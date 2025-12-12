let eraseMode = false;     // false: 描く / true: 消しゴム
let eraseButton;

let currentColor;          // 現在のブラシ色（ベース色）
let colorButtons = [];     // 丸い色ボタンたち

function setup() {
  createCanvas(1080, 1920);
  clear();        // 透明キャンバス
  noStroke();

  // 16色パレット（自由に変更OK）
  let colors = [
    "#000000", // 0 黒
    "#FFFFFF", // 1 白
    "#FF0000", // 2 赤
    "#FFA500", // 3 オレンジ
    "#FFFF00", // 4 黄色
    "#00FF00", // 5 緑
    "#00FFFF", // 6 水色
    "#0000FF", // 7 青
    "#8A2BE2", // 8 紫
    "#FFC0CB", // 9 ピンク
    "#964B00", // 10 茶色
    "#A9A9A9", // 11 グレー
    "#FFDAB9", // 12 肌色1
    "#F5CBA7", // 13 肌色2
    "#7FFF00", // 14 黄緑
    "#191970"  // 15 紺
  ];

  // 最初の色（黒）にしておく
  currentColor = colors[0];

  // 消しゴムモード切り替えボタン
  eraseButton = createButton("🖌 描くモード");
  eraseButton.position(10, 10);
  eraseButton.mousePressed(toggleEraseMode);

  // 丸ボタンのレイアウト（2行×8列）
  const r = 12;                // 半径
  const cols = 8;
  const rows = 2;
  const startY = 350;
  const rowGap = 26;
  const marginX = 24;
  const spaceX = (width - marginX * 2) / (cols - 1);

  let idx = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (idx >= colors.length) break;
      let x = marginX + col * spaceX;
      let y = startY + row * rowGap;
      colorButtons.push({
        x,
        y,
        r,
        color: colors[idx]
      });
      idx++;
    }
  }
}

function toggleEraseMode() {
  eraseMode = !eraseMode;
  if (eraseMode) {
    eraseButton.html("🧽 消しゴムモード");
  } else {
    eraseButton.html("🖌 描くモード");
  }
}

function draw() {
  // 下部に色ボタンを再描画（UI）
  drawColorButtons();

  if (mouseIsPressed) {
    // 色ボタンの上を押しているときは描画・消去しない
    if (isOnColorButton(mouseX, mouseY)) return;

    if (eraseMode) {
      eraseBrush();   // 線の消しゴム
    } else {
      // 水彩風＆にじみブラシ
      for (let i = 0; i < 200; i++) {
        paintBrush();
      }
    }
  }
}

// 🌸 水彩＋にじみ＋少し光るブラシ
// 🌸 水彩＋にじみ＋少し光るブラシ
function paintBrush() {
  let x = randomGaussian(mouseX, 18);
  let y = randomGaussian(mouseY, 18);

  let base = random(3, 30);
  let w = base * random(0.5, 1.4);
  let h = base * random(0.5, 1.4);

  // Glow（発光）はベース色で
  drawingContext.shadowBlur = random(10, 35);
  drawingContext.shadowColor = currentColor;

  // ベース色から“水彩風にじみ色”を作る
  let c = getWatercolorColor(currentColor);

  noStroke();
  fill(c);
  ellipse(x, y, w, h);
}

// 🎨 ベース色から「水彩っぽい揺らいだ色」を作る
function getWatercolorColor(baseHex) {
  // ベース色を p5.Color に変換
  let base = color(baseHex);

  // 元のRGB
  let r = red(base);
  let g = green(base);
  let b = blue(base);

  // 少しだけ色を揺らす（±20〜30くらい）
  let jitter = 25;
  r = constrain(r + random(-jitter, jitter), 0, 255);
  g = constrain(g + random(-jitter, jitter), 0, 255);
  b = constrain(b + random(-jitter, jitter), 0, 255);

  // 透明度もランダムで水彩感アップ
  let alpha = random(25, 90); // 0〜255

  return color(r, g, b, alpha);
}



// 🧽 線の消しゴム（ギザギザしない）
function eraseBrush() {
  erase(255);                    // 透明で塗るモード
  drawingContext.shadowBlur = 0; // 消しゴムはぼかしオフ

  strokeWeight(40);              // 消しゴムの太さ
  stroke(0);                     // 色はなんでもOK（erase中は透明扱い）
  noFill();
  line(pmouseX, pmouseY, mouseX, mouseY);

  noErase();                     // 通常描画に戻す
}

// 🎨 丸い色ボタン描画
function drawColorButtons() {
  // ボタン背景の薄いバー
  noStroke();
  drawingContext.shadowBlur = 0;
  fill(255, 255, 255, 200);
  rect(0, 336, width, 64);

  // 各ボタン
  for (let i = 0; i < colorButtons.length; i++) {
    let b = colorButtons[i];

    // 選択中の色なら枠を太く・濃く
    if (currentColor === b.color) {
      stroke(0);
      strokeWeight(2);
    } else {
      stroke(80, 80, 80, 120);
      strokeWeight(1);
    }

    fill(b.color);
    ellipse(b.x, b.y, b.r * 2, b.r * 2);
  }
}

// 🔍 マウスが色ボタン上か判定
function isOnColorButton(mx, my) {
  for (let i = 0; i < colorButtons.length; i++) {
    let b = colorButtons[i];
    let d = dist(mx, my, b.x, b.y);
    if (d < b.r) return true;
  }
  return false;
}

// 🖱 クリック時：色ボタンが押されたか判定して色変更
function mousePressed() {
  // キャンバス外は無視
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

  for (let i = 0; i < colorButtons.length; i++) {
    let b = colorButtons[i];
    let d = dist(mouseX, mouseY, b.x, b.y);
    if (d < b.r) {
      currentColor = b.color;
      // 色を選んだら描くモードに戻したい場合は以下をON
      // eraseMode = false;
      // eraseButton.html("🖌 描くモード");
      return;
    }
  }
}
