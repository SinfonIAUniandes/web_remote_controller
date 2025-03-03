import React, { useState, useEffect } from "react";
import { useRos } from "../contexts/RosContext";
import { createService } from "../services/RosManager";
import * as ROSLIB from "roslib";

const RobotAudioPlayer = () => {
    const { ros } = useRos();
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [filePath, setFilePath] = useState("");

    // Configura el servicio de audio cuando ROS esté disponible
    useEffect(() => {
        if (ros) {
            const enableAudioService = createService(ros, "/robot_toolkit/audio_tools_srv", "robot_toolkit_msgs/audio_tools_srv");
            const request = { command: "enable_audio" };

            enableAudioService.callService(request, (result) => {
                console.log("Servicio de audio inicializado:", result);
            }, (error) => {
                console.error("Error inicializando servicio de audio:", error);
            });
        }
    }, [ros]);

    // Función para reproducir un archivo de audio
    const handlePlay = () => {
        if (!filePath) {
            alert("Por favor, ingresa la ruta de un archivo de audio.");
            return;
        }

        if (ros) {
            const audioService = createService(ros, "/robot_toolkit/audio_tools_srv", "robot_toolkit_msgs/audio_tools_srv");
            const request = { command: "play_audio", file_path: filePath }; // Aquí se envía el archivo

            audioService.callService(request, (result) => {
                console.log("Audio reproduciéndose:", result);
                setPlaying(true);
            }, (error) => {
                console.error("Error al reproducir el audio:", error);
            });
        }
    };

    // Función para ajustar el volumen
    const handleVolumeChange = (event) => {
        const newVolume = parseInt(event.target.value, 10);
        setVolume(newVolume);

        if (ros) {
            const volumeService = createService(ros, "/pytoolkit/ALAudioDevice/set_output_volume_srv", "robot_toolkit_msgs/set_output_volume_srv");
            const request = { volume: newVolume };

            volumeService.callService(request, (result) => {
                console.log("Volumen actualizado:", result);
            }, (error) => {
                console.error("Error al actualizar volumen:", error);
            });
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Reproducir Audio en el Robot</h2>
            <div>
                <input 
                    type="text" 
                    value={filePath} 
                    onChange={(e) => setFilePath(e.target.value)} 
                    placeholder="Ruta del archivo de audio"
                />
                <button onClick={handlePlay} disabled={playing}>Reproducir</button>
            </div>
            <div>
                <label>Volumen: {volume}</label>
                <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} />
            </div>
        </div>
    );
};

export default RobotAudioPlayer;