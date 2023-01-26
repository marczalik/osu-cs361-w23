<style>
    :global(body) {
        background-color: #ffecd1;
    }

    button {
        background-color: #15616d;
        color: #ffecd1;
    }
</style>

<script>
	import { goto } from "$app/navigation";

    async function nameSuggester() {
        goto("/NameSuggester");
    }

    function backgroundCreator() {
        goto("/BackgroundCreator");    
    }
</script>

<button on:click={nameSuggester}>Name Suggester</button>
<button on:click={backgroundCreator}>Background Creator</button>