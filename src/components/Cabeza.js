import React, { useState } from 'react';
import { useRos } from '../contexts/RosContext';
import { createTopic } from '../services/RosManager';
import * as ROSLIB from 'roslib';

const HeadMovementControl = () => {
    const { ros } = useRos();
    const [anglePitch, setAnglePitch] = useState('');
    const [angleYaw, setAngleYaw] = useState('');
    const [speed, setSpeed] = useState('0.1');

    const headTopic = ros
        ? createTopic(ros, '/set_angles', 'robot_toolkit_msgs/set_angles_msg')
        : null;

    const handleMoveHead = () => {
        if (!anglePitch || !angleYaw) {
            alert("Por favor ingrese ambos ángulos.");
            return;
        }

        if (!headTopic) {
            alert("No hay conexión con ROS.");
            return;
        }

        const message = new ROSLIB.Message({
            names: ["HeadPitch", "HeadYaw"],
            angles: [parseFloat(anglePitch), parseFloat(angleYaw)],
            fraction_max_speed: [parseFloat(speed), parseFloat(speed)]
        });

        headTopic.publish(message);
        console.log("Moviendo cabeza:", message);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>🧠 Control de Cabeza del Robot</h2>

            <div>
                <label>Ángulo Pitch:</label>
                <input
                    type="number"
                    value={anglePitch}
                    onChange={(e) => setAnglePitch(e.target.value)}
                    placeholder="Ej: 0.3"
                    step="0.01"
                    style={{ margin: '5px' }}
                />
            </div>

            <div>
                <label>Ángulo Yaw:</label>
                <input
                    type="number"
                    value={angleYaw}
                    onChange={(e) => setAngleYaw(e.target.value)}
                    placeholder="Ej: 0.2"
                    step="0.01"
                    style={{ margin: '5px' }}
                />
            </div>

            <div>
                <label>Velocidad (0.0 a 1.0):</label>
                <input
                    type="number"
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    placeholder="Ej: 0.1"
                    min="0"
                    max="1"
                    step="0.01"
                    style={{ margin: '5px' }}
                />
            </div>

            <button
                onClick={handleMoveHead}
                style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    backgroundColor: '#007BFF',
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

export default HeadMovementControl;