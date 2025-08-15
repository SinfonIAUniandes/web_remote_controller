import React, { useState } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createService, callService } from '../../../services/RosManager';

// Componente para controlar la respiración del robot
const BreathingControl = () => {
    const { ros } = useRos(); // Acceder a la conexión ROS
    const [selectedPart, setSelectedPart] = useState("Body"); // Estado para la parte del cuerpo seleccionada
    const [breathingEnabled, setBreathingEnabled] = useState(false); // Estado para saber si la respiración está activa (booleano)

    // Función para cambiar el estado de la respiración
    const handleToggleBreathing = (enable) => {
        if (!ros) {
            console.error("ROS connection not available.");
            return;
        }
        
        // 1. Usar el nuevo nombre y tipo de servicio de ROS 2
        const service = createService(
            ros,
            '/naoqi_manipulation_node/toggle_breathing',
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
        <div className="text-center flex flex-col h-full">
            <h2 className="text-lg font-semibold mb-4">Control de Respiración</h2>
            
            <div className="mb-4">
                <label htmlFor="breathing-part" className="block text-sm font-medium text-gray-700 mb-1">
                    Parte del cuerpo:
                </label>
                <select 
                    id="breathing-part"
                    value={selectedPart} 
                    onChange={(e) => setSelectedPart(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="Body">Cuerpo</option>
                    <option value="Arms">Brazos</option>
                    <option value="LArm">Brazo Izquierdo</option>
                    <option value="RArm">Brazo Derecho</option>
                    <option value="Head">Cabeza</option>
                </select>
            </div>

            <p className="text-sm text-gray-600 mb-4">
                Estado de {selectedPart}: <strong className={breathingEnabled ? "text-green-600" : "text-red-600"}>{breathingEnabled ? "Activada" : "Desactivada"}</strong>
            </p>

            <div className="mt-auto grid grid-cols-2 gap-2">
                <button 
                    onClick={() => handleToggleBreathing(true)} 
                    disabled={breathingEnabled}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400"
                >
                    Activar
                </button>
                <button 
                    onClick={() => handleToggleBreathing(false)} 
                    disabled={!breathingEnabled}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:bg-gray-400"
                >
                    Desactivar
                </button>
            </div>
        </div>
    );
};

export default BreathingControl;
