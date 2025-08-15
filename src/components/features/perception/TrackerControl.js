import React, { useState } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createService, callService } from '../../../services/RosManager';

const TrackerControl = () => {
    const { ros } = useRos();
    const [trackerState, setTrackerState] = useState("Tracker apagado"); // Estado para mostrar al usuario

    const handleSetTrackerMode = (mode) => {
        if (!ros) {
            console.error("ROS connection not available.");
            return;
        }

        // 1. Usar el nuevo nombre y tipo de servicio
        const service = createService(
            ros,
            '/naoqi_perception_node/set_tracker_mode',
            'naoqi_utilities_msgs/srv/SetTrackerMode'
        );

        // 2. Crear la solicitud con el campo 'mode'
        const request = { mode: mode };

        // 3. Llamar al servicio usando el helper
        callService(service, request, (result) => {
            if (result.success) {
                console.log(`Tracker mode set to '${mode}'. Message: ${result.message}`);
                // Actualizar el estado para el usuario
                if (mode === 'stop') {
                    setTrackerState("Tracker apagado");
                } else if (mode === 'start_head') {
                    setTrackerState("Rastreando con la cabeza");
                } else if (mode === 'start_move') {
                    setTrackerState("Rastreando con todo el cuerpo");
                }
            } else {
                console.error(`Failed to set tracker mode to '${mode}'. Reason: ${result.message}`);
            }
        });
    };

    return (
        <div className="text-center flex flex-col h-full items-center justify-center">
            <h2 className="text-lg font-semibold mb-2">Control del Tracker</h2>
            <p className="text-sm text-gray-600 mb-4">Estado actual: <strong className="font-semibold">{trackerState}</strong></p>
            <div className="flex flex-col sm:flex-row justify-center gap-2">
                <button 
                    onClick={() => handleSetTrackerMode('start_head')}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors"
                >
                    Rastrear con Cabeza
                </button>
                <button 
                    onClick={() => handleSetTrackerMode('start_move')}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
                >
                    Rastrear con Cuerpo
                </button>
                <button 
                    onClick={() => handleSetTrackerMode('stop')}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                    Apagar Tracker
                </button>
            </div>
        </div>
    );
};

export default TrackerControl;
