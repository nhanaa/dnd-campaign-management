#!/usr/bin/env python3
"""DnD session transcription pipeline with speaker diarization."""

import argparse
import json
import os
import subprocess
import sys
import tempfile
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv

# Default audio input directory (OBS recordings on Windows, accessed via WSL)
DEFAULT_INPUT_DIR = "/mnt/c/Users/nhanp/Videos"
SCRIPT_DIR = Path(__file__).parent
DEFAULT_OUTPUT_DIR = SCRIPT_DIR / "transcripts"


def extract_audio(input_path: Path, tmp_dir: str) -> Path:
    """Extract audio from video container to 16kHz mono WAV."""
    wav_path = Path(tmp_dir) / f"{input_path.stem}.wav"
    cmd = [
        "ffmpeg", "-i", str(input_path),
        "-vn",                  # no video
        "-acodec", "pcm_s16le", # 16-bit PCM
        "-ar", "16000",         # 16kHz
        "-ac", "1",             # mono
        str(wav_path),
        "-y",                   # overwrite
    ]
    print(f"Extracting audio: {input_path.name} -> {wav_path.name}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"ffmpeg error:\n{result.stderr}", file=sys.stderr)
        sys.exit(1)
    return wav_path


def transcribe(
    audio_path: Path,
    output_dir: Path,
    min_speakers: int | None = None,
    max_speakers: int | None = None,
    model: str = "large-v3",
    device: str = "cuda",
    batch_size: int = 16,
) -> None:
    """Run whisperX transcription + alignment + diarization."""
    import whisperx
    import torch

    if device == "cuda" and not torch.cuda.is_available():
        print("CUDA not available, falling back to CPU (this will be slow).")
        device = "cpu"
        batch_size = 4

    hf_token = os.getenv("HF_TOKEN")
    if not hf_token:
        print("Error: HF_TOKEN not set. Run setup.sh or set it in .env", file=sys.stderr)
        sys.exit(1)

    compute_type = "float16" if device == "cuda" else "int8"

    # 1. Transcribe
    print(f"Loading model '{model}' on {device} (compute_type={compute_type})...")
    whisper_model = whisperx.load_model(model, device, compute_type=compute_type)

    print(f"Transcribing: {audio_path.name}")
    audio = whisperx.load_audio(str(audio_path))
    result = whisper_model.transcribe(audio, batch_size=batch_size, language="en")

    # Free model VRAM before alignment
    del whisper_model
    if device == "cuda":
        torch.cuda.empty_cache()

    # 2. Align
    print("Aligning timestamps...")
    align_model, align_metadata = whisperx.load_align_model(
        language_code="en", device=device
    )
    result = whisperx.align(
        result["segments"], align_model, align_metadata, audio, device,
        return_char_alignments=False,
    )

    del align_model
    if device == "cuda":
        torch.cuda.empty_cache()

    # 3. Diarize
    print("Running speaker diarization...")
    from whisperx.diarize import DiarizationPipeline
    diarize_model = DiarizationPipeline(
        token=hf_token, device=device
    )

    diarize_kwargs = {}
    if min_speakers is not None:
        diarize_kwargs["min_speakers"] = min_speakers
    if max_speakers is not None:
        diarize_kwargs["max_speakers"] = max_speakers

    diarize_segments = diarize_model(audio, **diarize_kwargs)
    result = whisperx.assign_word_speakers(diarize_segments, result)

    # 4. Build output
    duration = len(audio) / 16000  # whisperx loads at 16kHz
    speakers = set()
    segments = []
    for seg in result["segments"]:
        speaker = seg.get("speaker", "UNKNOWN")
        speakers.add(speaker)
        segments.append({
            "start": round(seg["start"], 3),
            "end": round(seg["end"], 3),
            "speaker": speaker,
            "text": seg["text"].strip(),
        })

    # Try to parse date from filename (session-YYYY-MM-DD.ext)
    stem = audio_path.stem
    try:
        date_str = "-".join(stem.split("-")[1:4])
        datetime.strptime(date_str, "%Y-%m-%d")
    except (ValueError, IndexError):
        date_str = datetime.now().strftime("%Y-%m-%d")

    output_data = {
        "metadata": {
            "source_file": audio_path.name,
            "date": date_str,
            "duration_seconds": round(duration),
            "num_speakers_detected": len(speakers),
            "model": model,
            "language": "en",
        },
        "segments": segments,
    }

    # Write outputs
    output_dir.mkdir(parents=True, exist_ok=True)
    base_name = audio_path.stem

    json_path = output_dir / f"{base_name}.json"
    with open(json_path, "w") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    print(f"JSON output: {json_path}")

    srt_path = output_dir / f"{base_name}.srt"
    with open(srt_path, "w") as f:
        for i, seg in enumerate(segments, 1):
            start_srt = _seconds_to_srt(seg["start"])
            end_srt = _seconds_to_srt(seg["end"])
            f.write(f"{i}\n")
            f.write(f"{start_srt} --> {end_srt}\n")
            f.write(f"[{seg['speaker']}] {seg['text']}\n\n")
    print(f"SRT output:  {srt_path}")
    print(f"Done. {len(segments)} segments, {len(speakers)} speakers detected.")


def _seconds_to_srt(seconds: float) -> str:
    """Convert seconds to SRT timestamp format (HH:MM:SS,mmm)."""
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds % 1) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def main():
    load_dotenv(SCRIPT_DIR / ".env")

    parser = argparse.ArgumentParser(
        description="Transcribe DnD session recordings with speaker diarization."
    )
    parser.add_argument(
        "input",
        help="Path to audio/video file to transcribe",
    )
    parser.add_argument(
        "--output", "-o",
        default=str(DEFAULT_OUTPUT_DIR),
        help=f"Output directory (default: {DEFAULT_OUTPUT_DIR})",
    )
    parser.add_argument(
        "--min-speakers",
        type=int, default=None,
        help="Minimum number of speakers (hint for diarization)",
    )
    parser.add_argument(
        "--max-speakers",
        type=int, default=None,
        help="Maximum number of speakers (hint for diarization)",
    )
    parser.add_argument(
        "--model",
        default="large-v3",
        help="Whisper model size (default: large-v3)",
    )
    parser.add_argument(
        "--device",
        default="cuda",
        choices=["cuda", "cpu"],
        help="Compute device (default: cuda)",
    )
    parser.add_argument(
        "--batch-size",
        type=int, default=16,
        help="Batch size for transcription (default: 16, reduce if OOM)",
    )
    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        print(f"Error: File not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    output_dir = Path(args.output)
    video_exts = {".mkv", ".mp4", ".webm", ".avi"}

    if input_path.suffix.lower() in video_exts:
        with tempfile.TemporaryDirectory() as tmp_dir:
            wav_path = extract_audio(input_path, tmp_dir)
            transcribe(
                wav_path, output_dir,
                min_speakers=args.min_speakers,
                max_speakers=args.max_speakers,
                model=args.model,
                device=args.device,
                batch_size=args.batch_size,
            )
    else:
        transcribe(
            input_path, output_dir,
            min_speakers=args.min_speakers,
            max_speakers=args.max_speakers,
            model=args.model,
            device=args.device,
            batch_size=args.batch_size,
        )


if __name__ == "__main__":
    main()
