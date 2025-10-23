# Compute Image Similarity

This project provides a small service that computes the visual similarity between two images using OpenAI's CLIP model. It exposes a FastAPI backend that accepts two image uploads and returns a cosine similarity score plus a simple difference visualization (base64 PNG).

## What it does
- Accepts two image files via an HTTP POST to `/compute`.
- Computes image embeddings using the `openai/clip-vit-base-patch32` model.
- Returns a similarity score (cosine similarity of normalized CLIP embeddings) and a base64-encoded PNG showing a simple per-pixel difference heatmap.

## Key files
- `backend/app.py` — FastAPI application implementing the `/compute` and `/ping` endpoints.
- `backend/requriements.txt` — Python dependencies required by the backend (note: filename contains a typo in the repo and is spelled `requriements.txt`).

## Requirements
- Python 3.8+ (3.10+ recommended)
- The dependencies listed in `backend/requriements.txt`:

```
fastapi
uvicorn[standard]
python-multipart
torch
open_clip_torch
Pillow
transformers
```

Note: The repository's `requriements.txt` currently does not list `transformers` explicitly; add it if you install manually.

GPU is optional but recommended for speed when computing embeddings with PyTorch.

## Install and run (Windows / PowerShell)
1. Create and activate a virtual environment:

```powershell
python -m venv .venv
. .\.venv\Scripts\Activate.ps1
```

2. Install dependencies (uses the file included in the repo):

```powershell
pip install -r backend/requriements.txt
pip install transformers
```

3. Start the backend (development):

```powershell
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`. The backend allows requests from `http://localhost:3000` by default (adjust CORS in `backend/app.py` as needed).

## API

- GET /ping
  - Returns a simple `pong` response for health checks.

- POST /compute
  - Content type: multipart/form-data
  - Form fields: `file1` (first image), `file2` (second image)
  - Response JSON:

```json
{
  "similarity_score": 0.87654321,
  "visualization": "data:image/png;base64,<BASE64_PNG>"
}
```

Example using `curl` (works in environments with curl available):

```powershell
curl -X POST "http://localhost:8000/compute" -F "file1=@C:\path\to\img1.jpg" -F "file2=@C:\path\to\img2.jpg"
```

Or in PowerShell using `Invoke-RestMethod` (base64 result will be included in the returned JSON):

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8000/compute" -Method Post -Form @{ file1 = Get-Item 'C:\path\to\img1.jpg'; file2 = Get-Item 'C:\path\to\img2.jpg' }
$response.similarity_score
```

## Notes
- On first run the CLIP model weights will be downloaded which may take time and disk space.
- If you plan to serve this in production, disable `--reload`, configure proper CORS, and pin dependency versions.
- The visualization is a simple absolute-difference heatmap and intended for quick inspection only.


