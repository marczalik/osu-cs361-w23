<style>
    .button {
        background-color: #15616d;
        color: #ffecd1;
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

    function onClear() {
        race = '';
        playerClass = '';
        gender = '';
    }

    function onBack() {
        continued = "false";
        goto ("/NameSuggester");
    }

    async function onContinue(race, playerClass, gender) {
        continued = "true";
        console.log("fetching")
        console.log(`${race}`)
        let formData = new FormData();
        formData.set("race", race);
        formData.set("playerClass", playerClass);
        formData.set("gender", gender);
        formData.set("continued", continued);
        const res = await fetch("?/submit", {
                    method: 'POST',
                    body: formData
        });
        const json = await res.json();
        console.log(`res: ${json.result}`)
        form = json;
        // return json;
    }
    
    function reload() {
        invalidateAll();
    }
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
    <!-- <button name="back" id="back" class="button" on:click={onBack}>No, Go Back</button> -->
    <!-- <button name="continue" id="continue" class="button" on:click={onContinue}>Continue Anyways</button> -->
    <!-- <button name="continue" id="continue" class="button" on:click={ () => onContinue(race, playerClass, gender) }>Continue Anyways</button> -->
{:else if form?.result}
<h1>
    Result
</h1>
<form method="POST" action="?/save" use:enhance>
    <p>{form?.result.prompt}</p>
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
