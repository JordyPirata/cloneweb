"use client";
import React, { useState, useRef, useEffect } from "react";
import { IconButton, Slider } from "@material-ui/core";
import { PlayArrow, Pause, SkipNext, SkipPrevious } from "@material-ui/icons";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import RepeatIcon from "@material-ui/icons/Repeat";

const AudioPlayer = ({ playlist, initialTrack = 0 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [trackInfo, setTrackInfo] = useState({});
  const [currentTrack, setCurrentTrack] = useState(initialTrack);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () =>
      setProgress((audio.currentTime / audio.duration) * 100);
    const updateTrackInfo = () => {
      setTrackInfo({
        title: playlist[currentTrack].title,
        duration: audio.duration,
      });
    };
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateTrackInfo);
    audio.addEventListener("ended", handleNext);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateTrackInfo);
      audio.removeEventListener("ended", handleNext);
    };
  }, [currentTrack, playlist]);

  useEffect(() => {
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (event, newValue) => {
    const audio = audioRef.current;
    audio.currentTime = (audio.duration / 100) * newValue;
    setProgress(newValue);
  };

  const handleNext = () => {
    if (isShuffle) {
      const randomTrack = Math.floor(Math.random() * playlist.length);
      setCurrentTrack(randomTrack);
    } else if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      setCurrentTrack((prev) => (prev + 1) % playlist.length);
    }
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  const toggleRepeat = () => {
    setIsRepeat((prev) => !prev);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <audio ref={audioRef} src={playlist[currentTrack].url} />
      <div style={{ marginBottom: 20 }}>
        <h2>{trackInfo.title}</h2>
        <p>
          Duration:{" "}
          {trackInfo.duration ? (trackInfo.duration / 60).toFixed(2) : "0.00"}{" "}
          minutes
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <IconButton onClick={handlePrev}>
          <SkipPrevious />
        </IconButton>
        <IconButton onClick={togglePlayPause}>
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton onClick={handleNext}>
          <SkipNext />
        </IconButton>
        <Slider
          value={progress}
          onChange={handleProgressChange}
          style={{ flex: 1 }}
        />
        <IconButton onClick={toggleShuffle} variant="ghost" size="icon">
          <ShuffleIcon
            className="w-6 h-6"
            color={isShuffle ? "primary" : "inherit"}
          />
        </IconButton>
        <IconButton onClick={toggleRepeat} variant="ghost" size="icon">
          <RepeatIcon
            className="w-6 h-6"
            color={isRepeat ? "primary" : "inherit"}
          />
        </IconButton>
      </div>
    </div>
  );
};

export default AudioPlayer;
