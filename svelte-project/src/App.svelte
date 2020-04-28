<svelte:head>
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
</svelte:head>
<script>
    import { onMount } from 'svelte';
    import BookTypeSelector from './com/BookTypeSelector.svelte';
    import Question from './com/Question.svelte';

    let qData = [];
    let hideAns = true;
    let selectedBookPath = '고대사';
    let bookType = []
    let bookSelectorLoading = false;
    let qDataLoading = false;

    onMount(async () => {
        init();
    });
    function init(){
        hideAns = true;
        bookSelectorLoading = true;
        qDataLoading = true;
        const bookPath = "https://script.google.com/macros/s/AKfycbxTpVMCp260XF7osyNWJL8tm7iqA931GLluKEJadyu3NelC8EY/exec?";
        fetch(bookPath + "action=sheetName")
                .then(res => res.json())
                .then(data => {
                    bookType = data.data;
                    bookSelectorLoading = false;
                });
        fetch(bookPath + "sheetName=" + selectedBookPath + "&action=qData")
                .then(res => res.json())
                .then(data => {
                    const qArr = getQ(data.data);
                    qData = setOrder(qArr);
                    qDataLoading = false;
                });
    }

    function getQ(qArr, count = 5){
        const qs = [];
        for(let i=0; i<qArr.length; i++){
            const rowArr = qArr[i];
            for(let j=1; j<rowArr.length; j++){
                const content = rowArr[j];
                if(content === undefined || content === null || content.length === 0){
                    continue;
                }
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
        let result = true;
        for(let i=0; i<qData.length; i++){
            const q = qData[i];
            if(q.user_order === ""){
                document.getElementById("checkAllModalButton").click();
                return;
            }
            if(q.user_order !== q.order){
                result = false;
            }
        }
        if(result){
            document.getElementById("rightModalButton").click();
        } else {
            document.getElementById("wrongModalButton").click();
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
        <button class="btn btn-secondary" on:click={init} disabled="{bookSelectorLoading || qDataLoading}">
            {#if bookSelectorLoading || qDataLoading}
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
            {/if}
            초기화
        </button>
        <button class="btn btn-primary" on:click={check}>정답 확인</button>
    </div>
</div>

<div style="display: none">
    <button id="checkAllModalButton" type="button" class="btn btn-primary" style="display: block;" data-toggle="modal" data-target="#checkAllModalButtonModal">show</button>
    <button id="wrongModalButton" type="button" class="btn btn-primary" style="display: block;" data-toggle="modal" data-target="#wrongModalButtonModal">show</button>
    <button id="rightModalButton" type="button" class="btn btn-primary" style="display: block;" data-toggle="modal" data-target="#rightModalButtonModal">show</button>
</div>

<!-- Modal -->
<div class="modal fade" id="checkAllModalButtonModal" tabindex="-1" role="dialog" aria-labelledby="checkAllModalButtonModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="checkAllModalButtonModalLabel">모든 보기를 선택 해 주세요</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                선택이 안 된 항목이 있습니다.
            </div>
            <div class="modal-footer">
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="wrongModalButtonModal" tabindex="-1" role="dialog" aria-labelledby="wrongModalButtonModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="wrongModalButtonModalLabel">정답과 다릅니다.</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                천천히 생각해 보세요.
            </div>
            <div class="modal-footer">
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="rightModalButtonModal" tabindex="-1" role="dialog" aria-labelledby="rightModalButtonModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="rightModalButtonModalLabel">정답!</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
            </div>
            <div class="modal-footer">
            </div>
        </div>
    </div>
</div>
