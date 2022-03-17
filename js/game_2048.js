/**
 * Created by L on 2021/5/12.
 */
window.onload=function(){
    ChangeColor();
    var step=new Array(0,3);            //step[0]用于记录步数,step[1]用于标记能撤销的次数，因为只有声明为数组或对象才能在函数中改变值
    var record_step=new Array(new Array(17),new Array(17),new Array(17),new Array(17));     //Array(17)数组用于记录每一步的格子值
    //当按下开始游戏按钮时
    document.getElementById("start_btn").onclick=function(){
        document.getElementById("highest_score").innerHTML=localStorage.getItem("highest_score");
        document.getElementById("button").style.display="none";
        PutRandom(step);
        PutRandom(step);              //游戏开始时在两个随机位置放置数
        ChangeColor();
        for(var i=1;i<=16;i++){                //先记录一开始的方格情况
            var val=document.getElementById("div"+i).innerHTML;
            record_step[0][i]=val;
        }
        record_step[0][0]=document.getElementById("score").innerHTML;
        document.onkeydown=function(event){                                    //用onkeydown函数，由于最后有return false所以页面不会因为键盘按下而滑动；如果是onkeyup函数则不行
            var event=event || window.event;    //标准化事件对象
            switch (event.keyCode){
                case 37:
                    left(step,record_step);
                    break;
                case 39:
                    right(step,record_step);
                    break;
                case 38:
                    up(step,record_step);
                    break;
                case 40:
                    down(step,record_step);
                    break;
            }
            return false;       //阻止冒泡
        }
        //当方向键图像被点击时也调用响应函数
        document.getElementById("up").onclick=function(){
            up(step,record_step);
        }
        document.getElementById("down").onclick=function(){
            down(step,record_step);
        }
        document.getElementById("left").onclick=function(){
            left(step,record_step);
        }
        document.getElementById("right").onclick=function(){
            right(step,record_step);
        }
    }

    //当按下继续游戏按钮时
    document.getElementById("continue_btn").onclick=function(){
        if(JSON.parse(localStorage.getItem("history_record"))!=null){
            document.getElementById("highest_score").innerHTML=localStorage.getItem("highest_score");
            document.getElementById("button").style.display="none";
            var history_record=JSON.parse(localStorage.getItem("history_record"));
            localStorage.removeItem("history_record");
            document.getElementById("score").innerHTML=history_record[0];
            for(var i=1;i<=16;i++){
                document.getElementById("div"+i).innerHTML=history_record[i];
            }
            ChangeColor();
            for(var i=1;i<=16;i++){                //先记录一开始的方格情况
                var val=document.getElementById("div"+i).innerHTML;
                record_step[0][i]=val;
            }
            record_step[0][0]=document.getElementById("score").innerHTML;
            document.onkeydown=function(event){                                    //用onkeydown函数，由于最后有return false所以页面不会因为键盘按下而滑动；如果是onkeyup函数则不行
                var event=event || window.event;    //标准化事件对象
                switch (event.keyCode){
                    case 37:
                        left(step,record_step);
                        break;
                    case 39:
                        right(step,record_step);
                        break;
                    case 38:
                        up(step,record_step);
                        break;
                    case 40:
                        down(step,record_step);
                        break;
                }
                return false;       //阻止冒泡
            }
            //当方向键图像被点击时也调用响应函数
            document.getElementById("up").onclick=function(){
                up(step,record_step);
            }
            document.getElementById("down").onclick=function(){
                down(step,record_step);
            }
            document.getElementById("left").onclick=function(){
                left(step,record_step);
            }
            document.getElementById("right").onclick=function(){
                right(step,record_step);
            }
        }
    }

    //存档退出
    document.getElementById("archive_btn").onclick=function(){
        var history_record=new Array(17);
        history_record[0]=document.getElementById("score").innerHTML;
        for(var i=1;i<=16;i++){
            history_record[i]=document.getElementById("div"+i).innerHTML;
        }
        //storage只能存储字符串的数据，不能直接存储数组或对象，因此要通过JSON对象的stringify将数据转化成字符串存储在history_record中，再通过parse将读取的history_record转化为数组或对象
        localStorage.setItem("history_record",JSON.stringify(history_record));
        window.close();
    }

    //撤销
    document.getElementById("revoke_btn").onclick=function(){
        if(step[1]>=1&&step[0]>=1){                  //如果可撤销的次数大于等于1且当前步数大于等于1，则执行撤销操作，同时撤销次数减一
            --step[0];        //回到上一步
            document.getElementById("score").innerHTML=record_step[step[0]%4][0];   //覆盖分数
            for(var i=1;i<=16;i++){
                document.getElementById("div"+i).innerHTML=record_step[step[0]%4][i];   //覆盖方格
            }
            ChangeColor();
            --step[1];     //撤销次数减一
        }
    }
    //重新开始
    document.getElementById("reset_btn").onclick=function(){
        GameOver(step);
    }
    //游戏说明
    document.getElementById("explain_btn").onclick=function(){
        document.getElementById("explain").style.display="flex";
    }
    //返回
    document.getElementById("return").onclick=function(){
        document.getElementById("explain").style.display="none";
    }
    //显示键盘或隐藏键盘
    document.getElementById("disp_key").onclick=function(){
        if(document.getElementById("disp_key").innerHTML=="显示键盘"){
            document.getElementById("key").style.display="block";
            document.getElementById("disp_key").innerHTML="隐藏键盘";
        }
        else{
            document.getElementById("key").style.display="none";
            document.getElementById("disp_key").innerHTML="显示键盘";
        }
    }
}

