import React, { useEffect, useState } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createTopic, subscribeToTopic } from '../../../services/RosManager';

// Componente que permite ver la batería actual del robot
const BatteryStatus = () => {
    const { ros } = useRos(); // Acceder a la conexión ROS
    const [batteryLevel, setBatteryLevel] = useState(100); // Estado para almacenar el nivel de batería

    useEffect(() => {
        if (ros) {
            // Crear el tópico para suscribirse al nivel de batería
            const batteryTopic = createTopic(
                ros,
                '/battery_percentage', // Nombre del tópico
                'std_msgs/msg/Float32' // Tipo de mensaje
            );

            // Suscribirse al tópico y actualizar el estado con el valor recibido
            subscribeToTopic(batteryTopic, (message) => {
                console.log('Nivel de batería recibido:', message.data);
                setBatteryLevel(message.data); // Actualizar el nivel de batería
            });

            // Limpiar la suscripción al desmontar el componente
            return () => {
                batteryTopic.unsubscribe();
                console.log('Suscripción al tópico de batería cancelada.');
            };
        }
    }, [ros]);

    return (
        <div>
            {/* Mostrar el nivel de batería si ya se tiene */}
            <div>
                <p>Nivel de batería: {batteryLevel}%</p>

                {/* Barra de progreso visual para el nivel de batería */}
                <progress value={batteryLevel} max="100"></progress>
            </div>
        </div>
    );
};

export default BatteryStatus;