<script>
    export let dataArr;
    export let selectedEnv;
</script>

<div class="b-container">
    {#each dataArr as {title}, i}
        <div class="b-container">
            <label for={'env_' + i}>{title}</label>
            <input id={'env_' + i} type="radio" name="envPath" value={title} selected={selectedEnv === title} bind:group={selectedEnv} />
        </div>
        <div class="b-container">　</div>
    {/each}
</div>

<style>
    .b-container {
        display: flex;
        flex-wrap: wrap;
    }
</style>