//按下上键函数
function up(step,record_step){
    var flag=0;        //用于标识按下此键时有无方格需要移动，若没有则不需要添加随机数，且此次操作不记录在步数中
    for(var i=1;i<=4;i++){
        for(var j=0;j<=2;j++){
            var valj=document.getElementById("div"+(i+4*j)).innerHTML;
            //若该位置为空，则向后找不为空的格子，如果有，则将第一个不为空的格子里的内容放到该位置中
            if(valj=='0'){
                var k=j+1;
                var valk=document.getElementById("div"+(i+4*k)).innerHTML;
                while(valk=='0'&&k<=3){   //向后找不为空的格子
                    ++k;
                    if(k<=3){
                        valk=document.getElementById("div"+(i+4*k)).innerHTML;
                    }
                }
                if(k<=3){       //若k>3，说明没有不为空的格子
                    document.getElementById("div"+(i+4*j)).innerHTML=valk;
                    document.getElementById("div"+(i+4*k)).innerHTML='0';
                    flag=1;                       //说明此时有进行移动的操作
                }
            }
            //若该位置不为空，则向后找第一个不为空的格子，若格子里的数和该位置的一样，则将其加到该位置
            valj=document.getElementById("div"+(i+4*j)).innerHTML;
            if(valj!='0'){
                var k=j+1;
                var valk=document.getElementById("div"+(i+4*k)).innerHTML;
                while(valk=='0'&&k<=3){
                    ++k;
                    if(k<=3){
                        valk=document.getElementById("div"+(i+4*k)).innerHTML;
                    }
                }
                if(k<=3&&valj==valk){
                    var value=2*Number(valj);
                    document.getElementById("div"+(i+4*j)).innerHTML=String(value);
                    document.getElementById("div"+(i+4*k)).innerHTML='0';
                    flag=1;                   //说明此时有进行移动的操作
                    var score=document.getElementById("score").innerHTML;
                    var newscore=Number(score)+Number(valj);
                    document.getElementById("score").innerHTML=String(newscore);
                }
            }
        }
    }
    if(flag==1){
        if(step[1]<3){
            ++step[1];          //可撤销的次数加一
        }
        PutRandom(step);   //操作完之后在一个随机位置加入2或4
        ChangeColor();   //并改变格子中数字颜色
        ++step[0];
        record_step[step[0]%4][0]=document.getElementById("score").innerHTML;    //用于记录分数
        for(var i=1;i<=16;i++){           //记录方格情况
            var val=document.getElementById("div"+i).innerHTML;
            record_step[step[0]%4][i]=val;
        }
    }
    else {
        var empty=GetEmpty();         //用于存储空格子位置
        if(empty.length<1){            //如果没有空格子，游戏结束
            window.alert("游戏结束！\n您的得分为："+GetScore());
            GameOver(step);
        }
    }
}
//按下下键函数
function down(step,record_step){
    var flag=0;        //用于标识按下此键时有无方格需要移动，若没有则不需要添加随机数，且此次操作不记录在步数中
    for(var i=13;i<=16;i++){
        for(var j=0;j<=2;j++){
            var valj=document.getElementById("div"+(i-4*j)).innerHTML;
            if(valj=='0'){
                var k=j+1;
                var valk=document.getElementById("div"+(i-4*k)).innerHTML;
                while(valk=='0'&&k<=3){
                    ++k;
                    if(k<=3){
                        valk=document.getElementById("div"+(i-4*k)).innerHTML;
                    }
                }
                if(k<=3){
                    document.getElementById("div"+(i-4*j)).innerHTML=valk;
                    document.getElementById("div"+(i-4*k)).innerHTML='0';
                    flag=1;                       //说明此时有进行移动的操作
                }
            }
            valj=document.getElementById("div"+(i-4*j)).innerHTML;
            if(valj!='0'){
                var k=j+1;
                var valk=document.getElementById("div"+(i-4*k)).innerHTML;
                while(valk=='0'&&k<=3){
                    ++k;
                    if(k<=3){
                        valk=document.getElementById("div"+(i-4*k)).innerHTML;
                    }
                }
                if(k<=3&&valj==valk){
                    var value=2*Number(valj);
                    document.getElementById("div"+(i-4*j)).innerHTML=String(value);
                    document.getElementById("div"+(i-4*k)).innerHTML='0';
                    flag=1;                       //说明此时有进行移动的操作
                    var score=document.getElementById("score").innerHTML;
                    var newscore=Number(score)+Number(valj);
                    document.getElementById("score").innerHTML=String(newscore);
                }
            }
        }
    }
    if(flag==1){
        if(step[1]<3){
            ++step[1];
        }
        PutRandom(step);   //操作完之后在一个随机位置加入2或4
        ChangeColor();   //并改变格子中数字颜色
        ++step[0];
        record_step[step[0]%4][0]=document.getElementById("score").innerHTML;    //用于记录分数
        for(var i=1;i<=16;i++){
            var val=document.getElementById("div"+i).innerHTML;
            record_step[step[0]%4][i]=val;
        }
    }
    else {
        var empty=GetEmpty();         //用于存储空格子位置
        if(empty.length<1){            //如果没有空格子，游戏结束
            window.alert("游戏结束！\n您的得分为："+GetScore());
            GameOver(step);
        }
    }
}
//按下左键函数
function left(step,record_step){
    var flag=0;        //用于标识按下此键时有无方格需要移动，若没有则不需要添加随机数，且此次操作不记录在步数中
    for(var i=1;i<=13;i=i+4){
        for(var j=0;j<=2;j++){
            var valj=document.getElementById("div"+(i+j)).innerHTML;
            if(valj=='0'){
                var k=j+1;
                var valk=document.getElementById("div"+(i+k)).innerHTML;
                while(valk=='0'&&k<=3){
                    ++k;
                    if(k<=3){
                        valk=document.getElementById("div"+(i+k)).innerHTML;
                    }
                }
                if(k<=3){
                    document.getElementById("div"+(i+j)).innerHTML=valk;
                    document.getElementById("div"+(i+k)).innerHTML='0';
                    flag=1;                       //说明此时有进行移动的操作
                }
            }
            valj=document.getElementById("div"+(i+j)).innerHTML;
            if(valj!='0'){
                var k=j+1;
                var valk=document.getElementById("div"+(i+k)).innerHTML;
                while(valk=='0'&&k<=3){
                    ++k;
                    if(k<=3){
                        valk=document.getElementById("div"+(i+k)).innerHTML;
                    }
                }
                if(k<=3&&valj==valk){
                    var value=2*Number(valj);
                    document.getElementById("div"+(i+j)).innerHTML=String(value);
                    document.getElementById("div"+(i+k)).innerHTML='0';
                    flag=1;                       //说明此时有进行移动的操作
                    var score=document.getElementById("score").innerHTML;
                    var newscore=Number(score)+Number(valj);
                    document.getElementById("score").innerHTML=String(newscore);
                }
            }
        }
    }
    if(flag==1){
        if(step[1]<3){
            ++step[1];
        }
        PutRandom(step);   //操作完之后在一个随机位置加入2或4
        ChangeColor();   //并改变格子中数字颜色
        ++step[0];
        record_step[step[0]%4][0]=document.getElementById("score").innerHTML;    //用于记录分数
        for(var i=1;i<=16;i++){
            var val=document.getElementById("div"+i).innerHTML;
            record_step[step[0]%4][i]=val;
        }
    }
    else {
        var empty=GetEmpty();         //用于存储空格子位置
        if(empty.length<1){            //如果没有空格子，游戏结束
            window.alert("游戏结束！\n您的得分为："+GetScore());
            GameOver(step);
        }
    }
}
//按下右键函数
function right(step,record_step){
    var flag=0;        //用于标识按下此键时有无方格需要移动，若没有则不需要添加随机数，且此次操作不记录在步数中
    for(var i=4;i<=16;i=i+4){
        for(var j=0;j<=2;j++){
            var valj=document.getElementById("div"+(i-j)).innerHTML;
            if(valj=='0'){
                var k=j+1;
                var valk=document.getElementById("div"+(i-k)).innerHTML;
                while(valk=='0'&&k<=3){
                    ++k;
                    if(k<=3){
                        valk=document.getElementById("div"+(i-k)).innerHTML;
                    }
                }
                if(k<=3){
                    document.getElementById("div"+(i-j)).innerHTML=valk;
                    document.getElementById("div"+(i-k)).innerHTML='0';
                    flag=1;                       //说明此时有进行移动的操作
                }
            }
            valj=document.getElementById("div"+(i-j)).innerHTML;
            if(valj!='0'){
                var k=j+1;
                var valk=document.getElementById("div"+(i-k)).innerHTML;
                while(valk=='0'&&k<=3){
                    ++k;
                    if(k<=3){
                        valk=document.getElementById("div"+(i-k)).innerHTML;
                    }
                }
                if(k<=3&&valj==valk){
                    var value=2*Number(valj);
                    document.getElementById("div"+(i-j)).innerHTML=String(value);
                    document.getElementById("div"+(i-k)).innerHTML='0';
                    flag=1;                       //说明此时有进行移动的操作
                    var score=document.getElementById("score").innerHTML;
                    var newscore=Number(score)+Number(valj);
                    document.getElementById("score").innerHTML=String(newscore);
                }
            }
        }
    }
    if(flag==1){
        if(step[1]<3){
            ++step[1];
        }
        PutRandom(step);   //操作完之后在一个随机位置加入2或4
        ChangeColor();   //并改变格子中数字颜色
        ++step[0];
        record_step[step[0]%4][0]=document.getElementById("score").innerHTML;    //用于记录分数
        for(var i=1;i<=16;i++){
            var val=document.getElementById("div"+i).innerHTML;
            record_step[step[0]%4][i]=val;
        }
    }
    else {
        var empty=GetEmpty();         //用于存储空格子位置
        if(empty.length<1){            //如果没有空格子，游戏结束
            window.alert("游戏结束！\n您的得分为："+GetScore());
            GameOver(step);
        }
    }
}

