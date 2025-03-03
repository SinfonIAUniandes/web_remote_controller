import React, { useState } from 'react';
import { useRos } from '../contexts/RosContext';
import { createService } from '../services/RosManager';
import * as ROSLIB from 'roslib';

const RobotAudioControl = () => {
    const { ros } = useRos();
    const [audioUrl, setAudioUrl] = useState("");
    const audioService = createService(ros, '/pytoolkit/ALAudio', 'robot_toolkit_msgs/audio_tools_srv');

    // Enviar URL de audio al robot
    const handlePlayUrl = () => {
        if (!audioUrl.trim()) {
            alert("Ingrese una URL de audio.");
            return;
        }

        // Crear mensaje ROS con la URL
        const message = new ROSLIB.Message({
            command: "player/play_audio",
            url: audioUrl
        });

        // Enviar mensaje ROS al servicio
        audioService.callService(message, (result) => {
            console.log('Reproduciendo audio en el robot desde URL:', result);
        }, (error) => {
            console.error('Error al reproducir el audio desde URL:', error);
        });
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Reproducir Audio en el Robot</h2>

            {/* Reproducir desde URL */}
            <div>
                <h3>Desde URL</h3>
                <input
                    type="text"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    placeholder="Ingrese URL de audio"
                />
                <button onClick={handlePlayUrl} disabled={!audioUrl.trim()}>Reproducir URL</button>
            </div>
        </div>
    );
};

export default RobotAudioControl;