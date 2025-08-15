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
        <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-center mb-4">Control de Seguridad</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
                <button onClick={enableDefaultSecurity} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    Seguridad por Defecto
                </button>
                <button onClick={disableAllSecurity} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                    Deshabilitar Seguridad
                </button>
            </div>

            <div className="mt-auto space-y-3">
                <h4 className="text-md font-semibold text-center">Ajuste Fino de Distancias</h4>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tangencial:</label>
                    <div className="flex items-center gap-2 mt-1">
                        <input
                            type="number"
                            step="0.01"
                            value={tangentialDistance}
                            onChange={(e) => setTangentialDistance(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                        />
                        <button onClick={setTangential} className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Set</button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ortogonal:</label>
                    <div className="flex items-center gap-2 mt-1">
                        <input
                            type="number"
                            step="0.01"
                            value={orthogonalDistance}
                            onChange={(e) => setOrthogonalDistance(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                        />
                        <button onClick={setOrthogonal} className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Set</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityControl;