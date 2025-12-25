/**
 * Ambient Brightness Input Handler
 */

class BrightnessInput {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.value = 50;
        this.callbacks = [];
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="input-card brightness-input">
                <div class="input-header">
                    <div class="input-icon">💡</div>
                    <div class="input-info">
                        <h3>Ortam Parlaklığı</h3>
                        <p>Bulunduğunuz ortamın ışık seviyesi</p>
                    </div>
                </div>
                <div class="brightness-display">
                    <div class="brightness-indicator" id="brightnessIndicator">
                        <span class="brightness-icon" id="brightnessIcon">🌙</span>
                    </div>
                    <span class="brightness-label" id="brightnessLabel">Loş</span>
                </div>
                <div class="slider-container">
                    <span class="slider-label">🌑</span>
                    <input type="range" id="brightnessSlider" min="0" max="100" value="50" class="premium-slider brightness-slider">
                    <span class="slider-label">☀️</span>
                </div>
                <div class="membership-display" id="brightnessMembership">
                    <div class="membership-bar">
                        <div class="membership-item">
                            <span class="term-label">Karanlık</span>
                            <div class="term-bar"><div class="term-fill" id="brightnessDark"></div></div>
                            <span class="term-value" id="brightnessDarkVal">0%</span>
                        </div>
                        <div class="membership-item">
                            <span class="term-label">Loş</span>
                            <div class="term-bar"><div class="term-fill" id="brightnessDim"></div></div>
                            <span class="term-value" id="brightnessDimVal">100%</span>
                        </div>
                        <div class="membership-item">
                            <span class="term-label">Aydınlık</span>
                            <div class="term-bar"><div class="term-fill" id="brightnessBright"></div></div>
                            <span class="term-value" id="brightnessBrightVal">0%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const slider = document.getElementById('brightnessSlider');
        slider.addEventListener('input', (e) => {
            this.value = parseInt(e.target.value);
            this.updateDisplay();
            this.notifyChange();
        });
    }

    updateDisplay() {
        const icon = document.getElementById('brightnessIcon');
        const label = document.getElementById('brightnessLabel');
        const indicator = document.getElementById('brightnessIndicator');

        if (this.value < 33) {
            icon.textContent = '🌑';
            label.textContent = 'Karanlık';
            indicator.style.background = 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)';
        } else if (this.value < 66) {
            icon.textContent = '🌙';
            label.textContent = 'Loş';
            indicator.style.background = 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)';
        } else {
            icon.textContent = '☀️';
            label.textContent = 'Aydınlık';
            indicator.style.background = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
        }

        if (window.FuzzyMembership) {
            const fuzzified = window.FuzzyMembership.FuzzyVariables.brightness.fuzzify(this.value);

            document.getElementById('brightnessDark').style.width = (fuzzified.dark * 100) + '%';
            document.getElementById('brightnessDarkVal').textContent = Math.round(fuzzified.dark * 100) + '%';

            document.getElementById('brightnessDim').style.width = (fuzzified.dim * 100) + '%';
            document.getElementById('brightnessDimVal').textContent = Math.round(fuzzified.dim * 100) + '%';

            document.getElementById('brightnessBright').style.width = (fuzzified.bright * 100) + '%';
            document.getElementById('brightnessBrightVal').textContent = Math.round(fuzzified.bright * 100) + '%';
        }
    }

    getValue() { return this.value; }

    setValue(value) {
        this.value = window.Utils.clamp(value, 0, 100);
        document.getElementById('brightnessSlider').value = this.value;
        this.updateDisplay();
    }

    onChange(callback) { this.callbacks.push(callback); }
    notifyChange() { this.callbacks.forEach(cb => cb(this.value)); }
}

window.BrightnessInput = BrightnessInput;
