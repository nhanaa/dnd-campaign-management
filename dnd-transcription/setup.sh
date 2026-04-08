#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/.venv"

echo "=== DnD Transcription Pipeline Setup ==="

# Find a compatible Python (3.10-3.12, PyTorch doesn't support 3.13+ yet)
PYTHON=""
for candidate in python3.12 python3.11 python3.10; do
    if command -v "$candidate" &>/dev/null; then
        PYTHON="$candidate"
        break
    fi
done

if [ -z "$PYTHON" ]; then
    echo "ERROR: Python 3.10-3.12 required (PyTorch has no wheels for 3.13+)."
    echo "Install with: sudo apt-get install python3.12 python3.12-venv"
    exit 1
fi
echo "Using $PYTHON ($($PYTHON --version))"

# Check nvidia-smi
echo ""
echo "Checking GPU access..."
if command -v nvidia-smi &>/dev/null; then
    nvidia-smi --query-gpu=name,memory.total --format=csv,noheader
else
    echo "WARNING: nvidia-smi not found. GPU acceleration may not work."
fi

# Check ffmpeg
echo ""
if command -v ffmpeg &>/dev/null; then
    echo "ffmpeg: $(ffmpeg -version 2>&1 | head -1)"
else
    echo "ffmpeg not found. Installing..."
    sudo apt-get update && sudo apt-get install -y ffmpeg
fi

# Create venv
echo ""
if [ -d "$VENV_DIR" ]; then
    echo "Virtual environment already exists at $VENV_DIR"
else
    echo "Creating virtual environment..."
    if ! $PYTHON -m venv "$VENV_DIR" 2>/dev/null; then
        echo "Installing venv package for $PYTHON..."
        sudo apt-get update && sudo apt-get install -y "${PYTHON}-venv"
        $PYTHON -m venv "$VENV_DIR"
    fi
fi

source "$VENV_DIR/bin/activate"
echo "Python: $(python --version)"

# Install PyTorch with CUDA
echo ""
echo "Installing PyTorch with CUDA support..."
pip install --upgrade pip
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu124

# Install whisperX and other deps
echo ""
echo "Installing whisperX and dependencies..."
pip install -r "$SCRIPT_DIR/requirements.txt"

# Verify CUDA
echo ""
echo "Verifying CUDA in PyTorch..."
python -c "
import torch
print(f'PyTorch: {torch.__version__}')
print(f'CUDA available: {torch.cuda.is_available()}')
if torch.cuda.is_available():
    print(f'GPU: {torch.cuda.get_device_name(0)}')
    print(f'VRAM: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.1f} GB')
"

# HuggingFace token
echo ""
ENV_FILE="$SCRIPT_DIR/.env"
if [ -f "$ENV_FILE" ] && grep -q "^HF_TOKEN=" "$ENV_FILE" && ! grep -q "your_huggingface_token_here" "$ENV_FILE"; then
    echo "HuggingFace token already configured in .env"
else
    echo "Speaker diarization requires a HuggingFace token."
    echo "You must accept the model terms at:"
    echo "  https://huggingface.co/pyannote/speaker-diarization-3.1"
    echo "  https://huggingface.co/pyannote/segmentation-3.0"
    echo ""
    read -rp "Enter your HuggingFace token (hf_...): " HF_TOKEN
    echo "HF_TOKEN=$HF_TOKEN" > "$ENV_FILE"
    echo "Token saved to .env"
fi

echo ""
echo "=== Setup complete ==="
echo "Activate the environment with: source $VENV_DIR/bin/activate"
echo ""
echo "Usage:"
echo "  python $SCRIPT_DIR/transcribe.py /mnt/c/Users/nhanp/Videos/session.wav"
echo "  python $SCRIPT_DIR/transcribe.py /mnt/c/Users/nhanp/Videos/session.mkv --min-speakers 4 --max-speakers 6"
