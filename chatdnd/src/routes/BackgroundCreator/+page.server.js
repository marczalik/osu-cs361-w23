import { error, fail, json } from '@sveltejs/kit';
import * as amqp from 'amqplib';

export const actions = {
    save: async ({ cookies, request }) => {
        return { "saved": true };
    },

    submit: async ({ cookies, request }) => {
        const data = await request.formData();

        let name = data.get('name');
        let race = data.get('race');
        let playerClass = data.get('playerClass');
        let gender = data.get('gender');
        let homeland = data.get('homeland');
        let family = data.get('family');
        let adventureReason = data.get('adventureReason');
        let flaw = data.get('flaw');

        let result = 'Err';

        // if (name === '' || race === '' || playerClass === '' || gender === '' ||
        //     homeland === '' || family === '' || adventureReason === '' || flaw === '') {
        //     return fail(422, {
        //         result: result,
        //         error: "You are missing input fields, are you sure you wish to continue?"
        //     });
        // }

        let connection = await amqp.connect('amqp://127.0.0.1');
        let channel = await connection.createChannel();

        let reqQueue = 'request';
        let respQueue = 'response';

        let msg = {
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

        console.log(`Sending message \t\n${JSON.stringify(msg)}\n to recipient...`);
        channel.sendToQueue(reqQueue, Buffer.from(JSON.stringify(msg)));

        const promise = new Promise((resolve) => {
            channel.consume(respQueue, (response) => {
                console.log(`Message received: ${JSON.stringify(JSON.parse(response.content))}`);
                let body = JSON.parse(response.content);
                resolve(body);
            }, { noAck: false });
        });

        result = await promise;

        return {
            result: result 
        };
	}
};