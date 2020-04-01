var height = document.querySelector('.height');
var weight = document.querySelector('.weight');
var resultBtn = document.querySelector('.resultBtn');
var list = document.querySelector('.list');
var clearBtn = document.querySelector('.clearBtn');
var clearAll = document.querySelector('.clearAll');
var refreshBtn =document.querySelector('.refreshBtn');
var data = JSON.parse(localStorage.getItem('allData')) || [];
var date = new Date();
var judge ='';

// 更新BMI紀錄
function updateList(){
    var dataLen = data.length;
    var str = '';
    for(i=0;i<dataLen;i++){
        str += `<div class='judgeColor'></div><li><table><tr><td>${data[i].judge}</td><td><span>BMI</span>${data[i].BMI}</td><td><span>height</span>${data[i].height}cm</td><td><span>weight</span>${data[i].weight}kg</td><td><span>${data[i].time}</span></td><td><a class='clearBtn' data-num=${i} href="#">clear</a></td></tr></table>
        </li>`;
    }
    list.innerHTML = str;
    height.value = '';
    weight.value = '';
    setjudgeColor();
}
updateList();


function recordList(){
    //將已經相反的陣列轉回來
    data.reverse();
    //確認input內身高與體重的值是否正確
    if(height.value =='' || weight.value ==''){
        alert('請正確輸入身高與體重')
        height.value = '';
        weight.value = '';
        height.focus();  //清空input的值，並focus在height內
        return;
    }
    if(isNaN(height.value) || isNaN(weight.value)){
        alert('輸入有誤，須為數字')
        height.value = '';
        weight.value = '';
        height.focus(); //清空input的值，並focus在height內
        return;
    }
    
    var bmi = (weight.value / (Math.pow(height.value/100,2))).toFixed(2);
    bmiJudge(bmi);
    // 創造一個物件，包含每個BMI紀錄所需要的值
    var record = {
        height: height.value,
        weight: weight.value,
        BMI: bmi,
        judge: judge,
        time: date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
    };
    data.push(record);
    data.reverse();  //將正常陣列轉向，原因為讓新的值push進去後保持在陣列第一個，並以時間序遞減
    localStorage.setItem('allData',JSON.stringify(data));
    updateList();
    changeBtn(bmi,judge); //將'看結果'按鍵做改變
}
// 傳入BMI的值後判斷體重狀況
function bmiJudge(bmi){
        if (bmi<18.5){
            judge = '過輕';
        }
        else if (18.5<=bmi && bmi<25){
            judge = '理想';
        }
        else if (25<=bmi && bmi<30){
            judge = '過重';
        }
        else if (30<=bmi && bmi<35){
            judge = '輕度肥胖';
        }
        else if (35<=bmi && bmi<40){
            judge = '中度肥胖';
        }
        else{
            judge = '重度肥胖';
        }
};
//給不同的judge在LI顯示不同顏色
function setjudgeColor(){
    var judgeColor = document.querySelectorAll('.judgeColor');
    for(i=0;i<data.length;i++){
        if(data[i].judge == '過輕'){
            judgeColor[i].setAttribute('id','lv1');
        }
        else if(data[i].judge == '理想'){
            judgeColor[i].setAttribute('id','lv2');
        }
        else if(data[i].judge == '過重'){
            judgeColor[i].setAttribute('id','lv3');
        }
        else if(data[i].judge == '輕度肥胖'){
            judgeColor[i].setAttribute('id','lv4');
        }
        else if(data[i].judge == '中度肥胖'){
            judgeColor[i].setAttribute('id','lv5');
        }
        else if(data[i].judge == '重度肥胖'){
            judgeColor[i].setAttribute('id','lv6');
        }
    }
    
}
// 將'看結果'按鍵做改變
function changeBtn(bmi,judge){
    var btn = document.querySelector('.btn');
    btn.innerHTML = `<div class='changeBtn'><p class ='BMI_value'>${bmi}</p><p class='BMI'>BMI</p><a class='refreshBtn' href=''><img src="image/icons_loop.png" alt=""></a></div><p class='judge'>${judge}</p>`;
    var refreshBtn = document.querySelector('.refreshBtn'); 


    if(judge == '過輕'){
        btn.setAttribute('style','color:#31BAF9;');
        refreshBtn.setAttribute('style','background-color:#31BAF9;');
    }
    else if(judge == '理想'){
        btn.setAttribute('style','color:#86D73F;');
        refreshBtn.setAttribute('style','background-color:#86D73F;');
    }
    else if(judge == '過重'){
        btn.setAttribute('style','color:#FF982D;');
        refreshBtn.setAttribute('style','background-color:#FF982D;');
    }
    else if(judge == '輕度肥胖'){
        btn.setAttribute('style','color:#FF6C03;');
        refreshBtn.setAttribute('style','background-color:#FF6C03;');
    }
    else if(judge == '中度肥胖'){
        btn.setAttribute('style','color:#FF6C03;');
        refreshBtn.setAttribute('style','background-color:#FF6C03;');
    }
    else if(judge == '重度肥胖'){
        btn.setAttribute('style','color:#FF1200;');
        refreshBtn.setAttribute('style','background-color:#FF1200;');
    }

    

}


// 以dataset的方式去抓要刪除的LI是陣列中的第幾個
// dataset在updateList裡已經innerHTML進a連結裡
// 若最後一筆資料也被刪除掉，將localStorage裡的allData(Key) remove掉，避免網頁更新後產生不必要的Bug
function delList(e){
    var del = e.target.nodeName;
    var num = e.target.dataset.num;
    if(del !== 'A'){return}
    data.splice(num,1);
    if(data.length == 0){
        data=[];
        localStorage.removeItem('allData');
    }
    else{
        localStorage.setItem('allData',JSON.stringify(data));  
    }
    updateList();
}

// 清除所有Data
function delAllList(){
    data=[];
    localStorage.removeItem('allData');
    updateList();    
}




resultBtn.addEventListener('click',recordList);
list.addEventListener('click',delList);
clearAll.addEventListener('click',delAllList);

