<script>
    export let qData;
    export let hideAns;
    export let selectedResult;

</script>

<div class="container1">
    {#each qData as {classification, detail, qClassification, correct}, i (i)}
        <label class="row" for={'q_ans_'+i}>
            <div class="col-2 selector" style="display: flex">
                <div class="row no-padding">
                    <div class="col-1">
                        <input id={'q_ans_'+i} name="ans" value={!correct} type="radio" bind:group={selectedResult} />
                    </div>
                    <div class="col no-padding">
                        <label>&nbsp;{(i+1) + '.'}</label>
                    </div>
                </div>
            </div>
            <div class="col">{detail}</div>
            <div class="col">
                <div>
                    {qClassification}
                </div>
                {#if !hideAns && !correct}
                    <div class="ans">{classification}</div>
                {/if}
            </div>
        </label>
    {/each}
</div>

<style>
    .ans {
        color: red;
        font-weight: bold;
    }
    .selector {
        max-width: 60px !important;
    }
</style>
