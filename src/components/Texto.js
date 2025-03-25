import React, { useState } from 'react';
import { useRos } from '../contexts/RosContext';
import * as ROSLIB from 'roslib';

const TrackerControl = () => {
    const { ros } = useRos();
    const [trackerState, setTrackerState] = useState("Off");

    const toggleTracker = (enable) => {
        if (ros) {
            const service = new ROSLIB.Service({
                ros: ros,
                name: enable ? '/pytoolkit/ALTracker/start_tracker_srv' : '/pytoolkit/ALTracker/stop_tracker_srv', //Servicio dependiendo de lo que quiero hacer
                serviceType: 'robot_toolkit_msgs/battery_service_srv', //Tipo mensaje
            });

            const request = new ROSLIB.ServiceRequest({}); //No armo nada, no necesita

            service.callService(request, (result) => {
                console.log(`Tracker ${enable ? 'encendido' : 'apagado'}. Respuesta:`, result);
                setTrackerState(enable ? "On" : "Off");
            });
        }
    };

    return (
        <div>
            <h2>Control del Tracker</h2>
            <p>Estado actual: {trackerState}</p>
            <button onClick={() => toggleTracker(true)}>Encender Tracker</button>
            <button onClick={() => toggleTracker(false)}>Apagar Tracker</button>
        </div>
    );
};

export default TrackerControl;
