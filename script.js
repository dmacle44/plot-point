const canvas = document.getElementById('coordinate-plane');
const ctx = canvas.getContext('2d');
const checkBtn = document.getElementById('check-btn');
const newProblemBtn = document.getElementById('new-problem-btn');
const targetPointSpan = document.getElementById('target-point');
const feedbackDiv = document.getElementById('feedback');
const scoreSpan = document.getElementById('score');
const attemptsSpan = document.getElementById('attempts');

const CANVAS_SIZE = 550;
const PADDING = 25;
const GRID_SIZE = 20;
const DRAWABLE_SIZE = CANVAS_SIZE - (PADDING * 2);
const UNIT_SIZE = DRAWABLE_SIZE / GRID_SIZE;
const CENTER = CANVAS_SIZE / 2;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

let targetX = 0;
let targetY = 0;
let pointX = null;
let pointY = null;
let isDragging = false;
let score = 0;
let attempts = 0;

function drawGrid() {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        const pos = PADDING + i * UNIT_SIZE;
        ctx.beginPath();
        ctx.moveTo(pos, PADDING);
        ctx.lineTo(pos, CANVAS_SIZE - PADDING);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(PADDING, pos);
        ctx.lineTo(CANVAS_SIZE - PADDING, pos);
        ctx.stroke();
    }
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(CENTER, PADDING);
    ctx.lineTo(CENTER, CANVAS_SIZE - PADDING);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(PADDING, CENTER);
    ctx.lineTo(CANVAS_SIZE - PADDING, CENTER);
    ctx.stroke();
    
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = -10; i <= 10; i++) {
        if (i !== 0) {
            const x = CENTER + i * UNIT_SIZE;
            ctx.fillText(i.toString(), x, CENTER + 15);
        }
    }
    
    ctx.textAlign = 'right';
    for (let i = -10; i <= 10; i++) {
        if (i !== 0) {
            const y = CENTER - i * UNIT_SIZE;
            ctx.fillText(i.toString(), CENTER - 5, y);
        }
    }
    
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('0', CENTER + 5, CENTER + 15);
    
    ctx.font = 'bold 16px Arial';
    ctx.fillText('x', CANVAS_SIZE - PADDING, CENTER - 10);
    ctx.fillText('y', CENTER + 15, PADDING - 5);
}

function drawPoint(x, y, color = '#ff4444') {
    const canvasX = CENTER + x * UNIT_SIZE;
    const canvasY = CENTER - y * UNIT_SIZE;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function canvasToGrid(canvasX, canvasY) {
    const x = Math.round((canvasX - CENTER) / UNIT_SIZE);
    const y = Math.round((CENTER - canvasY) / UNIT_SIZE);
    return { x: Math.max(-10, Math.min(10, x)), y: Math.max(-10, Math.min(10, y)) };
}

function generateNewProblem() {
    targetX = Math.floor(Math.random() * 21) - 10;
    targetY = Math.floor(Math.random() * 21) - 10;
    targetPointSpan.textContent = `(${targetX}, ${targetY})`;
    
    pointX = null;
    pointY = null;
    
    feedbackDiv.textContent = '';
    feedbackDiv.className = 'feedback';
    checkBtn.style.display = 'block';
    newProblemBtn.style.display = 'none';
    
    drawGrid();
}

function updateDisplay() {
    drawGrid();
    if (pointX !== null && pointY !== null) {
        drawPoint(pointX, pointY);
    }
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    
    const gridPos = canvasToGrid(canvasX, canvasY);
    
    if (pointX !== null && pointY !== null) {
        const pointCanvasX = CENTER + pointX * UNIT_SIZE;
        const pointCanvasY = CENTER - pointY * UNIT_SIZE;
        const distance = Math.sqrt(Math.pow(canvasX - pointCanvasX, 2) + Math.pow(canvasY - pointCanvasY, 2));
        
        if (distance <= 15) {
            isDragging = true;
            canvas.style.cursor = 'grabbing';
        }
    } else {
        pointX = gridPos.x;
        pointY = gridPos.y;
        isDragging = true;
        canvas.style.cursor = 'grabbing';
        updateDisplay();
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const canvasX = e.clientX - rect.left;
        const canvasY = e.clientY - rect.top;
        
        const gridPos = canvasToGrid(canvasX, canvasY);
        pointX = gridPos.x;
        pointY = gridPos.y;
        
        updateDisplay();
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    canvas.style.cursor = 'grab';
});

canvas.addEventListener('mouseleave', () => {
    isDragging = false;
    canvas.style.cursor = 'grab';
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const canvasX = touch.clientX - rect.left;
    const canvasY = touch.clientY - rect.top;
    
    const gridPos = canvasToGrid(canvasX, canvasY);
    
    if (pointX !== null && pointY !== null) {
        const pointCanvasX = CENTER + pointX * UNIT_SIZE;
        const pointCanvasY = CENTER - pointY * UNIT_SIZE;
        const distance = Math.sqrt(Math.pow(canvasX - pointCanvasX, 2) + Math.pow(canvasY - pointCanvasY, 2));
        
        if (distance <= 15) {
            isDragging = true;
        }
    } else {
        pointX = gridPos.x;
        pointY = gridPos.y;
        isDragging = true;
        updateDisplay();
    }
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isDragging) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const canvasX = touch.clientX - rect.left;
        const canvasY = touch.clientY - rect.top;
        
        const gridPos = canvasToGrid(canvasX, canvasY);
        pointX = gridPos.x;
        pointY = gridPos.y;
        
        updateDisplay();
    }
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    isDragging = false;
});

checkBtn.addEventListener('click', () => {
    if (pointX === null || pointY === null) {
        feedbackDiv.textContent = 'Please place a point on the coordinate plane first!';
        feedbackDiv.className = 'feedback hint';
        return;
    }
    
    attempts++;
    attemptsSpan.textContent = attempts;
    
    if (pointX === targetX && pointY === targetY) {
        score++;
        scoreSpan.textContent = score;
        feedbackDiv.textContent = `Correct! The point (${targetX}, ${targetY}) is exactly where you placed it!`;
        feedbackDiv.className = 'feedback correct';
        checkBtn.style.display = 'none';
        newProblemBtn.style.display = 'block';
        
        drawGrid();
        drawPoint(pointX, pointY, '#22c55e');
    } else {
        feedbackDiv.textContent = `Not quite right. You placed the point at (${pointX}, ${pointY}). Try again!`;
        feedbackDiv.className = 'feedback incorrect';
        
        const xDiff = targetX - pointX;
        const yDiff = targetY - pointY;
        let hint = 'Hint: Move the point ';
        
        if (xDiff > 0) hint += `${Math.abs(xDiff)} unit(s) right`;
        else if (xDiff < 0) hint += `${Math.abs(xDiff)} unit(s) left`;
        
        if (xDiff !== 0 && yDiff !== 0) hint += ' and ';
        
        if (yDiff > 0) hint += `${Math.abs(yDiff)} unit(s) up`;
        else if (yDiff < 0) hint += `${Math.abs(yDiff)} unit(s) down`;
        
        if (xDiff !== 0 || yDiff !== 0) {
            feedbackDiv.textContent += ' ' + hint;
        }
    }
});

newProblemBtn.addEventListener('click', () => {
    generateNewProblem();
});

drawGrid();
generateNewProblem();