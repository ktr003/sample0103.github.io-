// JavaScript source code
var drawing = false;
// 前回の座標を記録
var before_x = 0;
var before_y = 0;
// 矩形用
var MIN_WIDTH = 3;
var MIN_HEIGHT = 3;
var canvas, stx;
var rect_MousedownFlg = false;
var rect_sx = 0;
var rect_sy = 0;
var rect_ex = 0;
var rect_ey = 0;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//スマホの振り分け
var ua = navigator.userAgent;
if (ua.indexOf('iPhone') > 0) {
    ua = 'iphone';
} else if (ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
    ua = 'sp';
} else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
    ua = 'tab';
} else {
    ua = 'other';
}

//イベントの振り分け
var EVENT = {};
if (ua != 'other') {//スマートフォンだったら
    EVENT.TOUCH_START = 'touchstart';
    EVENT.TOUCH_MOVE = 'touchmove';
    EVENT.TOUCH_END = 'touchend';
} else {//パソコンだったら
    EVENT.TOUCH_START = 'mousedown';
    EVENT.TOUCH_MOVE = 'mousemove';
    EVENT.TOUCH_END = 'mouseup';
}

// マウスをクリックしてる時
canvas.addEventListener('mousedown', function (e) {
    drawing = true;
    var rect = e.target.getBoundingClientRect();
    before_x = e.clientX - rect.left;
    before_y = e.clientY - rect.top;
});

// マウスをクリックしていない時
canvas.addEventListener('mouseup', function () {
    drawing = false;
});

