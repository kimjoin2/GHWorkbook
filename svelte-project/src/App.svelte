<script>
    import { onMount } from 'svelte';

    let qData = [];
    let hideAns = true;
    let selectedBookPath = '고대사.tsv';
    const bookType = [
        {file:'고대사.tsv', title:'고대사'},
        {file:'남북국.tsv', title:'남북국'},
        {file:'구한말.tsv', title:'구한말'},
        {file:'일제강점기.tsv', title:'일제강점기'},
        {file:'현대사.tsv', title:'현대사'},
    ]

    onMount(async () => {
        init();
    });
    function init(){
        hideAns = true;
        const bookPath = "./";
        fetch(bookPath + selectedBookPath)
                .then(res => res.text())
                .then(qText => {
                    const qArr = getQ(qText);
                    qData = setOrder(qArr);
                });
    }

    function getQ(text, count = 5){
        const rows = text.split('\n');
        const qs = [];
        for(let i=0; i<rows.length; i++){
            const rowArr = rows[i].split('\t');
            for(let j=1; j<rowArr.length; j++){
                const q = {time:rowArr[0], order:'', user_order:'', user_check:false, content:rowArr[j]};
                qs.push(q);
            }
        }
        const res = [];
        const indexSet = {};
        for(let i=0; i<count; i++){
            const max = qs.length;
            const index = Math.round(max * Math.random() - 0.5);
            if(indexSet[index] === undefined){
                res.push(qs[index]);
                indexSet[index] = true;
            } else {
                i--;
            }
        }
        return res;
    }
    function setView(qArray){
        const container = document.querySelector('.q-container');
        container.innerHTML = '';

        qArray = setOrder(qArray);

        for(let i=0; i<qArray.length; i++){
            const el = document.querySelector('.q-template').cloneNode(true);
            el.classList.remove("q-template");
            el.querySelector('input[type=checkbox]').classList.remove('hide');

            const data = qArray[i];
            el.querySelector('.time').innerText = data.time;
            el.querySelector('.order').innerText = data.order;
            el.querySelector('.content').innerText = data.content;
            container.innerHTML = container.innerHTML + el.outerHTML;
        }
    }
    function setOrder(qArray){
        qArray.sort(function(a, b){return a.time - b.time});
        for(let i=0; i<qArray.length; i++){
            qArray[i].order = i+1;
        }
        qArray.sort(() => Math.random() - Math.random());
        return qArray;
    }

    function check(){
        const arr = getQRows();
        let result = true;
        for(let i=0; i<arr.length; i++){
            const q = arr[i];
            if(q.querySelector('.user-order').innerText === ""){
                alert("전부 체크 하세요.");
                return;
            }
        }
        for(let i=0; i<arr.length; i++){
            const q = arr[i];
            if(q.querySelector('.user-order').innerText !== q.querySelector('.order').innerText){
                result = false;
                break;
            }
        }
        if(result){
            alert("정답");
        } else {
            alert("다음 기회에");
        }
        hideAns = false;
    }
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

<div>
    <div>
        <h2>굿럭</h2>
        <div>
            <div>시대 선택</div>
            <div class="container">
                {#each bookType as {title, file}, i}
                    <div class="container item">　　</div>
                    <div class="container item">
                        <label for={'book_' + i}>{title}</label>
                        <input id={'book_' + i} type="radio" name="bookType" value={file} bind:group={selectedBookPath} />
                    </div>
                {/each}
            </div>
        </div>
        <div class="q-container">
            {#each qData as {time, order, user_order, user_check, content}}
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
    </div>
    <div>
        <button on:click={init}>초기화</button>
        <button on:click={check}>정답 확인</button>
    </div>
</div>
<style>
    .q-template {
        display: none;
    }
    .container {
        display: flex;
        flex-wrap: wrap;
    }
    .item {

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
