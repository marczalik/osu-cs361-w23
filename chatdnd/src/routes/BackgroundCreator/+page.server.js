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
};

async function createMsg(request) {
    const data = await request.formData();

    let name = data.get('name');
    let race = data.get('race');
    let playerClass = data.get('playerClass');
    let gender = data.get('gender');
    let homeland = data.get('homeland');
    let family = data.get('family');
    let adventureReason = data.get('adventureReason');
    let flaw = data.get('flaw');
    let continued = data.get('continued');

    let msg;
    if ( (name === '' || race === '' || playerClass === '' || gender === ''
       || homeland === '' || family === '' || adventureReason === '' || flaw === '')
      && (continued === "false" || continued === '' || continued === null) )
    {
        msg =
        {
            "error": "You are missing input fields, are you sure you wish to continue?"
        }
    }
    else
    {
        msg =
        {
            "queryType": "background",
            "name": name,
            "race": race,
            "gender": gender,
            "playerClass": playerClass,
            "homeland": homeland,
            "family": family,
            "adventureReason": adventureReason,
            "flaw": flaw,
        };
    };
    
    return msg;
}

async function sendMsg(msg) {
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
}