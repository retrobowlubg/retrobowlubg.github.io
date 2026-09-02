/*
 * Tetrys - modern Tetris engine
 * Rewritten to add: ghost piece, hold piece, hard/soft drop, SRS-style rotation
 * with wall kicks, 7-bag randomizer, standard scoring/leveling, line/rows
 * tracking, Marathon + Sprint (40 lines) modes, achievements, and sound.
 * Old implementation kept at tetrys.legacy.js / index.legacy.html for reference.
 */
(function () {
  'use strict';

  /* ============ Constants ============ */
  var COLS = 10, ROWS = 20, BLOCK = 24;
  var COLORS = { I: '#31C7EF', O: '#F7D308', T: '#AD4D9C', S: '#42B642', Z: '#EF2029', J: '#5A65AD', L: '#EF7921' };

  var SHAPES = {
    I: [[[0, 1], [1, 1], [2, 1], [3, 1]], [[2, 0], [2, 1], [2, 2], [2, 3]], [[0, 2], [1, 2], [2, 2], [3, 2]], [[1, 0], [1, 1], [1, 2], [1, 3]]],
    O: [[[1, 0], [2, 0], [1, 1], [2, 1]], [[1, 0], [2, 0], [1, 1], [2, 1]], [[1, 0], [2, 0], [1, 1], [2, 1]], [[1, 0], [2, 0], [1, 1], [2, 1]]],
    T: [[[1, 0], [0, 1], [1, 1], [2, 1]], [[1, 0], [1, 1], [2, 1], [1, 2]], [[0, 1], [1, 1], [2, 1], [1, 2]], [[1, 0], [0, 1], [1, 1], [1, 2]]],
    S: [[[1, 0], [2, 0], [0, 1], [1, 1]], [[1, 0], [1, 1], [2, 1], [2, 2]], [[1, 1], [2, 1], [0, 2], [1, 2]], [[0, 0], [0, 1], [1, 1], [1, 2]]],
    Z: [[[0, 0], [1, 0], [1, 1], [2, 1]], [[2, 0], [1, 1], [2, 1], [1, 2]], [[0, 1], [1, 1], [1, 2], [2, 2]], [[1, 0], [0, 1], [1, 1], [0, 2]]],
    J: [[[0, 0], [0, 1], [1, 1], [2, 1]], [[1, 0], [2, 0], [1, 1], [1, 2]], [[0, 1], [1, 1], [2, 1], [2, 2]], [[1, 0], [1, 1], [0, 2], [1, 2]]],
    L: [[[2, 0], [0, 1], [1, 1], [2, 1]], [[1, 0], [1, 1], [1, 2], [2, 2]], [[0, 1], [1, 1], [2, 1], [0, 2]], [[0, 0], [1, 0], [1, 1], [1, 2]]]
  };

  // Standard SRS wall-kick offsets, converted to a y-down coordinate system.
  var KICKS_JLSTZ = {
    '0>1': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    '1>0': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    '1>2': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    '2>1': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    '2>3': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    '3>2': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    '3>0': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    '0>3': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]]
  };
  var KICKS_I = {
    '0>1': [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
    '1>0': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
    '1>2': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
    '2>1': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
    '2>3': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
    '3>2': [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
    '3>0': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
    '0>3': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]]
  };

  var PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

  var SOUNDS = {
    move: 'sounds/move.mp3',
    rotate: 'sounds/rotate.mp3',
    drop: 'sounds/drop.mp3',
    clear: 'sounds/clear.mp3',
    levelup: 'sounds/levelup.mp3',
    gameover: 'sounds/gameover.mp3',
    achievement: 'sounds/powerup.mp3'
  };

  var ACHIEVEMENTS = [
    { id: 'first_clear', name: 'First Clear', desc: 'Clear your first line.' },
    { id: 'tetris', name: 'Tetris!', desc: 'Clear 4 lines at once.' },
    { id: 'combo3', name: 'Combo Master', desc: 'Reach a 3x combo.' },
    { id: 'perfect_clear', name: 'Perfect Clear', desc: 'Clear the entire board.' },
    { id: 'level10', name: 'Level 10', desc: 'Reach level 10.' },
    { id: 'sprint_finish', name: 'Sprint Finisher', desc: 'Complete a 40-line sprint.' }
  ];

  var LOCK_DELAY = 500;
  var MAX_LOCK_RESETS = 15;
  var SOFT_DROP_INTERVAL = 35;

  /* ============ State ============ */
  var canvas, ctx, nextCanvas, nextCtx, holdCanvas, holdCtx;
  var arena;
  var current, holdType = null, holdUsed = false;
  var bag = [], nextType = null;
  var score = 0, level = 1, linesCleared = 0, highScore = 0;
  var combo = -1, lastClearWasTetris = false;
  var gameOver = false, sprintComplete = false, isPaused = false;
  var dropAccumulator = 0, dropInterval = 1000;
  var onGround = false, lockTimer = 0, lockResets = 0;
  var softDropping = false;
  var dasTimer = 0, dasDelay = 170, dasInterval = 40, dasDirection = 0;
  var mode = 'marathon';
  var sprintElapsedMs = 0, sprintBestMs = null;
  var volume = 0.7;
  var achievementsUnlocked = {};
  var toastQueue = [], toastActive = false;
  var lastTime = 0;
  var els = {};

  window.addEventListener('load', init);

  function init() {
    canvas = document.getElementById('canvas'); ctx = canvas.getContext('2d');
    nextCanvas = document.getElementById('nextCanvas'); nextCtx = nextCanvas.getContext('2d');
    holdCanvas = document.getElementById('holdCanvas'); holdCtx = holdCanvas.getContext('2d');

    els.scoreVal = document.getElementById('scoreVal');
    els.highScoreVal = document.getElementById('highScoreVal');
    els.levelVal = document.getElementById('levelVal');
    els.rowsVal = document.getElementById('rowsVal');
    els.heldLabel = document.getElementById('heldLabel');
    els.timeRow = document.getElementById('timeRow');
    els.timeVal = document.getElementById('timeVal');
    els.bestRow = document.getElementById('bestRow');
    els.bestVal = document.getElementById('bestVal');
    els.overlay = document.getElementById('overlay');
    els.overlayTitle = document.getElementById('overlayTitle');
    els.overlaySubtitle = document.getElementById('overlaySubtitle');
    els.overlayHint = document.getElementById('overlayHint');
    els.toast = document.getElementById('toast');
    els.pauseIcon = document.getElementById('pauseIcon');
    els.settingsModal = document.getElementById('settingsModal');
    els.confirmModal = document.getElementById('confirmModal');
    els.volumeSlider = document.getElementById('volumeSlider');
    els.modeMarathon = document.getElementById('modeMarathon');
    els.modeSprint = document.getElementById('modeSprint');

    loadSettings();
    loadAchievements();

    if (!loadState()) {
      startNewGame();
    } else {
      updateStatsUI();
    }

    bindUI();
    bindKeyboard();

    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  /* ============ Game setup ============ */
  function createArena() {
    var m = [];
    for (var r = 0; r < ROWS; r++) m.push(new Array(COLS).fill(0));
    return m;
  }

  function startNewGame() {
    arena = createArena();
    bag = [];
    holdType = null; holdUsed = false;
    score = 0; level = 1; linesCleared = 0;
    combo = -1; lastClearWasTetris = false;
    gameOver = false; sprintComplete = false; isPaused = false;
    dropAccumulator = 0; onGround = false; lockTimer = 0; lockResets = 0;
    sprintElapsedMs = 0;
    updateDropInterval();
    nextType = drawFromBag();
    spawnPiece();
    renderHoldPreview();
    saveState();
    updateStatsUI();
    hideOverlay();
  }

  function drawFromBag() {
    if (bag.length === 0) {
      bag = PIECE_TYPES.slice();
      for (var i = bag.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = bag[i]; bag[i] = bag[j]; bag[j] = t;
      }
    }
    return bag.pop();
  }

  function makePiece(type) {
    var cells = SHAPES[type][0];
    var minRow = Math.min.apply(null, cells.map(function (c) { return c[1]; }));
    return { type: type, rotation: 0, x: 3, y: -minRow };
  }

  function spawnPiece() {
    current = makePiece(nextType);
    nextType = drawFromBag();
    holdUsed = false;
    onGround = false; lockTimer = 0; lockResets = 0; dropAccumulator = 0;
    if (collides(current)) {
      triggerGameOver();
    }
    renderNextPreview();
  }

  /* ============ Collision & movement ============ */
  function getCells(piece) { return SHAPES[piece.type][piece.rotation]; }

  function collides(piece) {
    var cells = getCells(piece);
    for (var i = 0; i < cells.length; i++) {
      var cx = piece.x + cells[i][0];
      var cy = piece.y + cells[i][1];
      if (cx < 0 || cx >= COLS || cy >= ROWS) return true;
      if (cy >= 0 && arena[cy][cx] !== 0) return true;
    }
    return false;
  }

  function isOnGround(piece) {
    return collides({ type: piece.type, rotation: piece.rotation, x: piece.x, y: piece.y + 1 });
  }

  function moveHorizontal(dir) {
    if (gameOver || sprintComplete || isPaused) return;
    var test = { type: current.type, rotation: current.rotation, x: current.x + dir, y: current.y };
    if (!collides(test)) {
      current = test;
      playSound('move');
      handleGroundedMoveReset();
      saveState();
    }
  }

  function tryRotate(dir) {
    if (gameOver || sprintComplete || isPaused || current.type === 'O') return;
    var from = current.rotation;
    var to = (from + dir + 4) % 4;
    var table = (current.type === 'I' ? KICKS_I : KICKS_JLSTZ)[from + '>' + to] || [[0, 0]];
    for (var i = 0; i < table.length; i++) {
      var dx = table[i][0], dy = table[i][1];
      var test = { type: current.type, rotation: to, x: current.x + dx, y: current.y + dy };
      if (!collides(test)) {
        current = test;
        playSound('rotate');
        handleGroundedMoveReset();
        saveState();
        return;
      }
    }
  }

  function handleGroundedMoveReset() {
    if (isOnGround(current)) {
      if (lockResets < MAX_LOCK_RESETS) {
        lockTimer = 0;
        lockResets++;
      }
    } else {
      lockTimer = 0; lockResets = 0;
    }
  }

  function hardDrop() {
    if (gameOver || sprintComplete || isPaused) return;
    var dist = 0;
    while (!collides({ type: current.type, rotation: current.rotation, x: current.x, y: current.y + 1 })) {
      current.y++; dist++;
    }
    score += dist * 2;
    playSound('drop');
    lockPiece();
  }

  function computeGhostY() {
    var y = current.y;
    while (!collides({ type: current.type, rotation: current.rotation, x: current.x, y: y + 1 })) y++;
    return y;
  }

  function lockPiece() {
    var cells = getCells(current);
    var blockedOut = false;
    for (var i = 0; i < cells.length; i++) {
      var cx = current.x + cells[i][0];
      var cy = current.y + cells[i][1];
      if (cy < 0) { blockedOut = true; continue; }
      if (arena[cy]) arena[cy][cx] = current.type;
    }
    if (blockedOut) { triggerGameOver(); return; }
    clearLines();
    if (!gameOver && !sprintComplete) spawnPiece();
    saveState();
  }

  function clearLines() {
    var cleared = 0;
    for (var r = ROWS - 1; r >= 0; r--) {
      if (arena[r].every(function (v) { return v !== 0; })) {
        arena.splice(r, 1);
        arena.unshift(new Array(COLS).fill(0));
        cleared++;
        r++;
      }
    }
    if (cleared > 0) {
      var wasFirstEver = linesCleared === 0;
      combo++;
      linesCleared += cleared;
      var table = [0, 100, 300, 500, 800];
      var base = table[cleared] * level;
      var isTetris = cleared === 4;
      if (isTetris && lastClearWasTetris) base = Math.round(base * 1.5);
      var comboBonus = combo > 0 ? 50 * combo * level : 0;
      var perfect = arena.every(function (row) { return row.every(function (v) { return v === 0; }); });
      var perfectBonus = perfect ? 1000 * level : 0;
      score += base + comboBonus + perfectBonus;
      lastClearWasTetris = isTetris;
      playSound('clear');

      var newLevel = Math.floor(linesCleared / 10) + 1;
      if (newLevel > level) {
        level = newLevel;
        updateDropInterval();
        playSound('levelup');
        showToast('Level ' + level + '!');
      }
      if (isTetris) showToast('Tetris!');
      if (perfect) { showToast('Perfect Clear!'); unlockAchievement('perfect_clear'); }
      if (wasFirstEver) unlockAchievement('first_clear');
      if (isTetris) unlockAchievement('tetris');
      if (combo >= 3) unlockAchievement('combo3');
      if (level >= 10) unlockAchievement('level10');

      if (mode === 'sprint' && linesCleared >= 40) finishSprint();
    } else {
      combo = -1;
    }
    updateStatsUI();
  }

  function updateDropInterval() {
    dropInterval = Math.max(1000 - (level - 1) * 70, 80);
  }

  /* ============ Hold ============ */
  function holdCurrent() {
    if (gameOver || sprintComplete || isPaused || holdUsed) return;
    var currentType = current.type;
    if (holdType === null) {
      holdType = currentType;
      current = makePiece(nextType);
      nextType = drawFromBag();
      renderNextPreview();
    } else {
      var temp = holdType;
      holdType = currentType;
      current = makePiece(temp);
    }
    holdUsed = true;
    onGround = false; lockTimer = 0; lockResets = 0; dropAccumulator = 0;
    playSound('move');
    renderHoldPreview();
    if (collides(current)) triggerGameOver();
    saveState();
  }

  /* ============ Game over / sprint finish ============ */
  function triggerGameOver() {
    gameOver = true;
    isPaused = false;
    showOverlay('Game Over!', 'Score: ' + score + '   Level: ' + level + '   Rows: ' + linesCleared, 'Press any key to restart');
    saveState();
  }

  function finishSprint() {
    sprintComplete = true;
    var time = sprintElapsedMs;
    var improved = sprintBestMs === null || time < sprintBestMs;
    if (improved) {
      sprintBestMs = time;
      localStorage.setItem('tetrys2_sprintbest', String(sprintBestMs));
    }
    unlockAchievement('sprint_finish');
    playSound('levelup');
    showOverlay('Sprint Over!', 'Time: ' + formatTime(time) + (improved ? '   (New Best!)' : ''), 'Press any key to restart');
    saveState();
  }

  /* ============ Main loop ============ */
  function loop(time) {
    var dt = time - lastTime;
    lastTime = time;
    if (dt > 200) dt = 200;

    if (!gameOver && !sprintComplete && !isPaused) {
      updateDAS(dt);

      if (mode === 'sprint') sprintElapsedMs += dt;

      var interval = softDropping ? Math.min(dropInterval, SOFT_DROP_INTERVAL) : dropInterval;
      dropAccumulator += dt;
      if (dropAccumulator >= interval) {
        dropAccumulator = 0;
        var test = { type: current.type, rotation: current.rotation, x: current.x, y: current.y + 1 };
        if (!collides(test)) {
          current = test;
          if (softDropping) score += 1;
          onGround = false; lockTimer = 0;
        } else {
          onGround = true;
        }
      }

      if (onGround) {
        lockTimer += dt;
        if (lockTimer >= LOCK_DELAY) {
          lockPiece();
        }
      }
    }

    render();
    updateStatsUI();
    requestAnimationFrame(loop);
  }

  function updateDAS(dt) {
    if (dasDirection === 0) return;
    dasTimer += dt;
    if (dasTimer >= dasDelay) {
      while (dasTimer >= dasDelay + dasInterval) {
        moveHorizontal(dasDirection);
        dasTimer -= dasInterval;
      }
    }
  }

  /* ============ Rendering ============ */
  function render() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawArena();
    if (!gameOver && !sprintComplete) {
      drawGhost();
      drawPiece(ctx, current, current.x, current.y, 1);
    }
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var cx = c * BLOCK + BLOCK / 2, cy = r * BLOCK + BLOCK / 2;
        ctx.beginPath();
        ctx.moveTo(cx - 3, cy); ctx.lineTo(cx + 3, cy);
        ctx.moveTo(cx, cy - 3); ctx.lineTo(cx, cy + 3);
        ctx.stroke();
      }
    }
  }

  function drawArena() {
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var v = arena[r][c];
        if (v !== 0) drawBlock(ctx, c, r, COLORS[v]);
      }
    }
  }

  function drawBlock(context, col, row, color, alpha) {
    var x = col * BLOCK, y = row * BLOCK;
    context.globalAlpha = alpha === undefined ? 1 : alpha;
    context.fillStyle = color;
    context.fillRect(x + 1, y + 1, BLOCK - 2, BLOCK - 2);
    context.globalAlpha = 1;
  }

  function drawPiece(context, piece, ox, oy, alpha) {
    var cells = getCells(piece);
    for (var i = 0; i < cells.length; i++) {
      var cx = ox + cells[i][0], cy = oy + cells[i][1];
      if (cy >= 0) drawBlock(context, cx, cy, COLORS[piece.type], alpha);
    }
  }

  function drawGhost() {
    var ghostY = computeGhostY();
    if (ghostY === current.y) return;
    var cells = getCells(current);
    for (var i = 0; i < cells.length; i++) {
      var cx = current.x + cells[i][0], cy = ghostY + cells[i][1];
      if (cy >= 0) {
        ctx.strokeStyle = COLORS[current.type];
        ctx.globalAlpha = 0.5;
        ctx.strokeRect(cx * BLOCK + 2, cy * BLOCK + 2, BLOCK - 4, BLOCK - 4);
        ctx.globalAlpha = 1;
      }
    }
  }

  function renderPreview(context, canvasEl, type) {
    context.clearRect(0, 0, canvasEl.width, canvasEl.height);
    if (!type) return;
    var cells = SHAPES[type][0];
    var minX = Math.min.apply(null, cells.map(function (c) { return c[0]; }));
    var maxX = Math.max.apply(null, cells.map(function (c) { return c[0]; }));
    var minY = Math.min.apply(null, cells.map(function (c) { return c[1]; }));
    var maxY = Math.max.apply(null, cells.map(function (c) { return c[1]; }));
    var w = maxX - minX + 1, h = maxY - minY + 1;
    var size = Math.min(canvasEl.width / (w + 1), canvasEl.height / (h + 1));
    var offsetX = (canvasEl.width - w * size) / 2;
    var offsetY = (canvasEl.height - h * size) / 2;
    context.fillStyle = COLORS[type];
    for (var i = 0; i < cells.length; i++) {
      var x = offsetX + (cells[i][0] - minX) * size;
      var y = offsetY + (cells[i][1] - minY) * size;
      context.fillRect(x + 1, y + 1, size - 2, size - 2);
    }
  }

  function renderNextPreview() { renderPreview(nextCtx, nextCanvas, nextType); }
  function renderHoldPreview() { renderPreview(holdCtx, holdCanvas, holdType); }

  /* ============ UI ============ */
  function updateStatsUI() {
    if (score > highScore) {
      highScore = score;
      try { localStorage.setItem('tetrys2_highscore', String(highScore)); } catch (e) {}
    }
    els.scoreVal.textContent = score;
    els.highScoreVal.textContent = highScore;
    els.levelVal.textContent = level;
    els.rowsVal.textContent = linesCleared;
    els.heldLabel.textContent = holdType ? holdType : 'None';
    if (mode === 'sprint') {
      els.timeRow.hidden = false;
      els.bestRow.hidden = false;
      els.timeVal.textContent = formatTime(sprintElapsedMs);
      els.bestVal.textContent = sprintBestMs !== null ? formatTime(sprintBestMs) : '--:--.-';
    } else {
      els.timeRow.hidden = true;
      els.bestRow.hidden = true;
    }
  }

  function formatTime(ms) {
    var totalSec = ms / 1000;
    var m = Math.floor(totalSec / 60);
    var s = totalSec - m * 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s.toFixed(1);
  }

  function showOverlay(title, subtitle, hint) {
    els.overlayTitle.textContent = title;
    els.overlaySubtitle.textContent = subtitle;
    els.overlayHint.textContent = hint;
    els.overlay.hidden = false;
  }
  function hideOverlay() { els.overlay.hidden = true; }

  function showToast(text) {
    toastQueue.push(text);
    processToast();
  }
  function processToast() {
    if (toastActive || toastQueue.length === 0) return;
    toastActive = true;
    var text = toastQueue.shift();
    els.toast.textContent = text;
    els.toast.hidden = false;
    els.toast.classList.add('show');
    setTimeout(function () {
      els.toast.classList.remove('show');
      setTimeout(function () {
        els.toast.hidden = true;
        toastActive = false;
        processToast();
      }, 200);
    }, 1400);
  }

  function togglePause() {
    if (gameOver || sprintComplete) return;
    isPaused = !isPaused;
    els.pauseIcon.src = isPaused ? 'images/play.png' : 'images/pause.png';
    if (isPaused) showOverlay('Paused', '', 'Click pause to resume'); else hideOverlay();
    saveState();
  }

  /* ============ Achievements ============ */
  function loadAchievements() {
    try {
      var raw = localStorage.getItem('tetrys2_achievements');
      achievementsUnlocked = raw ? JSON.parse(raw) : {};
    } catch (e) { achievementsUnlocked = {}; }
  }
  function unlockAchievement(id) {
    if (achievementsUnlocked[id]) return;
    achievementsUnlocked[id] = true;
    localStorage.setItem('tetrys2_achievements', JSON.stringify(achievementsUnlocked));
    var def = ACHIEVEMENTS.filter(function (a) { return a.id === id; })[0];
    if (def) { showToast('Achievement: ' + def.name); playSound('achievement'); }
  }

  /* ============ Settings ============ */
  function loadSettings() {
    try {
      var raw = localStorage.getItem('tetrys2_settings');
      var s = raw ? JSON.parse(raw) : {};
      volume = s.volume !== undefined ? s.volume : 0.7;
      mode = s.mode || 'marathon';
    } catch (e) { volume = 0.7; mode = 'marathon'; }
    highScore = parseInt(localStorage.getItem('tetrys2_highscore') || '0', 10) || 0;
    var best = localStorage.getItem('tetrys2_sprintbest');
    sprintBestMs = best !== null ? parseFloat(best) : null;
  }
  function saveSettings() {
    localStorage.setItem('tetrys2_settings', JSON.stringify({ volume: volume, mode: mode }));
  }

  /* ============ Persistence ============ */
  function saveState() {
    try {
      var state = {
        arena: arena, current: current, holdType: holdType, holdUsed: holdUsed,
        bag: bag, nextType: nextType, score: score, level: level, linesCleared: linesCleared,
        combo: combo, lastClearWasTetris: lastClearWasTetris, mode: mode,
        sprintElapsedMs: sprintElapsedMs, gameOver: gameOver, sprintComplete: sprintComplete
      };
      localStorage.setItem('tetrys2_state', JSON.stringify(state));
    } catch (e) { /* ignore quota errors */ }
  }

  function loadState() {
    try {
      var raw = localStorage.getItem('tetrys2_state');
      if (!raw) return false;
      var s = JSON.parse(raw);
      if (!s || !s.arena || !s.current) return false;
      arena = s.arena; current = s.current; holdType = s.holdType || null; holdUsed = !!s.holdUsed;
      bag = s.bag || []; nextType = s.nextType || drawFromBag();
      score = s.score || 0; level = s.level || 1; linesCleared = s.linesCleared || 0;
      combo = s.combo !== undefined ? s.combo : -1; lastClearWasTetris = !!s.lastClearWasTetris;
      mode = s.mode || mode; sprintElapsedMs = s.sprintElapsedMs || 0;
      gameOver = !!s.gameOver; sprintComplete = !!s.sprintComplete;
      updateDropInterval();
      dropAccumulator = 0; onGround = false; lockTimer = 0; lockResets = 0;
      renderNextPreview(); renderHoldPreview();
      if (gameOver) showOverlay('Game Over!', 'Score: ' + score + '   Level: ' + level + '   Rows: ' + linesCleared, 'Press any key to restart');
      else if (sprintComplete) showOverlay('Sprint Over!', 'Time: ' + formatTime(sprintElapsedMs), 'Press any key to restart');
      return true;
    } catch (e) { return false; }
  }

  /* ============ Sound ============ */
  function playSound(name) {
    if (volume <= 0) return;
    var src = SOUNDS[name];
    if (!src) return;
    try {
      var audio = new Audio(src);
      audio.volume = volume;
      audio.play().catch(function () {});
    } catch (e) { /* ignore */ }
  }

  /* ============ Input ============ */
  function bindKeyboard() {
    document.addEventListener('keydown', function (e) {
      if (gameOver || sprintComplete) {
        if (e.key !== 'F5' && !((e.key === 'r' || e.key === 'R') && (e.metaKey || e.ctrlKey))) startNewGame();
        return;
      }
      if (isPaused && e.key !== 'p' && e.key !== 'P' && e.key !== 'Escape') return;
      switch (e.key) {
        case 'ArrowLeft': case 'a': case 'A':
          if (dasDirection !== -1) { dasDirection = -1; dasTimer = 0; moveHorizontal(-1); }
          e.preventDefault(); break;
        case 'ArrowRight': case 'd': case 'D':
          if (dasDirection !== 1) { dasDirection = 1; dasTimer = 0; moveHorizontal(1); }
          e.preventDefault(); break;
        case 'ArrowDown': case 's': case 'S':
          softDropping = true; e.preventDefault(); break;
        case 'ArrowUp': case 'w': case 'W': case 'x': case 'X':
          tryRotate(1); e.preventDefault(); break;
        case 'z': case 'Z':
          tryRotate(-1); e.preventDefault(); break;
        case ' ':
          hardDrop(); e.preventDefault(); break;
        case 'c': case 'C': case 'Shift':
          holdCurrent(); e.preventDefault(); break;
        case 'p': case 'P': case 'Escape':
          togglePause(); e.preventDefault(); break;
      }
    });
    document.addEventListener('keyup', function (e) {
      switch (e.key) {
        case 'ArrowLeft': case 'a': case 'A':
          if (dasDirection === -1) dasDirection = 0;
          break;
        case 'ArrowRight': case 'd': case 'D':
          if (dasDirection === 1) dasDirection = 0;
          break;
        case 'ArrowDown': case 's': case 'S':
          softDropping = false; break;
      }
    });
  }

  function bindUI() {
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.getElementById('restartBtn').addEventListener('click', function () {
      els.confirmModal.hidden = false;
    });
    document.getElementById('confirmCancel').addEventListener('click', function () {
      els.confirmModal.hidden = true;
    });
    document.getElementById('confirmRestart').addEventListener('click', function () {
      els.confirmModal.hidden = true;
      startNewGame();
    });
    document.getElementById('settingsBtn').addEventListener('click', function () {
      els.volumeSlider.value = Math.round(volume * 100);
      setModeButtons();
      els.settingsModal.hidden = false;
    });
    document.getElementById('closeSettings').addEventListener('click', function () {
      els.settingsModal.hidden = true;
    });
    els.volumeSlider.addEventListener('input', function () {
      volume = els.volumeSlider.value / 100;
      saveSettings();
    });
    els.modeMarathon.addEventListener('click', function () {
      if (mode === 'marathon') return;
      mode = 'marathon'; saveSettings(); setModeButtons(); startNewGame();
    });
    els.modeSprint.addEventListener('click', function () {
      if (mode === 'sprint') return;
      mode = 'sprint'; saveSettings(); setModeButtons(); startNewGame();
    });
    document.getElementById('resetBtn').addEventListener('click', function () {
      localStorage.removeItem('tetrys2_state');
      localStorage.removeItem('tetrys2_highscore');
      localStorage.removeItem('tetrys2_achievements');
      localStorage.removeItem('tetrys2_sprintbest');
      achievementsUnlocked = {}; highScore = 0; sprintBestMs = null;
      els.settingsModal.hidden = true;
      startNewGame();
    });
  }

  function setModeButtons() {
    els.modeMarathon.classList.toggle('active', mode === 'marathon');
    els.modeSprint.classList.toggle('active', mode === 'sprint');
  }
})();
