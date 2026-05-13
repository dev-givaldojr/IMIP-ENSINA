from fastapi import FastAPI
import os
from worker import start_worker
import threading

app = FastAPI()

@app.on_event("startup")
def startup_event():
    # Start RabbitMQ consumer in a background thread
    thread = threading.Thread(target=start_worker, daemon=True)
    thread.start()

@app.get("/health")
def health_check():
    return {"status": "Generative AI Service is running"}
