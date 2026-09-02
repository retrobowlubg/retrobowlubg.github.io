(function (modules) {
    var moduleCache = {};

    function requireModule(moduleId) {
        if (moduleCache[moduleId]) return moduleCache[moduleId].exports;
        var module = moduleCache[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, requireModule);
        module.l = true;
        return module.exports;
    }

    requireModule.m = modules;
    requireModule.c = moduleCache;
    requireModule.d = function (exports, name, getter) {
        if (!requireModule.o(exports, name)) {
            Object.defineProperty(exports, name, {
                enumerable: true,
                get: getter
            });
        }
    };
    requireModule.r = function (exports) {
        if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
        }
        Object.defineProperty(exports, "__esModule", { value: true });
    };
    requireModule.t = function (value, mode) {
        if (mode & 1) value = requireModule(value);
        if (mode & 8) return value;
        if ((mode & 4) && typeof value === "object" && value && value.__esModule) return value;
        var ns = Object.create(null);
        requireModule.r(ns);
        Object.defineProperty(ns, "default", {
            enumerable: true,
            value: value
        });
        if (mode & 2 && typeof value != "string") {
            for (var key in value) {
                requireModule.d(ns, key, function (key) {
                    return value[key];
                }.bind(null, key));
            }
        }
        return ns;
    };
    requireModule.n = function (module) {
        var getter = module && module.__esModule ?
            function () { return module["default"]; } :
            function () { return module; };
        requireModule.d(getter, "a", getter);
        return getter;
    };
    requireModule.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    requireModule.p = "";
    return requireModule(requireModule.s = 0);
})([
    function (module, exports) {
        var gameSpeed = 12;
        var colors = [null, "#FF0D72", "#0DC2FF", "#0DFF72", "#F538FF", "#FF8E0D", "#FFE138", "#3877FF"];
        var tetrominoShapes = [
            [
                [1, 1, 1],
                [0, 1, 0],
                [0, 0, 0]
            ],
            [
                [2, 2],
                [2, 2]
            ],
            [
                [0, 0, 3, 0],
                [0, 0, 3, 0],
                [0, 0, 3, 0],
                [0, 0, 3, 0]
            ],
            [
                [0, 4, 0],
                [0, 4, 0],
                [0, 4, 4]
            ],
            [
                [0, 5, 0],
                [0, 5, 0],
                [5, 5, 0]
            ],
            [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0]
            ],
            [
                [7, 7, 0],
                [0, 7, 7],
                [0, 0, 0]
            ]
        ];

        var canvas, context, blockSize;
        var arena, highScore;
        var restartImage, pauseImage, playImage;
        var isHoveringPause = false;
        var score = 0;
        var gameOver = false;
        var mousePosition = localStorage.mouse ? JSON.parse(localStorage.mouse) : { x: 0, y: 0 };
        var isHoveringRestart = false;
        var isPaused = false;
        var scoreMultiplier = 0;
        var previousTime = 0, deltaTime = 0, timeAccumulator = 0;
        var dropInterval = 50 * gameSpeed;
        var updateInterval, horizontalInterval;
        var currentLevel = 0, levelMessage = "", levelMessageTimer = 0;

        // Переменные для задержки начала падения при восстановлении игры
        var initialDelay = 0;
        var gameStartedAt = 0;

        // Переменная для хранения следующей фигуры
        var nextPiece = null;

        var player = {
            start_x: 5,
            x: 5,
            y: 0,
            shape: []
        };

        var moveLeft = false, moveDown = false, moveRight = false;

        window.onload = function () {
            canvas = document.getElementById("canvas");
            context = canvas.getContext("2d");
            blockSize = canvas.width / 10;
            if (localStorage._scoreResetSept2018 === undefined) {
                localStorage._hscore = highScore = 0;
                localStorage._scoreResetSept2018 = true;
            }
            (function () {
                clearInterval(updateInterval);
                clearInterval(horizontalInterval);
                try {
                    document.removeEventListener("keydown", handleKeyEvent);
                    document.removeEventListener("keyup", handleKeyEvent);
                    document.removeEventListener("mousedown", handleMouseDown);
                } catch (err) {
                    console.error(err);
                }
                document.addEventListener("keydown", handleKeyEvent);
                document.addEventListener("keyup", handleKeyEvent);
                document.addEventListener("mousedown", handleMouseDown);
                document.addEventListener("mousemove", handleMouseMove);
                try {
                    gameOver = JSON.parse(localStorage._end);
                } catch (err) {
                    console.error(err);
                    gameOver = false;
                }
                try {
                    (function () {
                        try {
                            if (gameOver) {
                                highScore = JSON.parse(localStorage._hscore);
                                arena = createMatrix(canvas.width / blockSize, canvas.height / blockSize).slice(0);
                                resetPiece();
                                gameOver = false;
                                return;
                            }
                        } catch (err) {
                            console.error(err);
                            highScore = 0;
                        }
                        try {
                            if (localStorage._arena != null && localStorage._arena !== "undefined") {
                                arena = JSON.parse(localStorage._arena);
                            }
                        } catch (err) {
                            console.error(err);
                        } finally {
                            if (arena == null) {
                                arena = createMatrix(canvas.width / blockSize, canvas.height / blockSize);
                            }
                        }
                        try {
                            if (localStorage._hscore == null || localStorage._hscore === "undefined") {
                                highScore = localStorage._hscore = 0;
                            } else {
                                highScore = JSON.parse(localStorage._hscore);
                            }
                            score = (localStorage._score == null || localStorage._score === "undefined")
                                ? localStorage._score = 0
                                : JSON.parse(localStorage._score);
                            if (localStorage._player) {
                                player = JSON.parse(localStorage._player);
                            }
                        } catch (err) {
                            console.error(err);
                        }
                    })();
                } catch (err) {
                    console.error(err);
                }
                restartImage = new Image();
                restartImage.src = "../images/restart.png";
                pauseImage = new Image();
                pauseImage.src = "../images/pause.png";
                playImage = new Image();
                playImage.src = "../images/play.png";

                // Если игра не восстановлена, начинаем новую игру сразу.
                // Если восстановлена, задержка падения составляет 1 секунду, но элементы отображаются сразу.
                var isRestoredGame = (player != null && player.shape && player.shape.length > 0);
                if (!isRestoredGame) {
                    resetPiece();
                    // Для нового запуска делаем фигуру сразу видимой.
                    player.y = 0;
                    initialDelay = 0;
                } else {
                    initialDelay = 1000;
                }
                gameStartedAt = Date.now();
                updateInterval = setInterval(updateGame, 50);
                horizontalInterval = setInterval(updateHorizontalMovement, 1000 / 12);
                requestAnimationFrame(mainLoop);
            })();
        };

        function mainLoop(time = 0) {
            deltaTime = time - previousTime;
            previousTime = time;
            timeAccumulator += deltaTime;

            // При нажатии только на стрелки влево/вправо порог падения увеличивается в 2 раза.
            var effectiveDropInterval = dropInterval;
            if (!moveDown && (moveLeft || moveRight)) {
                effectiveDropInterval = dropInterval * 2;
            }
            if (timeAccumulator > effectiveDropInterval && !gameOver && !isPaused) {
                dropPiece();
                timeAccumulator = 0;
            }

            if (gameOver) {
                (function () {
                    var message = "You hit the limit!";
                    var offset = 0.05 * blockSize;
                    context.font = blockSize + "px Arial";
                    context.fillStyle = "#ff5b5b";
                    context.fillText(message, canvas.width / 2 - context.measureText(message).width / 2 + offset, 8 * blockSize + offset);
                    var restartMsg = "Press any key to restart";
                    context.font = 0.7 * blockSize + "px Arial";
                    context.fillStyle = "#ff5b5b";
                    context.fillText(restartMsg, canvas.width / 2 - context.measureText(restartMsg).width / 2 + offset, 9 * blockSize + offset);
                    context.font = blockSize + "px Arial";
                    context.fillStyle = "red";
                    context.fillText(message, canvas.width / 2 - context.measureText(message).width / 2, 8 * blockSize);
                    context.font = 0.7 * blockSize + "px Arial";
                    context.fillStyle = "red";
                    context.fillText(restartMsg, canvas.width / 2 - context.measureText(restartMsg).width / 2, 9 * blockSize);
                })();
            }

            context.fillStyle = "black";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = "red";
            context.fillRect(0, 3 * blockSize - 1, canvas.width, 1);
            drawMatrix(arena, { x: 0, y: 0 });
            drawMatrix(player.shape, { x: player.x, y: player.y });
            updateSavedState();

            context.font = 2 * blockSize + "px Arial";
            context.fillStyle = "#fff";
            context.fillText(score, canvas.width / 2 - context.measureText(score).width / 2, 2.5 * blockSize);
            context.font = 0.5 * blockSize + "px Arial";
            context.fillStyle = "#fff";
            context.fillText("High Score: " + highScore, canvas.width / 2 - context.measureText("High score: " + highScore).width / 2, 3.5 * blockSize);

            (function () {
                var offset = 1, hoverSize = blockSize / 5;
                if (mousePosition.x > blockSize * offset - hoverSize &&
                    mousePosition.x < blockSize * offset + blockSize + 2 * hoverSize &&
                    mousePosition.y > blockSize * offset - hoverSize &&
                    mousePosition.y < blockSize * offset + blockSize + 2 * hoverSize) {
                    isHoveringRestart = true;
                    context.fillStyle = "#3a3a3a";
                    context.fillRect(blockSize * offset - hoverSize, blockSize * offset - hoverSize, blockSize + 2 * hoverSize, blockSize + 2 * hoverSize);
                } else {
                    isHoveringRestart = false;
                }
                context.drawImage(restartImage, blockSize * offset, blockSize * offset, blockSize, blockSize);
            })();

            (function () {
                var offsetX = 8, offsetY = 1, hoverSize = blockSize / 5;
                if (mousePosition.x > blockSize * offsetX - hoverSize &&
                    mousePosition.x < blockSize * offsetX + blockSize + 2 * hoverSize &&
                    mousePosition.y > blockSize * offsetY - hoverSize &&
                    mousePosition.y < blockSize * offsetY + blockSize + 2 * hoverSize) {
                    isHoveringPause = true;
                    context.fillStyle = "#3a3a3a";
                    context.fillRect(blockSize * offsetX - hoverSize, blockSize * offsetY - hoverSize, blockSize + 2 * hoverSize, blockSize + 2 * hoverSize);
                } else {
                    isHoveringPause = false;
                }
                var imageToDraw = isPaused ? playImage : pauseImage;
                context.drawImage(imageToDraw, blockSize * offsetX, blockSize * offsetY, blockSize, blockSize);
            })();

            // Превью следующей фигуры в правом верхнем углу (уменьшено в 2 раза)
            (function () {
                if (nextPiece) {
                    var margin = blockSize / 4;
                    var previewScale = 0.25;
                    var previewWidth = nextPiece[0].length * blockSize * previewScale;
                    var previewHeight = nextPiece.length * blockSize * previewScale;
                    var previewX = canvas.width - previewWidth - margin;
                    var previewY = margin;
                    for (var y = 0; y < nextPiece.length; y++) {
                        for (var x = 0; x < nextPiece[y].length; x++) {
                            if (nextPiece[y][x] !== 0) {
                                context.fillStyle = colors[nextPiece[y][x]];
                                context.fillRect(previewX + x * blockSize * previewScale,
                                                 previewY + y * blockSize * previewScale,
                                                 blockSize * previewScale,
                                                 blockSize * previewScale);
                            }
                        }
                    }
                }
            })();

            (function () {
                for (let row = arena.length - 1; row >= 0; row--) {
                    if (arena[row].every(function (value) { return value > 0; })) {
                        arena.splice(row, 1);
                        arena.splice(0, 0, new Array(arena[1].length).fill(0));
                        score += scoreMultiplier;
                        scoreMultiplier *= 2;
                    }
                }
            })();

            requestAnimationFrame(mainLoop);
        }

        function createMatrix(width, height) {
            var matrix = [];
            for (var i = 0; i < height; i++) {
                matrix.push(new Array(width).fill(0));
            }
            return matrix;
        }

        function drawMatrix(matrix, offset) {
            for (let y = 0; y < matrix.length; y++) {
                for (let x = 0; x < matrix[y].length; x++) {
                    if (matrix[y][x] !== 0) {
                        context.fillStyle = colors[matrix[y][x]];
                        context.fillRect((offset.x + x) * blockSize, (offset.y + y) * blockSize, blockSize, blockSize);
                    }
                }
            }
        }

        function rotateMatrix(matrix, direction) {
            for (let y = 0; y < matrix.length; ++y) {
                for (let x = 0; x < y; ++x) {
                    [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
                }
            }
            if (direction > 0) {
                matrix.forEach(function (row) { row.reverse(); });
            } else {
                matrix.reverse();
            }
        }

        function updateSavedState() {
            try {
                if (score > highScore) {
                    highScore = score;
                    localStorage._hscore = JSON.stringify(highScore);
                }
                localStorage._end = JSON.stringify(gameOver);
                localStorage._score = JSON.stringify(score);
                localStorage._arena = JSON.stringify(arena);
                localStorage._player = JSON.stringify(player);
            } catch (err) { }
        }

        function handleMouseMove(event) {
            var computedStyle = window.getComputedStyle(canvas);
            var computedWidth = parseInt(computedStyle.width);
            var computedHeight = parseInt(computedStyle.height);
            var scaleX = canvas.width / computedWidth;
            var scaleY = canvas.height / computedHeight;
            var rect = canvas.getBoundingClientRect();
            mousePosition.x = (event.clientX - rect.left) * scaleX;
            mousePosition.y = (event.clientY - rect.top) * scaleY;
            localStorage.setItem("mouse", JSON.stringify(mousePosition));
        }

        function handleMouseDown(event) {
            if (isHoveringRestart) {
                endGame(true);
            } else if (isHoveringPause) {
                isPaused = !isPaused;
                moveLeft = moveDown = moveRight = false;
            }
        }

        function hasCollision() {
            for (let y = 0; y < player.shape.length; y++) {
                for (let x = 0; x < player.shape[y].length; x++) {
                    if (player.shape[y][x] !== 0 && arena[player.y + y] && arena[player.y + y][player.x + x] !== 0) {
                        return true;
                    }
                }
            }
            return false;
        }

        function dropPiece() {
            if (Date.now() - gameStartedAt < initialDelay) {
                return;
            }
            timeAccumulator = 0;
            if (player.y + player.shape.length - 1 - getEmptyRowsAtBottom(player.shape) < 0) {
                player.x = player.start_x;
            }
            if (player.x + player.shape.length - 1 - getEmptyColumnsRight(player.shape) > arena[0].length - 1) {
                player.x = arena[0].length - player.shape.length + getEmptyColumnsRight(player.shape);
            }
            if (player.x + getEmptyColumnsLeft(player.shape) < 0) {
                player.x = 0 - getEmptyColumnsLeft(player.shape);
            }
            player.y++;
            if (hasCollision() || player.y > arena.length - player.shape.length + getEmptyRowsAtBottom(player.shape)) {
                score += 10;
                player.y--;
                (function (piece, arenaMatrix) {
                    var shapeMatrix = piece.shape;
                    for (let y = 0; y < shapeMatrix.length; y++) {
                        for (let x = 0; x < shapeMatrix.length; x++) {
                            if (shapeMatrix[y][x]) {
                                try {
                                    arenaMatrix[piece.y + y][piece.x + x] = shapeMatrix[y][x];
                                } catch (err) {
                                    console.error(err);
                                }
                            }
                        }
                    }
                })(player, arena);
                if (arena[2].reduce(function (sum, val) { return sum + val; }, 0) > 0) {
                    drawMatrix(arena, { x: 0, y: 0 });
                    gameOver = true;
                    return endGame(false);
                }
                resetPiece();
            }
        }

        function resetPiece() {
            if (nextPiece) {
                player.shape = nextPiece;
            } else {
                player.shape = tetrominoShapes[Math.floor(Math.random() * tetrominoShapes.length)];
            }
            nextPiece = tetrominoShapes[Math.floor(Math.random() * tetrominoShapes.length)];
            player.y = -player.shape.length + getEmptyRowsAtBottom(player.shape);
            player.x = 5 - Math.round(player.shape.length / 2);
            player.start_x = player.x;
            scoreMultiplier = 75;
        }

        function getEmptyRowsAtBottom(matrix) {
            var count = 0;
            for (let y = matrix.length - 1; y >= 0; y--) {
                for (let x = 0; x < matrix[y].length; x++) {
                    if (matrix[y][x] !== 0) return count;
                }
                count++;
            }
            return count;
        }

        function getEmptyColumnsRight(matrix) {
            var count = 0;
            for (let x = matrix.length - 1; x >= 0; x--) {
                for (let y = 0; y < matrix.length; y++) {
                    if (matrix[y][x] !== 0) return count;
                }
                count++;
            }
            return count;
        }

        function getEmptyColumnsLeft(matrix) {
            var count = 0;
            for (let x = 0; x < matrix.length; x++) {
                for (let y = 0; y < matrix.length; y++) {
                    if (matrix[y][x] !== 0) return count;
                }
                count++;
            }
            return count;
        }

        function endGame(restart) {
            moveLeft = moveDown = moveRight = false;
            updateSavedState();
            gameOver = true;
            localStorage._end = JSON.stringify(gameOver);
            localStorage._arena = JSON.stringify(createMatrix(canvas.width / blockSize, canvas.height / blockSize).slice(0));
            if (restart) location.reload();
        }

        function updateGame() {
            if (moveDown && !isPaused) {
                score += 1;
                dropPiece();
            }
        }

        function updateHorizontalMovement() {
            if (moveLeft && !isPaused) {
                player.x--;
                if (hasCollision()) player.x++;
            } else if (moveRight && !isPaused) {
                player.x++;
                if (hasCollision()) player.x--;
            }
        }

        function handleKeyEvent(event) {
            if (gameOver) {
                endGame(true);
            } else {
                if (isPaused) return;
                if (event.type === "keydown") {
                    switch (event.keyCode) {
                        case 87:
                        case 38:
                            (function (direction) {
                                var initialX = player.x;
                                var offset = 1;
                                rotateMatrix(player.shape, direction);
                                while (hasCollision()) {
                                    player.x += offset;
                                    offset = -(offset + (offset > 0 ? 1 : -1));
                                    if (Math.abs(offset) > player.shape[0].length) {
                                        rotateMatrix(player.shape, -direction);
                                        player.x = initialX;
                                        return;
                                    }
                                }
                            })(1);
                            break;
                        case 65:
                        case 37:
                            if (player.y + player.shape.length - getEmptyRowsAtBottom(player.shape) < 0) break;
                            moveLeft = true;
                            break;
                        case 83:
                        case 40:
                        case 32:
                            moveDown = true;
                            break;
                        case 68:
                        case 39:
                            if (player.y + player.shape.length - getEmptyRowsAtBottom(player.shape) < 0) break;
                            moveRight = true;
                            break;
                        case 27:
                            localStorage.mouse = JSON.stringify({ x: -10, y: -10 });
                    }
                } else if (event.type === "keyup") {
                    switch (event.keyCode) {
                        case 65:
                        case 37:
                            moveLeft = false;
                            break;
                        case 83:
                        case 40:
                        case 32:
                            moveDown = false;
                            break;
                        case 68:
                        case 39:
                            moveRight = false;
                            break;
                    }
                }
            }
        }
    }
]);
