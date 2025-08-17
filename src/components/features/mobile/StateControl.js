import React, { useState, useCallback } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createService, callService } from '../../../services/RosManager';

// Componente de interruptor reutilizable para la UI con tooltip
const ToggleSwitch = ({ icon, isEnabled, onToggle, tooltip }) => (
    <button
        onClick={onToggle}
        title={tooltip} // El atributo title crea un tooltip nativo del navegador
        className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors duration-300 ${
            isEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
        }`}
    >
        {icon}
    </button>
);

const StateControl = () => {
    const { ros } = useRos();

    // Estados para cada interruptor. Asumimos un estado inicial por defecto.
    const [autonomousLifeEnabled, setAutonomousLifeEnabled] = useState(true);
    const [securityEnabled, setSecurityEnabled] = useState(true);
    const [breathingEnabled, setBreathingEnabled] = useState(false);
    const [trackerEnabled, setTrackerEnabled] = useState(false);

    // --- Control de Vida Autónoma ---
    const toggleAutonomousLife = useCallback(() => {
        if (!ros) return;
        const newState = !autonomousLifeEnabled;
        const service = createService(ros, '/naoqi_miscellaneous_node/set_autonomous_state', 'std_srvs/srv/SetBool');
        callService(service, { data: newState }, (result) => {
            if (result.success) setAutonomousLifeEnabled(newState);
        });
    }, [ros, autonomousLifeEnabled]);

    // --- Control de Seguridad ---
    const toggleSecurity = useCallback(() => {
        if (!ros) return;
        const newState = !securityEnabled;
        if (newState) { // Activar seguridad por defecto
            const service = createService(ros, '/naoqi_manipulation_node/enable_default_security', 'std_srvs/srv/Trigger');
            callService(service, {}, (result) => {
                if (result.success) setSecurityEnabled(true);
            });
        } else { // Desactivar toda la seguridad
            const armsService = createService(ros, '/naoqi_manipulation_node/toggle_arms_collision_protection', 'std_srvs/srv/SetBool');
            callService(armsService, { data: false }, (result) => {
                if (result.success) {
                    // Si la desactivación de brazos es exitosa, poner las distancias a 0
                    const tangentialService = createService(ros, '/naoqi_manipulation_node/set_tangential_security_distance', 'naoqi_utilities_msgs/srv/SetSecurityDistance');
                    callService(tangentialService, { distance: 0.0 }, () => {}); // Fire and forget

                    const orthogonalService = createService(ros, '/naoqi_manipulation_node/set_orthogonal_security_distance', 'naoqi_utilities_msgs/srv/SetSecurityDistance');
                    callService(orthogonalService, { distance: 0.0 }, () => {}); // Fire and forget
                    
                    setSecurityEnabled(false);
                }
            });
        }
    }, [ros, securityEnabled]);

    // --- Control de Respiración ---
    const toggleBreathing = useCallback(() => {
        if (!ros) return;
        const newState = !breathingEnabled;
        const service = createService(ros, '/naoqi_manipulation_node/toggle_breathing', 'naoqi_utilities_msgs/srv/SetBreathing');
        const request = { joint_group: 'Body', enabled: newState };
        callService(service, request, (result) => {
            if (result.success) setBreathingEnabled(newState);
        });
    }, [ros, breathingEnabled]);

    // --- Control del Tracker ---
    const toggleTracker = useCallback(() => {
        if (!ros) return;
        const newState = !trackerEnabled;
        const service = createService(ros, '/naoqi_perception_node/set_tracker_mode', 'naoqi_utilities_msgs/srv/SetTrackerMode');
        const request = { mode: newState ? 'start_head' : 'stop' };
        callService(service, request, (result) => {
            if (result.success) setTrackerEnabled(newState);
        });
    }, [ros, trackerEnabled]);

    return (
        <div className="w-full bg-white rounded-lg shadow-lg p-2">
            <h3 className="text-md font-semibold text-center mb-2">Estado</h3>
            <div className="grid grid-cols-2 justify-items-center gap-2">
                <ToggleSwitch icon="🤖" isEnabled={autonomousLifeEnabled} onToggle={toggleAutonomousLife} tooltip="Vida Autónoma" />
                <ToggleSwitch icon="🛡️" isEnabled={securityEnabled} onToggle={toggleSecurity} tooltip="Seguridad" />
                <ToggleSwitch icon="😮‍💨" isEnabled={breathingEnabled} onToggle={toggleBreathing} tooltip="Respiración" />
                <ToggleSwitch icon="👀" isEnabled={trackerEnabled} onToggle={toggleTracker} tooltip="Tracker" />
            </div>
        </div>
    );
};

export default StateControl;
