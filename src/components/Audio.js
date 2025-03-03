import React, { useState } from 'react';
import { useRos } from '../contexts/RosContext';
import { createService } from '../services/RosManager';
import * as ROSLIB from 'roslib';

const RobotAudioControl = () => {
    const { ros } = useRos();
    const [selectedFile, setSelectedFile] = useState(null);
    const audioService = createService(ros, '/robot_toolkit/audio_tools_srv', 'robot_toolkit_msgs/audio_tools_srv');

    // Función para manejar la selección del archivo
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Función para enviar el archivo al robot
    const handlePlayAudio = async () => {
        if (!selectedFile) {
            alert("Seleccione un archivo de audio.");
            return;
        }

        // Crear objeto FormData para subir el archivo
        const formData = new FormData();
        formData.append("audio_file", selectedFile, "audio_temp.wav");

        try {
            const uploadResponse = await fetch("http://ROBOT_IP:5000/upload_audio", {
                method: "POST",
                body: formData
            });

            if (!uploadResponse.ok) {
                throw new Error("Error al subir el archivo al robot.");
            }

            const uploadData = await uploadResponse.json();
            console.log("Archivo subido:", uploadData);

            // Enviar mensaje ROS para reproducir el archivo
            const message = new ROSLIB.Message({
                command: "play_audio",
                file_path: uploadData.file_path // Ruta del archivo en el robot
            });

            audioService.callService(message, (result) => {
                console.log('Reproduciendo audio en el robot:', result);
            }, (error) => {
                console.error('Error al reproducir el audio:', error);
            });

        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Reproducir Audio en el Robot</h2>
            <input type="file" accept="audio/*" onChange={handleFileChange} />
            <button onClick={handlePlayAudio} disabled={!selectedFile}>Reproducir Audio</button>
        </div>
    );
};

export default RobotAudioControl;