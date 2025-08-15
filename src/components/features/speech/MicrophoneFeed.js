import React, { useEffect } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createTopic, subscribeToTopic } from '../../../services/RosManager';

const MicrophoneFeed = () => {
    const { ros } = useRos();

    useEffect(() => {
        if (!ros) {
            console.error("ROS connection not available.");
            return;
        }

        const microphoneTopic = createTopic(ros, '/mic', 'naoqi_bridge_msgs/msg/AudioBuffer');
        
        subscribeToTopic(microphoneTopic, (message) => {
            if (message.data && message.data.length > 0) {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const audioBuffer = audioContext.createBuffer(1, message.data.length, message.frequency);
                const channelData = audioBuffer.getChannelData(0);

                for (let i = 0; i < message.data.length; i++) {
                    channelData[i] = message.data[i] / 32768.0;
                }

                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                source.start();
            }
        });

        return () => {
            microphoneTopic.unsubscribe();
            console.log('Suscripción al tópico del micrófono cancelada.');
        };
    }, [ros]);

    // Desactivar componente visual
    return null;
};

export default MicrophoneFeed;