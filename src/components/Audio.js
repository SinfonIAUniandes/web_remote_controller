import React, { useState } from "react";
import { useRos } from "../contexts/RosContext";
import { createService } from "../services/RosManager";

const RobotAudioPlayer = () => {
    const { ros } = useRos();
    const [selectedFile, setSelectedFile] = useState(null);
    const [playing, setPlaying] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handlePlay = () => {
        if (!selectedFile) {
            alert("Seleccione un archivo de audio para reproducir.");
            return;
        }

        if (ros) {
            const audioService = createService(ros, "/robot_toolkit/audio_tools_srv", "robot_toolkit_msgs/audio_tools_srv");

            const request = {
                data: { command: "play_audio", file_path: selectedFile.name }
            };

            audioService.callService(request, (result) => {
                console.log("Audio reproduciéndose:", result);
                setPlaying(true);
            }, (error) => {
                console.error("Error al reproducir el audio:", error);
            });
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Reproducir Audio en el Robot</h2>
            <input type="file" accept="audio/*" onChange={handleFileChange} />
            <button onClick={handlePlay} disabled={!selectedFile || playing}>Reproducir</button>
        </div>
    );
};

export default RobotAudioPlayer;