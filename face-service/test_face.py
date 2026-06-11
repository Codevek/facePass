from insightface.app import FaceAnalysis
import cv2
import os

print("Loading model...")

model = FaceAnalysis()
model.prepare(ctx_id=-1)

print("Model loaded")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

image_path = os.path.join(
    BASE_DIR,
    "test_images",
    "me.jpg"
)

print("Loading:", image_path)

img = cv2.imread(image_path)

if img is None:
    print("Image not found")
    exit()

faces = model.get(img)

print(f"Faces detected: {len(faces)}")

if len(faces) == 0:
    print("No face found")
    exit()

face = faces[0]

embedding = face.embedding

print("Embedding length:", len(embedding))