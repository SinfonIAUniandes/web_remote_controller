import React, { useState, useEffect } from 'react';
import { useRos } from '../contexts/RosContext';
import { createTopic } from '../services/RosManager';
import * as ROSLIB from 'roslib';

const RobotHeadControl = () => {
    const { ros } = useRos();
    const [angle0, setAngle0] = useState(0.0);  // Horizontal
    const [angle1, setAngle1] = useState(0.0);  // Vertical
    const [headTopic, setHeadTopic] = useState(null);

    useEffect(() => {
        if (ros) {
            const topic = createTopic(ros, '/set_angles', 'robot_toolkit_msgs/set_angles_msg');
            setHeadTopic(topic);
        }
    }, [ros]);

    const handleMoveHead = () => {
        if (!headTopic) {
            alert("No hay conexión con ROS.");
            return;
        }

        const msg = new ROSLIB.Message({
            names: ["HeadYaw", "HeadPitch"],
            angles: [parseFloat(angle0), parseFloat(angle1)],
            speed: 0.1
        });

        headTopic.publish(msg);
        console.log("Mensaje enviado para mover la cabeza:", msg);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>🧠 Controlar Cabeza del Robot</h2>

            <div style={{ marginBottom: '10px' }}>
                <label>Ángulo Horizontal (Yaw): </label>
                <input
                    type="number"
                    step="0.1"
                    value={angle0}
                    onChange={(e) => setAngle0(e.target.value)}
                />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>Ángulo Vertical (Pitch): </label>
                <input
                    type="number"
                    step="0.1"
                    value={angle1}
                    onChange={(e) => setAngle1(e.target.value)}
                />
            </div>

            <button 
                onClick={handleMoveHead}
                style={{
                    padding: '10px 15px',
                    fontSize: '16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Mover Cabeza
            </button>
        </div>
    );
};

export default RobotHeadControl;