import React, { useState } from 'react';
import { useRos } from '../contexts/RosContext';
import { createTopic } from '../services/RosManager';
import * as ROSLIB from 'roslib';

const MoverCabeza = () => {
    const { ros } = useRos();
    const [angle0, setAngle0] = useState('');
    const [angle1, setAngle1] = useState('');
    const headTopic = ros ? createTopic(ros, '/set_angles', 'robot_toolkit_msgs/set_angles_msg') : null;

    const handleMoveHead = () => {
        if (!angle0 || !angle1) {
            alert("Ingrese ambos ángulos.");
            return;
        }

        if (!headTopic) {
            alert("Error: No hay conexión con ROS.");
            return;
        }

        const message = new ROSLIB.Message({
            joint_names: ["HeadYaw", "HeadPitch"],
            joint_angles: [parseFloat(angle0), parseFloat(angle1)],
            speed: 0.3,
            relative: false
        });

        headTopic.publish(message);
        console.log("Moviendo cabeza con ángulos:", message);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>🧠 Mover Cabeza del Robot</h2>

            <div>
                <label>Ángulo Horizontal (HeadYaw):</label>
                <input
                    type="number"
                    value={angle0}
                    onChange={(e) => setAngle0(e.target.value)}
                    placeholder="Ej. 0.5"
                    style={{ margin: '5px' }}
                />
            </div>
            <div>
                <label>Ángulo Vertical (HeadPitch):</label>
                <input
                    type="number"
                    value={angle1}
                    onChange={(e) => setAngle1(e.target.value)}
                    placeholder="Ej. -0.3"
                    style={{ margin: '5px' }}
                />
            </div>
            <button
                onClick={handleMoveHead}
                style={{
                    padding: '10px 15px',
                    marginTop: '10px',
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

export default MoverCabeza;