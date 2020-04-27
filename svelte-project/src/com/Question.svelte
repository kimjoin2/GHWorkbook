<script>
    export let qData;
    export let hideAns;

    function setUserOrder(index){
        let currentMaxOrder = 0;
        for(let i=0; i<qData.length; i++){
            if(qData[i].user_check){
                currentMaxOrder++;
            }
        }
        console.log(index, qData[index]);
        if(!qData[index].user_check){
            qData[index].user_check = true;
            qData[index].user_order = currentMaxOrder+1;
        } else {
            qData[index].user_check = false;
            qData[index].user_order = "";
            for(let i=index; i<qData.length; i++){
                const target = qData[i];
                if(target.user_check){
                    qData[i].user_order = parseInt(qData[i].user_order) - 1;
                }
            }
        }
    }
    function getQRows(){
        return document.querySelectorAll('.q-container > .container');
    }
</script>


<div class="q-container">
    {#each qData as {time, order, user_order, user_check, content}, i (time)}
        <div class="container">
            <div class="item ans time" class:hide={hideAns}>{time}</div>
            <div class="item ans order" class:hide={hideAns}>{order}</div>
            <div class="item user-order">{user_order}</div>
            <div class="item check">
                <label>
                    <input class="user-order-check" type="checkbox" bind:checked={user_check} on:click={setUserOrder(i)} />
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
