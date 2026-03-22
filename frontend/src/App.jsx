import React, { useState, useRef } from "react";

const API = "https://smart-alarm-g579.onrender.com/api";

export default function App() {
  const [screen, setScreen] = useState("setup");
  const [alarmTime, setAlarmTime] = useState("");
  const [alarmLabel, setAlarmLabel] = useState("Wake Up!");
  const [task, setTask] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [detected, setDetected] = useState([]);
  const [mode, setMode] = useState("upload");

  const audioRef = useRef(null);
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

 
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  // 📦 FETCH TASK
  const fetchTask = async () => {
    try {
      const r = await fetch(`${API}/get-task`);
      const d = await r.json();
      setTask(d.task);
    } catch {
      setMessage("Server waking up... try again ");
      setStatus("fail");
    }
  };

  const startAlarmCheck = (time) => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const now = new Date();
      const [h, m] = time.split(":").map(Number);

      if (
        now.getHours() === h &&
        now.getMinutes() === m &&
        now.getSeconds() < 5
      ) {
        clearInterval(timerRef.current);
        fireAlarm();
      }
    }, 1000);
  };

  const fireAlarm = async () => {
    await fetchTask();
    playAudio();
    setScreen("ringing");
  };


  const handleSetAlarm = () => {
    if (!alarmTime) return alert("Pick a time first!");
    startAlarmCheck(alarmTime);
    alert(`Alarm set for ${alarmTime}`);
  };

  const handleTestAlarm = async () => {
    await fetchTask();
    playAudio();
    setScreen("ringing");
  };

  const handleCaptureObject = () => {
    setScreen("verify");
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      setImage(ev.target.result);
      setStatus("idle");
    };
    reader.readAsDataURL(file);
  };


  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setMode("webcam");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      alert("Camera access denied.");
    }
  };

  const captureWebcam = () => {
    const v = videoRef.current;

    if (!v || v.videoWidth === 0) {
      alert("Camera not ready yet!");
      return;
    }

    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;

    const ctx = c.getContext("2d");
    ctx.drawImage(v, 0, 0);

    const url = c.toDataURL("image/jpeg", 0.85);

    setPreview(url);
    setImage(url);
    setStatus("idle");

    stopStream();
    setMode("upload");
  };

  
  const handleVerify = async () => {
    if (!image) return alert("Upload or capture an image first!");

    setStatus("loading");

    try {
      const r = await fetch(`${API}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image, task }),
      });

      const d = await r.json();

      setMessage(d.message);
      setDetected(d.detected_objects || []);
      setStatus(d.success ? "success" : "fail");

      if (d.success) {
        stopAudio();
        setTimeout(() => setScreen("done"), 1500);
      }
    } catch {
      setMessage("Backend not reachable. Try again ");
      setStatus("fail");
    }
  };

  const handleNewTask = async () => {
    await fetchTask();
    setImage(null);
    setPreview(null);
    setStatus("idle");
    setMessage("");
  };

  const handleReset = () => {
    stopAudio();
    stopStream();
    setScreen("setup");
    setTask("");
    setImage(null);
    setPreview(null);
    setStatus("idle");
    setMessage("");
    setMode("upload");
  };

  return (
    <div className={`app ${screen === "ringing" ? "ringing-mode" : ""}`}>
      <audio ref={audioRef}>
        <source src="/alarm.mp3" />
      </audio>

      {screen === "setup" && (
        <div className="card">
          <h1>Smart Alarm</h1>
          <input
            type="time"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
          />
          <button onClick={handleSetAlarm}>Set Alarm</button>
          <button onClick={handleTestAlarm}>Test Alarm</button>
        </div>
      )}

      {screen === "ringing" && (
        <div className="card ringing">
          <h1>WAKE UP</h1>
          <div className="task-object">{task}</div>
          <button onClick={handleCaptureObject}>PROVE IT</button>
        </div>
      )}

      {screen === "verify" && (
        <div className="card">
          <h2>{task}</h2>

          <button onClick={() => setMode("upload")}>Upload</button>
          <button onClick={startWebcam}>Webcam</button>

          {mode === "webcam" && (
            <>
              <video ref={videoRef} autoPlay muted />
              <button onClick={captureWebcam}>Capture</button>
            </>
          )}

          {mode === "upload" && (
            <div onClick={() => fileRef.current.click()}>
              {preview ? <img src={preview} alt="preview" /> : "Upload Image"}
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            hidden
            onChange={handleFile}
          />

          <button onClick={handleVerify}>Verify</button>

          {status === "loading" && <p>Analyzing...</p>}
          {status === "success" && <p>{message}</p>}
          {status === "fail" && <p>{message}</p>}
        </div>
      )}

      {screen === "done" && (
        <div className="card">
          <h1>Done </h1>
          <button onClick={handleReset}>Restart</button>
        </div>
      )}
    </div>
  );
}
