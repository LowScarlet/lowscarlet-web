'use client'

import { useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

export default function MediaPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const START_TIME = 10; // ⬅️ mulai dari detik 10

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      // lompat ke start kalau masih di awal
      if (audioRef.current.currentTime < START_TIME) {
        audioRef.current.currentTime = START_TIME;
      }

      audioRef.current.play();
    }

    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;

    setProgress((current / total) * 100);
  };

  const handleLoaded = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;

    const value = Number(e.target.value);
    const newTime = (value / 100) * duration;

    audioRef.current.currentTime = newTime;
    setProgress(value);
  };

  const formatTime = (time: number) => {
    if (!time) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className="space-y-4 bg-neutral-800 p-6 rounded-xl w-full max-w-md text-white">
      
      {/* AUDIO */}
      <audio
        ref={audioRef}
        src="/music.mp3"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoaded}
      />

      {/* TOP */}
      <div className="flex items-center gap-4">
        <div className="bg-neutral-700 rounded-md w-14 h-14" />

        <div className="flex flex-col">
          <span className="font-semibold">My Track</span>
          <span className="text-neutral-400 text-sm">Unknown Artist</span>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="space-y-1">
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleSeek}
          className="w-full accent-pink-500"
        />

        <div className="flex justify-between text-neutral-400 text-xs">
          <span>{formatTime((progress / 100) * duration)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex justify-center items-center">
        <button
          onClick={togglePlay}
          className="flex justify-center items-center bg-linear-to-r from-pink-500 to-violet-500 rounded-full w-10 h-10 hover:scale-105 transition"
        >
          {playing ? <FaPause /> : <FaPlay />}
        </button>
      </div>
    </div>
  );
}