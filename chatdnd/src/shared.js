import * as amqp from 'amqplib';

import key from './config.json';
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    apiKey: key['API-KEY'],
});
console.log(configuration)
const openai = new OpenAIApi(configuration);

/**
 * Connects to the RabbitMQ server, sends a message to the microservice, and returns the result.
 * 
 * @param msg The message constructed by createMsg().
 */
export async function sendMsg( msg ) {
    // Set up connection
    let connection = await amqp.connect('amqp://127.0.0.1');
    let channel = await connection.createChannel();

    let reqQueue = 'request';
    let respQueue = 'response';

    console.log(`Sending message \t\n${JSON.stringify(msg)}\n to recipient...`);
    channel.sendToQueue(reqQueue, Buffer.from(JSON.stringify(msg)));

    // Send message and await response
    const promise = new Promise((resolve) => {
        channel.consume(respQueue, (response) => {
            console.log(`Message received: ${JSON.stringify(JSON.parse(response.content))}`);
            let body = JSON.parse(response.content);
            resolve(body);
        }, { noAck: false });
    });

    let result = await promise;
    
    return result;
};

/**
 * Sends the prompt to a Chat Completion API and returns the result.
 * 
 * @param {JSON} prompt The message prompt to be sent.
 */
export async function getResponse( prompt ) {
    const messages = [];
    messages.push({ role: "user", content: prompt['prompt'] });

    let result;
    try {
        let completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages,
        });

        result = completion.data.choices[0].message.content;
    } catch (error) {
        console.log(error.message);
        result = "Error!";
    }
    
    return result;
};