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

  eraseButton = createButton("🖌 おえかき");
  eraseButton.position(16, 16);
  eraseButton.style("font-size", "20px");
  eraseButton.style("padding", "12px 18px");
  eraseButton.style("border-radius", "12px");
  eraseButton.mousePressed(toggleEraseMode); // ✅ これが必要

  layoutPalette();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  layoutPalette();
}

function layoutPalette() {
  colorButtons = [];

  const startX = 240;
  const y = 44;
  const r = 26;
  const gap = 20;

  for (let i = 0; i < colors.length; i++) {
    let x = startX + i * (r * 2 + gap);
    colorButtons.push({ x, y, r, color: colors[i] });
  }
}

function toggleEraseMode() {
  eraseMode = !eraseMode;
  eraseButton.html(eraseMode ? "🧽 消しゴム" : "🖌 おえかき");
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

// 🧽 消しゴム（線）
function eraseBrush() {
  erase(255);
  drawingContext.shadowBlur = 0;

  strokeWeight(40);
  stroke(0);
  noFill();
  line(pmouseX, pmouseY, mouseX, mouseY);

  noErase();
}

// 🎨 パレット描画（背景なし）✅ 関数として復活させる
function drawColorButtons() {
  drawingContext.shadowBlur = 0;

  for (let i = 0; i < colorButtons.length; i++) {
    let b = colorButtons[i];

    if (currentColor === b.color) {
      stroke(0);
      strokeWeight(4);
    } else {
      stroke(100, 100, 100, 120);
      strokeWeight(2);
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
