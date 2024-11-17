import React, { useEffect, useState } from 'react';
import { useRos } from '../contexts/RosContext';
import * as ROSLIB from 'roslib';

//Componente que permite ver la bateria actual del robot
const BatteryStatus = () => {

  const { ros } = useRos(); //Acceder a la conexión ROS

  // Estado para almacenar el nivel de batería
  const [batteryLevel, setBatteryLevel] = useState(null);
  //setVariable: es una función que se usa para cambiar el valor de variable
  //batteryLevel: valor actual que quiero recordar
  //useState(valorInicial): dar un valor inicial a la variable de estado batteryLevel (en este caso null)

  useEffect(() => {
    if (ros) {
        // Crear el cliente (o suscriptor) del servicio para obtener el nivel de batería
        const batteryService = new ROSLIB.Service({
            ros: ros, // Conexión ROS 
            name: '/pytoolkit/ALBatteryService/get_porcentage', // Nombre del servicio
            serviceType: 'robot_toolkit_msgs/BatteryPercentageService' // Tipo de retorno del servicio ??
        });

        // Crear una solicitud vacía
        const request = new ROSLIB.ServiceRequest({});

        // Llamar al servicio y tener la rta
        batteryService.callService(request, (result) => {
            console.log('Respuesta del servicio de bateria:', result);
            setBatteryLevel(result.percentage); // Actualizar el nivel de batería, con la "llave" percentaje
        });
    }
    }, [ros]);

    return (
        <div>
            <h2>Estado de la Batería</h2>

            {/* Mostrar el nivel de batería si ya se tiene */}
            {batteryLevel !== null ? (
                <div>
                    {/*Mostrar el porcentaje de batería*/}
                    <p>Nivel de batería: {batteryLevel}%</p>

                    {/*Barra de progreso visual para el nivel de batería*/}
                    <progress value={batteryLevel} max="100"></progress>
                </div>
            ) : (
                <p>Obteniendo nivel de batería...</p>
            )}
        </div>
    );
    };

export default BatteryStatus;