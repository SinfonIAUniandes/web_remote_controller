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
    "BodyTalk/Listening/Listening_6",
    "BodyTalk/Listening/Listening_7",
    "BodyTalk/Speaking/BodyTalk_1",
    "BodyTalk/Speaking/BodyTalk_10",
    "BodyTalk/Speaking/BodyTalk_11",
    "BodyTalk/Speaking/BodyTalk_12",
    "BodyTalk/Speaking/BodyTalk_13",
    "BodyTalk/Speaking/BodyTalk_14",
    "BodyTalk/Speaking/BodyTalk_15",
    "BodyTalk/Speaking/BodyTalk_16",
    "BodyTalk/Speaking/BodyTalk_2",
    "BodyTalk/Speaking/BodyTalk_3",
    "BodyTalk/Speaking/BodyTalk_4",
    "BodyTalk/Speaking/BodyTalk_5",
    "BodyTalk/Speaking/BodyTalk_6",
    "BodyTalk/Speaking/BodyTalk_7",
    "BodyTalk/Speaking/BodyTalk_8",
    "BodyTalk/Speaking/BodyTalk_9",
    "Emotions/Positive/Happy_1",
    "Gestures/Excited_1",
    "Waiting/Stretch_1",
    "arcadia/full_launcher",
    "asereje/full_launcher",
    "jgangnamstyle/full_launcher",
    "la_bamba/full_launcher",
    "Freezer",
    "Freezer_Pose"
];

const RobotAnimationControl = () => {
    const { ros } = useRos();
    const [selectedAnimation, setSelectedAnimation] = useState('');
    const animationTopic = createTopic(ros, '/animations', 'robot_toolkit_msgs/animation_msg');

    useEffect(() => {
        if (ros) {
            const enableMotionService = createService(ros, '/robot_toolkit/motion_tools_srv', 'robot_toolkit_msgs/motion_tools_srv');
            const motionRequest = {
                data: { command: "enable_all" }
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

        if (animationTopic) {
            animationTopic.publish(message);
            console.log(`Animación enviada: ${selectedAnimation}`);
        } else {
            console.error("El publicador de animaciones no está disponible.");
        }
    };

    const standardAnimation = () => {
        
        const message = new ROSLIB.Message({
            family: "animations",
            animation_name: "Gestures/Maybe_1"
        });

        if (animationTopic) {
            animationTopic.publish(message);
            console.log(`Animación enviada: ${selectedAnimation}`);
        } else {
            console.error("El publicador de animaciones no está disponible.");
        }
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
            <button onClick={standardAnimation}>Posicion estandar</button>
        </div>
    );
};

export default RobotAnimationControl;