<script>
    import { onMount } from 'svelte';
    onMount(async () => {
        const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=20`);
        photos = await res.json();
    });

    function init(bookName = $('input[name=bookType]:checked').val()){
        const bookPath = "./";
        fetch(bookPath + bookName)
                .then(res => res.text())
                .then(qText => {
                    const qArr = getQ(qText);
                    setView(qArr);
                });
    }

    function getQ(text, count = 5){
        const rows = text.split('\n');
        const qs = [];
        for(let i=0; i<rows.length; i++){
            const rowArr = rows[i].split('\t');
            for(let j=1; j<rowArr.length; j++){
                const q = {time:rowArr[0], content:rowArr[j], };
                qs.push(q);
            }
        }
        const res = [];
        const indexSet = {};
        for(let i=0; i<count; i++){
            const max = qs.length;
            const index = Math.round(max * Math.random() -1);
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
        const container = $('.q-container');
        container.html('');

        qArray = setOrder(qArray);

        for(let i=0; i<qArray.length; i++){
            const el = $('.q-template').clone();
            el.removeClass("q-template");
            el.find('input[type=checkbox]').removeClass('hide');

            const data = qArray[i];
            el.find('.time').text(data.time);
            el.find('.order').text(data.order);
            el.find('.content').text(data.content);
            container.append(el);
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
            const q = $(arr[i]);
            if(q.find('.user-order').text() === ""){
                alert("전부 체크 하세요.");
                return;
            }
        }
        for(let i=0; i<arr.length; i++){
            const q = $(arr[i]);
            if(q.find('.user-order').text() !== q.find('.order').text()){
                result = false;
                break;
            }
        }
        if(result){
            alert("정답");
        } else {
            alert("다음 기회에");
        }
        arr.find('.hide').removeClass('hide');
    }
    function setUserOrder(){
        const arr = getQRows();
        const checkCount = $('.q-container > .container .user-order-check:checked').length;
        let userOrderCount = 0;
        for(let i=0; i<arr.length; i++){
            if($(arr[i]).find('.user-order').text() !== ""){
                userOrderCount++;
            }
        }
        if(checkCount > userOrderCount){
            const targetArr = arr.find('input.user-order-check:checked');
            for(let i=0; i<targetArr.length; i++){
                const target = $(targetArr[i]).parent().parent().parent().find('.user-order');
                if(target.text() === ""){
                    target.text(checkCount);
                    break;
                }
            }
        } else {
            let deleted = -1;
            for(let i=0; i<arr.length; i++){
                const row = $(arr[i]);
                if(row.find('.user-order').text() !== "" && row.find('.user-order-check:checked').length === 0){
                    deleted = parseInt(row.find('.user-order').text());
                }
            }
            for(let i=0; i<arr.length; i++){
                const target = $(arr[i]).find('.user-order');
                const targetText = target.text();
                if(targetText !== ""){
                    const targetInt = parseInt(targetText);
                    if(targetInt > deleted){
                        target.text(targetInt-1)
                    } else if(targetInt === deleted){
                        target.text("");
                    }
                }
            }
        }
    }
    function getQRows(){
        return $('.q-container > .container');
    }
</script>

<div>
    <div>
        <h2>굿럭</h2>
        <div>
            <div>시대 선택</div>
            <div class="container">
                <div class="item"><label for="type1">고대사</label>   <input id="type1" type="radio" name="bookType" value="고대사.tsv" checked /></div>
                <div class="item">　　</div>
                <div class="item"><label for="type2">남북국</label>   <input id="type2" type="radio" name="bookType" value="남북국.tsv" /></div>
                <div class="item">　　</div>
                <div class="item"><label for="type3">구한말</label>   <input id="type3" type="radio" name="bookType" value="구한말.tsv" /></div>
                <div class="item">　　</div>
                <div class="item"><label for="type4">일제강점기</label><input id="type4" type="radio" name="bookType" value="일제강점기.tsv" /></div>
                <div class="item">　　</div>
                <div class="item"><label for="type5">현대사</label>   <input id="type5" type="radio" name="bookType" value="현대사.tsv"/></div>
            </div>
        </div>
        <div class="q-container"></div>
    </div>
    <div>
        <button onclick="init()">초기화</button>
        <button onclick="check()">정답 확인</button>
    </div>
    <div class="q-template container">
        <div class="item ans time hide"></div>
        <div class="item ans order hide"></div>
        <div class="item user-order"></div>
        <div class="item check">
            <label>
                <input class="user-order-check hide" type="checkbox" onclick="setUserOrder()" />
            </label>
        </div>
        <div class="item content"></div>
    </div>
</div>
