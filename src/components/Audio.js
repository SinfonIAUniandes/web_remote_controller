import React, { useState } from "react";
import { useRos } from "../contexts/RosContext";
import { createService } from "../services/RosManager";
import * as ROSLIB from "roslib";

const RobotAudioPlayer = () => {
    const { ros } = useRos();
    const [selectedFile, setSelectedFile] = useState(null);

    // Maneja la carga del archivo desde el PC
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        } else {
            alert("Por favor, selecciona un archivo de audio.");
        }
    };

    // Envía el archivo al robot para que lo reproduzca
    const handlePlay = async () => {
        if (!selectedFile) {
            alert("Por favor, selecciona un archivo de audio para reproducir.");
            return;
        }

        // Convierte el archivo en Base64 para enviarlo como string
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = () => {
            const base64Audio = reader.result.split(",")[1]; // Se obtiene solo la parte de datos

            if (ros) {
                const audioService = createService(ros, "/robot_toolkit/audio_tools_srv", "robot_toolkit_msgs/audio_tools_srv");
                const request = { command: "play_audio", file_data: base64Audio };

                audioService.callService(request, (result) => {
                    console.log("Audio enviado para reproducción:", result);
                }, (error) => {
                    console.error("Error al reproducir el audio:", error);
                });
            }
        };
        reader.onerror = (error) => {
            console.error("Error al leer el archivo:", error);
        };
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Reproducir Audio en el Robot</h2>
            <input type="file" accept="audio/*" onChange={handleFileChange} />
            <button onClick={handlePlay} disabled={!selectedFile}>Reproducir</button>
        </div>
    );
};

export default RobotAudioPlayer;