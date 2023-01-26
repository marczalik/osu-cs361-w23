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

    function onClear() {
        name = '';
        race = '';
        playerClass = '';
        gender = '';
    }
</script>

<br>
{#if form?.error}
	<p class="error">{form.error}</p>
{:else if form?.name}
<form method="POST" action="?/save" use:enhance>
    <p>{form.name}</p>
    <button name="save" id="save" class="button">Save</button>
</form>
{:else}
<form method="POST" action="?/submit" use:enhance>
    <input name="name" id="name" bind:value={name} placeholder="Name">
    <input name="race" id="race" bind:value={race} placeholder="Race">
    <input name="playerClass" id="playerClass" bind:value={playerClass} placeholder="Class">
    <input name="gender" id="gender" bind:value={gender} placeholder="Gender">
<br>
<br>

    <input type="button" name="clear" id="clear" class="button" on:click={onClear} value="Clear Inputs"/>
    <button name="submit" id="submit" class="button">Submit</button>
</form>
{/if}
