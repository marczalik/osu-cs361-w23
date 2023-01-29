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

    let name = '';
    let race = '';
    let playerClass = '';
    let gender = '';
    let homeland = '';
    let family = '';
    let adventureReason = '';
    let flaw = '';

    let continued = false;

    function onBack() {
        goto ("/BackgroundCreator");
    }

    function onClear() {
        name = '';
        race = '';
        playerClass = '';
        gender = '';
        homeland = '';
        family = '';
        adventureReason = '';
        flaw = '';
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
    <p>{form.result}</p>
    <button name="save" id="save" class="button">Save</button>
</form>
{:else}
<form method="POST" action="?/submit" use:enhance>
    <input name="name" id="name" bind:value={name} placeholder="Name*" required>
    <input name="race" id="race" bind:value={race} placeholder="Race">
    <input name="playerClass" id="playerClass" bind:value={playerClass} placeholder="Class">
    <input name="gender" id="gender" bind:value={gender} placeholder="Gender">
<br>
<br>
    <input name="homeland" id="homeland" bind:value={homeland} placeholder="Homeland">
    <input name="family" id="family" bind:value={family} placeholder="Family Members">
    <input name="adventureReason" id="adventureReason" bind:value={adventureReason} placeholder="Reason for Adventuring">
    <input name="flaw" id="flaw" bind:value={flaw} placeholder="Flaw">
<br>
<br>
    <button name="clear" id="clear" class="button" on:click|preventDefault={onClear}>Clear Inputs</button>
    <button name="submit" id="submit" class="button">Submit</button>
</form>
{/if}