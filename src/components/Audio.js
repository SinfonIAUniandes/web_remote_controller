import React, { useState } from 'react';
import { useRos } from '../contexts/RosContext';
import { createService } from '../services/RosManager';
import * as ROSLIB from 'roslib';

const RobotAudioControl = () => {
    const { ros } = useRos();
    const [selectedFile, setSelectedFile] = useState(null);
    const audioService = createService(ros, '/robot_toolkit/audio_tools_srv', 'robot_toolkit_msgs/audio_tools_srv');

    // ✅ Manejar selección de archivo
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // ✅ Enviar el archivo al robot y reproducirlo
    const handlePlayAudio = () => {
        if (!selectedFile) {
            alert("Por favor, seleccione un archivo de audio.");
            return;
        }

        // Leer el archivo y enviarlo como mensaje ROS
        const reader = new FileReader();
        reader.onload = (e) => {
            const audioData = new Uint8Array(e.target.result);

            const message = new ROSLIB.Message({
                command: "play_audio",
                data: [...audioData]
            });

            audioService.callService(message, (result) => {
                console.log('Audio enviado al robot:', result);
            }, (error) => {
                console.error('Error al enviar el audio:', error);
            });
        };

        reader.readAsArrayBuffer(selectedFile);
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