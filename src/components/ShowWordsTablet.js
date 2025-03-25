import React, { useState } from 'react';
import { useRos } from '../contexts/RosContext';
import * as ROSLIB from 'roslib';

const ShowWordsTablet = () => {
    const { ros } = useRos();
    const [tabletText, setTabletText] = useState("Esperando el texto..."); //para poderlo mostrar en la pagina web

    const fetchTabletText = () => {
        if (ros) {
            const service = new ROSLIB.Service({
                ros: ros,
                name: '/pytoolkit/ALTabletService/show_words_srv',
                serviceType: 'robot_toolkit_msgs/battery_service_srv', 
            });

            const request = new ROSLIB.ServiceRequest({}); //no args

            service.callService(request, (result) => {
                console.log("El texto en la tablet es:", result.message);
                setTabletText(result.message); //actualizar el texto en la interfaz para saber que dice
            });
        }
    };

    return (
        <div>
            <h2>Texto en la Tablet</h2>
            <p>{tabletText}</p> 
            <button onClick={fetchTabletText}>Mostrar texto actual</button>
        </div>
    );
};

export default ShowWordsTablet;
