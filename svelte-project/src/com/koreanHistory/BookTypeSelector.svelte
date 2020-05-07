<script>
    export let dataArr;
    export let selectedBook;
</script>

<div class="b-container">
    {#each dataArr as title, i}
        <div class="b-container">
            <input class="" id={'book_' + i} type="radio" name="bookPath" value={title} bind:group={selectedBook} />
            <label class="book-selector-label" for={'book_' + i}>{title}</label>
        </div>
    {/each}
</div>

<style>
    .book-selector-label {
        padding-right: 15px;
        padding-left: 5px;
    }
    .b-container {
        display: flex;
        flex-wrap: wrap;
    }
</style>
