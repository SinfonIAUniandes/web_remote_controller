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
            '/naoqi_perception/set_tracker_mode',
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
        <div>
            <h2>Control del Tracker</h2>
            <p>Estado actual: {trackerState}</p>
            {/* 4. Actualizar los botones para llamar a la nueva función con los modos correctos */}
            <button onClick={() => handleSetTrackerMode('start_head')}>Rastrear con Cabeza</button>
            <button onClick={() => handleSetTrackerMode('start_move')} style={{ marginLeft: '10px' }}>Rastrear con Cuerpo</button>
            <button onClick={() => handleSetTrackerMode('stop')} style={{ marginLeft: '10px' }}>Apagar Tracker</button>
        </div>
    );
};

export default TrackerControl;
