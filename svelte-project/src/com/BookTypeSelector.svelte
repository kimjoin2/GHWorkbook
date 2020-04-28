<script>
    export let dataArr;
    export let selectedBook;
</script>

<div class="b-container">
    {#each dataArr as title, i}
        <div class="b-container">
            <label for={'book_' + i}>{title}</label>
            <input id={'book_' + i} type="radio" name="bookPath" value={title} bind:group={selectedBook} />
        </div>
        <div class="b-container">　　</div>
    {/each}
</div>

<style>
    .b-container {
        display: flex;
        flex-wrap: wrap;
    }
</style>
