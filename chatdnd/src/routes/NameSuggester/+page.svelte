<style>
    .button {
        background-color: #15616d;
        color: #ffecd1;
    }
</style>

<script>
    import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

    export let data;
    export let form;

    let race = '';
    let playerClass = '';
    let gender = '';

    let continued = false;

    function onClear() {
        race = '';
        playerClass = '';
        gender = '';
    }

    function onBack() {
        goto ("/NameSuggester");
    }

    function onContinue() {
        continued = true;
    }
</script>

<br>
{#if form?.error && continued === false}
	<p class="error">{form.error}</p>
    <button name="back" id="back" class="button" on:click={onBack}>No, Go Back</button>
    <button name="continue" id="continue" class="button" on:click={onContinue}>Continue Anyways</button>
{:else if form?.result}
<h1>
    Result
</h1>
<form method="POST" action="?/save" use:enhance>
    <p>{form.result.name}</p>
    <button name="save" id="save" class="button">Save</button>
</form>
{:else}
<form method="POST" action="?/submit" use:enhance>
    <input name="race" id="race" bind:value={race} placeholder="Race">
    <input name="playerClass" id="playerClass" bind:value={playerClass} placeholder="Class">
    <input name="gender" id="gender" bind:value={gender} placeholder="Gender">
<br>
<br>
    <button name="clear" id="clear" class="button" on:click|preventDefault={onClear}>Clear Inputs</button>
    <button name="submit" id="submit" class="button">Submit</button>
</form>
{/if}
