import { error, fail, json } from '@sveltejs/kit';

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

        let result = {
            background: "You awoke one day, your memories scattered to the wind. You have amnesia and don't recall your past."
        }

        if (name === '' || race === '' || playerClass === '' || gender === '' ||
            homeland === '' || family === '' || adventureReason === '' || flaw === '') {
            return fail(422, {
                result: result,
                error: "You are missing input fields, are you sure you wish to continue?"
            });
        }

        return { 
            result: result
        };
	}
};