import React, { useEffect, useState } from 'react';
import { useRos } from '../contexts/RosContext';
import { createTopic, createService } from '../services/RosManager';
import * as ROSLIB from 'roslib';

const animations = [
    "BodyTalk/Listening/Listening_1",
    "BodyTalk/Listening/Listening_2",
    "BodyTalk/Listening/Listening_3",
    "BodyTalk/Listening/Listening_4",
    "BodyTalk/Listening/Listening_5",
    "BodyTalk/Listening/Listening_6"
];

const RobotAnimationControl = () => {
    const { ros } = useRos();
    const [selectedAnimation, setSelectedAnimation] = useState('');
    const animationTopic = createTopic(ros, '/animations', 'robot_toolkit_msgs/animation_msg');

    useEffect(() => {
        if (ros) {
            const enableMotionService = createService(ros, '/robot_toolkit/motion_tools_srv', 'robot_toolkit_msgs/motion_tools_srv');
            const motionRequest = {
                command: "enable_all"
            };
            enableMotionService.callService(motionRequest, (result) => {
                console.log('Motion tools service initialized:', result);
            }, (error) => {
                console.error('Error initializing motion service:', error);
            });
        }
    }, [ros]);

    const handleAnimation = () => {
        if (!selectedAnimation) {
            alert("Seleccione una animación para ejecutar.");
            return;
        }

        const message = new ROSLIB.Message({
            family: "animations",
            animation_name: selectedAnimation
        });

        animationTopic.publish(message);
        console.log(`Animación enviada: ${selectedAnimation}`);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Control de Animaciones del Robot</h2>
            <select value={selectedAnimation} onChange={(e) => setSelectedAnimation(e.target.value)}>
                <option value="">Seleccione una animación</option>
                {animations.map((animation, index) => (
                    <option key={index} value={animation}>{animation}</option>
                ))}
            </select>
            <button onClick={handleAnimation}>Ejecutar Animación</button>
        </div>
    );
};

export default RobotAnimationControl;