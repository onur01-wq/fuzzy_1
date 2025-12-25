/**
 * Fuzzy Logic Dashboard Visualization Module
 * Canvas-based charts and real-time updates
 */

const FuzzyDashboard = {
    colors: {
        primary: '#8b5cf6',
        secondary: '#ec4899',
        tertiary: '#6366f1',
        accent: '#4facfe',
        success: '#10b981',
        warning: '#f59e0b',
        muted: 'rgba(255, 255, 255, 0.3)',
        grid: 'rgba(255, 255, 255, 0.1)'
    },

    termColors: {
        sad: '#6366f1',
        neutral: '#8b5cf6',
        happy: '#ec4899',
        slow: '#4facfe',
        medium: '#8b5cf6',
        fast: '#ec4899',
        low: '#4facfe',
        high: '#ec4899',
        dark: '#6366f1',
        dim: '#8b5cf6',
        bright: '#f59e0b',
        melancholic: '#6366f1',
        chill: '#8b5cf6',
        pop: '#ec4899',
        energetic: '#f59e0b',
        intense: '#ef4444',
        moderate: '#10b981',
        upbeat: '#f59e0b'
    },

    init() {
        this.setupEventListeners();
        this.drawMembershipChart('facial');
        console.log('📊 Fuzzy Dashboard initialized');
    },

    setupEventListeners() {
        const select = document.getElementById('membershipVarSelect');
        if (select) {
            select.addEventListener('change', (e) => {
                this.drawMembershipChart(e.target.value);
            });
        }
    },

    /**
     * Draw membership function chart on canvas
     */
    drawMembershipChart(varName) {
        const canvas = document.getElementById('membershipChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;
        const padding = { top: 20, right: 20, bottom: 30, left: 40 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Get fuzzy variable definition
        const varConfig = this.getVariableConfig(varName);
        if (!varConfig) return;

        // Draw grid
        this.drawGrid(ctx, padding, chartWidth, chartHeight, varConfig);

        // Draw membership functions
        varConfig.terms.forEach((term, index) => {
            this.drawMembershipFunction(ctx, term, varConfig, padding, chartWidth, chartHeight, index);
        });

        // Draw current value indicator if available
        this.drawCurrentValueIndicator(ctx, varName, varConfig, padding, chartWidth, chartHeight);

        // Update legend
        this.updateLegend(varConfig);
    },

    getVariableConfig(varName) {
        const configs = {
            facial: {
                name: 'Yüz İfadesi',
                range: [0, 100],
                terms: [
                    { name: 'Üzgün', key: 'sad', type: 'triangular', params: [0, 0, 50] },
                    { name: 'Nötr', key: 'neutral', type: 'triangular', params: [0, 50, 100] },
                    { name: 'Mutlu', key: 'happy', type: 'triangular', params: [50, 100, 100] }
                ]
            },
            tempo: {
                name: 'Tempo (BPM)',
                range: [40, 200],
                terms: [
                    { name: 'Yavaş', key: 'slow', type: 'trapezoidal', params: [40, 40, 70, 100] },
                    { name: 'Orta', key: 'medium', type: 'triangular', params: [70, 110, 150] },
                    { name: 'Hızlı', key: 'fast', type: 'trapezoidal', params: [120, 160, 200, 200] }
                ]
            },
            energy: {
                name: 'Enerji Seviyesi',
                range: [0, 100],
                terms: [
                    { name: 'Düşük', key: 'low', type: 'triangular', params: [0, 0, 50] },
                    { name: 'Orta', key: 'medium', type: 'triangular', params: [0, 50, 100] },
                    { name: 'Yüksek', key: 'high', type: 'triangular', params: [50, 100, 100] }
                ]
            },
            brightness: {
                name: 'Parlaklık',
                range: [0, 100],
                terms: [
                    { name: 'Karanlık', key: 'dark', type: 'triangular', params: [0, 0, 50] },
                    { name: 'Loş', key: 'dim', type: 'triangular', params: [0, 50, 100] },
                    { name: 'Aydınlık', key: 'bright', type: 'triangular', params: [50, 100, 100] }
                ]
            },
            genre: {
                name: 'Müzik Türü',
                range: [0, 100],
                terms: [
                    { name: 'Melankolik', key: 'melancholic', type: 'triangular', params: [0, 0, 25] },
                    { name: 'Chill', key: 'chill', type: 'triangular', params: [0, 25, 50] },
                    { name: 'Pop', key: 'pop', type: 'triangular', params: [25, 50, 75] },
                    { name: 'Enerjik', key: 'energetic', type: 'triangular', params: [50, 75, 100] },
                    { name: 'Intense', key: 'intense', type: 'triangular', params: [75, 100, 100] }
                ]
            },
            outputTempo: {
                name: 'Çıkış Tempo',
                range: [60, 180],
                terms: [
                    { name: 'Yavaş', key: 'slow', type: 'trapezoidal', params: [60, 60, 75, 100] },
                    { name: 'Orta', key: 'moderate', type: 'triangular', params: [80, 110, 140] },
                    { name: 'Hızlı', key: 'upbeat', type: 'triangular', params: [120, 145, 170] },
                    { name: 'Çok Hızlı', key: 'fast', type: 'trapezoidal', params: [150, 170, 180, 180] }
                ]
            }
        };
        return configs[varName];
    },

    drawGrid(ctx, padding, chartWidth, chartHeight, config) {
        ctx.strokeStyle = this.colors.grid;
        ctx.lineWidth = 1;
        ctx.font = '10px Inter, sans-serif';
        ctx.fillStyle = this.colors.muted;

        // Horizontal lines (membership degree)
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartHeight * i / 4);
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + chartWidth, y);
            ctx.stroke();

            const degree = 1 - (i / 4);
            ctx.fillText(degree.toFixed(1), padding.left - 25, y + 4);
        }

        // Vertical lines (x-axis values)
        const [min, max] = config.range;
        for (let i = 0; i <= 5; i++) {
            const x = padding.left + (chartWidth * i / 5);
            ctx.beginPath();
            ctx.moveTo(x, padding.top);
            ctx.lineTo(x, padding.top + chartHeight);
            ctx.stroke();

            const value = min + ((max - min) * i / 5);
            ctx.fillText(Math.round(value).toString(), x - 10, padding.top + chartHeight + 15);
        }
    },

    drawMembershipFunction(ctx, term, config, padding, chartWidth, chartHeight, index) {
        const [min, max] = config.range;
        const color = this.termColors[term.key] || this.colors.primary;

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        const points = this.getMembershipPoints(term, min, max, padding, chartWidth, chartHeight);

        if (points.length > 0) {
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
        }

        ctx.stroke();

        // Fill with transparency
        ctx.fillStyle = color.replace(')', ', 0.1)').replace('rgb', 'rgba');
        if (color.startsWith('#')) {
            ctx.fillStyle = this.hexToRgba(color, 0.1);
        }
        ctx.fill();
    },

    getMembershipPoints(term, min, max, padding, chartWidth, chartHeight) {
        const points = [];
        const steps = 100;

        for (let i = 0; i <= steps; i++) {
            const x = min + (max - min) * i / steps;
            let membership = 0;

            if (term.type === 'triangular') {
                const [a, b, c] = term.params;
                if (x <= a || x >= c) membership = 0;
                else if (x < b) membership = (x - a) / (b - a);
                else membership = (c - x) / (c - b);
            } else if (term.type === 'trapezoidal') {
                const [a, b, c, d] = term.params;
                if (x <= a || x >= d) membership = 0;
                else if (x >= b && x <= c) membership = 1;
                else if (x < b) membership = (x - a) / (b - a);
                else membership = (d - x) / (d - c);
            }

            membership = Math.max(0, Math.min(1, membership));

            const px = padding.left + ((x - min) / (max - min)) * chartWidth;
            const py = padding.top + (1 - membership) * chartHeight;
            points.push({ x: px, y: py });
        }

        // Close path for fill
        points.push({ x: padding.left + chartWidth, y: padding.top + chartHeight });
        points.push({ x: padding.left, y: padding.top + chartHeight });

        return points;
    },

    drawCurrentValueIndicator(ctx, varName, config, padding, chartWidth, chartHeight) {
        // Get current input value from app if available
        let currentValue = null;

        if (window.app && window.app.inputs) {
            if (varName === 'facial') currentValue = window.app.inputs.facial?.getValue();
            else if (varName === 'tempo') currentValue = window.app.inputs.tempo?.getValue();
            else if (varName === 'energy') currentValue = window.app.inputs.energy?.getValue();
            else if (varName === 'brightness') currentValue = window.app.inputs.brightness?.getValue();
        }

        if (currentValue !== null && currentValue !== undefined) {
            const [min, max] = config.range;
            const x = padding.left + ((currentValue - min) / (max - min)) * chartWidth;

            // Draw vertical line
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(x, padding.top);
            ctx.lineTo(x, padding.top + chartHeight);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw value label
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.fillText(Math.round(currentValue).toString(), x - 10, padding.top - 5);
        }
    },

    updateLegend(config) {
        const legend = document.getElementById('membershipLegend');
        if (!legend) return;

        legend.innerHTML = config.terms.map(term => {
            const color = this.termColors[term.key] || this.colors.primary;
            return `
                <div class="legend-item">
                    <div class="legend-color" style="background: ${color}"></div>
                    <span>${term.name}</span>
                </div>
            `;
        }).join('');
    },

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    /**
     * Update dashboard with inference results
     */
    updateWithResults(result, recommendation) {
        // Update system status
        const statusEl = document.getElementById('systemStatus');
        if (statusEl) {
            statusEl.textContent = 'Çıkarım Tamamlandı';
            statusEl.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        }

        // Update active rules count
        const activeRulesEl = document.getElementById('statActiveRules');
        if (activeRulesEl && result.activeRules) {
            activeRulesEl.textContent = result.activeRules.length;
        }

        // Update defuzzification values
        if (result.output) {
            const defuzzGenre = document.getElementById('defuzzGenre');
            const defuzzTempo = document.getElementById('defuzzTempo');

            if (defuzzGenre) defuzzGenre.textContent = `${Math.round(result.output.genreValue)} (${result.output.genre.name})`;
            if (defuzzTempo) defuzzTempo.textContent = `${Math.round(result.output.tempo)} BPM`;
        }

        // Update fuzzification analysis
        this.updateFuzzificationAnalysis(result);

        // Update rule metrics
        this.updateRuleMetrics(result.activeRules || []);

        // Update rule heatmap
        this.updateRuleHeatmap(result.activeRules || []);

        // Update input values display
        this.updateInputValuesDisplay();

        // Redraw membership chart with current values
        const currentVar = document.getElementById('membershipVarSelect')?.value || 'facial';
        this.drawMembershipChart(currentVar);

        // Draw defuzzification chart
        this.drawDefuzzChart(result);
    },

    /**
     * Update fuzzification analysis panel with membership degrees
     */
    updateFuzzificationAnalysis(result) {
        if (!window.app || !window.app.inputs) return;

        const facial = window.app.inputs.facial?.getValue() || 50;
        const tempo = window.app.inputs.tempo?.getValue() || 110;
        const energy = window.app.inputs.energy?.getValue() || 50;
        const brightness = window.app.inputs.brightness?.getValue() || 50;

        // Update crisp values
        this.updateElement('fuzzFacialCrisp', facial);
        this.updateElement('fuzzTempoCrisp', `${tempo} BPM`);
        this.updateElement('fuzzEnergyCrisp', `${energy}%`);
        this.updateElement('fuzzBrightnessCrisp', `${brightness}%`);

        // Get fuzzified values from membership module
        if (window.FuzzyMembership) {
            // Facial Expression
            const facialFuzz = window.FuzzyMembership.FuzzyVariables.facial.fuzzify(facial);
            this.updateFuzzTerm('fuzzFacialSad', facialFuzz.sad);
            this.updateFuzzTerm('fuzzFacialNeutral', facialFuzz.neutral);
            this.updateFuzzTerm('fuzzFacialHappy', facialFuzz.happy);

            // Tempo
            const tempoFuzz = window.FuzzyMembership.FuzzyVariables.tempo.fuzzify(tempo);
            this.updateFuzzTerm('fuzzTempoSlow', tempoFuzz.slow);
            this.updateFuzzTerm('fuzzTempoMedium', tempoFuzz.medium);
            this.updateFuzzTerm('fuzzTempoFast', tempoFuzz.fast);

            // Energy
            const energyFuzz = window.FuzzyMembership.FuzzyVariables.energy.fuzzify(energy);
            this.updateFuzzTerm('fuzzEnergyLow', energyFuzz.low);
            this.updateFuzzTerm('fuzzEnergyMedium', energyFuzz.medium);
            this.updateFuzzTerm('fuzzEnergyHigh', energyFuzz.high);

            // Brightness
            const brightFuzz = window.FuzzyMembership.FuzzyVariables.brightness.fuzzify(brightness);
            this.updateFuzzTerm('fuzzBrightnessDark', brightFuzz.dark);
            this.updateFuzzTerm('fuzzBrightnessDim', brightFuzz.dim);
            this.updateFuzzTerm('fuzzBrightnessBright', brightFuzz.bright);
        }
    },

    updateFuzzTerm(id, value) {
        const bar = document.getElementById(id);
        const valEl = document.getElementById(id + 'Val');
        if (bar) bar.style.width = `${value * 100}%`;
        if (valEl) valEl.textContent = value.toFixed(2);
    },

    updateElement(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    },

    /**
     * Update rule evaluation metrics
     */
    updateRuleMetrics(activeRules) {
        const totalRules = 81;
        const activeCount = activeRules.length;
        const activePercent = Math.round((activeCount / totalRules) * 100);

        // Active rules
        this.updateElement('statActiveRules', activeCount);
        this.updateElement('activeRulesPercent', `${activePercent}%`);
        const activeBar = document.getElementById('activeRulesBar');
        if (activeBar) activeBar.style.width = `${activePercent}%`;

        if (activeRules.length > 0) {
            // Get strengths
            const strengths = activeRules.map(r => r.strength);
            const maxStrength = Math.max(...strengths);
            const avgStrength = strengths.reduce((a, b) => a + b, 0) / strengths.length;

            // Max firing strength
            this.updateElement('maxFiringStrength', maxStrength.toFixed(2));
            this.updateElement('maxFiringPercent', `${Math.round(maxStrength * 100)}%`);
            const maxBar = document.getElementById('maxFiringBar');
            if (maxBar) maxBar.style.width = `${maxStrength * 100}%`;

            // Average firing strength
            this.updateElement('avgFiringStrength', avgStrength.toFixed(2));
            this.updateElement('avgFiringPercent', `${Math.round(avgStrength * 100)}%`);
            const avgBar = document.getElementById('avgFiringBar');
            if (avgBar) avgBar.style.width = `${avgStrength * 100}%`;

            // Dominant rule
            const dominantRule = activeRules.reduce((a, b) => a.strength > b.strength ? a : b);
            this.updateElement('dominantRule', `R${dominantRule.index + 1}`);
            this.updateElement('dominantRuleDetail', `Güç: ${(dominantRule.strength * 100).toFixed(1)}%`);
        } else {
            this.updateElement('maxFiringStrength', '0.00');
            this.updateElement('maxFiringPercent', '0%');
            this.updateElement('avgFiringStrength', '0.00');
            this.updateElement('avgFiringPercent', '0%');
            this.updateElement('dominantRule', '--');
            this.updateElement('dominantRuleDetail', 'Henüz çıkarım yapılmadı');
        }
    },

    updateRuleHeatmap(activeRules) {
        const heatmap = document.getElementById('ruleHeatmap');
        if (!heatmap) return;

        if (activeRules.length === 0) {
            heatmap.innerHTML = '<div class="heatmap-placeholder">Öneri almak için parametreleri ayarlayın</div>';
            return;
        }

        // Create 81 cells (9x9 grid representing all rules)
        let html = '';
        for (let i = 0; i < 81; i++) {
            const rule = activeRules.find(r => r.index === i);
            const strength = rule ? Math.ceil(rule.strength * 5) : 0;
            const tooltip = rule ? `Kural ${i + 1}: %${Math.round(rule.strength * 100)}` : `Kural ${i + 1}: Pasif`;
            html += `<div class="heatmap-cell" data-strength="${strength}" title="${tooltip}"></div>`;
        }

        heatmap.innerHTML = html;
    },

    updateInputValuesDisplay() {
        if (!window.app || !window.app.inputs) return;

        const facial = window.app.inputs.facial?.getValue() || 50;
        const tempo = window.app.inputs.tempo?.getValue() || 110;
        const energy = window.app.inputs.energy?.getValue() || 50;
        const brightness = window.app.inputs.brightness?.getValue() || 50;

        // Update values
        const facialEl = document.getElementById('inputFacial');
        const tempoEl = document.getElementById('inputTempo');
        const energyEl = document.getElementById('inputEnergy');
        const brightnessEl = document.getElementById('inputBrightness');

        if (facialEl) facialEl.textContent = facial;
        if (tempoEl) tempoEl.textContent = `${tempo} BPM`;
        if (energyEl) energyEl.textContent = `${energy}%`;
        if (brightnessEl) brightnessEl.textContent = `${brightness}%`;

        // Update bars
        const facialBar = document.getElementById('inputFacialBar');
        const tempoBar = document.getElementById('inputTempoBar');
        const energyBar = document.getElementById('inputEnergyBar');
        const brightnessBar = document.getElementById('inputBrightnessBar');

        if (facialBar) facialBar.style.width = `${facial}%`;
        if (tempoBar) tempoBar.style.width = `${((tempo - 40) / 160) * 100}%`;
        if (energyBar) energyBar.style.width = `${energy}%`;
        if (brightnessBar) brightnessBar.style.width = `${brightness}%`;
    },

    drawDefuzzChart(result) {
        const canvas = document.getElementById('defuzzChart');
        if (!canvas || !result.output) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;
        const padding = { top: 15, right: 15, bottom: 25, left: 35 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        ctx.clearRect(0, 0, width, height);

        // Draw output distribution (simplified)
        const genreValue = result.output.genreValue;
        const centerX = padding.left + (genreValue / 100) * chartWidth;

        // Draw filled area
        const gradient = ctx.createLinearGradient(0, 0, chartWidth, 0);
        gradient.addColorStop(0, this.colors.tertiary);
        gradient.addColorStop(0.5, this.colors.primary);
        gradient.addColorStop(1, this.colors.secondary);

        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top + chartHeight);

        // Draw bell curve
        for (let x = 0; x <= chartWidth; x++) {
            const px = padding.left + x;
            const xNorm = (x - chartWidth * genreValue / 100) / (chartWidth / 4);
            const height_val = Math.exp(-xNorm * xNorm / 2) * chartHeight;
            ctx.lineTo(px, padding.top + chartHeight - height_val);
        }

        ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
        ctx.closePath();

        ctx.fillStyle = this.hexToRgba(this.colors.primary, 0.3);
        ctx.fill();

        ctx.strokeStyle = this.colors.primary;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw COA line
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(centerX, padding.top);
        ctx.lineTo(centerX, padding.top + chartHeight);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText('COA', centerX - 12, padding.top - 3);

        // X-axis labels
        ctx.fillStyle = this.colors.muted;
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText('0', padding.left, padding.top + chartHeight + 15);
        ctx.fillText('100', padding.left + chartWidth - 15, padding.top + chartHeight + 15);
    }
};

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => FuzzyDashboard.init());
} else {
    FuzzyDashboard.init();
}

window.FuzzyDashboard = FuzzyDashboard;
