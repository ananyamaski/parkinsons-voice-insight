from fastapi import (
    FastAPI,
    UploadFile,
    File,
    HTTPException,
    Depends
)

from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from backend.database import (
    Base,
    engine,
    SessionLocal
)

from backend import models

import bcrypt

from backend.auth import create_access_token

import os
import tempfile
import joblib
import pandas as pd

from ml.feature_extractor import extract_features


# =========================================================
# CREATE FASTAPI APP
# =========================================================

app = FastAPI()


# =========================================================
# DATABASE
# =========================================================

models.Base.metadata.create_all(
    bind=engine
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =========================================================
# ML MODEL
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)


MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "parkinsons_svm.pkl"
)


saved_model = joblib.load(
    MODEL_PATH
)


ml_model = saved_model["model"]

FEATURE_NAMES = saved_model["features"]


# =========================================================
# REQUEST MODELS
# =========================================================

class LoginRequest(BaseModel):

    email: str
    password: str


class RegisterRequest(BaseModel):

    name: str
    email: str
    password: str


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():

    return {
        "message":
        "Parkinson's Voice Insight API is running!"
    }


# =========================================================
# LOGIN
# =========================================================

@app.post("/login")
def login(
    data: LoginRequest,
    db=Depends(get_db)
):

    user = db.query(
        models.User
    ).filter(
        models.User.email == data.email
    ).first()


    if not user:

        return {
            "message":
            "Invalid email or password"
        }


    password_match = bcrypt.checkpw(
        data.password.encode("utf-8"),
        user.password_hash.encode("utf-8")
    )


    if not password_match:

        return {
            "message":
            "Invalid email or password"
        }


    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email
        }
    )


    return {

        "message":
        "Login successful",

        "access_token":
        access_token,

        "name":
        user.name,

        "email":
        user.email
    }


# =========================================================
# REGISTER
# =========================================================

@app.post("/register")
def register(
    data: RegisterRequest,
    db=Depends(get_db)
):

    hashed_password = bcrypt.hashpw(
        data.password.encode("utf-8"),
        bcrypt.gensalt()
    )


    new_user = models.User(

        name=data.name,

        email=data.email,

        password_hash=
        hashed_password.decode("utf-8")
    )


    db.add(
        new_user
    )

    db.commit()

    db.refresh(
        new_user
    )


    return {

        "message":
        "Registration successful",

        "name":
        new_user.name,

        "email":
        new_user.email
    }


# =========================================================
# VOICE ANALYSIS
# =========================================================

@app.post("/analyze")
async def analyze_voice(
    audio: UploadFile = File(...)
):

    # -----------------------------------------------------
    # CHECK FILE
    # -----------------------------------------------------

    if not audio.filename:

        raise HTTPException(
            status_code=400,
            detail="No audio file provided."
        )


    allowed_extensions = (
        ".wav",
        ".mp3"
    )


    file_extension = os.path.splitext(
        audio.filename
    )[1].lower()


    if file_extension not in allowed_extensions:

        raise HTTPException(
            status_code=400,
            detail=
            "Please upload a WAV or MP3 audio file."
        )


    # -----------------------------------------------------
    # TEMPORARY FILE
    # -----------------------------------------------------

    temp_path = None


    try:

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=file_extension
        ) as temp_file:

            temp_path = temp_file.name

            contents = await audio.read()

            temp_file.write(
                contents
            )


        # -------------------------------------------------
        # EXTRACT 26 VOICE FEATURES
        # -------------------------------------------------

        features = extract_features(
            temp_path
        )

        feature_values = dict(
            zip(
                FEATURE_NAMES,
                features
            )
        )


        # -------------------------------------------------
        # CREATE DATAFRAME
        # -------------------------------------------------

        X = pd.DataFrame(
            [features],
            columns=FEATURE_NAMES
        )


        # -------------------------------------------------
        # PREDICTION
        # -------------------------------------------------

        prediction = int(
            ml_model.predict(X)[0]
        )


        # -------------------------------------------------
        # MODEL PROBABILITY
        # -------------------------------------------------

        probabilities = ml_model.predict_proba(
            X
        )[0]


        confidence = float(
            max(probabilities) * 100
        )


        # -------------------------------------------------
        # ASSESSMENT
        # -------------------------------------------------

        if prediction == 1:

            assessment = (
                "Higher risk indicator"
            )

        else:

            assessment = (
                "Lower risk indicator"
            )


        # -------------------------------------------------
        # CREATE FEATURE DICTIONARY
        # -------------------------------------------------

        feature_values = {}


        for name, value in zip(
            FEATURE_NAMES,
            features
        ):

            feature_values[name] = round(
                float(value),
                6
            )


        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return {

            "success":
            True,

            "prediction":
            prediction,

            "confidence":
            round(
                confidence,
                2
            ),

            "assessment":
            assessment,

            "message":
            (
                "Voice analysis completed successfully."
            ),

            "features":
            feature_values
        }


    # =====================================================
    # ERROR HANDLING
    # =====================================================

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=
            f"Voice analysis failed: {str(e)}"
        )


    # =====================================================
    # DELETE TEMPORARY FILE
    # =====================================================

    finally:

        if (
            temp_path
            and os.path.exists(temp_path)
        ):

            os.remove(
                temp_path
            )