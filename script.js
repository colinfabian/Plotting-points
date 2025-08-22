// Interactive Coordinate Plotter
const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
const size = 500;
const min = -10, max = 10;
const step = (size - 40) / (max - min); // 20px margin
const origin = { x: size / 2, y: size / 2 };

let dot = { x: 0, y: 0 };
let dragging = false;
let target = randomCoord();

function drawGrid() {
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(origin.x, origin.y);

  // Draw grid lines
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1;
  for (let i = min; i <= max; i++) {
    // Vertical grid lines (x = i)
    ctx.beginPath();
    ctx.moveTo(i * step, -size / 2 + 20);
    ctx.lineTo(i * step, size / 2 - 20);
    ctx.stroke();
    // Horizontal grid lines (y = i)
    ctx.beginPath();
    ctx.moveTo(-size / 2 + 20, -i * step);
    ctx.lineTo(size / 2 - 20, -i * step);
    ctx.stroke();
  }

  // Draw axes
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  // x-axis
  ctx.beginPath();
  ctx.moveTo(-size/2 + 20 - origin.x, 0);
  ctx.lineTo(size/2 - 20 - origin.x, 0);
  ctx.stroke();
  // y-axis
  ctx.beginPath();
  ctx.moveTo(0, -size/2 + 20 - origin.y);
  ctx.lineTo(0, size/2 - 20 - origin.y);
  ctx.stroke();

  // Draw dashes and labels
  ctx.font = '13px Arial';
  ctx.fillStyle = '#222';
  for (let i = min; i <= max; i++) {
    if (i === 0) continue;
    // X axis dashes and labels
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    let x = i * step;
    ctx.beginPath();
    ctx.moveTo(x, -5);
    ctx.lineTo(x, 5);
    ctx.strokeStyle = '#222';
    ctx.stroke();
    ctx.fillText(i, x, 8);
    ctx.restore();
    // Y axis dashes and labels
    ctx.save();
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    let y = -i * step;
    ctx.beginPath();
    ctx.moveTo(-5, y);
    ctx.lineTo(5, y);
    ctx.strokeStyle = '#222';
    ctx.stroke();
    ctx.fillText(i, -10, y);
    ctx.restore();
  }
  ctx.restore();
}

function drawDot() {
  ctx.save();
  ctx.translate(origin.x, origin.y);
  let px = dot.x * step, py = -dot.y * step;
  ctx.beginPath();
  ctx.arc(px, py, 10, 0, 2 * Math.PI);
  ctx.fillStyle = dragging ? '#1976d2' : '#e53935';
  ctx.shadowColor = '#0006';
  ctx.shadowBlur = 6;
  ctx.fill();
  ctx.restore();
}

function render() {
  drawGrid();
  drawDot();
}

function randomCoord() {
  let x = Math.floor(Math.random() * 21) - 10;
  let y = Math.floor(Math.random() * 21) - 10;
  return { x, y };
}

function updateTarget() {
  target = randomCoord();
  document.getElementById('target').textContent = `Target: (${target.x}, ${target.y})`;
  document.getElementById('result').textContent = '';
  dot = { x: 0, y: 0 };
  render();
}

canvas.addEventListener('mousedown', e => {
  const { x, y } = getMouseCoord(e);
  if (Math.abs(x - dot.x) <= 0.5 && Math.abs(y - dot.y) <= 0.5) {
    dragging = true;
  }
});
canvas.addEventListener('mousemove', e => {
  if (!dragging) return;
  let { x, y } = getMouseCoord(e);
  // Snap to nearest integer
  x = Math.round(x);
  y = Math.round(y);
  // Clamp to grid
  x = Math.max(min, Math.min(max, x));
  y = Math.max(min, Math.min(max, y));
  dot = { x, y };
  render();
});
canvas.addEventListener('mouseup', () => { dragging = false; render(); });
canvas.addEventListener('mouseleave', () => { dragging = false; render(); });

function getMouseCoord(e) {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left - origin.x;
  const my = e.clientY - rect.top - origin.y;
  let x = Math.round(mx / step);
  let y = Math.round(-my / step);
  return { x, y };
}

document.getElementById('checkBtn').onclick = function() {
  if (dot.x === target.x && dot.y === target.y) {
    document.getElementById('result').textContent = 'Correct! New target...';
    setTimeout(updateTarget, 1000);
  } else {
    document.getElementById('result').textContent = 'Try again!';
  }
};

updateTarget();
render();
