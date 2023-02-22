import { error, fail, json } from '@sveltejs/kit';
import * as amqp from 'amqplib';

export const actions = {
    save: async ({ cookies, request }) => {
        return { "saved": true };
    },

    submit: async ({ cookies, request }) => {
        const data = await request.formData();

        let race = data.get('race');
        let playerClass = data.get('playerClass');
        let gender = data.get('gender');

        let result = "Err";

        if (race === '' || playerClass === '' || gender === '') {
            return fail(422, {
                result: result,
                error: "You are missing input fields, are you sure you wish to continue?"
            });
        }

        let connection = await amqp.connect('amqp://127.0.0.1');
        let channel = await connection.createChannel();

        let reqQueue = 'request';
        let respQueue = 'response';

        let msg = {
            "queryType": "nameSuggestion",
            "race": race,
            "gender": gender,
            "playerClass": playerClass,
        };

        channel.sendToQueue(reqQueue, Buffer.from(JSON.stringify(msg)));
        console.log(`Sending message "${msg}" to recipient...`);

        const promise = new Promise((resolve) => {
            channel.consume(respQueue, (response) => {
                console.log(`Message received: ${JSON.parse(response.content)}`);
                let body = JSON.parse(JSON.parse(response.content));
                resolve(body);
            });
        });

        result = await promise;

        return {
            result: result 
        };
    }
}