/**
 * Fuzzy Logic Music Recommendation System
 * Main Fuzzy Inference Engine
 * 
 * Implements complete Mamdani fuzzy inference system
 */

class FuzzyEngine {
    constructor() {
        this.variables = window.FuzzyMembership.FuzzyVariables;
        this.ruleBase = new window.FuzzyRules.RuleBase();
        this.defuzzifier = window.FuzzyDefuzzifier.Defuzzifier;
        this.aggregator = window.FuzzyDefuzzifier.Aggregator;
    }

    /**
     * Fuzzify all input values
     * @param {Object} inputs - Crisp input values {facial, tempo, energy, brightness}
     * @returns {Object} Fuzzified inputs with membership degrees
     */
    fuzzify(inputs) {
        return {
            facial: this.variables.facial.fuzzify(inputs.facial),
            tempo: this.variables.tempo.fuzzify(inputs.tempo),
            energy: this.variables.energy.fuzzify(inputs.energy),
            brightness: this.variables.brightness.fuzzify(inputs.brightness)
        };
    }

    /**
     * Evaluate all rules and get firing strengths
     * @param {Object} fuzzifiedInputs - Fuzzified input values
     * @returns {Array} Active rules with firing strengths
     */
    evaluateRules(fuzzifiedInputs) {
        return this.ruleBase.evaluateAll(fuzzifiedInputs);
    }

    /**
     * Aggregate rule outputs using maximum method
     * @param {Array} ruleResults - Evaluated rule results
     * @returns {Object} Aggregated fuzzy outputs
     */
    aggregate(ruleResults) {
        return this.aggregator.maximum(ruleResults);
    }

    /**
     * Defuzzify aggregated outputs to crisp values
     * @param {Object} aggregatedOutput - Aggregated fuzzy output
     * @returns {Object} Crisp output values {genre, tempo}
     */
    defuzzify(aggregatedOutput) {
        const genreValue = this.defuzzifier.centerOfArea(
            aggregatedOutput.genre || {},
            this.variables.genre
        );

        const tempoValue = this.defuzzifier.centerOfArea(
            aggregatedOutput.outputTempo || {},
            this.variables.outputTempo
        );

        return {
            genreValue,
            tempoValue,
            genre: this.mapGenreValue(genreValue),
            tempo: Math.round(tempoValue)
        };
    }

    /**
     * Map numeric genre value to genre name
     * @param {number} value - Genre value 0-100
     * @returns {Object} Genre info with name and description
     */
    mapGenreValue(value) {
        if (value <= 20) return { name: 'Melancholic', emoji: '😢', color: '#6366f1' };
        if (value <= 40) return { name: 'Chill', emoji: '😌', color: '#8b5cf6' };
        if (value <= 60) return { name: 'Pop', emoji: '🎵', color: '#ec4899' };
        if (value <= 80) return { name: 'Energetic', emoji: '⚡', color: '#f97316' };
        return { name: 'Intense', emoji: '🔥', color: '#ef4444' };
    }

    /**
     * Complete inference pipeline
     * @param {Object} inputs - Crisp input values
     * @returns {Object} Complete inference result
     */
    infer(inputs) {
        // Step 1: Fuzzify inputs
        const fuzzifiedInputs = this.fuzzify(inputs);

        // Step 2: Evaluate rules
        const ruleResults = this.evaluateRules(fuzzifiedInputs);

        // Step 3: Aggregate outputs
        const aggregatedOutput = this.aggregate(ruleResults);

        // Step 4: Defuzzify
        const crispOutput = this.defuzzify(aggregatedOutput);

        // Get active rules for visualization
        const activeRules = this.ruleBase.getActiveRules(fuzzifiedInputs).slice(0, 5);

        return {
            inputs,
            fuzzifiedInputs,
            ruleResults: ruleResults.slice(0, 10),
            aggregatedOutput,
            output: crispOutput,
            activeRules,
            totalRulesActivated: ruleResults.length
        };
    }

    /**
     * Get membership visualization data for an input
     * @param {string} variable - Variable name
     * @param {number} value - Current value
     * @returns {Object} Visualization data
     */
    getMembershipVisualization(variable, value) {
        const fuzzyVar = this.variables[variable];
        if (!fuzzyVar) return null;

        const fuzzified = fuzzyVar.fuzzify(value);
        const points = {};

        for (const term of fuzzyVar.terms) {
            points[term] = fuzzyVar.membershipFunctions[term];
        }

        return {
            variable: fuzzyVar.name,
            value,
            min: fuzzyVar.min,
            max: fuzzyVar.max,
            terms: fuzzyVar.terms,
            fuzzified,
            membershipFunctions: points
        };
    }
}

// Export for use in other modules
window.FuzzyEngine = FuzzyEngine;
