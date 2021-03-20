// 设置用全局变量
var luckySum = 0;                   // 中奖总人数
var showId = true;                  // 中奖结果显示ID true/false
var showLink = true;                // 中奖结果显示发送私信连接 true/false
var storeInfoIntervalTime = 1500;   // 存放用户信息的间隔ms
var waitIntervalNum = 3;            // 出结果前等待次数
var waitIntervalTime = 1500;        // 出结果前等待间隔ms
var msgSitePrefix = "https://message.bilibili.com/#/whisper/mid";

// 功能用全局变量
var idSet = new Set();          // 存放所有参与的用户的id
var nameSet = new Set();        // 存放所有参与的用户的昵称
var luckyInfo = new Array();    // 存放所有抽奖结果信息
var pageSum;                    // 评论总页数
var storeInfoInterval;          // 存储信息用定时器
var waitResInterval;            // 等待结果用定时器
var waitIntervalCnt = 0;        // 出结果前等待计数器

// 调用入口方法
draw();

// 入口
function draw() {
    gotoFirstPage();
    var pages = document.getElementsByClassName("tcd-number");
    pageSum = pages[pages.length - 1].childNodes[0].nodeValue;
    console.log("\n抽奖开始...\n逐页记录用户信息...");
    storeInfoInterval = setInterval(getCurPageInfo, storeInfoIntervalTime);
}

// 获取本页信息
function getCurPageInfo() {
    // 当前页数进度
    var currentPage = document.getElementsByClassName("current")[0].childNodes[0].nodeValue;
    console.log(currentPage + "/" + pageSum + "...");

    // 添加本页用户信息
    var cons = document.getElementsByClassName("con ");
    var length = cons.length;
    for (var i = 0; i < length; i++) {
        var userInfo = cons[i].firstChild.getElementsByTagName("a")[0];
        var userId = userInfo.getAttribute("data-usercard-mid");
        var userName = userInfo.childNodes[0].nodeValue;
        idSet.add(userId);
        nameSet.add(userName);
        // console.log("加入用户 " + userName);
    }
    
    // 通过是否有“下一页”按键判断是否到达尾页
    var next = document.getElementsByClassName("next")[0];
    if (next == undefined || next == null) {
        // 到达页尾，开始抽奖
        clearInterval(storeInfoInterval);
        var userNum = idSet.size;
        console.log("录入结束，共有" + userNum + "名用户参与评论.");
        // 获取获奖人数
        if (luckySum == 0) {
            var getLuckySumMsg = "共有" + userNum + "名用户参与，要抽几个人呢？";
            luckySum = prompt(getLuckySumMsg);
            while (luckySum > userNum) {
                luckySum = prompt(getLuckySumMsg);
            }
        }  
        // 生成幸运数字，从数组中取出放入最终结果
        var luckyNums = generateLuckyNums(userNum, luckySum);
        var idArray = Array.from(idSet);
        var nameArray = Array.from(nameSet);
        var luckyArray = Array.from(luckyNums);
        for (var i = 0; i < luckySum; i++) {
            var id = idArray[luckyArray[i]]
            var name = nameArray[luckyArray[i]];
            var msg ;
            msg = "" + name; 
            if (showId) {
                msg += "(" + id + ")";
            }
            if (showLink) {
                msg += " " + msgSitePrefix + id;
            }
            luckyInfo.push(msg);
        }
        // 出结果前的等待
        waitResInterval = setInterval(waitRes, waitIntervalTime);
        
    } else {
        // 若不是尾页，就click进入下一页
        next.click();
    }
}

// 前往评论首页
function gotoFirstPage() {
    if (document.getElementsByClassName("current")[0].childNodes[0].nodeValue == 1) {
        return;
    }

    document.getElementsByClassName("tcd-number")[0].click();
}

// 在userNum总数中随机生成num个数字并返回
function generateLuckyNums(userNum, luckySum) {
    var temp = 0;
    var luckyNums = new Set();

    for (var i = 0; i < luckySum; i++) {
        // floor([0, 1) * userNum) = [0, userNum - 1]，用作之后下标
        temp = Math.floor((Math.random() * userNum));
        while (luckyNums.has(temp)) {
            temp = Math.floor((Math.random() * userNum));
        }
        luckyNums.add(temp);
    }
    return luckyNums;    
}

// 显示中奖用户
function waitRes() {
    var waitMsg = "抽出的" + luckySum + "名用户是" + ".".repeat(waitIntervalNum - waitIntervalCnt);
    if (waitIntervalCnt == waitIntervalNum) {
        clearInterval(waitResInterval);
        if (waitIntervalNum == 0) {
            console.log(waitMsg);
        }
        console.log("\n");
        for (var i = 0; i < luckyInfo.length; i++) {
            console.log("%c" + luckyInfo[i], "color:blue");
        }
        console.log("\n抽奖结束，恭喜！*(^o^)/*");
        return;
    }
    
    console.log(waitMsg);
    waitIntervalCnt++;
}
