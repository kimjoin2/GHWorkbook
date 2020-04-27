<script>
    export let qData;
    export let hideAns;

    function setUserOrder(){
        const arr = getQRows();
        const checkCount = document.querySelectorAll('.q-container > .container .user-order-check:checked').length;
        let userOrderCount = 0;
        for(let i=0; i<arr.length; i++){
            if(arr[i].querySelector('.user-order').innerText !== ""){
                userOrderCount++;
            }
        }
        if(checkCount > userOrderCount){
            for(let i=0; i<arr.length; i++){
                const targetArr = arr[i].querySelectorAll('input.user-order-check:checked');
                if(targetArr.length > 0){
                    const target = targetArr[0].parentNode.parentNode.parentNode.querySelector('.user-order');
                    if(target.innerText === ""){
                        target.innerText = checkCount;
                        break;
                    }
                }
            }
        } else {
            let deleted = -1;
            for(let i=0; i<arr.length; i++){
                const row = arr[i];
                if(row.querySelector('.user-order').innerText !== "" && row.querySelectorAll('.user-order-check:checked').length === 0){
                    deleted = parseInt(row.querySelector('.user-order').innerText);
                }
            }
            for(let i=0; i<arr.length; i++){
                const target = arr[i].querySelector('.user-order');
                const targetText = target.innerText;
                if(targetText !== ""){
                    const targetInt = parseInt(targetText);
                    if(targetInt > deleted){
                        target.innerText = targetInt-1;
                    } else if(targetInt === deleted){
                        target.innerText = "";
                    }
                }
            }
        }
    }
    function getQRows(){
        return document.querySelectorAll('.q-container > .container');
    }
</script>


<div class="q-container">
    {#each qData as {time, order, user_order, user_check, content} (time)}
        <div class="container">
            <div class="item ans time" class:hide={hideAns}>{time}</div>
            <div class="item ans order" class:hide={hideAns}>{order}</div>
            <div class="item user-order">{user_order}</div>
            <div class="item check">
                <label>
                    <input class="user-order-check" type="checkbox" bind:checked={user_check} on:click={setUserOrder} />
                </label>
            </div>
            <div class="item content">{content}</div>
        </div>
    {/each}
</div>

<style>
    .container {
        display: flex;
        flex-wrap: wrap;
    }
    .ans {
        font-weight: bold;
        color: red;
    }
    .hide {
        visibility: hidden;
    }
    .time {
        width: 100px;
    }
    .order, .user-order {
        width: 15px;
    }
</style>
