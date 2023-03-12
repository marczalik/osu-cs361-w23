import { error, fail, json } from '@sveltejs/kit';
import * as amqp from 'amqplib';

export const actions = {
    save: async ({ cookies, request }) => {
        return { "saved": true };
    },

    submit: async ({ cookies, request }) => {
        let msg = await createMsg(request);
        
        if ( msg["error"] !== undefined )
        {
            return fail(422, msg);
        }

        let result = await sendMsg(msg);

        console.log(`Displaying ${result.prompt}`)
        return {
            result: result 
        };
    },

    continue: async ({ cookies, request }) => {
        let msg = await createMsg(request);
        let result = await sendMsg(msg);

        console.log(`Displaying ${result.prompt}`)
        return {
            result: result 
        };
    }
}

/**
 * Creates a message from the form data to be sent to the microservice.
 * 
 * @param request The request object. 
 */
async function createMsg( request ) {
    const data = await request.formData();

    let msg;
    if (await hasMissingFields(data) === true) {
        msg = {
            "error": "You are missing input fields, are you sure you wish to continue?"
        };
    } else {
        msg = {
            "queryType": "nameSuggestion",
            "race": data.get('race'),
            "gender": data.get('gender'),
            "playerClass": data.get('playerClass'),
        };
    };
    
    return msg;
};

/**
 * Checks if the form has missing optional fields and whether it has already been 'continued'.
 * 
 * @param {FormData} data FormData from the request object.
 * @return {boolean} Does the Missing Fields message need to be displayed?
 */
async function hasMissingFields( data ) {
    let race = data.get('race');
    let playerClass = data.get('playerClass');
    let gender = data.get('gender');
    let continued = data.get('continued');

    return ( ( race === '' || playerClass === '' || gender === '' )
          && ( continued === "false" || continued === '' || continued === null ) );
};

/**
 * Connects to the RabbitMQ server, sends a message to the microservice, and returns the result.
 * 
 * @param msg The message constructed by createMsg().
 */
async function sendMsg( msg ) {
    let connection = await amqp.connect('amqp://127.0.0.1');
    let channel = await connection.createChannel();

    let reqQueue = 'request';
    let respQueue = 'response';

    console.log(`Sending message \t\n${JSON.stringify(msg)}\n to recipient...`);
    channel.sendToQueue(reqQueue, Buffer.from(JSON.stringify(msg)));

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