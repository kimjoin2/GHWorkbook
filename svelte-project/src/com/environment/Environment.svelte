<script>
    import { onMount } from 'svelte';
    import EnvQTypeSelector from './EnvQTypeSelector.svelte';
    import Question from './Question.svelte';

    let hideAns = true;
    let duplication = true;
    let qType = [];
    let selectedQType = '';
    let qData = [];
    let qClassification = [];
    let selectedResult;
    let selectorLoading = false;
    let qDataLoading = false;

    $: loadingFlag = selectorLoading || qDataLoading;
    $: showAns = !hideAns;

    function checkRequest(){
        if(selectedResult){
            // 정답
            document.getElementById('rightModalButton').click();
        } else {
            // 오답
            document.getElementById('wrongModalButton').click();
        }
        hideAns = false;
    }

    onMount(async () => {
        initStart();
    });
    function initStart() {
        hideAns = true;
        selectorLoading = true;
        qDataLoading = true;
        if(qType.length === 0){
            const url = 'https://script.google.com/macros/s/AKfycbxJGF5r6cWjQsBzqKbRY3J0Ljo8MAORv9V5aZVMhDuMtWHVC0Y/exec?action=';
            fetch(url + 'sheetName')
                    .then(res => res.json())
                    .then(data => {
                        const title = [];
                        for (let i = 0; i < data.data.length; i++) {
                            title.push({title: data.data[i]});
                        }
                        qType = title;
                        qInit(title[0].title);
                        selectorLoading = false;
                    });
        } else {
            selectorLoading = false;
            qInit();
        }
    }
    function qInit(defaultSheetName) {
        const url = 'https://script.google.com/macros/s/AKfycbxJGF5r6cWjQsBzqKbRY3J0Ljo8MAORv9V5aZVMhDuMtWHVC0Y/exec?action=';
        if(selectedQType === ''){
            selectedQType = defaultSheetName;
        }
        fetch(url+'qData&sheetName='+selectedQType)
                .then(res => res.json())
                .then(data => {
                    setQDataAndQClassification(data.data);
                    qData = processQData();
                    qDataLoading = false;
                });
    }
    function setQDataAndQClassification(data){
        const qArr = [];
        const classSet = new Set();
        for(let i=0; i<data.length; i++){
            const row = data[i];
            const classification = row[0];
            const detail = row[1];
            qArr.push({classification: classification, detail: detail});
            classSet.add(classification);
        }
        qArr.sort(() => Math.random() - Math.random());
        qData = qArr.slice(0,4);
        qClassification = Array.from(classSet);
    }
    function processQData(){
        const index = Math.round(qData.length * Math.random() - 0.5);
        for(let i=0; i<qData.length; i++){
            const el = qData[i];
            if(i === index){
                el.qClassification = getQClass(el.classification);
                el.correct = false;
            } else {
                el.qClassification = el.classification;
                el.correct = true;
            }
        }
        return qData;
    }
    function getQClass(except){
        const duplicationSet = new Set();
        duplicationSet.add(except);
        if(!duplication){
            for(let i=0; i<qData.length; i++){
                const el = qData[i];
                duplicationSet.add(el.classification);
            }
        }
        while(true){
            const index = Math.round(qClassification.length * Math.random() - 0.5);
            const classVal = qClassification[index];
            if(!duplicationSet.has(classVal)){
                return classVal;
            }
        }
    }
</script>

<div>
    <div>
        <h2>분야 선택</h2>
        <div>
            <EnvQTypeSelector bind:dataArr={qType} bind:selectedEnv={selectedQType} />
        </div>
        <div>
            <span style="color: red; font-weight: bold;">틀린</span><span>&nbsp;것을 고르시오</span>
        </div>
        <Question bind:selectedResult={selectedResult} bind:hideAns={hideAns} bind:qData={qData} bind:qClass={qClassification} bind:duplication={duplication} />
    </div>
    <div>
        <button class="btn btn-secondary" on:click={initStart} disabled={loadingFlag}>
            {#if loadingFlag}
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
            {/if}
            초기화
        </button>
        <button class="btn btn-primary" on:click={checkRequest} disabled={showAns}>정답 확인</button>
    </div>
</div>

<div style="display: none">
    <button id="wrongModalButton" type="button" class="btn btn-primary" style="display: block;" data-toggle="modal" data-target="#wrongModalButtonModal">show</button>
    <button id="rightModalButton" type="button" class="btn btn-primary" style="display: block;" data-toggle="modal" data-target="#rightModalButtonModal">show</button>
</div>

<!-- Modal -->
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
                정답정답!
            </div>
            <div class="modal-footer">
            </div>
        </div>
    </div>
</div>
