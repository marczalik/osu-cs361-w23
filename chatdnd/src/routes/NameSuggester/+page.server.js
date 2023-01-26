import { error, fail, json } from '@sveltejs/kit';

export function load() {
    // Returns information requested from this page.
}

export const actions = {
	submit: async ({ cookies, request }) => {
		const data = await request.formData();

        let name = data.get('name')
        if (name === '') {
            return fail(422, {error: "You are missing input fields, are you sure you wish to continue?"});
        }

        return { "name": name };
	}
};