// Game State Management
class CrosswordGame {
    constructor() {
        this.currentScreen = 'start';
        this.playerName = '';
        this.selectedSubject = '';
        this.selectedDifficulty = '';
        this.gameData = null;
        this.timer = null;
        this.startTime = null;
        this.isPaused = false;
        this.isSoundEnabled = true;
        this.currentTheme = 'light';
        this.currentDirection = 'across';
        this.hintLimit = 3;
        this.hintCount = 0;

        this.initializeEventListeners();
        this.loadTheme();
        this.loadLeaderboard();
        this.lastResult = {
            score: 0,
            time: '00:00',
            subject: '',
            difficulty: '',
            name: ''
        };
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Start screen
        document.getElementById('startBtn').addEventListener('click', () => this.showScreen('registration'));
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Registration screen
        document.getElementById('registrationForm').addEventListener('submit', (e) => this.handleRegistration(e));
        document.getElementById('backToStart').addEventListener('click', () => this.showScreen('start'));

        // Subject selection
        document.querySelectorAll('.subject-card').forEach(card => {
            card.addEventListener('click', () => this.selectSubject(card));
        });
        document.getElementById('backToRegistration').addEventListener('click', () => this.showScreen('registration'));

        // Difficulty selection
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.addEventListener('click', () => this.selectDifficulty(card));
        });
        document.getElementById('backToSubject').addEventListener('click', () => this.showScreen('subject'));

        // Game screen
        document.getElementById('pauseGame').addEventListener('click', () => this.pauseGame());
        // sound button removed from UI
        document.getElementById('checkAnswers').addEventListener('click', () => this.checkAnswers());
        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());

        // Clue tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchClueTab(btn));
        });

        // Pause modal
        document.getElementById('resumeGame').addEventListener('click', () => this.resumeGame());
        document.getElementById('quitGame').addEventListener('click', () => this.quitGame());

        // Score screen
        document.getElementById('playAgain').addEventListener('click', () => this.playAgain());
        document.getElementById('viewLeaderboard').addEventListener('click', () => this.showLeaderboard());
        document.getElementById('backToHome').addEventListener('click', () => this.showScreen('start'));

        // Leaderboard modal
        document.getElementById('closeLeaderboard').addEventListener('click', () => this.hideLeaderboard());
        document.getElementById('leaderboardModal').addEventListener('click', (e) => {
            if (e.target.id === 'leaderboardModal') this.hideLeaderboard();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    // Screen navigation
    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        document.getElementById(screenName + 'Screen').classList.add('active');
        this.currentScreen = screenName;

        // Special handling for different screens
        switch (screenName) {
            case 'game':
                this.startGame();
                break;
            case 'score':
                this.showScore();
                break;
        }
    }

    // Theme management
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);

        const themeBtn = document.getElementById('themeToggle');
        const icon = themeBtn.querySelector('i');
        const text = themeBtn.textContent.trim();

        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
            themeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            themeBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        }
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);

        const themeBtn = document.getElementById('themeToggle');
        if (this.currentTheme === 'dark') {
            themeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        }
    }

    // Registration handling
    handleRegistration(e) {
        e.preventDefault();
        const nameInput = document.getElementById('playerName');
        this.playerName = nameInput.value.trim();

        if (this.playerName) {
            this.showScreen('subject');
        }
    }

    // Subject selection
    selectSubject(card) {
        // Remove previous selection
        document.querySelectorAll('.subject-card').forEach(c => c.classList.remove('selected'));

        // Select new card
        card.classList.add('selected');
        this.selectedSubject = card.dataset.subject;

        // Update difficulty screen text
        const subjectNames = {
            datascience: 'Data Science',
            fundamental: 'Fundamental Data Science',
            engineering: 'Engineering Economy',
            management: 'Industrial Management',
            lifeskills: 'Applied Life Skills',
            environmental: 'Environmental Science'
        };

        document.getElementById('selectedSubject').textContent = subjectNames[this.selectedSubject];

        // Show difficulty screen after a short delay
        setTimeout(() => this.showScreen('difficulty'), 300);
    }

    // Difficulty selection
    selectDifficulty(card) {
        // Remove previous selection
        document.querySelectorAll('.difficulty-card').forEach(c => c.classList.remove('selected'));

        // Select new card
        card.classList.add('selected');
        this.selectedDifficulty = card.dataset.difficulty;

        // Start the game
        setTimeout(() => this.showScreen('game'), 300);
    }

    // Game initialization
    startGame() {
        this.gameData = this.generateCrossword(this.selectedSubject, this.selectedDifficulty);
        this.renderCrossword();
        this.renderClues();
        this.startTimer();
        this.updateGameTitle();
        // reset hint usage each game
        this.hintCount = 0;
        const hintBtn = document.getElementById('hintBtn');
        if (hintBtn) {
            hintBtn.disabled = false;
            hintBtn.innerHTML = '<i class="fas fa-lightbulb"></i> Hint (3 left)';
        }
    }

    // Crossword generation
    generateCrossword(subject, difficulty) {
        const puzzles = this.getPuzzleData(subject, difficulty);
        const selectedPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

        return {
            grid: selectedPuzzle.grid,
            words: selectedPuzzle.words,
            clues: selectedPuzzle.clues,
            subject: subject,
            difficulty: difficulty
        };
    }

    // Get puzzle data based on subject and difficulty
    getPuzzleData(subject, difficulty) {
        const puzzleDatabase = {
            datascience: {
                easy: [
                    {
                        grid: [
                            ['D', 'A', 'T', 'A'],
                            ['A', '', '', ''],
                            ['T', '', '', ''],
                            ['A', '', '', '']
                        ],
                        words: ['DATA', 'DATA'],
                        clues: {
                            across: [
                                { number: 1, clue: 'Raw information for analysis', word: 'DATA' }
                            ],
                            down: [
                                { number: 1, clue: 'Raw information for analysis', word: 'DATA' }
                            ]
                        }
                    }
                ],
                moderate: [
                    {
                        grid: [
                            ['A', 'L', 'G', 'O', 'R', 'I', 'T', 'H', 'M'],
                            ['L', '', '', '', '', '', '', '', ''],
                            ['G', '', '', '', '', '', '', '', ''],
                            ['O', '', '', '', '', '', '', '', '']
                        ],
                        words: ['ALGORITHM', 'ALGO'],
                        clues: {
                            across: [
                                { number: 1, clue: 'Step-by-step problem-solving procedure', word: 'ALGORITHM' }
                            ],
                            down: [
                                { number: 1, clue: 'Short for algorithm', word: 'ALGO' }
                            ]
                        }
                    }
                ],
                hard: [
                    {
                        grid: [
                            ['M', 'A', 'C', 'H', 'I', 'N', 'E', 'L', 'E', 'A', 'R', 'N', 'I', 'N', 'G'],
                            ['A', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                            ['C', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                            ['H', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
                        ],
                        words: ['MACHINELEARNING', 'MACHINE'],
                        clues: {
                            across: [
                                { number: 1, clue: 'AI technique for pattern recognition', word: 'MACHINELEARNING' }
                            ],
                            down: [
                                { number: 1, clue: 'Computing device', word: 'MACHINE' }
                            ]
                        }
                    }
                ]
            },
            fundamental: {
                easy: [
                    {
                        grid: [
                            ['B', 'A', 'S', 'E'],
                            ['A', '', '', ''],
                            ['S', '', '', ''],
                            ['E', '', '', '']
                        ],
                        words: ['BASE', 'BASE'],
                        clues: {
                            across: [
                                { number: 1, clue: 'Foundation or starting point', word: 'BASE' }
                            ],
                            down: [
                                { number: 1, clue: 'Foundation or starting point', word: 'BASE' }
                            ]
                        }
                    }
                ],
                moderate: [
                    {
                        grid: [
                            ['F', 'U', 'N', 'D', 'A', 'M', 'E', 'N', 'T', 'A', 'L'],
                            ['U', '', '', '', '', '', '', '', '', '', ''],
                            ['N', '', '', '', '', '', '', '', '', '', ''],
                            ['D', '', '', '', '', '', '', '', '', '', '']
                        ],
                        words: ['FUNDAMENTAL', 'FUND'],
                        clues: {
                            across: [
                                { number: 1, clue: 'Basic or essential principle', word: 'FUNDAMENTAL' }
                            ],
                            down: [
                                { number: 1, clue: 'Short for fundamental', word: 'FUND' }
                            ]
                        }
                    }
                ],
                hard: [
                    {
                        grid: [
                            ['P', 'R', 'I', 'N', 'C', 'I', 'P', 'L', 'E', 'S'],
                            ['R', '', '', '', '', '', '', '', '', ''],
                            ['I', '', '', '', '', '', '', '', '', ''],
                            ['N', '', '', '', '', '', '', '', '', '']
                        ],
                        words: ['PRINCIPLES', 'PRINCE'],
                        clues: {
                            across: [
                                { number: 1, clue: 'Basic rules or laws', word: 'PRINCIPLES' }
                            ],
                            down: [
                                { number: 1, clue: 'Royal title', word: 'PRINCE' }
                            ]
                        }
                    }
                ]
            },
            engineering: {
                easy: [
                    {
                        grid: [
                            ['C', 'O', 'S', 'T'],
                            ['O', '', '', ''],
                            ['S', '', '', ''],
                            ['T', '', '', '']
                        ],
                        words: ['COST', 'COST'],
                        clues: {
                            across: [
                                { number: 1, clue: 'Expense or price', word: 'COST' }
                            ],
                            down: [
                                { number: 1, clue: 'Expense or price', word: 'COST' }
                            ]
                        }
                    }
                ],
                moderate: [
                    {
                        grid: [
                            ['E', 'C', 'O', 'N', 'O', 'M', 'Y'],
                            ['C', '', '', '', '', '', ''],
                            ['O', '', '', '', '', '', ''],
                            ['N', '', '', '', '', '', '']
                        ],
                        words: ['ECONOMY', 'ECON'],
                        clues: {
                            across: [
                                { number: 1, clue: 'Financial system management', word: 'ECONOMY' }
                            ],
                            down: [
                                { number: 1, clue: 'Short for economy', word: 'ECON' }
                            ]
                        }
                    }
                ],
                hard: [
                    {
                        grid: [
                            ['I', 'N', 'D', 'U', 'S', 'T', 'R', 'I', 'A', 'L'],
                            ['N', '', '', '', '', '', '', '', '', ''],
                            ['D', '', '', '', '', '', '', '', '', ''],
                            ['U', '', '', '', '', '', '', '', '', '']
                        ],
                        words: ['INDUSTRIAL', 'INDUSTRY'],
                        clues: {
                            across: [
                                { number: 1, clue: 'Related to manufacturing', word: 'INDUSTRIAL' }
                            ],
                            down: [
                                { number: 1, clue: 'Business sector', word: 'INDUSTRY' }
                            ]
                        }
                    }
                ]
            },
            management: {
                easy: [
                    {
                        grid: [
                            ['T', 'E', 'A', 'M'],
                            ['E', '', '', ''],
                            ['A', '', '', ''],
                            ['M', '', '', '']
                        ],
                        words: ['TEAM', 'TEAM'],
                        clues: {
                            across: [
                                { number: 1, clue: 'Group working together', word: 'TEAM' }
                            ],
                            down: [
                                { number: 1, clue: 'Group working together', word: 'TEAM' }
                            ]
                        }
                    }
                ],
                moderate: [
                    {
                        grid: [
                            ['M', 'A', 'N', 'A', 'G', 'E', 'M', 'E', 'N', 'T'],
                            ['A', '', '', '', '', '', '', '', '', ''],
                            ['N', '', '', '', '', '', '', '', '', ''],
                            ['A', '', '', '', '', '', '', '', '', '']
                        ],
                        words: ['MANAGEMENT', 'MANAGE'],
                        clues: {
                            across: [
                                { number: 1, clue: 'Process of controlling resources', word: 'MANAGEMENT' }
                            ],
                            down: [
                                { number: 1, clue: 'To control or direct', word: 'MANAGE' }
                            ]
                        }
                    }
                ],
                hard: [
                    {
                        grid: [
                            ['L', 'E', 'A', 'D', 'E', 'R', 'S', 'H', 'I', 'P'],
                            ['E', '', '', '', '', '', '', '', '', ''],
                            ['A', '', '', '', '', '', '', '', '', ''],
                            ['D', '', '', '', '', '', '', '', '', '']
                        ],
                        words: ['LEADERSHIP', 'LEADER'],
                        clues: {
                            across: [
                                { number: 1, clue: 'Ability to guide others', word: 'LEADERSHIP' }
                            ],
                            down: [
                                { number: 1, clue: 'Person who guides', word: 'LEADER' }
                            ]
                        }
                    }
                ]
            },
            lifeskills: {
                easy: [
                    {
                        grid: [
                            ['S', 'K', 'I', 'L', 'L'],
                            ['K', '', '', '', ''],
                            ['I', '', '', '', ''],
                            ['L', '', '', '', ''],
                            ['L', '', '', '', '']
                        ],
                        words: ['SKILL', 'SKILL'],
                        clues: {
                            across: [
                                { number: 1, clue: 'Ability or expertise', word: 'SKILL' }
                            ],
                            down: [
                                { number: 1, clue: 'Ability or expertise', word: 'SKILL' }
                            ]
                        }
                    }
                ],
                moderate: [
                    {
                        grid: [
                            ['C', 'O', 'M', 'M', 'U', 'N', 'I', 'C', 'A', 'T', 'I', 'O', 'N'],
                            ['O', '', '', '', '', '', '', '', '', '', '', '', ''],
                            ['M', '', '', '', '', '', '', '', '', '', '', '', ''],
                            ['M', '', '', '', '', '', '', '', '', '', '', '', '']
                        ],
                        words: ['COMMUNICATION', 'COMM'],
                        clues: {
                            across: [
                                { number: 1, clue: 'Exchange of information', word: 'COMMUNICATION' }
                            ],
                            down: [
                                { number: 1, clue: 'Short for communication', word: 'COMM' }
                            ]
                        }
                    }
                ],
                hard: [
                    {
                        grid: [
                            ['P', 'R', 'O', 'B', 'L', 'E', 'M', 'S', 'O', 'L', 'V', 'I', 'N', 'G'],
                            ['R', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                            ['O', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                            ['B', '', '', '', '', '', '', '', '', '', '', '', '', '']
                        ],
                        words: ['PROBLEMSOLVING', 'PROBLEM'],
                        clues: {
                            across: [
                                { number: 1, clue: 'Process of finding solutions', word: 'PROBLEMSOLVING' }
                            ],
                            down: [
                                { number: 1, clue: 'Issue to be resolved', word: 'PROBLEM' }
                            ]
                        }
                    }
                ]
            },
            environmental: {
                easy: [
                    {
                        grid: [
                            ['E', 'C', 'O'],
                            ['C', '', ''],
                            ['O', '', '']
                        ],
                        words: ['ECO', 'ECO'],
                        clues: {
                            across: [
                                { number: 1, clue: 'Short for ecological', word: 'ECO' }
                            ],
                            down: [
                                { number: 1, clue: 'Short for ecological', word: 'ECO' }
                            ]
                        }
                    }
                ],
                moderate: [
                    {
                        grid: [
                            ['E', 'N', 'V', 'I', 'R', 'O', 'N', 'M', 'E', 'N', 'T'],
                            ['N', '', '', '', '', '', '', '', '', '', ''],
                            ['V', '', '', '', '', '', '', '', '', '', ''],
                            ['I', '', '', '', '', '', '', '', '', '', '']
                        ],
                        words: ['ENVIRONMENT', 'ENVIRO'],
                        clues: {
                            across: [
                                { number: 1, clue: 'Natural surroundings', word: 'ENVIRONMENT' }
                            ],
                            down: [
                                { number: 1, clue: 'Short for environment', word: 'ENVIRO' }
                            ]
                        }
                    }
                ],
                hard: [
                    {
                        grid: [
                            ['S', 'U', 'S', 'T', 'A', 'I', 'N', 'A', 'B', 'I', 'L', 'I', 'T', 'Y'],
                            ['U', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                            ['S', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                            ['T', '', '', '', '', '', '', '', '', '', '', '', '', '']
                        ],
                        words: ['SUSTAINABILITY', 'SUSTAIN'],
                        clues: {
                            across: [
                                { number: 1, clue: 'Ability to maintain resources', word: 'SUSTAINABILITY' }
                            ],
                            down: [
                                { number: 1, clue: 'To maintain or support', word: 'SUSTAIN' }
                            ]
                        }
                    }
                ]
            }
        };

        return puzzleDatabase[subject][difficulty] || puzzleDatabase.datascience.easy;
    }

    // Render crossword grid
    renderCrossword() {
        const grid = document.getElementById('crosswordGrid');
        grid.innerHTML = '';

        const gridData = this.gameData.grid;
        const rows = gridData.length;
        const cols = gridData[0].length;

        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        let cellNumber = 1;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement('div');
                cell.className = 'crossword-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;

                if (gridData[i][j] === '') {
                    cell.classList.add('black');
                } else {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = 1;
                    input.dataset.row = i;
                    input.dataset.col = j;
                    input.dataset.correct = gridData[i][j];

                    // Add cell number if it's the start of a word
                    if (this.isWordStart(i, j, gridData)) {
                        const number = document.createElement('span');
                        number.className = 'cell-number';
                        number.textContent = cellNumber++;
                        cell.appendChild(number);
                    }

                    cell.appendChild(input);

                    // Add event listeners for input
                    input.addEventListener('input', (e) => this.handleInput(e));
                    input.addEventListener('keydown', (e) => this.handleKeydown(e));
                    input.addEventListener('focus', () => this.selectCell(i, j));
                }

                grid.appendChild(cell);
            }
        }
    }

    // Check if cell is the start of a word
    isWordStart(row, col, grid) {
        const char = grid[row][col];
        if (char === '') return false;

        // Check if it's the start of an across word
        const isAcrossStart = col === 0 || grid[row][col - 1] === '';

        // Check if it's the start of a down word
        const isDownStart = row === 0 || grid[row - 1][col] === '';

        return isAcrossStart || isDownStart;
    }

    // Handle input in crossword cells
    handleInput(e) {
        const input = e.target;
        const value = input.value.toUpperCase();
        input.value = value;
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);

        if (value) {
            this.focusNext(row, col);
        }
    }

    // Handle keyboard navigation
    handleKeydown(e) {
        const input = e.target;
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.currentDirection = 'across';
                this.focusPrev(row, col, 'across');
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.currentDirection = 'across';
                this.focusNext(row, col, 'across');
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.currentDirection = 'down';
                this.focusPrev(row, col, 'down');
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.currentDirection = 'down';
                this.focusNext(row, col, 'down');
                break;
            case 'Backspace':
                if (input.value === '') {
                    e.preventDefault();
                    this.focusPrev(row, col);
                }
                break;
        }
    }

    // Focus a specific cell
    focusCell(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"] input`);
        if (cell) {
            cell.focus();
        }
    }

    // Helpers for navigation
    getInputAt(row, col) {
        return document.querySelector(`[data-row="${row}"][data-col="${col}"] input`);
    }

    isValidCell(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        return !!(cell && !cell.classList.contains('black'));
    }

    focusNext(row, col, direction = this.currentDirection) {
        const step = direction === 'down' ? [1, 0] : [0, 1];
        let r = row + step[0];
        let c = col + step[1];
        for (let i = 0; i < 200; i++) {
            if (!this.isValidCell(r, c)) {
                r += step[0];
                c += step[1];
                continue;
            }
            const next = this.getInputAt(r, c);
            if (next) {
                next.focus();
                return;
            }
            r += step[0];
            c += step[1];
        }
    }

    focusPrev(row, col, direction = this.currentDirection) {
        const step = direction === 'down' ? [-1, 0] : [0, -1];
        let r = row + step[0];
        let c = col + step[1];
        for (let i = 0; i < 200; i++) {
            if (!this.isValidCell(r, c)) {
                r += step[0];
                c += step[1];
                continue;
            }
            const prev = this.getInputAt(r, c);
            if (prev) {
                prev.focus();
                return;
            }
            r += step[0];
            c += step[1];
        }
    }

    // Select a cell (highlight it)
    selectCell(row, col) {
        document.querySelectorAll('.crossword-cell').forEach(cell => {
            cell.classList.remove('selected');
        });

        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.classList.add('selected');
        }
    }

    // Render clues
    renderClues() {
        const acrossClues = document.getElementById('acrossClues');
        const downClues = document.getElementById('downClues');

        acrossClues.innerHTML = '';
        downClues.innerHTML = '';

        this.gameData.clues.across.forEach(clue => {
            const clueItem = document.createElement('div');
            clueItem.className = 'clue-item';
            clueItem.innerHTML = `<span class="clue-number">${clue.number}.</span>${clue.clue}`;
            clueItem.addEventListener('click', () => this.selectClue(clue, 'across'));
            acrossClues.appendChild(clueItem);
        });

        this.gameData.clues.down.forEach(clue => {
            const clueItem = document.createElement('div');
            clueItem.className = 'clue-item';
            clueItem.innerHTML = `<span class="clue-number">${clue.number}.</span>${clue.clue}`;
            clueItem.addEventListener('click', () => this.selectClue(clue, 'down'));
            downClues.appendChild(clueItem);
        });
    }

    // Select a clue
    selectClue(clue, direction) {
        // Remove previous selections
        document.querySelectorAll('.clue-item').forEach(item => {
            item.classList.remove('selected');
        });

        // Select current clue
        event.target.closest('.clue-item').classList.add('selected');

        // Find and focus the first cell of this word
        this.focusWordStart(clue.number, direction);
    }

    // Focus the start of a word
    focusWordStart(number, direction) {
        // This is a simplified version - in a real implementation,
        // you'd have a mapping of clue numbers to grid positions
        const firstInput = document.querySelector('.crossword-cell input');
        if (firstInput) {
            firstInput.focus();
        }
    }

    // Switch clue tabs
    switchClueTab(btn) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.clues-list').forEach(list => list.classList.remove('active'));

        btn.classList.add('active');
        const tab = btn.dataset.tab;
        document.getElementById(tab + 'Clues').classList.add('active');
    }

    // Timer functionality
    startTimer() {
        this.startTime = Date.now();
        this.timer = setInterval(() => {
            if (!this.isPaused) {
                this.updateTimer();
            }
        }, 1000);
    }

    updateTimer() {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timer').textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Game controls
    pauseGame() {
        this.isPaused = true;
        document.getElementById('pauseModal').classList.add('active');
    }

    resumeGame() {
        this.isPaused = false;
        document.getElementById('pauseModal').classList.remove('active');
    }

    quitGame() {
        clearInterval(this.timer);
        this.showScreen('start');
        document.getElementById('pauseModal').classList.remove('active');
    }

    // toggleSound removed with sound button

    // Check answers
    checkAnswers() {
        const inputs = document.querySelectorAll('.crossword-cell input');
        let correctCount = 0;
        let totalCount = 0;

        inputs.forEach(input => {
            const correct = (input.dataset.correct || '').toUpperCase();
            const userAnswer = (input.value || '').toUpperCase();

            if (correct) {
                totalCount++;

                // reset previous state
                input.parentElement.classList.remove('correct', 'incorrect');

                if (userAnswer === correct) {
                    input.parentElement.classList.add('correct');
                    correctCount++;
                } else {
                    input.parentElement.classList.add('incorrect');
                }
            }
        });

        let score = 0;
        if (totalCount > 0) {
            score = Math.round((correctCount / totalCount) * 100);
        }

        // Show score screen after a brief delay
        setTimeout(() => {
            this.endGame(score);
        }, 800);
    }

    // Show hint
    showHint() {
        const hintBtn = document.getElementById('hintBtn');
        // enforce limit
        if (this.hintCount >= this.hintLimit) {
            if (hintBtn) hintBtn.disabled = true;
            return;
        }

        const inputs = document.querySelectorAll('.crossword-cell input');
        const unfilledInputs = Array.from(inputs).filter(input =>
            input.value === '' && input.dataset.correct
        );

        if (unfilledInputs.length > 0) {
            const randomInput = unfilledInputs[Math.floor(Math.random() * unfilledInputs.length)];
            randomInput.value = randomInput.dataset.correct;
            randomInput.parentElement.classList.add('correct');

            // count this hint usage only when a cell was successfully filled
            this.hintCount += 1;
            const remaining = Math.max(this.hintLimit - this.hintCount, 0);
            if (hintBtn) {
                hintBtn.innerHTML = `<i class="fas fa-lightbulb"></i> Hint (${remaining} left)`;
                if (this.hintCount >= this.hintLimit) {
                    hintBtn.disabled = true;
                }
            }
        }
    }

    // End game
    endGame(score) {
        clearInterval(this.timer);
        const currentTime = document.getElementById('timer').textContent;
        this.lastResult = {
            score,
            time: currentTime,
            subject: this.selectedSubject,
            difficulty: this.selectedDifficulty,
            name: this.playerName
        };
        this.saveScore(score);
        this.showScreen('score');
    }

    // Update game title
    updateGameTitle() {
        const subjectNames = {
            datascience: 'Data Science',
            fundamental: 'Fundamental Data Science',
            engineering: 'Engineering Economy',
            management: 'Industrial Management',
            lifeskills: 'Applied Life Skills',
            environmental: 'Environmental Science'
        };

        const difficultyNames = {
            easy: 'Easy',
            moderate: 'Moderate',
            hard: 'Hard'
        };

        document.getElementById('gameTitle').textContent =
            `${subjectNames[this.selectedSubject]} - ${difficultyNames[this.selectedDifficulty]}`;
    }

    // Show score screen
    showScore() {
        // Always show the current attempt's result (do not rely on leaderboard ranking)
        const subjectNames = {
            datascience: 'Data Science',
            fundamental: 'Fundamental Data Science',
            engineering: 'Engineering Economy',
            management: 'Industrial Management',
            lifeskills: 'Applied Life Skills',
            environmental: 'Environmental Science'
        };

        const difficultyNames = {
            easy: 'Easy',
            moderate: 'Moderate',
            hard: 'Hard'
        };

        document.getElementById('finalScore').textContent = this.lastResult.score;
        document.getElementById('playerNameDisplay').textContent = this.lastResult.name || this.playerName;
        document.getElementById('timeTaken').textContent = this.lastResult.time;
        document.getElementById('subjectDisplay').textContent = subjectNames[this.lastResult.subject] || '';
        document.getElementById('difficultyDisplay').textContent = difficultyNames[this.lastResult.difficulty] || '';
    }

    // Leaderboard management
    saveScore(score) {
        const leaderboard = this.getLeaderboard();
        const newEntry = {
            name: this.playerName,
            score: score,
            subject: this.selectedSubject,
            difficulty: this.selectedDifficulty,
            time: document.getElementById('timer').textContent,
            date: new Date().toISOString()
        };

        leaderboard.push(newEntry);
        leaderboard.sort((a, b) => b.score - a.score);

        // Keep only top 10 scores
        const topScores = leaderboard.slice(0, 10);
        localStorage.setItem('crosswordLeaderboard', JSON.stringify(topScores));
    }

    getLeaderboard() {
        const saved = localStorage.getItem('crosswordLeaderboard');
        return saved ? JSON.parse(saved) : [];
    }

    loadLeaderboard() {
        // This is called during initialization
        this.leaderboard = this.getLeaderboard();
    }

    showLeaderboard() {
        const leaderboard = this.getLeaderboard();
        const leaderboardList = document.getElementById('leaderboardList');

        if (leaderboard.length === 0) {
            leaderboardList.innerHTML = '<p>No scores yet. Be the first to play!</p>';
        } else {
            leaderboardList.innerHTML = leaderboard.map((entry, index) => `
                <div class="leaderboard-item">
                    <span class="leaderboard-rank">#${index + 1}</span>
                    <span class="leaderboard-name">${entry.name}</span>
                    <span class="leaderboard-score">${entry.score}/100</span>
                </div>
            `).join('');
        }

        document.getElementById('leaderboardModal').classList.add('active');
    }

    hideLeaderboard() {
        document.getElementById('leaderboardModal').classList.remove('active');
    }

    // Play again
    playAgain() {
        this.showScreen('subject');
    }

    // Handle keyboard events
    handleKeyboard(e) {
        if (this.currentScreen === 'game' && !this.isPaused) {
            // Additional keyboard shortcuts can be added here
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CrosswordGame();
}); 