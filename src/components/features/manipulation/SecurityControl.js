import React, { useState } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createService, callService } from '../../../services/RosManager';

const SecurityControl = () => {
    const { ros } = useRos();
    const [tangentialDistance, setTangentialDistance] = useState(0.1);
    const [orthogonalDistance, setOrthogonalDistance] = useState(0.1);

    const handleServiceCall = (serviceName, serviceType, requestData) => {
        if (!ros) {
            console.error("ROS connection not available.");
            return;
        }
        const service = createService(ros, `/naoqi_manipulation_node${serviceName}`, serviceType);
        callService(service, requestData, (result) => {
            console.log(`Service call to ${serviceName} successful:`, result);
        });
    };

    const enableDefaultSecurity = () => {
        handleServiceCall('/enable_default_security', 'std_srvs/srv/Trigger', {});
    };

    const disableAllSecurity = () => {
        // Deshabilitar protección de colisión de brazos
        handleServiceCall('/toggle_arms_collision_protection', 'std_srvs/srv/SetBool', { data: false });
        // Establecer distancias de seguridad a 0.0
        handleServiceCall('/set_tangential_security_distance', 'naoqi_utilities_msgs/srv/SetSecurityDistance', { distance: 0.0 });
        handleServiceCall('/set_orthogonal_security_distance', 'naoqi_utilities_msgs/srv/SetSecurityDistance', { distance: 0.0 });
    };

    const setTangential = () => {
        handleServiceCall('/set_tangential_security_distance', 'naoqi_utilities_msgs/srv/SetSecurityDistance', { distance: parseFloat(tangentialDistance) });
    };

    const setOrthogonal = () => {
        handleServiceCall('/set_orthogonal_security_distance', 'naoqi_utilities_msgs/srv/SetSecurityDistance', { distance: parseFloat(orthogonalDistance) });
    };

    return (
        <div>
            <h3>Control de Seguridad</h3>
            <div>
                <button onClick={enableDefaultSecurity}>Habilitar Seguridad por Defecto</button>
                <button onClick={disableAllSecurity} style={{ marginLeft: '10px' }}>Deshabilitar Toda la Seguridad</button>
            </div>
            <div style={{ marginTop: '15px' }}>
                <h4>Ajuste Fino de Distancias</h4>
                <div>
                    <label>Tangencial: </label>
                    <input
                        type="number"
                        step="0.01"
                        value={tangentialDistance}
                        onChange={(e) => setTangentialDistance(e.target.value)}
                    />
                    <button onClick={setTangential}>Establecer</button>
                </div>
                <div style={{ marginTop: '5px' }}>
                    <label>Ortogonal: </label>
                    <input
                        type="number"
                        step="0.01"
                        value={orthogonalDistance}
                        onChange={(e) => setOrthogonalDistance(e.target.value)}
                    />
                    <button onClick={setOrthogonal}>Establecer</button>
                </div>
            </div>
        </div>
    );
};

export default SecurityControl;