// ===== Password Generator Logic =====
let lengthDisplay = document.querySelector("[lengthDisplay]");
let slider = document.querySelector("input[type=range]");
let passwordLength = 10;
let password = "";
let checkBoxes = document.querySelectorAll("input[type=checkbox]");
let generateBtn = document.querySelector("#generateBtn");
let passwordDisplay = document.querySelector("input[passwordDisplay]");
let copyMessage = document.querySelector("[copyMessage]");
let copyBtn = document.querySelector(".copyBtn");
let indicator = document.querySelector(".indicator");

const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols");

const symbol = "~`!@#$%^&*()_-+={[}]|:;\"<,>.?/";

// Update slider
function handleSlider() {
  slider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}
handleSlider();

slider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

function generateRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomLowercase() {
  return String.fromCharCode(generateRandom(97, 123));
}

function generateRandomUppercase() {
  return String.fromCharCode(generateRandom(65, 91));
}

function generateRandomNumber() {
  return generateRandom(0, 10);
}

function generateRandomSymbol() {
  return symbol[generateRandom(0, symbol.length)];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = generateRandom(0, i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

function calcStrength() {
  const hasUpper = uppercase.checked;
  const hasLower = lowercase.checked;
  const hasNumber = numbers.checked;
  const hasSymbol = symbols.checked;

  if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if ((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordLength >= 6) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}
setIndicator("#ccc");

function handleCheckBoxChange() {
  let checkCount = 0;
  checkBoxes.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}
checkBoxes.forEach((cb) => cb.addEventListener("change", handleCheckBoxChange));

generateBtn.addEventListener("click", () => {
  let arrayOfFuncs = [];

  if (uppercase.checked) arrayOfFuncs.push(generateRandomUppercase);
  if (lowercase.checked) arrayOfFuncs.push(generateRandomLowercase);
  if (numbers.checked) arrayOfFuncs.push(generateRandomNumber);
  if (symbols.checked) arrayOfFuncs.push(generateRandomSymbol);

  if (arrayOfFuncs.length === 0) return;

  password = "";

  for (let i = 0; i < arrayOfFuncs.length; i++) {
    password += arrayOfFuncs[i]();
  }
  for (let i = 0; i < passwordLength - arrayOfFuncs.length; i++) {
    let randIndex = generateRandom(0, arrayOfFuncs.length);
    password += arrayOfFuncs[randIndex]();
  }

  password = shuffle(Array.from(password));
  passwordDisplay.value = password;
  calcStrength();
});

copyBtn.addEventListener("click", async () => {
  if (!passwordDisplay.value) return;
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMessage.innerText = "Copied";
  } catch (e) {
    copyMessage.innerText = "Failed";
  }
  copyMessage.classList.add("active");
  setTimeout(() => copyMessage.classList.remove("active"), 2000);
});

// ===== Animated Canvas Dots Background =====
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let dots = [];
const mouse = { x: null, y: null, radius: 120 };

for (let i = 0; i < 150; i++) {
  dots.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
  });
}

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

function animateDots() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < dots.length; i++) {
    let d = dots[i];
    d.x += d.vx;
    d.y += d.vy;
    if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
    if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

    ctx.beginPath();
    ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fill();

    for (let j = i + 1; j < dots.length; j++) {
      let d2 = dots[j];
      let dx = d.x - d2.x;
      let dy = d.y - d2.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d2.x, d2.y);
        ctx.strokeStyle = `rgba(255,255,255,${1 - dist / 100})`;
        ctx.stroke();
      }
    }

    if (mouse.x && mouse.y) {
      let dx = d.x - mouse.x;
      let dy = d.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(255,255,255,${1 - dist / mouse.radius})`;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateDots);
}
animateDots();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
