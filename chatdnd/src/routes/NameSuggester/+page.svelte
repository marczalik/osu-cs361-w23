<style>
    button {
        background-color: #15616d;
        color: #ffecd1;
    }
</style>

<script>
    let name = '';
    let race = '';
    let playerClass = '';
    let gender = '';

    function send() {
        
    }

    function clear() {
        
    }
</script>

<form method="POST">
    <input bind:value={name} placeholder="Name">
    <input bind:value={race} placeholder="Race">
    <input bind:value={playerClass} placeholder="Class">
    <input bind:value={gender} placeholder="Gender">

    <button on:click={clear}>Clear Inputs</button>
    <button on:click={send}>Submit</button>
</form>
