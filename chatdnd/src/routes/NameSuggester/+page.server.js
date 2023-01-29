import { error, fail, json } from '@sveltejs/kit';

export const actions = {
    save: async ({ cookies, request }) => {
        return { "saved": true };
    },

	submit: async ({ cookies, request }) => {
		const data = await request.formData();

        let race = data.get('race');
        let playerClass = data.get('playerClass');
        let gender = data.get('gender');

        let result = {
            name: "Steve"
        }

        if (race === '' || playerClass === '' || gender === '') {
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