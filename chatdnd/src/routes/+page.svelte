<style>
    :global(body) {
        background-color: #fefaea;
        font-family: 'Inknut Antiqua', serif;
    }

    #bgCreator:hover ~ .tooltip .tooltipText {
        visibility: visible;
    }

    .tooltipText {
        visibility: hidden;
        color: #78290f;
    }

    .button {
        background-color: #6247aa;
        color: #ffecd1;
        font-size: 1rem;
        font-family: 'Eczar', serif;
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
<button class="button" id="nameSuggester" on:click={nameSuggester}>Name Suggester</button>
<span>
    Get a suggested name for your character! Try this first :)
</span>
<br>
<br>
<button class="button" id="bgCreator" on:click={backgroundCreator}>Background Creator</button>
<span>
    Find possible background stories for your character!
</span>
 <div class="tooltip">
    <span class="tooltipText">This will take more time!</span>
</div> 