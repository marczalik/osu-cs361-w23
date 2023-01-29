import { error, fail, json } from '@sveltejs/kit';

export const actions = {
    save: async ({ cookies, request }) => {
        return { "saved": true };
    },

	submit: async ({ cookies, request }) => {
		const data = await request.formData();

        let race = data.get('race');
        let gender = data.get('gender');

        if (race === '') {
            return fail(422, {
                result: gender,
                error: "You are missing input fields, are you sure you wish to continue?"
            });
        }

        return { "result": gender };
	}
};