// 描画の処理
function draw_canvas(e) {
    if (!drawing) {
        return
    };
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var w = document.getElementById('width').value;
    var color = document.getElementById('color').value;
    var r = parseInt(color.substring(1, 3), 16);
    var g = parseInt(color.substring(3, 5), 16);
    var b = parseInt(color.substring(5, 7), 16);
    // 描画
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(before_x, before_y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();
    // 描画最後の座標を前回の座標に代入する
    before_x = x;
    before_y = y;
}

//矩形
function draw_Rectangle(e) {
    //OnMouseup();
    //OnMousedown();
    //OnMousemove();
}

var pen = document.getElementById('pencil');
var era = document.getElementById('eraser');
var scr = document.getElementById('scroll');
var sen = document.getElementById('sentaku');

// スクロール禁止関数
function disableScroll(event) {
    event.preventDefault();
}

// 鉛筆、消しゴム、スクロール、矩形選択
function tool(btnNum) {
    // スクロールボタン
    if (btnNum == 1) {
        document.removeEventListener('touchmove', disableScroll, { passive: false });
        document.body.classList.remove('overflow-hidden');
        canvas.removeEventListener('mousemove', draw_Rectangle);
        canvas.removeEventListener('mousemove', draw_canvas);
        scr.className = 'active';
        pen.className = '';
        era.className = '';
        sen.className = ''; 
    }
    // 鉛筆ボタン
    else if (btnNum == 2) {
        document.addEventListener('touchmove', disableScroll, { passive: false });
        document.body.classList.add('overflow-hidden');
        ctx.globalCompositeOperation = 'source-over';
        canvas.removeEventListener('mousemove', draw_Rectangle);
        canvas.addEventListener('mousemove', draw_canvas);
        scr.className = '';
        pen.className = 'active';
        era.className = '';
        sen.className = ''; 
    }
    // 消しゴムボタン
    else if (btnNum == 3) {
        document.addEventListener('touchmove', disableScroll, { passive: false });
        document.body.classList.add('overflow-hidden');
        ctx.globalCompositeOperation = 'destination-out';
        canvas.removeEventListener('mousemove', draw_Rectangle);
        canvas.addEventListener('mousemove', draw_canvas);
        scr.className = '';
        pen.className = '';
        era.className = 'active';
        sen.className = ''; 
    }
    // 範囲選択ボタン
    else if (btnNum == 4) {
        document.addEventListener('touchmove', disableScroll, { passive: false });
        document.body.classList.add('overflow-hidden');
        canvas.removeEventListener('mousemove', draw_canvas);
        canvas.addEventListener('mousemove', draw_Rectangle);
        scr.className = '';
        pen.className = '';
        era.className = '';
        sen.className = 'active'; 
    }
}

window.addEventListener('load', function () {

    var background = new Image();
    background.src = "gridpaper.jpg";
    canvas.height = 500;
    canvas.width = 500 / 1.4;
    background.onload = function () {
        //canvas_widthを height / width倍する.
        ctx.drawImage(background, 0, 0, canvas.width, background.height * canvas.width / background.width);
    }

    var img_datas_cnt = 0;
    var img_datas_arr = new Array();

    //ウィンドウリサイズ時
    window.addEventListener('resize', function (event) {
        // canvasの位置座標を取得（描いたものを伸縮させないため、キャンバスの大きさを変える）
        clientRect = canvas.getBoundingClientRect();
        x = clientRect.left;
        y = clientRect.top;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        // 一度消して、保存していた配列データを全て描く（ウィンドウを大きくした場合に戻す）
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        for (var i = 0; i < img_datas_arr.length; i++) ctx.putImageData(img_datas_arr[i], 0, 0);
    });
    // マウスダウンイベントを設定
    window.addEventListener(EVENT.TOUCH_START, function (e) {
        //スマホだったら
        if (ua != 'other') e = e.touches[0];
        startX = e.pageX - x;
        startY = e.pageY - y;
        mousedown = true;
    });
    // マウスアップイベントを設定
    window.addEventListener(EVENT.TOUCH_END, function (e) {
        mousedown = false;
        // 配列に保存しておく
        img_datas_arr[img_datas_cnt] = ctx.getImageData(0, 0, canvas.width, canvas.height);
        img_datas_cnt++;
    });
    // マウスムーブイベントを設定
    window.addEventListener(EVENT.TOUCH_MOVE, function (e) {
        //スマホだったら
        if (ua != 'other') e = e.touches[0];
        if (mousedown) draw(e.pageX - x, e.pageY - y);
    });
    // キャンバスに描く
    function draw(x, y) {
        var target = document.getElementById('canvas');
        var context = target.getContext('2d');
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(x, y);
        context.closePath();
        context.stroke();
        startX = x;
        startY = y;
    }
    //クリアボタンクリック時
    document.getElementById('delbt').addEventListener(EVENT.TOUCH_START, function (e) {
        ctx.drawImage(background, 0, 0, canvas.width, background.height * canvas.width / background.width);
        return false;
    });
    // 保存ボタンクリック時
    document.getElementById('savebt').addEventListener(EVENT.TOUCH_START, function (e) {
        //背景色
        ctx.globalCompositeOperation = 'destination-over';
        ctx.drawImage(background, 0, 0, canvas.width, background.height * canvas.width / background.width);
        // 要素のイベントをリセットしておく
        e.preventDefault();
        Fnk_SaveBt();
        //canvasの下に保存した画像表示する処理
        return false;
    });
    // canvas上のイメージを保存
    function Fnk_SaveBt() {
        // base64エンコード
        var base64 = canvas.toDataURL('image/jpeg');
        var blob = Base64toBlob(base64);

        // blobデータをa要素を使ってダウンロード
        saveBlob(blob, 'memo.jpg');
    }
    // Base64データをBlobデータに変換
    function Base64toBlob(base64) {
        // カンマで分割し、base64データの文字列をデコード
        var tmp = base64.split(',');
        var data = atob(tmp[1]);
        // tmp[0]の文字列（data:image/png;base64）からコンテンツタイプ（image/png）部分を取得
        var mime = tmp[0].split(':')[1].split(';')[0];
        //  1文字ごとにUTF-16コードを表す 0から65535 の整数を取得
        var buf = new Uint8Array(data.length);
        for (var i = 0; i < data.length; i++) buf[i] = data.charCodeAt(i);
        // blobデータを作成
        var blob = new Blob([buf], { type: mime });
        return blob;
    }
    // 画像のダウンロード
    function saveBlob(blob, fileName) {
        var url = (window.URL || window.webkitURL);
        // ダウンロード用のURL作成
        var dataUrl = url.createObjectURL(blob);
        // イベント作成
        var event = document.createEvent("MouseEvents");
        event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        // a要素を作成
        var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
        a.href = dataUrl;
        a.download = fileName;
        a.dispatchEvent(event);
    }
    // 色の反転
    function getTurningAround(color) {
        // 灰色は白にする
        if (color >= 88 && color <= 168) {
            return 255;
            // 色を反転する
        } else {
            return 255 - color;
        }
    }
    //矩形
    function OnMousedown() {
        rect_MousedownFlg = true;
        // 座標を求める
        var rect = event.target.getBoundingClientRect();
        rect_sx = rect_ex = event.clientX - rect.left;
        rect_sy = rect_ey = event.clientY - rect.top;
        // 矩形の枠色を反転させる
        var imagedata = ctx.getImageData(rect_sx, rect_sy, 1, 1);
        ctx.strokeStyle = 'rgb(' + getTurningAround(imagedata.data[0]) +
            ',' + getTurningAround(imagedata.data[1]) +
            ',' + getTurningAround(imagedata.data[2]) + ')';
        // 線の太さ
        ctx.lineWidth = 2;
        // 矩形の枠線を点線にする
        ctx.setLineDash([2, 3]);
    }
    function OnMousemove() {
        if (rect_MousedownFlg) {
            // 座標を求める
            var rect = event.target.getBoundingClientRect();
            rect_ex = event.clientX - rect.left;
            rect_ey = event.clientY - rect.top;
            // 元画像の再描画
            ctx.drawImage(image, 0, 0);
            // 矩形の描画
            ctx.beginPath();
            // 上
            ctx.moveTo(rect_sx, rect_sy);
            ctx.lineTo(rect_ex, rect_sy);
            // 下
            ctx.moveTo(rect_sx, rect_ey);
            ctx.lineTo(rect_ex, rect_ey);
            // 右
            ctx.moveTo(rect_ex, rect_sy);
            ctx.lineTo(rect_ex, rect_ey);
            // 左
            ctx.moveTo(rect_sx, rect_sy);
            ctx.lineTo(rect_sx, rect_ey);

            ctx.stroke();
        }
    }
    function OnMouseup() {
        // キャンバスの範囲外は無効にする
        if (rect_sx === rect_ex && rect_sy === rect_ey) {
            // 初期化
            //ctx.drawImage(image, 0, 0);
            rect_sx = rect_ex = 0;
            rect_sy = rect_ey = 0;
        }
        // 矩形の画像を取得する
        if (rect_MousedownFlg) {
            event.preventDefault();
            // base64エンコード
            var base64 = canvas.toDataURL('image/jpeg');
            var blob = Base64toBlob(base64);
            // blobデータをa要素を使ってダウンロード
            saveBlob(blob, 'report.jpg');
        }
        rect_MousedownFlg = false;
    }
});
