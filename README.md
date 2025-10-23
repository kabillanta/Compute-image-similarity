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

## License
This repository does not include a license file. Add one if you intend to share or publish.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Compute-image-similarity
