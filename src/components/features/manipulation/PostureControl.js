import React from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createService, callService } from '../../../services/RosManager';

const RobotPostureControl = () => {
    const { ros, setPosture, robotModel } = useRos();

    const handlePosture = (posture) => {
        if (!ros) {
            alert("La conexión con ROS no está disponible.");
            return;
        }

        // 1. Crear el servicio con el nombre y tipo correctos de ROS 2
        const postureService = createService(
            ros, 
            '/naoqi_manipulation_node/go_to_posture', 
            'naoqi_utilities_msgs/srv/GoToPosture'
        );

        // 2. Crear la solicitud con la estructura correcta: { posture_name: '...' }
        const request = {
            posture_name: posture
        };

        console.log(`Enviando solicitud de postura: ${posture}`);
        setPosture(posture); // Actualizar el estado global de la postura

        // 3. Llamar al servicio usando el helper de RosManager
        callService(postureService, request, (result) => {
            if (result.success) {
                console.log(`Postura '${posture}' ejecutada correctamente. Mensaje: ${result.message}`);
            } else {
                console.error(`Error al ejecutar la postura '${posture}'. Razón: ${result.message}`);
            }
        });
    };

    const renderButtons = () => {
        const buttonClass = "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors";

        if (robotModel === 'NAO') {
            return (
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handlePosture('stand')} className={buttonClass}>Pararse</button>
                    <button onClick={() => handlePosture('rest')} className={buttonClass}>Agacharse</button>
                    <button onClick={() => handlePosture('sit')} className={buttonClass}>Sentarse</button>
                    <button onClick={() => handlePosture('sit-relax')} className={buttonClass}>Relajarse</button>
                    <button onClick={() => handlePosture('lying-back')} className={buttonClass}>Acostarse (Espalda)</button>
                    <button onClick={() => handlePosture('lying-front')} className={buttonClass}>Acostarse (Frente)</button>
                </div>
            );
        }

        if (robotModel === 'Pepper') {
            return (
                <div className="grid grid-cols-1 gap-2">
                    <button onClick={() => handlePosture('stand')} className={buttonClass}>Pararse (Stand)</button>
                    <button onClick={() => handlePosture('rest')} className={buttonClass}>Agacharse (Rest)</button>
                </div>
            );
        }

        return <p className="text-sm text-gray-500">Detectando modelo de robot para mostrar posturas...</p>;
    };

    return (
        <div className="text-center flex flex-col h-full items-center justify-center">
            <h4 className="text-lg font-semibold mb-4">Control de Postura ({robotModel || '...'})</h4>
            <div className="flex justify-center gap-2">
                {renderButtons()}
            </div>
        </div>
    );
};

export default RobotPostureControl;