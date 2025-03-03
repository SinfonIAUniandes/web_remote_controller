import React, { useState } from "react";
import { useRos } from "../contexts/RosContext";
import { createService } from "../services/RosManager";
import * as ROSLIB from "roslib";

const RobotAudioPlayer = () => {
    const { ros } = useRos();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFilePath, setUploadedFilePath] = useState("");

    // Maneja la selección del archivo en el input
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        } else {
            alert("Por favor, selecciona un archivo de audio.");
        }
    };

    // Sube el archivo al servidor y obtiene la URL donde se almacenó
    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Por favor, selecciona un archivo de audio para subir.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch("/upload/audio", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setUploadedFilePath(data.file_path);
                alert("Archivo subido correctamente.");
            } else {
                console.error("Error al subir el archivo:", data.error);
                alert("Error al subir el archivo.");
            }
        } catch (error) {
            console.error("Error de red al subir el archivo:", error);
            alert("Error de conexión al subir el archivo.");
        }
    };

    // Envía la ruta del archivo al robot para que lo reproduzca
    const handlePlay = () => {
        if (!uploadedFilePath) {
            alert("Primero sube un archivo antes de reproducir.");
            return;
        }

        if (ros) {
            const audioService = createService(
                ros,
                "/robot_toolkit/audio_tools_srv",
                "robot_toolkit_msgs/audio_tools_srv"
            );
            const request = { command: "play_audio", file_path: uploadedFilePath };

            audioService.callService(
                request,
                (result) => {
                    console.log("Reproduciendo audio desde:", uploadedFilePath, result);
                },
                (error) => {
                    console.error("Error al reproducir el audio:", error);
                }
            );
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Reproducir Audio en el Robot</h2>
            <input type="file" accept="audio/*" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!selectedFile}>Subir Audio</button>
            <button onClick={handlePlay} disabled={!uploadedFilePath}>Reproducir</button>
        </div>
    );
};

export default RobotAudioPlayer;