<script>
    import { onMount } from 'svelte';
    import EnvQTypeSelector from './EnvQTypeSelector.svelte';
    import Question from './Question.svelte';

    let hideAns = false;
    let duplication = false;
    let qType = [{title:'토양/지하수처리방법 분류(In or ex)'}, {title:'토양/지하수 처리방법'}, {title:'소음'}];
    let selectedQType = '토양/지하수 처리방법';
    let qData = [];
    qData = [
        {classification: '토양증기추출법(SVE)', detail: '불포화대수층 위에 추출정 설치, 진공흡입하여 휘발성, 준휘발성 오염물질 제거'},
        {classification: '공기분사법(에어스파징)', detail: '오염된 지하수 정화 위해 포화대 내에 공기 강제 주입, 지하수를 폭기시켜 VOC를 휘발, 제거'},
        {classification: '바이오스파징', detail: '지하수면 아래의 포화대로 공기 주입 공급, 휘발성 유기물질을 불포화토양층으로 이동, 분해'},
        {classification: '바이오벤팅', detail: '오염토양에 인위적으로 산소 공급, 미생물을 통한 생분해'},
    ];
    let qClassification = [];
    qClassification = [
        '토양증기추출법(SVE)',
        '공기분사법(에어스파징)',
        '바이오스파징',
        '바이오벤팅',
        '수직차단벽',
        '식물정화법',
    ];

    onMount(async () => {
        console.log('start');
        init();
    });
    function init(){
        qData = processQData();
        console.log(qData);
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
        <Question bind:hideAns={hideAns} bind:qData={qData} bind:qClass={qClassification} bind:duplication={duplication} />
    </div>
    <div>
        <button class="btn btn-secondary">초기화</button>
        <button class="btn btn-primary">정답 확인</button>
    </div>
</div>
