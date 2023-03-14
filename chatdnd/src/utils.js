import { fail } from '@sveltejs/kit';
import * as amqp from 'amqplib';

// Set up OpenAI
import key from '../config.json';
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    apiKey: key['API-KEY'],
});
const openai = new OpenAIApi(configuration);

/**
 * Responds to submit actions on the input forms.
 *  
 * @param {Request} request
 * @param {string} queryType
 * @param {boolean} checkContinued
 * @return {Promise<object>} result
 */
export async function submit( request, queryType, checkContinued ) {
    let msg = await createMsg(request, queryType);
    
    if (checkContinued === true) {
        if ( msg["error"] !== undefined ) {
            return fail(422, msg);
        }
    }

    let prompt = await sendMsg(msg);
    let result = await getResponse(prompt);

    return {
        result: result 
    };
};

/**
 * Creates a message from the form data to be sent to the microservice.
 * 
 * @param {Request} request 
 * @param {string} queryType 
 * @return {Promise<object>} msg
 */
async function createMsg( request, queryType ) {
    const data = await request.formData();
    let msg = {};

    if (hasMissingFields(data, queryType) === true) {
        msg = {
            "error": "You are missing input fields, are you sure you wish to continue?"
        };
    } else {
        msg = constructMsg(data, queryType);
    };
    
    return msg;
};

/**
 * Checks if the form has missing optional fields and whether it has already been 'continued'.
 * 
 * @param {FormData} data 
 * @param {string} queryType
 * @return {boolean} Does the Missing Fields message need to be displayed?
 */
function hasMissingFields( data, queryType ) {
    let result = false;
    if (queryType === "name") {
        result = hasMissingNameFields(data);
    } else if (queryType === "background") {
        result = hasMissingBackgroundFields(data);
    }
    
    return result;
};

/**
 * Check for missing fields for Name Suggestor.
 * 
 * @param {FormData} data
 * @return {boolean} Are fields missing?
 */
function hasMissingNameFields( data ) {
    let race = data.get('race');
    let playerClass = data.get('playerClass');
    let gender = data.get('gender');
    let continued = data.get('continued');

    return ( ( race === '' || playerClass === '' || gender === '' )
          && ( continued === "false" || continued === '' || continued === null ) );
};

/**
 * Check for missing fields for Background Suggestor.
 * 
 * @param {FormData} data
 * @return {boolean} Are fields missing?
 */
function hasMissingBackgroundFields( data ) {
    let name = data.get('name');
    let race = data.get('race');
    let playerClass = data.get('playerClass');
    let gender = data.get('gender');
    let homeland = data.get('homeland');
    let family = data.get('family');
    let adventureReason = data.get('adventureReason');
    let flaw = data.get('flaw');
    let continued = data.get('continued');

    return ( ( name === '' || race === '' || playerClass === '' || gender === ''
            || homeland === '' || family === '' || adventureReason === '' || flaw === '' )
          && ( continued === "false" || continued === '' || continued === null ) );
};

/**
 * Builds the message that will be sent to the microservice using the values from the form inputs.
 * 
 * @param {FormData} data
 * @param {string} queryType
 * @return {object} msg
 */
function constructMsg( data, queryType ) {
    let msg = {};
    if (queryType === "name") {
        msg = constructNameMsg(data);
    } else if (queryType === "background") {
        msg = constructBackgroundMsg(data);
    }

    return msg;
};

/**
 * Builds message for Name Suggestion.
 * 
 * @param {FormData} data
 * @return {object} msg
 */
function constructNameMsg( data ) {
    return {
        "queryType": "nameSuggestion",
        "race": data.get('race'),
        "gender": data.get('gender'),
        "playerClass": data.get('playerClass'),
    };
};

/**
 * Builds message for Background Suggestion.
 * 
 * @param {FormData} data
 * @return {object} msg
 */
function constructBackgroundMsg( data ) {
    return {
        "queryType": "background",
        "name": data.get('name'),
        "race": data.get('race'),
        "gender": data.get('gender'),
        "playerClass": data.get('playerClass'),
        "homeland": data.get('homeland'),
        "family": data.get('family'),
        "adventureReason": data.get('adventureReason'),
        "flaw": data.get('flaw'),
    };
};

/**
 * Connects to the RabbitMQ server, sends a message to the microservice, and returns the result.
 * 
 * @param {object} msg 
 * @return {Promise<object>} result
 */
export async function sendMsg( msg ) {
    // Set up connection
    let connection = await amqp.connect('amqp://127.0.0.1');
    let channel = await connection.createChannel();

    let reqQueue = 'request';
    let respQueue = 'response';

    // Send message and await response
    channel.sendToQueue(reqQueue, Buffer.from(JSON.stringify(msg)));
    const promise = new Promise((resolve) => {
        channel.consume(respQueue, (response) => {
            console.log(`Message received: ${JSON.stringify(JSON.parse(response.content))}`);
            let body = JSON.parse(response.content);
            resolve(body);
        }, { noAck: false });
    });

    return await promise;
};

/**
 * Sends the prompt to a Chat Completion API and returns the result.
 * 
 * @param {object} prompt
 * @return {Promise<string>} result
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
        console.log(`Result: ${result}`);
    } catch (error) {
        console.log(error.message);
        result = "Error!";
    }
    
    return result;
};