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
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    // Función para enviar el audio al robot y reproducirlo
    const handlePlayAudio = () => {
        if (!selectedFile) {
            alert("Seleccione un archivo de audio.");
            return;
        }

        const reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = () => {
            const audioData = Array.from(new Uint8Array(reader.result));

            // Crear mensaje ROS
            const message = new ROSLIB.Message({
                command: "play_audio",
                data: audioData
            });

            // Enviar mensaje ROS
            audioService.callService(message, (result) => {
                console.log('Reproduciendo audio en el robot:', result);
            }, (error) => {
                console.error('Error al reproducir el audio:', error);
            });
        };

        reader.onerror = () => {
            console.error("Error al leer el archivo de audio.");
        };
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