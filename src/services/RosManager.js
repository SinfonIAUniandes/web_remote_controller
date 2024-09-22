import * as ROSLIB from 'roslib';

const createTopic = (ros, topicName, messageType) => {
    return new ROSLIB.Topic({
        ros: ros,
        name: topicName,
        messageType: messageType
    });
};

const publishMessage = (topic, messageData) => {
    const rosMessage = new ROSLIB.Message(messageData);
    topic.publish(rosMessage);
};

const subscribeToTopic = (topic, callback) => {
    topic.subscribe((message) => {
        console.log('Received message on ' + topic.name + ': ', message);
        callback(message);
    });
};

const createService = (ros, serviceName, serviceType) => {
    return new ROSLIB.Service({
        ros: ros,
        name: serviceName,
        serviceType: serviceType
    });
};

const callService = (service, requestData, callback) => {
    const request = new ROSLIB.ServiceRequest(requestData);

    service.callService(request, (result) => {
        console.log('Service response:', result);
        callback(result);
    }, (error) => {
        console.log('Service call failed:', error);
    });
};

export { createTopic, publishMessage, subscribeToTopic, createService, callService };
