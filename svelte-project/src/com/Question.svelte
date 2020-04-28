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
            const num = parseInt(qData[index].user_order);
            qData[index].user_check = false;
            qData[index].user_order = "";
            for(let i=0; i<qData.length; i++){
                const target = qData[i];
                if(target.user_check && parseInt(target.user_order) > num){
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
        <div class="b-container">
            <div class="ans time" class:hide={hideAns}>{time}</div>
            <div class="ans order" class:hide={hideAns}>{order}</div>
            <div class="user-order">{user_order}</div>
            <div class="check">
                <label>
                    <input class="user-order-check" type="checkbox" bind:checked={user_check} on:click={setUserOrder(i)} />
                </label>
            </div>
            <div class="content">{content}</div>
        </div>
    {/each}
</div>

<style>
    .b-container {
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
