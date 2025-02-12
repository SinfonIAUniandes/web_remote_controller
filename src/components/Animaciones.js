import React, { useEffect, useState } from 'react';
import { useRos } from '../contexts/RosContext';
import { createTopic } from '../services/RosManager';
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
    const [animationPublisher, setAnimationPublisher] = useState(null);

    useEffect(() => {
        if (ros) {
            const topic = createTopic(ros, '/animations', 'robot_toolkit_msgs/animation_msg');
            setAnimationPublisher(topic);
        }
    }, [ros]);

    const handleAnimation = () => {
        if (!selectedAnimation) {
            alert("Seleccione una animación para ejecutar.");
            return;
        }

        const message = new ROSLIB.Message({
            family: "animations",          // Required by the message definition
            animation_name: selectedAnimation // Correct field from the Python code
        });

        if (animationPublisher) {
            animationPublisher.publish(message);
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
        </div>
    );
};

export default RobotAnimationControl;