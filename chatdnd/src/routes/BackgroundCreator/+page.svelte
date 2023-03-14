<style>
    #results {
        width: 50%;
    }

    .button {
        background-color: #6247aa;
        color: #ffecd1;
        font-size: 1rem;
        font-family: 'Eczar', serif;
    }

    input {
        font-size: 1rem;
        font-family: 'Eczar', serif;
    }
    
    h2 {
        font-size: 2.5rem;
        color: #3d0e61;
    }

    p {
        font-size: 1.5rem;
        color: #102b3f;
    }
</style>

<script>
    import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';

    export let data;
    export let form;

    let name = '';
    let race = '';
    let gender = '';
    let playerClass = '';
    let homeland = '';
    let family = '';
    let adventureReason = '';
    let flaw = '';

    let continued = "false";

    function onBack() {
        goto ("/BackgroundCreator");
    };

    function onClear() {
        name = '';
        race = '';
        playerClass = '';
        gender = '';
        homeland = '';
        family = '';
        adventureReason = '';
        flaw = '';
    };

    function reload() {
        invalidateAll();
    };
</script>

<br>
{#if form?.error && continued === "false"}
<p class="error">{form.error}</p>
<form method="POST" action="?/continue" use:enhance>
    <input type="hidden" name="name" id="name" bind:value={name} placeholder="Name*" required>
    <input type="hidden" name="race" id="race" bind:value={race} placeholder="Race">
    <input type="hidden" name="gender" id="gender" bind:value={gender} placeholder="Gender">
    <input type="hidden" name="playerClass" id="playerClass" bind:value={playerClass} placeholder="Class">
<br>
<br>
    <input type="hidden" name="homeland" id="homeland" bind:value={homeland} placeholder="Homeland">
    <input type="hidden" name="family" id="family" bind:value={family} placeholder="Family Members">
    <input type="hidden" name="adventureReason" id="adventureReason" bind:value={adventureReason} placeholder="Reason for Adventuring">
    <input type="hidden" name="flaw" id="flaw" bind:value={flaw} placeholder="Flaw">
    <input type="hidden" name="continued" value="true">
    <button name="back" id="back" class="button" on:click={onBack}>No, Go Back</button>
    <button name="continue" id="continue" class="button" on:click={reload}>Continue Anyways</button>
</form>
{:else if form?.result}
<h2>
    Results
</h2>
<form method="POST" action="?/save" use:enhance>
    <div id="results">
        <p>
            {form?.result}
        </p>
    </div>
    <button name="save" id="save" class="button">Save</button>
</form>
{:else}
<form method="POST" action="?/submit" use:enhance>
    <input name="name" id="name" bind:value={name} placeholder="Name*" required>
    <input name="race" id="race" bind:value={race} placeholder="Race">
    <input name="gender" id="gender" bind:value={gender} placeholder="Gender">
    <input name="playerClass" id="playerClass" bind:value={playerClass} placeholder="Class">
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