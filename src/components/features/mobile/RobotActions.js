import React, { useState, useEffect, useCallback } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createService, callService } from '../../../services/RosManager';

// Importar los archivos JSON de acciones
import naoActions from '../../../assets/nao_actions.json';
import pepperActions from '../../../assets/pepper_actions.json';

// Definir las posturas fuera del componente para que sean constantes
const basePostures = [
    { name: 'Stand', icon: '🧍', type: 'posture' },
    { name: 'Rest', icon: '🧘', type: 'posture' },
];

const naoExtraPostures = [
    { name: 'Sit', icon: '🪑', type: 'posture' },
    { name: 'Lying-Back', icon: '🛌', type: 'posture' },
    { name: 'Lying-Front', icon: '🤸', type: 'posture' },
];

const RobotActions = () => {
    const { ros, robotModel } = useRos();
    const [actions, setActions] = useState([]);

    useEffect(() => {
        if (!robotModel) return;

        let finalActions = [...basePostures];
        let specificActions = [];

        if (robotModel === 'NAO') {
            finalActions = [...finalActions, ...naoExtraPostures];
            specificActions = naoActions;
        } else if (robotModel === 'Pepper') {
            specificActions = pepperActions;
        }

        // Mapear acciones de JSON para que tengan el tipo 'custom'
        const customActions = specificActions.map(a => ({ ...a, type: 'custom' }));
        setActions([...finalActions, ...customActions]);

    }, [robotModel]);

    const handleActionClick = useCallback((action) => {
        if (!ros) {
            console.error("ROS connection not available.");
            return;
        }

        if (action.type === 'posture') {
            const postureService = createService(ros, '/naoqi_manipulation_node/go_to_posture', 'naoqi_utilities_msgs/srv/GoToPosture');
            callService(postureService, { posture_name: action.name }, (result) => {
                console.log(`Posture result:`, result);
            });
        } else if (action.type === 'custom') {
            // 1. Establecer volumen (opcional, pero buena práctica)
            const volumeService = createService(ros, '/naoqi_speech_node/set_volume', 'naoqi_utilities_msgs/srv/SetVolume');
            callService(volumeService, { volume: action.speech.volume }, () => {
                // 2. Ejecutar animación
                const animationService = createService(ros, '/naoqi_manipulation_node/play_animation', 'naoqi_utilities_msgs/srv/PlayAnimation');
                callService(animationService, { animation_name: action.animation }, () => {
                    // 3. Decir el texto después de que la animación comience
                    const speechService = createService(ros, '/naoqi_speech_node/say', 'naoqi_utilities_msgs/srv/Say');
                    const speechRequest = {
                        text: action.speech.text,
                        language: action.speech.language,
                        animated: action.speech.animated,
                        asynchronous: true,
                    };
                    callService(speechService, speechRequest, (speechResult) => {
                        console.log('Speech result:', speechResult);
                    });
                });
            });
        }
    }, [ros]);

    return (
        <div className="w-full bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold text-center mb-4">Acciones Rápidas</h3>
            <div className="h-64 overflow-y-auto flex flex-col items-center gap-3">
                {actions.length > 0 ? (
                    actions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => handleActionClick(action)}
                            title={action.name}
                            className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl hover:bg-blue-600 transition-colors shadow-md"
                        >
                            {action.icon}
                        </button>
                    ))
                ) : (
                    <p className="text-gray-500">Detectando robot...</p>
                )}
            </div>
        </div>
    );
};

export default RobotActions;