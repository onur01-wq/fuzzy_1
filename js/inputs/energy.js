/**
 * Energy Level Input Handler
 */

class EnergyInput {
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
            <div class="input-card energy-input">
                <div class="input-header">
                    <div class="input-icon">⚡</div>
                    <div class="input-info">
                        <h3>Enerji Seviyesi</h3>
                        <p>Şu anki enerji durumunuz</p>
                    </div>
                </div>
                <div class="energy-display">
                    <div class="energy-meter">
                        <div class="energy-fill" id="energyFill" style="width: 50%"></div>
                    </div>
                    <span class="energy-value" id="energyValue">50%</span>
                </div>
                <div class="slider-container">
                    <span class="slider-label">🔋</span>
                    <input type="range" id="energySlider" min="0" max="100" value="50" class="premium-slider energy-slider">
                    <span class="slider-label">⚡</span>
                </div>
                <div class="membership-display" id="energyMembership">
                    <div class="membership-bar">
                        <div class="membership-item">
                            <span class="term-label">Düşük</span>
                            <div class="term-bar"><div class="term-fill" id="energyLow"></div></div>
                            <span class="term-value" id="energyLowVal">0%</span>
                        </div>
                        <div class="membership-item">
                            <span class="term-label">Orta</span>
                            <div class="term-bar"><div class="term-fill" id="energyMedium"></div></div>
                            <span class="term-value" id="energyMediumVal">100%</span>
                        </div>
                        <div class="membership-item">
                            <span class="term-label">Yüksek</span>
                            <div class="term-bar"><div class="term-fill" id="energyHigh"></div></div>
                            <span class="term-value" id="energyHighVal">0%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const slider = document.getElementById('energySlider');
        slider.addEventListener('input', (e) => {
            this.value = parseInt(e.target.value);
            this.updateDisplay();
            this.notifyChange();
        });
    }

    updateDisplay() {
        document.getElementById('energyValue').textContent = this.value + '%';
        document.getElementById('energyFill').style.width = this.value + '%';

        // Update gradient color based on value
        const fill = document.getElementById('energyFill');
        if (this.value < 33) {
            fill.style.background = 'linear-gradient(90deg, #6366f1, #8b5cf6)';
        } else if (this.value < 66) {
            fill.style.background = 'linear-gradient(90deg, #8b5cf6, #ec4899)';
        } else {
            fill.style.background = 'linear-gradient(90deg, #f97316, #ef4444)';
        }

        if (window.FuzzyMembership) {
            const fuzzified = window.FuzzyMembership.FuzzyVariables.energy.fuzzify(this.value);

            document.getElementById('energyLow').style.width = (fuzzified.low * 100) + '%';
            document.getElementById('energyLowVal').textContent = Math.round(fuzzified.low * 100) + '%';

            document.getElementById('energyMedium').style.width = (fuzzified.medium * 100) + '%';
            document.getElementById('energyMediumVal').textContent = Math.round(fuzzified.medium * 100) + '%';

            document.getElementById('energyHigh').style.width = (fuzzified.high * 100) + '%';
            document.getElementById('energyHighVal').textContent = Math.round(fuzzified.high * 100) + '%';
        }
    }

    getValue() { return this.value; }

    setValue(value) {
        this.value = window.Utils.clamp(value, 0, 100);
        document.getElementById('energySlider').value = this.value;
        this.updateDisplay();
    }

    onChange(callback) { this.callbacks.push(callback); }
    notifyChange() { this.callbacks.forEach(cb => cb(this.value)); }
}

window.EnergyInput = EnergyInput;
