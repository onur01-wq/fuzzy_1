/**
 * Facial Expression Input Handler
 */

class FacialInput {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.value = 50; // Default: neutral
        this.callbacks = [];
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="input-card facial-input">
                <div class="input-header">
                    <div class="input-icon">😊</div>
                    <div class="input-info">
                        <h3>Yüz İfadesi</h3>
                        <p>Mevcut ruh halinizi seçin</p>
                    </div>
                </div>
                <div class="emoji-display">
                    <span class="emoji-indicator" id="facialEmoji">😐</span>
                    <span class="emotion-label" id="facialLabel">Nötr</span>
                </div>
                <div class="slider-container">
                    <span class="slider-label">😢</span>
                    <input type="range" id="facialSlider" min="0" max="100" value="50" class="premium-slider">
                    <span class="slider-label">😊</span>
                </div>
                <div class="membership-display" id="facialMembership">
                    <div class="membership-bar">
                        <div class="membership-item" data-term="sad">
                            <span class="term-label">Üzgün</span>
                            <div class="term-bar"><div class="term-fill" id="facialSad"></div></div>
                            <span class="term-value" id="facialSadVal">0%</span>
                        </div>
                        <div class="membership-item" data-term="neutral">
                            <span class="term-label">Nötr</span>
                            <div class="term-bar"><div class="term-fill" id="facialNeutral"></div></div>
                            <span class="term-value" id="facialNeutralVal">100%</span>
                        </div>
                        <div class="membership-item" data-term="happy">
                            <span class="term-label">Mutlu</span>
                            <div class="term-bar"><div class="term-fill" id="facialHappy"></div></div>
                            <span class="term-value" id="facialHappyVal">0%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const slider = document.getElementById('facialSlider');
        slider.addEventListener('input', (e) => {
            this.value = parseInt(e.target.value);
            this.updateDisplay();
            this.notifyChange();
        });
    }

    updateDisplay() {
        const emoji = document.getElementById('facialEmoji');
        const label = document.getElementById('facialLabel');

        // Update emoji based on value
        if (this.value < 33) {
            emoji.textContent = '😢';
            label.textContent = 'Üzgün';
        } else if (this.value < 66) {
            emoji.textContent = '😐';
            label.textContent = 'Nötr';
        } else {
            emoji.textContent = '😊';
            label.textContent = 'Mutlu';
        }

        // Update membership degrees
        if (window.FuzzyMembership) {
            const fuzzified = window.FuzzyMembership.FuzzyVariables.facial.fuzzify(this.value);

            document.getElementById('facialSad').style.width = (fuzzified.sad * 100) + '%';
            document.getElementById('facialSadVal').textContent = Math.round(fuzzified.sad * 100) + '%';

            document.getElementById('facialNeutral').style.width = (fuzzified.neutral * 100) + '%';
            document.getElementById('facialNeutralVal').textContent = Math.round(fuzzified.neutral * 100) + '%';

            document.getElementById('facialHappy').style.width = (fuzzified.happy * 100) + '%';
            document.getElementById('facialHappyVal').textContent = Math.round(fuzzified.happy * 100) + '%';
        }
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = window.Utils.clamp(value, 0, 100);
        document.getElementById('facialSlider').value = this.value;
        this.updateDisplay();
    }

    onChange(callback) {
        this.callbacks.push(callback);
    }

    notifyChange() {
        this.callbacks.forEach(cb => cb(this.value));
    }
}

window.FacialInput = FacialInput;
