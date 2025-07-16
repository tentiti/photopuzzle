class PhotoPuzzleApp {
    constructor() {
        this.currentScreen = 'upload';
        this.selectedImage = null;
        this.selectedDifficulty = 'easy';
        this.gameState = null;
        this.moves = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.locale = this.detectLocale();
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }

    detectLocale() {
        const userLang = navigator.language || navigator.userLanguage;
        return userLang.startsWith('ko') ? 'ko' : 'en';
    }

    initializeElements() {
        // Screens
        this.uploadScreen = document.getElementById('upload-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.victoryScreen = document.getElementById('victory-screen');
        
        // Upload elements
        this.uploadArea = document.getElementById('upload-area');
        this.fileInput = document.getElementById('file-input');
        this.startGameBtn = document.getElementById('start-game');
        
        // Difficulty elements
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');
        
        // Game elements
        this.backBtn = document.getElementById('back-btn');
        this.movesDisplay = document.getElementById('moves');
        this.timerDisplay = document.getElementById('timer');
        this.shuffleBtn = document.getElementById('shuffle-btn');
        this.solveBtn = document.getElementById('solve-btn');
        
        // Victory elements
        this.finalMoves = document.getElementById('final-moves');
        this.finalTime = document.getElementById('final-time');
        this.finalMovesEn = document.getElementById('final-moves-en');
        this.finalTimeEn = document.getElementById('final-time-en');
        this.shareBtn = document.getElementById('share-btn');
        this.newGameBtn = document.getElementById('new-game-btn');
    }

    bindEvents() {
        // Upload events
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        
        // Difficulty selection
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => this.selectDifficulty(btn.dataset.difficulty));
        });
        
        // Game events
        this.startGameBtn.addEventListener('click', () => this.startGame());
        this.backBtn.addEventListener('click', () => this.showUploadScreen());
        this.shuffleBtn.addEventListener('click', () => this.shufflePuzzle());
        this.solveBtn.addEventListener('click', () => this.showSolution());
        
        // Victory events
        this.shareBtn.addEventListener('click', () => this.sharePuzzle());
        this.newGameBtn.addEventListener('click', () => this.showUploadScreen());
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    processFile(file) {
        if (!file.type.startsWith('image/')) {
            const message = this.locale === 'ko' ? '이미지 파일을 선택해주세요.' : 'Please select an image file.';
            alert(message);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.selectedImage = e.target.result;
            this.updateUploadArea();
            this.startGameBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    updateUploadArea() {
        if (this.selectedImage) {
            this.uploadArea.style.backgroundImage = `url(${this.selectedImage})`;
            this.uploadArea.style.backgroundSize = 'cover';
            this.uploadArea.style.backgroundPosition = 'center';
            this.uploadArea.style.border = '3px solid #667eea';
            this.uploadArea.querySelector('.upload-content').style.display = 'none';
        }
    }

    selectDifficulty(difficulty) {
        this.selectedDifficulty = difficulty;
        
        // Update button states
        this.difficultyBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
        });
    }

    startGame() {
        if (!this.selectedImage) {
            const message = this.locale === 'ko' ? '먼저 이미지를 선택해주세요.' : 'Please select an image first.';
            alert(message);
            return;
        }

        this.showGameScreen();
        this.initializeGame();
    }

    showGameScreen() {
        this.currentScreen = 'game';
        this.uploadScreen.classList.remove('active');
        this.gameScreen.classList.add('active');
        this.victoryScreen.classList.remove('active');
    }

    showUploadScreen() {
        this.currentScreen = 'upload';
        this.uploadScreen.classList.add('active');
        this.gameScreen.classList.remove('active');
        this.victoryScreen.classList.remove('active');
        
        // Reset state
        this.selectedImage = null;
        this.startGameBtn.disabled = true;
        this.uploadArea.style.backgroundImage = '';
        this.uploadArea.style.border = '3px dashed #ddd';
        this.uploadArea.querySelector('.upload-content').style.display = 'block';
        this.fileInput.value = '';
        
        // Stop timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    showVictoryScreen() {
        this.currentScreen = 'victory';
        this.uploadScreen.classList.remove('active');
        this.gameScreen.classList.remove('active');
        this.victoryScreen.classList.add('active');
        
        // Update final stats
        this.finalMoves.textContent = this.moves;
        this.finalTime.textContent = this.getFormattedTime();
        this.finalMovesEn.textContent = this.moves;
        this.finalTimeEn.textContent = this.getFormattedTime();
        
        // Stop timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Trigger confetti
        this.triggerConfetti();
    }

    initializeGame() {
        this.moves = 0;
        this.startTime = Date.now();
        this.updateDisplay();
        
        // Start timer
        this.timerInterval = setInterval(() => {
            this.updateDisplay();
        }, 1000);
        
        // Initialize puzzle
        const gridSize = this.getGridSize();
        this.gameState = new PuzzleGame(this.selectedImage, gridSize);
        this.gameState.onMove = () => {
            this.moves++;
            this.updateDisplay();
        };
        this.gameState.onComplete = () => {
            this.showVictoryScreen();
        };
    }

    getGridSize() {
        const sizes = {
            'easy': 3,
            'medium': 4,
            'hard': 5
        };
        return sizes[this.selectedDifficulty];
    }

    updateDisplay() {
        const movesText = this.locale === 'ko' ? `이동: ${this.moves}` : `Moves: ${this.moves}`;
        const timeText = this.locale === 'ko' ? `시간: ${this.getFormattedTime()}` : `Time: ${this.getFormattedTime()}`;
        
        this.movesDisplay.textContent = `${movesText} / ${this.locale === 'ko' ? `Moves: ${this.moves}` : `이동: ${this.moves}`}`;
        this.timerDisplay.textContent = `${timeText} / ${this.locale === 'ko' ? `Time: ${this.getFormattedTime()}` : `시간: ${this.getFormattedTime()}`}`;
    }

    getFormattedTime() {
        if (!this.startTime) return '00:00';
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    shufflePuzzle() {
        if (this.gameState) {
            this.shuffleBtn.classList.add('shake');
            setTimeout(() => {
                this.shuffleBtn.classList.remove('shake');
            }, 500);
            
            this.gameState.shuffle();
            this.moves = 0;
            this.updateDisplay();
        }
    }

    showSolution() {
        if (this.gameState) {
            this.gameState.showSolution();
        }
    }

    triggerConfetti() {
        const confettiContainer = document.getElementById('confetti');
        confettiContainer.innerHTML = '';
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confettiContainer.appendChild(confetti);
        }
        
        // Clear confetti after animation
        setTimeout(() => {
            confettiContainer.innerHTML = '';
        }, 5000);
    }

    async sharePuzzle() {
        const shareText = this.locale === 'ko' 
            ? `사진퍼즐을 ${this.moves}번의 이동과 ${this.getFormattedTime()}만에 완성했습니다! 직접 해보세요: ${window.location.href}`
            : `I completed the Photo Puzzle in ${this.moves} moves and ${this.getFormattedTime()}! Try it yourself: ${window.location.href}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: this.locale === 'ko' ? '사진퍼즐' : 'Photo Puzzle',
                    text: shareText,
                    url: window.location.href
                });
            } catch (error) {
                console.log('Share cancelled or failed');
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(shareText);
                const message = this.locale === 'ko' ? '퍼즐 통계가 클립보드에 복사되었습니다!' : 'Puzzle stats copied to clipboard!';
                alert(message);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = shareText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                const message = this.locale === 'ko' ? '퍼즐 통계가 클립보드에 복사되었습니다!' : 'Puzzle stats copied to clipboard!';
                alert(message);
            }
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PhotoPuzzleApp();
}); 