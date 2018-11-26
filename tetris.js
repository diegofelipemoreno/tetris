let board = [];

(function tetris() {
    const pieceSize = 24,
        width = 10,
        height = 20,
        piecesName = Object.keys(piecesModel),
        xcoorsArray = Array.from(Array(10).keys()),
        speedFrame = 200;
    let canvas = document.querySelector("canvas"),
        context = canvas.getContext("2d"),
        boardWidth = width * pieceSize,
        boardHeight = height * pieceSize,
        evenFlag = false,
        currentPattern,
        nextPieceRot,
        flagButton = false,
        xMov,
        nextPiece = true,
        actualRotationPos,
        boardSaved = [];

    function _isNextRotationValid(nextRotPattern) {
        let isPieceOutBoardDown = false,
            busySpace = false,
            isNextRotaOutBoard = false;

        isPieceOutBoardDown = nextRotPattern.some(elem => elem[1] >= height - 1);
        busySpace = nextRotPattern.some(elem => {
            if (boardSaved[elem[1]] && boardSaved[elem[1] + 1] && boardSaved[elem[1] + 1][elem[0]] === 1 && boardSaved[elem[1] + 1][elem[0]+1] === 1 && boardSaved[elem[1]][elem[0]] === 1 && boardSaved[elem[1]][elem[0] + 1] === 1 && boardSaved[elem[1]][elem[0] - 1] === 1) {
              return true;
            }
        });

        !isPieceOutBoardDown && !busySpace ? (isNextRotaOutBoard = true) : (isNextRotaOutBoard = false);
        //console.log(nextRotPattern, isPieceOutBoardDown, busySpace, "--", isNextRotaOutBoard);
        return isNextRotaOutBoard;
    }

    function _isCoorOnPiece(array) {
        return currentPattern.some(elem => elem.toString() === array.toString());
    }

    function _isPieceLeftOutBoard() {
        return currentPattern && currentPattern.some(elem => elem[0] <= 0);
    }

    function _isPieceRightOutBoard() {
        return currentPattern && currentPattern.some(elem => elem[0] >= width -1);
    }

    function _isRightEmpty() {
        let isBoardPosEmptyRight = true;

        currentPattern && currentPattern.some(elem => {
            if (boardSaved[elem[1]] && boardSaved[elem[1]][elem[0] + 1] === 1 && !_isCoorOnPiece([elem[0] + 1, elem[1]])) {
                isBoardPosEmptyRight = false;
            }
        });
       
        return isBoardPosEmptyRight;
    }

    function _isLeftEmpty() {
        let isBoardPosEmptyLeft = true;

        currentPattern && currentPattern.some(elem => {
            if (boardSaved[elem[1]] && boardSaved[elem[1]][elem[0]-1] === 1 && !_isCoorOnPiece([elem[0] - 1, elem[1]])) {
                isBoardPosEmptyLeft = false;
            }
        });

        return isBoardPosEmptyLeft;
    }

    function _isDownEmpty() {
        let isBoardPosEmptyDown,
            isDownEmpty = true;

        currentPattern.some(elem => {
            if (boardSaved[elem[1] + 1]) isBoardPosEmptyDown = boardSaved[elem[1] + 1][elem[0]];

            if (isBoardPosEmptyDown && !_isCoorOnPiece([elem[0], elem[1] + 1])) {
                isDownEmpty = false;
            }
        });
        return isDownEmpty;
    }

    function _freezePiece() { 
        let freezePieceHeight = _pieceHeight(currentPattern);

        return currentPattern && currentPattern.some(elem => elem[1] + 1 >= height - freezePieceHeight);
    }

    function _pieceHeight(patternPiece) {
        let yCoorSet = new Set();

        patternPiece && Array.from(patternPiece, elem => yCoorSet.add(elem[1]));
        return yCoorSet.size;
    }

    function _pieceWidth(patternPiece) {
        let xCoorSet = new Set();

        patternPiece && Array.from(patternPiece, elem => xCoorSet.add(elem[0]));
        return xCoorSet.size;
    }

    function renderBoard() {
        let linecount = document.getElementById("lines"),
            clear = window
                .getComputedStyle(canvas)
                .getPropertyValue("background-color");

        canvas.width = boardWidth;
        canvas.height = boardHeight;

        for (let row = 0; row < height; row++) {
            board[row] = [];
            for (let col = 0; col < width; col++) {
                board[row][col] = "";
            }
        }
    }

    function renderPiece(x, y) {
        let pieceWidth,
          pieceHeight,
          patternPiece = nextPieceRot,
          xCoor,
          yCoor,
          boardClone;

        context.clearRect(0, 0, boardWidth, boardHeight);
        pieceWidth = _pieceWidth(patternPiece);
           
        if (x === width - 1 && pieceWidth >= 1) x = width - pieceWidth;

        if (flagButton) {
          nextRotPattern = patternPiece.map(elem => [
            elem[0] + x,
            elem[1] + y
          ]);
        }

        currentPattern = patternPiece.map(elem => [
            elem[0] + x,
            elem[1] + y
        ]);
        
        boardClone = patternPiece.map(elem => [
          elem[0] + x,
          elem[1] + y
        ]);

        for (let index = 0; index < patternPiece.length; index++) {
            pieceHeight = _pieceHeight(currentPattern);
            xCoor = currentPattern[index][0];
            yCoor = currentPattern[index][1];

            let xCoorboardClone = boardClone[index][0];
            let yCoorboardClone = boardClone[index][1];

            if (!index) evenFlag = !evenFlag;

            if (!board[yCoor][xCoor]) {
                if (board[yCoor]) board[yCoor][xCoor] = 1;
                setTimeout(() => {
                    if (board[yCoorboardClone] && _isDownEmpty()) board[yCoorboardClone][xCoorboardClone] = "";
                }, 0);
            }
        }
        
        drawOnBoard(); 
        //console.log(board);       
        // console.log(xMov, x, type);
        return pieceHeight;
    }

    function drawOnBoard() {
        board.forEach((elem, index) => {
            elem.forEach((subelem, subindex) => {
                if (subelem) {
                    context.fillRect(subindex * pieceSize, index * pieceSize, pieceSize, pieceSize);
                    context.strokeStyle = "#FFF";
                    context.strokeRect(subindex * pieceSize, index * pieceSize, pieceSize, pieceSize);
                    context.strokeStyle = "#FFF";
                }
            });
        });
    }

    function newPiece(x, y, currentTypePiece) {
        let piece,
            intervalId,
            heightPiece,
            limitBoard,
            yPiecePos;

        nextPieceRot = nextPieceRot || piecesModel[currentTypePiece][0];

        function _setPieceMov(y) {
            let cache = [];

            return y => {

                if (typeof xMov === "boolean") {
                    xMov ? x++ : x--;
                    xMov = '';
                }

                if (-1 !== cache.indexOf(y)) {
                    y = cache[cache.length - 1] + 1;
                    cache.push(y);
                } 
                heightPiece = renderPiece(x, y, currentTypePiece);
                cache.push(y);
                return y;
            };
        }

        function _putPiece() {
            currentPattern.forEach(elem => {
                if (board[elem[1]]) {
                    board[elem[1]][elem[0]] = 1;
                } else {
                    if (board[elem[1] - 1]) board[elem[1] - 1][elem[0]] = 1;
                }
                drawOnBoard();
                clearInterval(intervalId);
                nextPiece = true;
                nextPieceRot = '';
                boardSaved = board;
            });
        }

        piece = _setPieceMov(y);
        intervalId = setInterval(() => {
            limitBoard = height - heightPiece;
            yPiecePos = piece(y);

            if (!_isDownEmpty()) _putPiece();
        
            if (yPiecePos >= limitBoard) {
                _putPiece();
            }
        }, speedFrame);
    }

    function pieceRotationPos(currentTypePiece) {
      let cache = new Set(),
        currentPieceModel = piecesModel[currentTypePiece],
        lastPos,
        patternPiece,
        nextRotaiontPos;

      return (currentTypePiece) => {

        if (cache.size === 0) cache.add(0);
        lastPos = cache.size - 1;
        patternPiece = piecesModel[currentTypePiece][lastPos];

        currentPieceModel && currentPieceModel.forEach((elem, index) => {

            if (elem.toString() === patternPiece.toString() && currentPieceModel[lastPos + 1]) {
              nextRotaiontPos = currentPieceModel[index + 1];
              actualRotationPos = currentPieceModel[index];
              cache.add(index + 1);
            }
        });

        if (currentPieceModel.length - 1 === lastPos) {
          nextRotaiontPos = currentPieceModel[0];
          actualRotationPos = currentPieceModel[lastPos];
          cache = new Set();
        }

        return nextRotaiontPos;
      };
    }

    function controllers(currentTypePiece) {
        let nextRotationPiece = pieceRotationPos(currentTypePiece),
            nextRotationPos;

        document.addEventListener("keydown", function(event) {
            flagButton = true;
            typeEvent = event.keyCode;

            switch (event.keyCode) {
              case 32:    
                nextRotationPos = nextRotationPiece(currentTypePiece);
                //_isNextRotationValid(nextRotationPos) ? (nextPieceRot = nextRotationPos) : (nextPieceRot = actualRotationPos);

                if (_isPieceRightOutBoard()) {
                    flagButton = false;
                    nextPieceRot = actualRotationPos;
                } else {
                    if (!_freezePiece() && _isNextRotationValid(nextRotationPos)) {
                      nextPieceRot = nextRotationPos;
                    }
                }
                xMov = '';
                break;

              case 37:
                _isLeftEmpty() && !_isPieceLeftOutBoard() && !_freezePiece() ? (xMov = false) : (xMov = "");
                break;

              case 39:
                _isRightEmpty() && !_isPieceRightOutBoard() && !_freezePiece() ? (xMov = true) : (xMov = "");
                break;

              case 39:
                //speedFrame = 60;
                break;
            }
        
        }, false);

        document.addEventListener("keyup", function(event) {
            flagButton = false;  
        }, false);
    }

    function randomPieces() {
        let randomxcoor = xcoorsArray[Math.floor(Math.random() * xcoorsArray.length)],
            patternPiece,
            patternPieceWidth,
            currentTypePiece;

        currentTypePiece = piecesName[Math.floor(Math.random() * piecesName.length)];
        patternPiece = piecesModel[currentTypePiece][0];
        patternPieceWidth = _pieceWidth(patternPiece);

        if (randomxcoor + patternPieceWidth >= width - 1) {
            randomxcoor = randomxcoor - patternPieceWidth;
        } else if (randomxcoor + patternPieceWidth <= 0) {
            randomxcoor = 1;
        }
        osa = currentTypePiece;
        newPiece(randomxcoor, 0, currentTypePiece);
    }

    function start() {
        let promise;

        setInterval( () => { 
            if (nextPiece) {
                nextPiece = false;
                
                promise = new Promise((resolve) => { 
                    randomPieces();
                    resolve();
                });

                promise.then(function () {
                    controllers(osa);
                });
            }
        }, 300);
    }

    function init() {
        renderBoard();
        start();
    }

    init();
})();