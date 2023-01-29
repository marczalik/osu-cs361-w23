<style>
    :global(body) {
        background-color: #ffecd1;
    }

    button {
        background-color: #15616d;
        color: #ffecd1;
    }

    #bgCreator:hover ~ .tooltip .tooltipText {
        visibility: visible;
    }

    .tooltipText {
        visibility: hidden;
        color: #78290f;
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

<br>
<button id="nameSuggester" on:click={nameSuggester}>Name Suggester</button>
<span>
    Get a suggested name for your character! Try this first :)
</span>
<br>
<br>
<button id="bgCreator" on:click={backgroundCreator}>Background Creator</button>
<span>
    Find possible background stories for your character!
</span>
 <div class="tooltip">
    <span class="tooltipText">This will take more time!</span>
</div> 