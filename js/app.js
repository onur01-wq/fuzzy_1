/**
 * Fuzzy Logic Music Recommendation System
 * Main Application Controller
 */

class App {
    constructor() {
        this.fuzzyEngine = null;
        this.inputs = {};
        this.init();
    }

    init() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Initialize fuzzy engine
        this.fuzzyEngine = new window.FuzzyEngine();

        // Initialize input handlers
        this.inputs.facial = new window.FacialInput('facialInputContainer');
        this.inputs.tempo = new window.TempoInput('tempoInputContainer');
        this.inputs.energy = new window.EnergyInput('energyInputContainer');
        this.inputs.brightness = new window.BrightnessInput('brightnessInputContainer');

        // Update displays
        this.inputs.facial.updateDisplay();
        this.inputs.tempo.updateDisplay();
        this.inputs.energy.updateDisplay();
        this.inputs.brightness.updateDisplay();

        // Setup event listeners
        this.setupEventListeners();

        // Load saved state
        this.loadState();

        console.log('🎵 Fuzzy Music Recommender initialized');
        console.log(`📊 ${this.fuzzyEngine.ruleBase.count} fuzzy rules loaded`);
    }

    setupEventListeners() {
        // Infer button
        const inferBtn = document.getElementById('inferBtn');
        inferBtn.addEventListener('click', () => this.runInference());

        // Input change handlers
        const debouncedSave = window.Utils.debounce(() => this.saveState(), 500);

        this.inputs.facial.onChange(() => debouncedSave());
        this.inputs.tempo.onChange(() => debouncedSave());
        this.inputs.energy.onChange(() => debouncedSave());
        this.inputs.brightness.onChange(() => debouncedSave());

        // Language selector
        const langTr = document.getElementById('langTr');
        const langEn = document.getElementById('langEn');

        if (langTr && langEn) {
            langTr.addEventListener('click', () => this.setLanguage('tr'));
            langEn.addEventListener('click', () => this.setLanguage('en'));
        }

        // Modal close
        document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
        document.getElementById('youtubeModal').addEventListener('click', (e) => {
            if (e.target.id === 'youtubeModal') this.closeModal();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
            if (e.key === 'Enter' && e.ctrlKey) this.runInference();
        });
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        window.YouTubeManager.setLanguage(lang);

        // Update UI
        const langTr = document.getElementById('langTr');
        const langEn = document.getElementById('langEn');

        if (lang === 'tr') {
            langTr.classList.add('active');
            langEn.classList.remove('active');
        } else {
            langEn.classList.add('active');
            langTr.classList.remove('active');
        }

        // Save preference
        window.Utils.storage.set('musicLanguage', lang);
        console.log('🌍 Language changed to:', lang === 'tr' ? 'Türkçe' : 'International');
    }

    getInputValues() {
        return {
            facial: this.inputs.facial.getValue(),
            tempo: this.inputs.tempo.getValue(),
            energy: this.inputs.energy.getValue(),
            brightness: this.inputs.brightness.getValue()
        };
    }

    async runInference() {
        const inputs = this.getInputValues();

        // Show loading state
        const inferBtn = document.getElementById('inferBtn');
        const originalText = inferBtn.innerHTML;
        inferBtn.innerHTML = '<span class="loading-spinner"></span><span>Müzik Aranıyor...</span>';
        inferBtn.disabled = true;

        // Run fuzzy inference
        const result = this.fuzzyEngine.infer(inputs);

        try {
            // Get music recommendations from API (async)
            const recommendation = await window.MusicRecommender.getRecommendationAsync(result.output);

            // Display results
            this.displayResults(result, recommendation);

            console.log('🔮 Inference complete:', result);
            console.log('🎵 Recommendation:', recommendation);
            console.log('📡 Source:', recommendation.source);
        } catch (error) {
            console.warn('API failed, using fallback:', error);
            // Fallback to sync method
            const recommendation = window.MusicRecommender.getRecommendation(result.output);
            this.displayResults(result, recommendation);
        }

        // Restore button
        inferBtn.innerHTML = originalText;
        inferBtn.disabled = false;

        // Save state
        this.saveState();
    }

    displayResults(result, recommendation) {
        // Hide initial state
        document.getElementById('initialState').style.display = 'none';

        // Show results container
        const container = document.getElementById('resultsContainer');
        container.classList.add('show');

        // Display genre
        this.displayGenre(recommendation.genre);

        // Display tempo
        this.displayTempo(recommendation.tempo);

        // Display songs
        this.displaySongs(recommendation.songs);

        // Display active rules
        this.displayRules(result.activeRules);

        // Update dashboard with results
        if (window.FuzzyDashboard) {
            window.FuzzyDashboard.updateWithResults(result, recommendation);
        }
    }

    displayGenre(genre) {
        const genreResult = document.getElementById('genreResult');
        const badge = document.getElementById('genreBadge');
        const description = document.getElementById('genreDescription');

        genreResult.style.display = 'block';
        badge.innerHTML = `<span>${genre.name}</span>`;
        badge.style.background = genre.gradient;
        description.textContent = genre.descriptionTr;

        // Animate
        genreResult.classList.add('animate-bounce-in');
    }

    displayTempo(tempo) {
        const tempoResult = document.getElementById('tempoResult');
        const tempoValue = document.getElementById('tempoResultValue');
        const tempoCategory = document.getElementById('tempoCategory');

        tempoResult.style.display = 'block';

        // Animate value
        window.Utils.animateValue(tempoValue, 0, tempo.bpm, 1000);
        tempoCategory.textContent = tempo.descriptionTr;
    }

    displaySongs(songs) {
        const songsSection = document.getElementById('songsSection');
        const songsGrid = document.getElementById('songsGrid');

        songsSection.style.display = 'block';
        songsGrid.innerHTML = '';

        songs.forEach((song, index) => {
            const card = document.createElement('div');
            card.className = 'song-card';
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div class="song-thumbnail">
                    <img src="${song.thumbnail}" alt="${song.title}" loading="lazy">
                    <div class="play-overlay">
                        <span class="play-icon">▶️</span>
                    </div>
                </div>
                <div class="song-info">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
            `;

            card.addEventListener('click', () => this.openVideo(song));
            songsGrid.appendChild(card);
        });
    }

    displayRules(activeRules) {
        const rulesDisplay = document.getElementById('rulesDisplay');
        const rulesList = document.getElementById('rulesList');

        rulesDisplay.style.display = 'block';
        rulesList.innerHTML = '';

        activeRules.slice(0, 5).forEach(rule => {
            const item = document.createElement('div');
            item.className = 'rule-item';
            item.innerHTML = `
                <span class="rule-text">${rule.description.replace('IF ', '').replace(' THEN ', ' → ')}</span>
                <span class="rule-strength">${Math.round(rule.strength * 100)}%</span>
            `;
            rulesList.appendChild(item);
        });
    }

    openVideo(song) {
        // If it's an iTunes song (no embedUrl), open YouTube search
        if (!song.embedUrl || !song.isYouTube) {
            // Open YouTube search for this song
            const searchQuery = encodeURIComponent(`${song.artist} ${song.title} official`);
            window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
            return;
        }

        // YouTube video - play in modal
        const modal = document.getElementById('youtubeModal');
        const player = document.getElementById('youtubePlayer');
        const title = document.getElementById('modalTitle');

        title.textContent = `${song.title} - ${song.artist}`;
        player.src = `${song.embedUrl}&autoplay=1`;
        modal.classList.add('show');
    }

    closeModal() {
        const modal = document.getElementById('youtubeModal');
        const player = document.getElementById('youtubePlayer');

        modal.classList.remove('show');
        player.src = '';
    }

    saveState() {
        const state = {
            facial: this.inputs.facial.getValue(),
            tempo: this.inputs.tempo.getValue(),
            energy: this.inputs.energy.getValue(),
            brightness: this.inputs.brightness.getValue()
        };
        window.Utils.storage.set('fuzzyInputs', state);
    }

    loadState() {
        const state = window.Utils.storage.get('fuzzyInputs');
        if (state) {
            this.inputs.facial.setValue(state.facial || 50);
            this.inputs.tempo.setValue(state.tempo || 110);
            this.inputs.energy.setValue(state.energy || 50);
            this.inputs.brightness.setValue(state.brightness || 50);
        }

        // Load language preference
        const savedLang = window.Utils.storage.get('musicLanguage') || 'tr';
        this.setLanguage(savedLang);
    }
}

// Test suite for fuzzy logic verification
window.FuzzyTest = {
    runAllTests() {
        console.log('🧪 Running Fuzzy Logic Tests...\n');

        const engine = new window.FuzzyEngine();
        const tests = [
            { inputs: { facial: 0, tempo: 60, energy: 0, brightness: 0 }, expected: 'melancholic' },
            { inputs: { facial: 50, tempo: 110, energy: 50, brightness: 50 }, expected: 'pop' },
            { inputs: { facial: 100, tempo: 180, energy: 100, brightness: 100 }, expected: 'intense' },
        ];

        tests.forEach((test, i) => {
            const result = engine.infer(test.inputs);
            const passed = result.output.genre.name.toLowerCase() === test.expected;
            console.log(`Test ${i + 1}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
            console.log(`  Inputs:`, test.inputs);
            console.log(`  Expected: ${test.expected}, Got: ${result.output.genre.name}`);
            console.log(`  Tempo: ${result.output.tempo} BPM\n`);
        });
    }
};

// Initialize app
const app = new App();
