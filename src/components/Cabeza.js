import React, { useEffect, useState } from 'react';
import { useRos } from '../contexts/RosContext';
import { createTopic, createService } from '../services/RosManager';
import * as ROSLIB from 'roslib';

const HeadMovementControl = () => {
    const { ros } = useRos();
    const [anglePitch, setAnglePitch] = useState('');
    const [angleYaw, setAngleYaw] = useState('');
    const [speed, setSpeed] = useState('0.1');

    const headTopic = ros
        ? createTopic(ros, '/set_angles', 'robot_toolkit_msgs/set_angles_msg')
        : null;

    useEffect(() => {
        if (ros) {
            const motionService = createService(
                ros,
                '/robot_toolkit/motion_tools_srv',
                'robot_toolkit_msgs/motion_tools_srv'
            );

            const request = {
                data: { command: "enable_all" }
              };

            motionService.callService(request,
                (result) => {
                    console.log('Motion tools service initialized:', result);
                },
                (error) => {
                    console.error('Error initializing motion tools service:', error);
                }
            );
        }
    }, [ros]);

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
            <h2>Control de cabeza del robot</h2>

            <div>
                <label>Ángulo pitch:</label>
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
                <label>Ángulo yaw:</label>
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
                Mover cabeza
            </button>
        </div>
    );
};

export default HeadMovementControl;