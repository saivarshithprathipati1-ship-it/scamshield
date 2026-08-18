from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from detector import detect_scam


app = FastAPI()


# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def home():

    return {
        "message": "ScamShield backend is running!"
    }


@app.post("/check")
def check_message(data: dict):

    message = data.get("message", "")

    result = detect_scam(message)

    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)