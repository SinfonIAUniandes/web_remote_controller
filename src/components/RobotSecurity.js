import React from 'react';
import { useRos } from '../contexts/RosContext';
import * as ROSLIB from 'roslib';

//Componente para habilitar o deshabilitar la seguridad del robot
const SecurityControl = () => {
    const {ros} = useRos(); //Conexión ROS

    //Función para llamar al servicio
    const toggleSecurity = (enable) => {
        if (ros) {
            const service = new ROSLIB.Service({
                ros: ros,
                name: '/pytoolkit/ALMotion/enable_security_srv', //Nombre del servicio
                serviceType: 'std_srvs/SetBool', //Tipo de mensaje que hay que mandarle al servicio
            });

            //Crear la solicitud con el valor true/false para activar/desactivar
            const request = new ROSLIB.ServiceRequest({
                data: enable, //true para habilitar, false para deshabilitar
            });

            //Llamar al servicio
            service.callService(request, (result) => {
                console.log(`Seguridad ${enable ? 'habilitada' : 'deshabilitada'}. Respuesta:`, result);
            });
        } 
    };

    return (
        <div>
            <h2>Control de Seguridad</h2>
            <button onClick={() => toggleSecurity(true)}>Habilitar Seguridad</button>
            <button onClick={() => toggleSecurity(false)}>Deshabilitar Seguridad</button>
        </div>
    );
};

export default SecurityControl;
