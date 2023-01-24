<style>
    button {
        background-color: #15616d;
        color: #ffecd1;
    }
</style>

<script>
    // import {submit} from './+server.js';

    let name = '';
    let race = '';
    let playerClass = '';
    let gender = '';

	async function submit() {
		const res = await fetch('/NameSuggester', {
			method: 'POST',
			body: JSON.stringify({
				name,
				race,
                playerClass,
                gender,
			})
        })

        const json = await res.json()
		let result = JSON.stringify(json)
    }

    function clear() {
        
    }
</script>

<form method="POST">
    <input bind:value={name} placeholder="Name">
    <input bind:value={race} placeholder="Race">
    <input bind:value={playerClass} placeholder="Class">
    <input bind:value={gender} placeholder="Gender">

    <button type="button" on:click={clear}>Clear Inputs</button>
    <button type="button" on:click={submit}>Submit</button>
</form>
