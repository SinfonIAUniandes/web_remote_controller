import * as ROSLIB from 'roslib';

//Función para crear un tópico en ROS
const createTopic = (ros, topicName, messageType) => {
    return new ROSLIB.Topic({
        ros: ros,
        name: topicName,
        messageType: messageType
    });
};

//Función para publicar un mensaje en un tópico específico
const publishMessage = (topic, messageData) => {
    const rosMessage = new ROSLIB.Message(messageData);
    topic.publish(rosMessage);
};

//Función para suscribirse a un tópico en ROS
const subscribeToTopic = (topic, callback) => {
    topic.subscribe((message) => {
        console.log('Received message on ' + topic.name + ': ', message);
        callback(message);
    });
};

//Función para crear un servicio en ROS
const createService = (ros, serviceName, serviceType) => {
    return new ROSLIB.Service({
        ros: ros,
        name: serviceName,
        serviceType: serviceType
    });
};

//Función para llamar a un servicio de ROS y manejar la respuesta o error
const callService = (service, requestData, callback) => {
    const request = new ROSLIB.ServiceRequest(requestData);

    service.callService(request, (result) => {
        console.log('Service response:', result);
        callback(result);
    }, (error) => {
        console.log('Service call failed:', error);
    });
};

//Exportar todas las funciones para su uso en otros archivos :)
export { createTopic, publishMessage, subscribeToTopic, createService, callService };
