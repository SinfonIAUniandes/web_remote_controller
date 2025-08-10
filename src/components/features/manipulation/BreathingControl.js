import React, { useState } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createService, callService } from '../../../services/RosManager';

// Componente para controlar la respiración del robot
const BreathingControl = () => {
    const { ros } = useRos(); // Acceder a la conexión ROS
    const [selectedPart, setSelectedPart] = useState("Body"); // Estado para la parte del cuerpo seleccionada
    const [breathingEnabled, setBreathingEnabled] = useState(true); // Estado para saber si la respiración está activa (booleano)

    // Función para cambiar el estado de la respiración
    const handleToggleBreathing = (enable) => {
        if (!ros) {
            console.error("ROS connection not available.");
            return;
        }
        
        // 1. Usar el nuevo nombre y tipo de servicio de ROS 2
        const service = createService(
            ros,
            '/naoqi_manipulation/toggle_breathing',
            'naoqi_utilities_msgs/srv/SetBreathing'
        );

        // 2. Crear la solicitud con los campos correctos ('joint_group' y 'enabled')
        const request = {
            joint_group: selectedPart,
            enabled: enable, // El servicio espera un booleano, no un string
        };

        // 3. Llamar al servicio usando el helper
        callService(service, (request), (result) => {
            if (result.success) {
                console.log(`Breathing for ${selectedPart} set to ${enable}. Message: ${result.message}`);
                setBreathingEnabled(enable); // Actualizar el estado local
            } else {
                console.error(`Failed to set breathing for ${selectedPart}. Reason: ${result.message}`);
            }
        });
    };

    return (
        <div>
            <h2>Control de Respiración</h2>

            {/* Selector para la parte del cuerpo */}
            <label>
                Seleccionar parte del cuerpo:
                <select value={selectedPart} onChange={(e) => setSelectedPart(e.target.value)}>
                    <option value="Body">Cuerpo</option>
                    <option value="Arms">Brazos</option>
                    <option value="LArm">Brazo Izquierdo</option>
                    <option value="RArm">Brazo Derecho</option>
                    <option value="Head">Cabeza</option>
                </select>
            </label>

            {/* Mostrar el estado actual */}
            <p>Estado actual de {selectedPart}: {breathingEnabled ? "Activada" : "Desactivada"}</p>

            {/* Botones para activar o desactivar */}
            <button onClick={() => handleToggleBreathing(true)} disabled={breathingEnabled}>Activar Respiración</button>
            <button onClick={() => handleToggleBreathing(false)} disabled={!breathingEnabled}>Desactivar Respiración</button>
        </div>
    );
};

export default BreathingControl;
