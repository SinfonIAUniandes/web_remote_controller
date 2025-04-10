import React, { useEffect } from 'react';
import { useRos } from '../contexts/RosContext';
import { createService } from '../services/RosManager';
import * as ROSLIB from 'roslib';

const RobotPostureControl = () => {
    const { ros } = useRos();
    const postureService = ros 
        ? createService(ros, '/pytoolkit/ALRobotPosture/go_to_posture_srv', 'robot_toolkit_msgs/go_to_posture_srv') 
        : null;

    useEffect(() => {
        if (ros) {
            console.log('Servicio de postura disponible.');
        }
    }, [ros]);

    const handlePosture = (posture) => {
        if (!postureService) {
            alert("No hay conexión con ROS.");
            return;
        }

        const request = new ROSLIB.ServiceRequest({
            args: posture
        });

        postureService.callService(request, (result) => {
            console.log(`Postura enviada: ${posture}`, result);
        }, (error) => {
            console.error(`Error enviando postura: ${posture}`, error);
        });
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <div>
                <button onClick={() => handlePosture('rest')}>
                    Agacharse
                </button>
                <button onClick={() => handlePosture('stand')}>
                    Pararse
                </button>
            </div>
        </div>
    );
};

export default RobotPostureControl;