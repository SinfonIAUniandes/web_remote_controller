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
            '/naoqi_miscellaneous/set_autonomous_state',
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
        <div>
            <h2>Control de Vida Autónoma</h2>
            <button onClick={() => toggleAutonomousLife(true)}>Activar Vida Autónoma</button>
            <button onClick={() => toggleAutonomousLife(false)}>Desactivar Vida Autónoma</button>
        </div>
    );
};

export default AutonomousLifeControl;
