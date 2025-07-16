class PuzzleGame {
    constructor(imageSrc, gridSize) {
        this.imageSrc = imageSrc;
        this.gridSize = gridSize;
        this.board = [];
        this.emptyPosition = { row: gridSize - 1, col: gridSize - 1 };
        this.onMove = null;
        this.onComplete = null;
        this.isShuffled = false;
        
        this.initializeBoard();
        this.renderBoard();
        this.setupShakeDetection();
    }

    initializeBoard() {
        const puzzleBoard = document.getElementById('puzzle-board');
        puzzleBoard.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        puzzleBoard.style.gridTemplateRows = `repeat(${this.gridSize}, 1fr)`;
        
        // Create solved board
        this.board = [];
        for (let row = 0; row < this.gridSize; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.gridSize; col++) {
                this.board[row][col] = row * this.gridSize + col;
            }
        }
        
        // Set empty position
        this.emptyPosition = { row: this.gridSize - 1, col: this.gridSize - 1 };
        this.board[this.emptyPosition.row][this.emptyPosition.col] = -1; // -1 represents empty
    }

    renderBoard() {
        const puzzleBoard = document.getElementById('puzzle-board');
        puzzleBoard.innerHTML = '';
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const piece = document.createElement('div');
                piece.className = 'puzzle-piece';
                
                const value = this.board[row][col];
                if (value === -1) {
                    piece.classList.add('empty');
                } else {
                    const pieceRow = Math.floor(value / this.gridSize);
                    const pieceCol = value % this.gridSize;
                    
                    const backgroundX = (pieceCol / (this.gridSize - 1)) * 100;
                    const backgroundY = (pieceRow / (this.gridSize - 1)) * 100;
                    
                    piece.style.backgroundImage = `url(${this.imageSrc})`;
                    piece.style.backgroundSize = `${this.gridSize * 100}%`;
                    piece.style.backgroundPosition = `-${backgroundX}% -${backgroundY}%`;
                    
                    piece.addEventListener('click', () => this.movePiece(row, col));
                }
                
                puzzleBoard.appendChild(piece);
            }
        }
    }

    movePiece(row, col) {
        if (!this.isShuffled) return;
        
        // Check if piece is adjacent to empty space
        const isAdjacent = (
            (Math.abs(row - this.emptyPosition.row) === 1 && col === this.emptyPosition.col) ||
            (Math.abs(col - this.emptyPosition.col) === 1 && row === this.emptyPosition.row)
        );
        
        if (isAdjacent) {
            // Swap piece with empty space
            const temp = this.board[row][col];
            this.board[row][col] = -1;
            this.board[this.emptyPosition.row][this.emptyPosition.col] = temp;
            
            // Update empty position
            this.emptyPosition = { row, col };
            
            // Re-render board
            this.renderBoard();
            
            // Trigger move callback
            if (this.onMove) {
                this.onMove();
            }
            
            // Check if puzzle is complete
            if (this.isComplete()) {
                if (this.onComplete) {
                    this.onComplete();
                }
            }
        }
    }

    shuffle() {
        // Perform random moves to shuffle
        const shuffleMoves = this.gridSize * this.gridSize * 10; // More moves for larger grids
        
        for (let i = 0; i < shuffleMoves; i++) {
            const adjacentPositions = this.getAdjacentPositions();
            const randomPosition = adjacentPositions[Math.floor(Math.random() * adjacentPositions.length)];
            
            // Swap with random adjacent position
            const temp = this.board[randomPosition.row][randomPosition.col];
            this.board[randomPosition.row][randomPosition.col] = -1;
            this.board[this.emptyPosition.row][this.emptyPosition.col] = temp;
            this.emptyPosition = randomPosition;
        }
        
        this.isShuffled = true;
        this.renderBoard();
    }

    getAdjacentPositions() {
        const positions = [];
        const { row, col } = this.emptyPosition;
        
        // Check all four directions
        const directions = [
            { row: row - 1, col: col }, // Up
            { row: row + 1, col: col }, // Down
            { row: row, col: col - 1 }, // Left
            { row: row, col: col + 1 }  // Right
        ];
        
        directions.forEach(dir => {
            if (dir.row >= 0 && dir.row < this.gridSize && 
                dir.col >= 0 && dir.col < this.gridSize) {
                positions.push(dir);
            }
        });
        
        return positions;
    }

    isComplete() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const expectedValue = row * this.gridSize + col;
                if (row === this.gridSize - 1 && col === this.gridSize - 1) {
                    // Last position should be empty
                    if (this.board[row][col] !== -1) return false;
                } else {
                    if (this.board[row][col] !== expectedValue) return false;
                }
            }
        }
        return true;
    }

    showSolution() {
        // Temporarily solve the puzzle
        this.initializeBoard();
        this.renderBoard();
        
        // Re-shuffle after 2 seconds
        setTimeout(() => {
            this.shuffle();
        }, 2000);
    }

    setupShakeDetection() {
        let lastUpdate = 0;
        let lastX = 0, lastY = 0, lastZ = 0;
        const threshold = 15; // Adjust sensitivity
        
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', (event) => {
                const current = event.accelerationIncludingGravity;
                if (!current) return;
                
                const curTime = new Date().getTime();
                if ((curTime - lastUpdate) > 100) {
                    const diffTime = curTime - lastUpdate;
                    lastUpdate = curTime;
                    
                    const speed = Math.abs(current.x + current.y + current.z - lastX - lastY - lastZ) / diffTime * 10000;
                    
                    if (speed > threshold) {
                        // Device was shaken
                        this.handleShake();
                    }
                    
                    lastX = current.x;
                    lastY = current.y;
                    lastZ = current.z;
                }
            });
        }
    }

    handleShake() {
        if (this.isShuffled) {
            // Add shake animation to the puzzle board
            const puzzleBoard = document.getElementById('puzzle-board');
            puzzleBoard.classList.add('shake');
            
            setTimeout(() => {
                puzzleBoard.classList.remove('shake');
            }, 500);
            
            // Shuffle the puzzle
            this.shuffle();
            
            // Trigger move callback to reset moves
            if (this.onMove) {
                this.onMove();
            }
        }
    }
} 