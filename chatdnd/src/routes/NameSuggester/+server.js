import { json } from '@sveltejs/kit';

export async function submit(req) {
	console.log(req);

	return json(req);
}