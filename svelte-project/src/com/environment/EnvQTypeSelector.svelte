<script>
    export let dataArr;
    export let selectedEnv;
</script>

<div class="row">
    {#each dataArr as {title}, i}
        <div class="col">
            <div class="row">
                <div class="col-1">
                    <input id={'env_' + i} type="radio" name="envPath" value={title} selected={selectedEnv === title} bind:group={selectedEnv} />
                </div>
                <div class="col">
                    <label for={'env_' + i}>{title}</label>
                </div>
            </div>
        </div>
    {/each}
</div>
