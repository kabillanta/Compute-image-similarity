from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any
from io import BytesIO
from PIL import Image
import numpy as np
import base64
import torch

# HuggingFace Transformers
from transformers import CLIPProcessor, CLIPModel

app = FastAPI()

# Allow requests from your frontend
origins = ["http://localhost:3000"]  # adjust to your frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load CLIP model
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32", use_safetensors=True)
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")


# Helper to compute cosine similarity
def cosine_similarity(a: np.ndarray, b: np.ndarray):
    a_norm = a / np.linalg.norm(a)
    b_norm = b / np.linalg.norm(b)
    return float(np.dot(a_norm, b_norm))


# Simple visualization: difference heatmap
def generate_diff_image(img1: Image.Image, img2: Image.Image):
    img1 = img1.convert("RGB").resize((224, 224))
    img2 = img2.convert("RGB").resize((224, 224))
    arr1 = np.array(img1).astype(np.float32)
    arr2 = np.array(img2).astype(np.float32)
    diff = np.abs(arr1 - arr2).mean(axis=2)  # grayscale diff
    diff_img = (diff / diff.max() * 255).astype(np.uint8)
    diff_img = Image.fromarray(diff_img).resize((224, 224))
    buffered = BytesIO()
    diff_img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")


@app.post("/compute")
async def compute_similarity(file1: UploadFile = File(...), file2: UploadFile = File(...)) -> Any:

    image1 = Image.open(BytesIO(await file1.read()))
    image2 = Image.open(BytesIO(await file2.read()))


    inputs = clip_processor(
        images=[image1, image2],
        return_tensors="pt"
    )
    with torch.no_grad():
        features = clip_model.get_image_features(**inputs)
        features = features / features.norm(p=2, dim=-1, keepdim=True)
        similarity = float((features[0] @ features[1].T).item())


    diff_b64 = generate_diff_image(image1, image2)

    return {
        "similarity_score": similarity,
        "visualization": f"data:image/png;base64,{diff_b64}"
    }
    
    
@app.get("/ping")
def ping():
    return "pong"