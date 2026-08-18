# Parkinson's Voice Insight

> An AI/ML-based web application for voice-based Parkinson's risk analysis using extracted vocal characteristics.

<p align="center">

### 🚀 Live Demo

**[Open Parkinson's Voice Insight](https://parkinsons-voice-insight.onrender.com/)**

</p>

---

## 📌 Overview

**Parkinson's Voice Insight** is a full-stack AI/ML web application that analyzes voice samples and provides a **risk indicator** based on vocal characteristics extracted from the audio.

Users can upload or record a voice sample, run the analysis, view important voice parameters, explore detailed technical features, and review previous analyses.

> **Note:** This application is intended for screening and research purposes only. It is not a medical diagnosis.

---

## ✨ Key Features

- 🔐 **User Authentication**
  - Registration and login
  - JWT-based authentication
  - Password hashing with bcrypt

- 🎙️ **Voice Analysis**
  - Upload `.wav` or `.mp3` files
  - Record voice directly through the browser
  - Audio preview before analysis

- 🧠 **Machine Learning Prediction**
  - SVM-based prediction model
  - 26 extracted voice features
  - Prediction with confidence score

- 📊 **Voice Parameter Analysis**
  - Jitter
  - Shimmer
  - Mean Pitch
  - Voice Breaks
  - Unvoiced Frames
  - Visual progress indicators

- 🔬 **Technical Features**
  - Detailed display of all extracted voice characteristics
  - Feature values presented in a structured interface

- 📚 **Analysis History**
  - User-specific history
  - View previous analyses
  - Review detailed voice parameters

- 📄 **PDF Reports**
  - Generate downloadable voice analysis reports

---

## 🧠 Machine Learning Pipeline

```text
Voice Sample
     ↓
Audio Processing
     ↓
Praat / Parselmouth
     ↓
26 Voice Features
     ↓
Feature Preparation
     ↓
Trained SVM Model
     ↓
Prediction + Confidence
     ↓
Voice Analysis Result