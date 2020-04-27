<script>
    import { onMount } from 'svelte';
    import BookTypeSelector from './com/BookTypeSelector.svelte';
    import Question from './com/Question.svelte';

    let qData = [];
    let hideAns = true;
    let selectedBookPath = '고대사.tsv';
    let bookType = [
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
    function getQRows(){
        return document.querySelectorAll('.q-container > .container');
    }
</script>

<div>
    <div>
        <h2>굿럭</h2>
        <div>
            <div>시대 선택</div>
            <BookTypeSelector bind:dataArr={bookType} bind:selectedBook={selectedBookPath} />
        </div>
        <Question bind:hideAns={hideAns} bind:qData={qData} />
    </div>
    <div>
        <button on:click={init}>초기화</button>
        <button on:click={check}>정답 확인</button>
    </div>
</div>
