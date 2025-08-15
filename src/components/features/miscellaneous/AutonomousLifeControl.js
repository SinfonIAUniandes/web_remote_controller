import React from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createService, callService } from '../../../services/RosManager';

// Componente para encender/apagar la vida autónoma del robot
const AutonomousLifeControl = () => {
    const { ros } = useRos(); // Acceder a la conexión ROS

    // Función para llamar al servicio y cambiar el estado de la vida autónoma
    const toggleAutonomousLife = (enable) => {
        if (!ros) {
            console.error("La conexión con ROS no está disponible.");
            return;
        }

        // Crear el servicio con el nombre y tipo correctos
        const service = createService(
            ros,
            '/naoqi_miscellaneous_node/set_autonomous_state',
            'std_srvs/srv/SetBool'
        );

        // Crear la solicitud con el valor true/false para activar/desactivar
        const request = { data: enable };

        // Llamar al servicio
        callService(service, request, (result) => {
            if (result.success) {
                console.log(`Vida autónoma ${enable ? 'activada' : 'desactivada'}.`);
            } else {
                console.error(`Error al cambiar el estado de la vida autónoma: ${result.message}`);
            }
        });
    };

    return (
        <div className="text-center flex flex-col h-full items-center justify-center">
            <h2 className="text-lg font-semibold mb-4">Control de Vida Autónoma</h2>
            <div className="grid grid-cols-2 gap-2">
                <button 
                    onClick={() => toggleAutonomousLife(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                    Activar
                </button>
                <button 
                    onClick={() => toggleAutonomousLife(false)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                    Desactivar
                </button>
            </div>
        </div>
    );
};

export default AutonomousLifeControl;
