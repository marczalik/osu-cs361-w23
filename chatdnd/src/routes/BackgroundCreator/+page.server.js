import { error, fail, json } from '@sveltejs/kit';

export const actions = {
    save: async ({ cookies, request }) => {
        return { "saved": true };
    },

	submit: async ({ cookies, request }) => {
		const data = await request.formData();

        let race = data.get('race')
        if (race === '') {
            return fail(422, {error: "You are missing input fields, are you sure you wish to continue?"});
        }

        return { "result": name };
	}
};