//在随机的空格子中放置数（2或4，其中放置2的概率要比4大）
function PutRandom(step){         //因为函数中调用的GameOver函数需要step数组，因此PutRandom需要有step参数
    var empty=GetEmpty();         //用于存储空格子位置
    if(empty.length>=1){          //如果有空格子，从空格子中随机选一个
        var num=Math.floor(Math.random()*empty.length);
        var position=empty[num];
        var value;
        //放置2和4的概率不同
        if(Math.random()<=0.8){
            value=2;
        }
        else {
            value=4;
        }
        document.getElementById("div"+position).innerHTML=value;
    }
    else {    //如果没有空格子，游戏结束
        window.alert("游戏结束！\n您的得分为："+GetScore());
        GameOver(step);
    }
}

//获得分数
function GetScore(){
    var score=document.getElementById("score").innerHTML;
    return score;
}

//找空格子
function GetEmpty(){
    var empty=new Array();
    for(var i=1;i<=16;i++){
        var val=document.getElementById("div"+i).innerHTML;
        if(val=='0'){
            empty.push(i);
        }
    }
    return empty;
}

//游戏结束函数
function GameOver(step){
    //游戏结束时判断是否需要改变历史最高分
    var score=document.getElementById("score").innerHTML;
    if(localStorage.getItem("highest_score")==null){
        localStorage.setItem("highest_score",score);
    }
    else {
        if(localStorage.getItem("highest_score")<Number(score)){
            localStorage.setItem("highest_score",Number(score));
        }
    }
    for(var i=1;i<=16;i++){
        document.getElementById("div"+i).innerHTML='0';       //给每个格子置零（即变空）
    }
    ChangeColor();
    document.getElementById("button").style.display="flex";
    document.getElementById("score").innerHTML=0;
    step[0]=0;
    step[1]=3;             //重置步数和可撤销次数
}

//为不同的数字设置不同的颜色
function ChangeColor(){
    var empty=new Array();
    for(var i=1;i<=16;i++){
        var val=document.getElementById("div"+i).innerHTML;
        switch (val){
            case '0':
                document.getElementById("div"+i).style.color="#FEEEED";
                break;
            case '2':
                document.getElementById("div"+i).style.color="#F8ABA6";
                break;
            case '4':
                document.getElementById("div"+i).style.color="#F58F98";
                break;
            case '8':
                document.getElementById("div"+i).style.color="#F391A9";
                break;
            case '16':
                document.getElementById("div"+i).style.color="#F05B72";
                break;
            case '32':
                document.getElementById("div"+i).style.color="#EF5B9C";
                break;
            case '64':
                document.getElementById("div"+i).style.color="#BB505D";
                break;
            case '128':
                document.getElementById("div"+i).style.color="#D93A49";
                break;
            case '256':
                document.getElementById("div"+i).style.color='#D71345';
                break;
            case '512':
                document.getElementById("div"+i).style.color='#ED1941';
                break;
            case '1024':
                document.getElementById("div"+i).style.color="#C63C26"
            default:
                document.getElementById("div"+i).style.color="#AA2116";
                break;
        }
    }
}


