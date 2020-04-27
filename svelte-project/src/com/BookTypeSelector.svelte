<script>
    export let dataArr;
    export let selectedBook;
</script>

<div class="container">
    {#each dataArr as {title, file}, i}
        <div class="container item">
            <label for={'book_' + i}>{title}</label>
            <input id={'book_' + i} type="radio" name="bookPath" value={file} bind:group={selectedBook} />
        </div>
        <div class="container item">　　</div>
    {/each}
</div>

<style>
    .container {
        display: flex;
        flex-wrap: wrap;
    }
</style>
