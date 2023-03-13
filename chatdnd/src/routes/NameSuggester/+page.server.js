import { submit } from '../../utils.js';

export const actions = {
    save: async () => {
        return { "saved": true };
    },

    submit: async ({ request }) => submit(request, "name", true),

    continue: async ({ request }) => submit(request, "name", false),
};