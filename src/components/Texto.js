import React, { useEffect, useState } from 'react';
import { useRos } from '../contexts/RosContext';
import { createTopic, createService } from '../services/RosManager';
import * as ROSLIB from 'roslib';

const RobotAudioControl = () => {
    const { ros } = useRos();
    const [text, setText] = useState('');
    const [language, setLanguage] = useState('Spanish');
    const speechTopic = createTopic(ros, '/speech', 'robot_toolkit_msgs/speech_msg');

    useEffect(() => {
        if (ros) {
            const enableAudioService = createService(ros, '/robot_toolkit/audio_tools_srv', 'robot_toolkit_msgs/audio_tools_srv');
            const audioRequest = {
                data: { command: "enable_tts" }
            };
            enableAudioService.callService(audioRequest, (result) => {
                console.log('Audio tools service initialized:', result);
            }, (error) => {
                console.error('Error initializing audio service:', error);
            });
        }
    }, [ros]);


    const handleSpeak = () => {
        if (!text.trim()) {
            alert("Por favor, ingrese un texto para que el robot hable.");
            return;
        }

        if (ros) {
            const message = new ROSLIB.Message({
                language: language,
                text: text,
                animated: true 
            });
            speechTopic.publish(message)
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <div>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Texto para el robot"
                />
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="Spanish">Español</option>
                    <option value="English">Inglés</option>
                </select>
                <button onClick={handleSpeak}>Hablar</button>
            </div>
        </div>
    );
};

export default RobotAudioControl;