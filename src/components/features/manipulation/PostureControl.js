import React from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createService, callService } from '../../../services/RosManager';

const RobotPostureControl = () => {
    const { ros } = useRos();

    const handlePosture = (posture) => {
        if (!ros) {
            alert("La conexión con ROS no está disponible.");
            return;
        }

        // 1. Crear el servicio con el nombre y tipo correctos de ROS 2
        const postureService = createService(
            ros, 
            '/naoqi_manipulation/go_to_posture', 
            'naoqi_utilities_msgs/srv/GoToPosture'
        );

        // 2. Crear la solicitud con la estructura correcta: { posture_name: '...' }
        const request = {
            posture_name: posture
        };

        console.log(`Enviando solicitud de postura: ${posture}`);

        // 3. Llamar al servicio usando el helper de RosManager
        callService(postureService, request, (result) => {
            if (result.success) {
                console.log(`Postura '${posture}' ejecutada correctamente. Mensaje: ${result.message}`);
            } else {
                console.error(`Error al ejecutar la postura '${posture}'. Razón: ${result.message}`);
            }
        });
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h4>Control de Postura</h4>
            <div>
                <button onClick={() => handlePosture('rest')}>
                    Agacharse (Rest)
                </button>
                <button onClick={() => handlePosture('Stand')} style={{ marginLeft: '10px' }}>
                    Pararse (Stand)
                </button>
                 <button onClick={() => handlePosture('Sit')} style={{ marginLeft: '10px' }}>
                    Sentarse (Sit)
                </button>
            </div>
        </div>
    );
};

export default RobotPostureControl;