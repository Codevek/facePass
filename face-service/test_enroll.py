import requests
import base64
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

image_path = os.path.join(
    BASE_DIR,
    "test_images",
    "me.jpg"
)

with open(image_path, "rb") as f:
    image_bytes = f.read()

image_base64 = base64.b64encode(
    image_bytes
).decode("utf-8")

response = requests.post(
    "http://localhost:8000/enroll",
    json={
        "image": image_base64
    }
)

print(response.json())