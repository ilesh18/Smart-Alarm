# AI Smart Alarm

## Overview
AI Smart Alarm is an intelligent alarm system designed to eliminate oversleeping by enforcing physical wake-up actions. Unlike traditional alarms, this system uses computer vision to ensure the user is awake and active before the alarm can be dismissed.

It combines real-time object detection with a strict no-snooze mechanism, making it a practical productivity tool.
---

## Features
- AI-based wake verification using object detection  
- Webcam-based real-time monitoring  
- No snooze system (forces action to stop alarm)  
- Fast and responsive detection pipeline  

---
## Tech Stack

### Frontend
- React  

### Backend
- Flask (Python)  

### AI / Computer Vision
- YOLOv8  

---

## Project Structure
AI-Smart-Alarm/
│
├── backend/
│ ├── app.py
│ ├── requirements.txt
│
├── frontend/
│ ├── src/
│ ├── package.json
│
└── README.md

---

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js (v16+)
- npm or yarn

---

## Installation

### Clone the Repository
git clone https://github.com/ilesh18/smart-alarm.git

cd ai-smart-alarm

---

### Backend Setup
cd backend
pip install -r requirements.txt
python app.py

Backend runs on:

http://localhost:5000


---

### Frontend Setup

cd frontend
npm install
npm run dev


Frontend runs on:

http://localhost:5173


---

## How It Works
1. User sets an alarm  
2. Alarm triggers and activates webcam  
3. YOLOv8 detects required object/action  
4. Alarm stops only after successful detection  

---

## Future Improvements
- Mobile app version  
- Custom wake-up challenges  
- Face recognition  
- Cloud deployment  
- Performance optimization  

---

## Contributing
Contributions are welcome. Fork the repo and submit a pull request
