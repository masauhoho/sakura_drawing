let eraseMode = false;
let eraseButton;

let currentColor;
let colorButtons = [];

let colors = [
  "#000000", "#FFFFFF", "#FF0000", "#FFA500",
  "#FFFF00", "#00FF00", "#00FFFF", "#0000FF",
  "#8A2BE2", "#FFC0CB", "#964B00", "#A9A9A9",
  "#FFDAB9", "#F5CBA7", "#7FFF00", "#191970"
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  clear();
  noStroke();

  currentColor = colors[0];

  // ✅ ボタン：大きく＆上に余白（スマホで押しやすい）
  eraseButton = createButton("🖌 おえかき");
  eraseButton.position(20, 24);              // ← 上に余白
  eraseButton.style("font-size", "26px");    // ← 文字大
  eraseButton.style("padding", "18px 24px"); // ← 押しやすい
  eraseButton.style("border-radius", "16px");
  eraseButton.style("border", "2px solid rgba(0,0,0,0.25)");
  eraseButton.style("background", "rgba(255,255,255,0.9)");
  eraseButton.mousePressed(toggleEraseMode);

  layoutPalette();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  layoutPalette();
}

function toggleEraseMode() {
  eraseMode = !eraseMode;
  eraseButton.html(eraseMode ? "🧽 消しゴム" : "🖌 おえかき");
}

function layoutPalette() {
  colorButtons = [];

  // ==== パレット設定（大きめ + 間隔広め）====
  const r = 34;     // 円の半径（直径68px）
  const gapY = 32;  // 縦の間隔（もっと広げた）
  const gapX = 44;  // 列間の間隔（もっと広げた）
  const cols = 2;   // 2列
  const total = colors.length;
  const rows = Math.ceil(total / cols);

  // ==== ボタンの位置・サイズをDOMから取得して「真下」に置く ====
  const bx = parseFloat(eraseButton.position().x) || 20;
  const by = parseFloat(eraseButton.position().y) || 24;
  const bw = eraseButton.elt ? eraseButton.elt.offsetWidth : 220;
  const bh = eraseButton.elt ? eraseButton.elt.offsetHeight : 80;

  const marginUnderButton = 26; // ボタンの下の余白（ここ増やすともっと離れる）

  // パレット全体の横幅（2列ぶん）
  const paletteW = cols * (r * 2) + gapX;

  // ボタンの中央にパレットを揃えて、ボタンの真下に配置
  const startX = bx + (bw - paletteW) / 2 + r;  // ellipse中心基準なので +r
  const startY = by + bh + marginUnderButton + r;

  let idx = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (idx >= total) return;

      const x = startX + col * (r * 2 + gapX);
      const y = startY + row * (r * 2 + gapY);

      colorButtons.push({ x, y, r, color: colors[idx] });
      idx++;
    }
  }
}

function draw() {
  drawColorButtons();

  if (mouseIsPressed) {
    if (isOnColorButton(mouseX, mouseY)) return;

    if (eraseMode) {
      eraseBrush();
    } else {
      for (let i = 0; i < 200; i++) paintBrush();
    }
  }
}

// 🌸 水彩ブラシ
function paintBrush() {
  let x = randomGaussian(mouseX, 18);
  let y = randomGaussian(mouseY, 18);

  let base = random(3, 30);
  let w = base * random(0.5, 1.4);
  let h = base * random(0.5, 1.4);

  drawingContext.shadowBlur = random(10, 35);
  drawingContext.shadowColor = currentColor;

  let c = getWatercolorColor(currentColor);

  noStroke();
  fill(c);
  ellipse(x, y, w, h);
}

function getWatercolorColor(baseHex) {
  let base = color(baseHex);
  let r = red(base), g = green(base), b = blue(base);

  let jitter = 25;
  r = constrain(r + random(-jitter, jitter), 0, 255);
  g = constrain(g + random(-jitter, jitter), 0, 255);
  b = constrain(b + random(-jitter, jitter), 0, 255);

  let alpha = random(25, 90);
  return color(r, g, b, alpha);
}

// 🧽 消しゴム
function eraseBrush() {
  erase(255);
  drawingContext.shadowBlur = 0;

  strokeWeight(50); // ← スマホ用に少し太く
  stroke(0);
  noFill();
  line(pmouseX, pmouseY, mouseX, mouseY);

  noErase();
}

// 🎨 パレット描画（背景なし）
function drawColorButtons() {
  drawingContext.shadowBlur = 0;

  for (let i = 0; i < colorButtons.length; i++) {
    let b = colorButtons[i];

    if (currentColor === b.color) {
      stroke(0);
      strokeWeight(5);  // ← 選択中を分かりやすく
    } else {
      stroke(80, 80, 80, 140);
      strokeWeight(3);
    }

    fill(b.color);
    ellipse(b.x, b.y, b.r * 2, b.r * 2);
  }
}

function isOnColorButton(mx, my) {
  for (let i = 0; i < colorButtons.length; i++) {
    let b = colorButtons[i];
    if (dist(mx, my, b.x, b.y) < b.r) return true;
  }
  return false;
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

  for (let i = 0; i < colorButtons.length; i++) {
    let b = colorButtons[i];
    if (dist(mouseX, mouseY, b.x, b.y) < b.r) {
      currentColor = b.color;
      return;
    }
  }
}
