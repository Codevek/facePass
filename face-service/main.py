from fastapi import FastAPI
from pydantic import BaseModel

from insightface.app import FaceAnalysis

import cv2
import numpy as np
import base64

app = FastAPI()

print("Loading Face Model...")

face_model = FaceAnalysis()
face_model.prepare(ctx_id=-1)

print("Face Model Loaded")


class EnrollRequest(BaseModel):
    image: str


@app.get("/")
def home():
    return {
        "status": "running"
    }


@app.post("/enroll")
def enroll(data: EnrollRequest):

    try:

        image_bytes = base64.b64decode(data.image)

        np_arr = np.frombuffer(
            image_bytes,
            np.uint8
        )

        img = cv2.imdecode(
            np_arr,
            cv2.IMREAD_COLOR
        )

        faces = face_model.get(img)

        if len(faces) == 0:
            return {
                "success": False,
                "message": "No face detected"
            }

        embedding = faces[0].embedding

        return {
            "success": True,
            "embedding": embedding.tolist()
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }