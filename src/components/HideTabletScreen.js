import React from 'react';
import { useRos } from '../contexts/RosContext';
import * as ROSLIB from 'roslib';

//Componente para esconder lo que se ve en la tablet del robot
const HideTabletScreen = () => {
    const { ros } = useRos(); //Acceder a la conexión ROS

    //Función para llamar al servicio y ocultar lo que este en la pantalla
    const hideScreen = () => {
        if (ros) {
            //Crear el cliente (o suscriptor) del servicio
            const hideScreenService = new ROSLIB.Service({
                ros: ros,
                name: '/pytoolkit/ALTabletService/hide_srv', // Nombre del servicio
                serviceType: 'std_srvs/Empty' // Asumiendo que usa un mensaje vacío estándar ??, hay que ver
            });

            //Crear una solicitud vacía (std_srvs/Empty no requiere parámetros, es vacio precisamente)
            const request = new ROSLIB.ServiceRequest({});

            //Llamar al servicio
            hideScreenService.callService(request, (result) => {
                console.log('Pantalla de la tablet oculta. Respuesta del servicio:', result);
            });
        } 
    };

    return (
        <div>
            <h2>Control de la Tablet</h2>
            <button onClick={hideScreen}>Ocultar Pantalla</button>
        </div>
    );
};

export default HideTabletScreen;
