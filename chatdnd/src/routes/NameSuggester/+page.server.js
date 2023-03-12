import { error, fail, json } from '@sveltejs/kit';
import { sendMsg } from '../BackgroundCreator/+page.server.js';
import * as amqp from 'amqplib';


import key from '../../../config.json';
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    apiKey: key['API-KEY'],
});
console.log(configuration)
const openai = new OpenAIApi(configuration);

export const actions = {
    save: async ({ cookies, request }) => {
        return { "saved": true };
    },

    submit: async ({ cookies, request }) => {
        let msg = await createMsg(request);
        
        if ( msg["error"] !== undefined ) {
            return fail(422, msg);
        }

        let prompt = await sendMsg(msg);
        console.log(`Displaying ${prompt.prompt}`)
        let result = await getResponse(prompt);
        console.log(result)

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
 * @return {JSON} msg The message to send to the microservice.
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

async function getResponse( prompt ) {
    const messages = [];
    messages.push({ role: "user", content: prompt['prompt'] });

    console.log(`messages:`)
    console.log(messages)
    let result;
    try {
        let completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages,
        });

        result = completion.data.choices[0].message.content;
        console.log(completion)
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
          } else {
            console.log(error.message);
          }
        result = "Error!";
        // console.log(error);
    }
    
    console.log(`Result: ${result}`)
    return result;
};