/**
 * Tempo History Input Handler
 */

class TempoInput {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.value = 110; // Default BPM
        this.history = [100, 110, 120]; // Sample history
        this.callbacks = [];
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="input-card tempo-input">
                <div class="input-header">
                    <div class="input-icon">🎵</div>
                    <div class="input-info">
                        <h3>Son Dinlenen Tempo</h3>
                        <p>Son şarkıların ortalama temposu</p>
                    </div>
                </div>
                <div class="tempo-display">
                    <span class="tempo-value" id="tempoValue">${this.value}</span>
                    <span class="tempo-unit">BPM</span>
                </div>
                <div class="slider-container">
                    <span class="slider-label">40</span>
                    <input type="range" id="tempoSlider" min="40" max="200" value="${this.value}" class="premium-slider tempo-slider">
                    <span class="slider-label">200</span>
                </div>
                <div class="tempo-presets">
                    <button class="preset-btn" data-tempo="70">Yavaş</button>
                    <button class="preset-btn active" data-tempo="110">Orta</button>
                    <button class="preset-btn" data-tempo="150">Hızlı</button>
                </div>
                <div class="membership-display" id="tempoMembership">
                    <div class="membership-bar">
                        <div class="membership-item" data-term="slow">
                            <span class="term-label">Yavaş</span>
                            <div class="term-bar"><div class="term-fill" id="tempoSlow"></div></div>
                            <span class="term-value" id="tempoSlowVal">0%</span>
                        </div>
                        <div class="membership-item" data-term="medium">
                            <span class="term-label">Orta</span>
                            <div class="term-bar"><div class="term-fill" id="tempoMedium"></div></div>
                            <span class="term-value" id="tempoMediumVal">100%</span>
                        </div>
                        <div class="membership-item" data-term="fast">
                            <span class="term-label">Hızlı</span>
                            <div class="term-bar"><div class="term-fill" id="tempoFast"></div></div>
                            <span class="term-value" id="tempoFastVal">0%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const slider = document.getElementById('tempoSlider');
        slider.addEventListener('input', (e) => {
            this.value = parseInt(e.target.value);
            this.updateDisplay();
            this.notifyChange();
        });

        const presetBtns = this.container.querySelectorAll('.preset-btn');
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                presetBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.setValue(parseInt(btn.dataset.tempo));
                this.notifyChange();
            });
        });
    }

    updateDisplay() {
        document.getElementById('tempoValue').textContent = this.value;

        // Update presets
        const presetBtns = this.container.querySelectorAll('.preset-btn');
        presetBtns.forEach(btn => {
            const tempo = parseInt(btn.dataset.tempo);
            btn.classList.toggle('active', Math.abs(this.value - tempo) < 20);
        });

        // Update membership degrees
        if (window.FuzzyMembership) {
            const fuzzified = window.FuzzyMembership.FuzzyVariables.tempo.fuzzify(this.value);

            document.getElementById('tempoSlow').style.width = (fuzzified.slow * 100) + '%';
            document.getElementById('tempoSlowVal').textContent = Math.round(fuzzified.slow * 100) + '%';

            document.getElementById('tempoMedium').style.width = (fuzzified.medium * 100) + '%';
            document.getElementById('tempoMediumVal').textContent = Math.round(fuzzified.medium * 100) + '%';

            document.getElementById('tempoFast').style.width = (fuzzified.fast * 100) + '%';
            document.getElementById('tempoFastVal').textContent = Math.round(fuzzified.fast * 100) + '%';
        }
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = window.Utils.clamp(value, 40, 200);
        document.getElementById('tempoSlider').value = this.value;
        this.updateDisplay();
    }

    onChange(callback) {
        this.callbacks.push(callback);
    }

    notifyChange() {
        this.callbacks.forEach(cb => cb(this.value));
    }
}

window.TempoInput = TempoInput;
