import React, { useState } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createTopic, publishMessage } from '../../../services/RosManager';

// Componente que permite elegir los colores de los LEDs del robot
const LEDController = () => {
    const { ros } = useRos(); // Acceder a la conexión ROS

    // Nombre del LED (o grupo de LEDs)
    const [ledName, setLedName] = useState('FaceLeds');
    // Color en formato hexadecimal
    const [color, setColor] = useState('#ffffff'); // Por defecto, blanco
    // Duración de la transición en segundos
    const [duration, setDuration] = useState(0); // 0 para cambiar inmediatamente

    // Crear el tópico para publicar los colores de los LEDs
    const ledsTopic = createTopic(ros, '/set_leds', 'naoqi_utilities_msgs/msg/LedParameters');

    // Función para enviar el mensaje de LEDs a ROS
    const setLEDColor = () => {
        const { red, green, blue } = hexToRgb(color); // Convertir el color hexadecimal a RGB

        // Crear el mensaje de ROS en el formato correcto
        const messageData = {
            name: ledName,  // Nombre del LED o grupo de LEDs
            red: red,       // Valor RGB de color rojo
            green: green,   // Valor RGB de color verde
            blue: blue,     // Valor RGB de color azul
            duration: duration // Duración en segundos de la transición
        };

        // Publicar el mensaje en el tópico /set_leds
        publishMessage(ledsTopic, messageData);
        console.log(`Mensaje enviado: Nombre del LED - ${ledName}, Rojo - ${red}, Verde - ${green}, Azul - ${blue}, Duración - ${duration}`);
    };

    // Función para convertir color hexadecimal a RGB
    const hexToRgb = (hex) => {
        const red = parseInt(hex.substring(1, 3), 16);
        const green = parseInt(hex.substring(3, 5), 16);
        const blue = parseInt(hex.substring(5, 7), 16);
        return { red, green, blue };
    };

    return (
        <div>
            <h2>Control de LEDs</h2>

            {/* Input para el nombre del LED */}
            <div>
                <label>Nombre del LED: </label>
                <input
                    type="text"
                    value={ledName}
                    onChange={(e) => setLedName(e.target.value)}
                />
            </div>

            {/* Input para el color del LED */}
            <div>
                <label>Color del LED: </label>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
            </div>

            {/* Input para la duración de la transición */}
            <div>
                <label>Duración (en segundos): </label>
                <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseFloat(e.target.value) || 0)}
                />
            </div>

            {/* Botón para actualizar el color de los LEDs */}
            <button onClick={setLEDColor}>Actualizar LEDs</button>
        </div>
    );
};

export default LEDController;