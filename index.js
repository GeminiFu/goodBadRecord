// form 送出內容到 good 或 bad
function Render() {
    let goodList = [],
        badList = [],
        dataHistory = [],
        historyNum = 1;
    const that = this;

    this.key = "goodBadRacord";

    // 放進 goodList or badList
    this.addItem = function (submit) {
        const item = {
            num: parseInt(submit[1].value),
            text: submit[2].value,
            date: submit[3].value,
            note: submit[4].value
        };

        // 判定為 good
        if (submit[0].checked) {
            goodList.push(item)
        }
        // 判定為 bad
        else {
            badList.push(item)
        }

        this.renderHeader();
        this.renderArticle();
        this.renderBar();
    }

    // 計算 good bad 的總和
    this.sum = function () {
        let goodSum = 0,
            badSum = 0;
        goodList.forEach(function (good) {
            goodSum += good.num;
        });
        badList.forEach(function (bad) {
            badSum += bad.num;
        });
        const sum = (goodSum - badSum);
        return [sum, goodSum, badSum];
    }

    // 計算 history 績效
    this.historyNum = function () {
        let history = 1;
        dataHistory.forEach(function (list, index) {
            // console.log("這是list", index, list);
            let goodSum = 0, badSum = 0, sum = 0;
            list.good.forEach(function (good) {
                goodSum += parseInt(good.num);
            })
            list.bad.forEach(function (bad) {
                badSum += bad.num;
            })
            sum = goodSum - badSum;
            history *= (1 + sum / 100);

        })
        return history;
    }

    // 渲染標題
    this.renderHeader = function () {
        const sum = this.sum()[0],
            num = parseInt(historyNum * (100 + sum));
        $("header")[0].innerHTML = num + "%";
    }

    // 渲染 article 的 $tableGood $tableBad
    this.renderArticle = function () {
        const $tableGood = $(".today-good tbody")[0],
            $tableBad = $(".today-bad tbody")[0];

        // 初始化 $tableGood
        $tableGood.innerHTML = "";
        // 渲染 $tableGood
        goodList.forEach((item, idx) => {
            $tableGood.innerHTML += `
            <tr>
                <td>
                    <div>
                        <button class="delete-btn" data-index="${idx}" data-goodOrBad="good">X</button>
                        <div>+${item.num}</div>
                    </div>
                </td>
                <td>${item.text}</td>
                <td>${item.date}</td>
                <td>${item.note}</td>
            </tr>
            `
        })
        // 初始化 $tableBad
        $tableBad.innerHTML = "";
        // 渲染 $tableBad
        badList.forEach((item, idx) => {
            $tableBad.innerHTML += `
            <tr>
                <td>
                    <div>
                        <button class="delete-btn" data-index="${idx}" data-goodOrBad="bad">X</button>
                        <div>-${item.num}</div>
                    </div>
                </td>
                <td>${item.text}</td>
                <td>${item.date}</td>
                <td>${item.note}</td>
            </tr>
            `
        })

        // 按鈕功能綁定
        $(".delete-btn").click(function () {
            const id = this.dataset.index,
                status = this.dataset.goodorbad;
            let list = [];
            if (status == "good") {
                list = goodList;
            }
            else {
                list = badList;
            }
            list.splice(id, 1);

            that.renderArticle();
            that.renderHeader();
        })

        this.clearInput();
    }

    // 渲染 bar
    this.renderBar = function () {
        const root = document.documentElement,
            goodBar = document.getElementsByClassName("good-bar")[0],
            badBar = document.getElementsByClassName("bad-bar")[0],
            goodSum = this.sum()[1],
            badSum = this.sum()[2],
            sum = goodSum + badSum;

        goodBar.innerHTML = goodSum;
        badBar.innerHTML = badSum;

        root.style.setProperty("--good-bar-width", `${goodSum / sum * 100}%`)
    }

    // 清空 input
    this.clearInput = function () {
        inputList = $(".input-form input");
        for (let i = 0; i < inputList.length; i++) {
            inputList[i].value = null;
        }
        inputList[1].value = 1;
    }

    // 放進 localStorage
    this.updateDataToStorage = function () {
        const itemListStr = JSON.stringify([{ good: goodList, bad: badList }, ...dataHistory]);
        // TODO: 還要再加入今日時間
        localStorage.setItem(this.key, itemListStr)
        this.init();
    }

    // init
    this.init = function () {
        goodList = [];
        badList = [];

        this.getDataFromStorage();
        that.renderArticle();
        that.renderHeader();
    }

    // 從 localStorage 取出資料
    this.getDataFromStorage = function () {
        dataHistory = JSON.parse(localStorage.getItem(that.key)) || [];
        historyNum = this.historyNum();
    }


}

const render = new Render();
render.init();

// submit 事件
$(".input-form").submit(function (e) {
    e.preventDefault();
    const form = this;
    render.addItem(form);
})

// TODO: 點擊 修改

// TODO: positive-negative點擊 input-point基數變 1 或 2

// TODO: 提取 localStorage 變成歷史紀錄

// 送進 localStorage
$("#send-localStorage").click(function () {
    render.updateDataToStorage();
})