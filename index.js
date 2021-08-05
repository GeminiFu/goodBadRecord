// form 送出內容到 good 或 bad
function Render() {
    let itemList = { good: [], bad: [] },
        goodList = itemList.good,
        badList = itemList.bad;

    this.key = "goodBadRacord";
    // 放進 itemList
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
            console.log(itemList);
        }
        // 判定為 bad
        else {
            badList.push(item)
            console.log(itemList);
        }
        this.renderHeader();
        this.renderArticle();
    }

    // TODO:儲存輸入選項變下拉選單

    // 計算 good bad sum 總和
    this.sum = function () {
        let goodSum = 0,
            badSum = 0;
        goodList.forEach(function (good) {
            goodSum += good.num || 0;
        });
        badList.forEach(function (bad) {
            badSum += bad.num || 0;
        });
        const sum = goodSum - badSum;
        return [goodSum, badSum, sum];
    }

    // 渲染標題
    this.renderHeader = function () {
        const sum = this.sum()[2];
        $("header")[0].innerHTML = 100 + sum + "%";
    }

    // TODO:渲染 bar
    this.renderBar = function () {

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
                        <button data-index="${idx}">X</button>
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
                        <button data-index="${idx}" class=".delete-btn">X</button>
                        <div>-${item.num}</div>
                    </div>
                </td>
                <td>${item.text}</td>
                <td>${item.date}</td>
                <td>${item.note}</td>
            </tr>
            `
        })
        this.clearInput();
        this.updateDataToStorage();
    }

    // 清空 input
    this.clearInput = function () {
        inputList = $(".input-form input");
        for (let i = 0; i < inputList.length; i++) {
            inputList[i].value = "";
        }
    }

    // 放進 localStorage
    this.updateDataToStorage = function () {
        const itemListStr = JSON.stringify(itemList);
        // TODO: 還要再加入今日時間
        localStorage.setItem(this.key, itemListStr)
    }
}

const render = new Render();

// submit 事件
$(".input-form").submit(function (e) {
    e.preventDefault();
    const form = this;
    render.addItem(form);
})

// TODO: 點擊 刪除
// TODO: 點擊 修改

// TODO: positive-negative點擊 input-point基數變 1 或 2

// TODO: 提取 localStorage 變成歷史紀錄