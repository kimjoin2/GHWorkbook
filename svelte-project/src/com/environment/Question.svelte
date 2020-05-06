<script>
    export let qData;
    export let hideAns;

</script>

<div class="q-container">
    {#each qData as {classification, detail, qClassification, correct}, i (detail)}
        <div class="b-container">
            <div class="check">
                <label>
                    <input name="ans" value={!correct} type="radio" />
                </label>
            </div>
            <span>　</span>
            <div>{(i+1) + '. '}</div>
            <span>　</span>
            <div>{detail}</div>
            <span>　-　</span>
            <div>{qClassification}</div>
            <span>　</span>
            {#if !hideAns && !correct}
                <div class="ans">{classification}</div>
            {/if}
        </div>
    {/each}
</div>

<style>
    .b-container {
        display: flex;
        flex-wrap: wrap;
    }
    .ans {
        color: red;
        font-weight: bold;
    }
</style>
