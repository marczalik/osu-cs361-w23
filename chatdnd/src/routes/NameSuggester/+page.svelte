<style>
    .button {
        background-color: #15616d;
        color: #ffecd1;
        font-size: 1rem;
    }
    
    input {
        font-size: 1rem;
    }

    p {
        font-size: 2rem;
    }
</style>

<script>
    import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';

    export let data;
    export let form;

    let race = '';
    let playerClass = '';
    let gender = '';

    let continued = "false";

    function onBack() {
        continued = "false";
        goto ("/NameSuggester");
    };

    function onClear() {
        race = '';
        playerClass = '';
        gender = '';
    };

    function reload() {
        invalidateAll();
    };
</script>

<br>
{#if form?.error && continued === "false"}
<p class="error">{form.error}</p>
<form method="POST" action="?/continue" use:enhance>
    <input type="hidden" name="race" id="race" bind:value={race} placeholder="Race">
    <input type="hidden" name="playerClass" id="playerClass" bind:value={playerClass} placeholder="Class">
    <input type="hidden" name="gender" id="gender" bind:value={gender} placeholder="Gender">
    <input type="hidden" name="continued" value="true">
    <button name="back" id="back" class="button" on:click|preventDefault={onBack}>No, Go Back</button>
    <button name="continue" id="continue" class="button" on:click={reload}>Continue Anyways</button>
</form>
{:else if form?.result}
<h1>
    Results
</h1>
<form method="POST" action="?/save" use:enhance>
    <p>
        {form?.result}
    </p>
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
    <button name="submit" id="submit" class="button" on:click={reload}>Submit</button>
</form>
{/if}
