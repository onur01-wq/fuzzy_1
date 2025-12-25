/**
 * Fuzzy Logic Music Recommendation System
 * Fuzzy Rules Module
 * 
 * Implements 81+ IF-THEN rules for Mamdani inference
 * Covers all combinations of input linguistic terms
 */

// ============================================
// FUZZY RULE CLASS
// ============================================

class FuzzyRule {
    /**
     * Create a fuzzy rule
     * @param {Object} antecedent - Input conditions {variable: term, ...}
     * @param {Object} consequent - Output values {genre: term, tempo: term}
     * @param {number} weight - Rule weight [0, 1]
     */
    constructor(antecedent, consequent, weight = 1.0) {
        this.antecedent = antecedent;
        this.consequent = consequent;
        this.weight = weight;
    }

    /**
     * Evaluate the rule with given fuzzified inputs
     * Uses MIN operator for AND (conjunction)
     * @param {Object} fuzzifiedInputs - Fuzzified input values
     * @returns {number} Rule firing strength
     */
    evaluate(fuzzifiedInputs) {
        let firingStrength = 1.0;

        for (const [variable, term] of Object.entries(this.antecedent)) {
            if (fuzzifiedInputs[variable] && fuzzifiedInputs[variable][term] !== undefined) {
                firingStrength = Math.min(firingStrength, fuzzifiedInputs[variable][term]);
            } else {
                firingStrength = 0;
            }
        }

        return firingStrength * this.weight;
    }

    /**
     * Get rule as human-readable string
     */
    toString() {
        const antecedentStr = Object.entries(this.antecedent)
            .map(([v, t]) => `${v}=${t}`)
            .join(' AND ');
        const consequentStr = Object.entries(this.consequent)
            .map(([v, t]) => `${v}=${t}`)
            .join(' AND ');
        return `IF ${antecedentStr} THEN ${consequentStr}`;
    }
}

// ============================================
// RULE BASE DEFINITION
// ============================================

/**
 * Complete rule base for music recommendation
 * 81 rules covering all combinations:
 * - facial: sad, neutral, happy (3)
 * - energy: low, medium, high (3)
 * - brightness: dark, dim, bright (3)
 * - tempo: slow, medium, fast (3)
 * Total: 3 x 3 x 3 x 3 = 81 rules
 */

const ruleDefinitions = [
    // ========================================
    // SAD FACIAL EXPRESSION RULES (27 rules)
    // ========================================

    // Sad + Low Energy
    {
        antecedent: { facial: 'sad', energy: 'low', brightness: 'dark', tempo: 'slow' },
        consequent: { genre: 'melancholic', outputTempo: 'slow' }
    },
    {
        antecedent: { facial: 'sad', energy: 'low', brightness: 'dark', tempo: 'medium' },
        consequent: { genre: 'melancholic', outputTempo: 'slow' }
    },
    {
        antecedent: { facial: 'sad', energy: 'low', brightness: 'dark', tempo: 'fast' },
        consequent: { genre: 'chill', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'sad', energy: 'low', brightness: 'dim', tempo: 'slow' },
        consequent: { genre: 'melancholic', outputTempo: 'slow' }
    },
    {
        antecedent: { facial: 'sad', energy: 'low', brightness: 'dim', tempo: 'medium' },
        consequent: { genre: 'chill', outputTempo: 'slow' }
    },
    {
        antecedent: { facial: 'sad', energy: 'low', brightness: 'dim', tempo: 'fast' },
        consequent: { genre: 'chill', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'sad', energy: 'low', brightness: 'bright', tempo: 'slow' },
        consequent: { genre: 'chill', outputTempo: 'slow' }
    },
    {
        antecedent: { facial: 'sad', energy: 'low', brightness: 'bright', tempo: 'medium' },
        consequent: { genre: 'chill', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'sad', energy: 'low', brightness: 'bright', tempo: 'fast' },
        consequent: { genre: 'pop', outputTempo: 'moderate' }
    },

    // Sad + Medium Energy
    {
        antecedent: { facial: 'sad', energy: 'medium', brightness: 'dark', tempo: 'slow' },
        consequent: { genre: 'melancholic', outputTempo: 'slow' }
    },
    {
        antecedent: { facial: 'sad', energy: 'medium', brightness: 'dark', tempo: 'medium' },
        consequent: { genre: 'chill', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'sad', energy: 'medium', brightness: 'dark', tempo: 'fast' },
        consequent: { genre: 'chill', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'sad', energy: 'medium', brightness: 'dim', tempo: 'slow' },
        consequent: { genre: 'chill', outputTempo: 'slow' }
    },
    {
        antecedent: { facial: 'sad', energy: 'medium', brightness: 'dim', tempo: 'medium' },
        consequent: { genre: 'chill', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'sad', energy: 'medium', brightness: 'dim', tempo: 'fast' },
        consequent: { genre: 'pop', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'sad', energy: 'medium', brightness: 'bright', tempo: 'slow' },
        consequent: { genre: 'chill', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'sad', energy: 'medium', brightness: 'bright', tempo: 'medium' },
        consequent: { genre: 'pop', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'sad', energy: 'medium', brightness: 'bright', tempo: 'fast' },
        consequent: { genre: 'pop', outputTempo: 'upbeat' }
    },

    // Sad + High Energy
    {
        antecedent: { facial: 'sad', energy: 'high', brightness: 'dark', tempo: 'slow' },
        consequent: { genre: 'chill', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'sad', energy: 'high', brightness: 'dark', tempo: 'medium' },
        consequent: { genre: 'pop', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'sad', energy: 'high', brightness: 'dark', tempo: 'fast' },
        consequent: { genre: 'energetic', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'sad', energy: 'high', brightness: 'dim', tempo: 'slow' },
        consequent: { genre: 'chill', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'sad', energy: 'high', brightness: 'dim', tempo: 'medium' },
        consequent: { genre: 'pop', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'sad', energy: 'high', brightness: 'dim', tempo: 'fast' },
        consequent: { genre: 'energetic', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'sad', energy: 'high', brightness: 'bright', tempo: 'slow' },
        consequent: { genre: 'pop', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'sad', energy: 'high', brightness: 'bright', tempo: 'medium' },
        consequent: { genre: 'energetic', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'sad', energy: 'high', brightness: 'bright', tempo: 'fast' },
        consequent: { genre: 'energetic', outputTempo: 'fast' }
    },

    // ========================================
    // NEUTRAL FACIAL EXPRESSION RULES (27 rules)
    // ========================================

    // Neutral + Low Energy
    {
        antecedent: { facial: 'neutral', energy: 'low', brightness: 'dark', tempo: 'slow' },
        consequent: { genre: 'chill', outputTempo: 'slow' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'low', brightness: 'dark', tempo: 'medium' },
        consequent: { genre: 'chill', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'low', brightness: 'dark', tempo: 'fast' },
        consequent: { genre: 'chill', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'low', brightness: 'dim', tempo: 'slow' },
        consequent: { genre: 'chill', outputTempo: 'slow' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'low', brightness: 'dim', tempo: 'medium' },
        consequent: { genre: 'chill', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'low', brightness: 'dim', tempo: 'fast' },
        consequent: { genre: 'pop', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'low', brightness: 'bright', tempo: 'slow' },
        consequent: { genre: 'chill', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'low', brightness: 'bright', tempo: 'medium' },
        consequent: { genre: 'pop', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'low', brightness: 'bright', tempo: 'fast' },
        consequent: { genre: 'pop', outputTempo: 'upbeat' }
    },

    // Neutral + Medium Energy
    {
        antecedent: { facial: 'neutral', energy: 'medium', brightness: 'dark', tempo: 'slow' },
        consequent: { genre: 'chill', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'medium', brightness: 'dark', tempo: 'medium' },
        consequent: { genre: 'pop', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'medium', brightness: 'dark', tempo: 'fast' },
        consequent: { genre: 'pop', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'medium', brightness: 'dim', tempo: 'slow' },
        consequent: { genre: 'chill', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'medium', brightness: 'dim', tempo: 'medium' },
        consequent: { genre: 'pop', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'medium', brightness: 'dim', tempo: 'fast' },
        consequent: { genre: 'pop', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'medium', brightness: 'bright', tempo: 'slow' },
        consequent: { genre: 'pop', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'medium', brightness: 'bright', tempo: 'medium' },
        consequent: { genre: 'pop', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'medium', brightness: 'bright', tempo: 'fast' },
        consequent: { genre: 'energetic', outputTempo: 'upbeat' }
    },

    // Neutral + High Energy
    {
        antecedent: { facial: 'neutral', energy: 'high', brightness: 'dark', tempo: 'slow' },
        consequent: { genre: 'pop', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'high', brightness: 'dark', tempo: 'medium' },
        consequent: { genre: 'pop', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'high', brightness: 'dark', tempo: 'fast' },
        consequent: { genre: 'energetic', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'high', brightness: 'dim', tempo: 'slow' },
        consequent: { genre: 'pop', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'high', brightness: 'dim', tempo: 'medium' },
        consequent: { genre: 'energetic', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'high', brightness: 'dim', tempo: 'fast' },
        consequent: { genre: 'energetic', outputTempo: 'fast' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'high', brightness: 'bright', tempo: 'slow' },
        consequent: { genre: 'pop', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'high', brightness: 'bright', tempo: 'medium' },
        consequent: { genre: 'energetic', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'neutral', energy: 'high', brightness: 'bright', tempo: 'fast' },
        consequent: { genre: 'intense', outputTempo: 'fast' }
    },

    // ========================================
    // HAPPY FACIAL EXPRESSION RULES (27 rules)
    // ========================================

    // Happy + Low Energy
    {
        antecedent: { facial: 'happy', energy: 'low', brightness: 'dark', tempo: 'slow' },
        consequent: { genre: 'chill', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'happy', energy: 'low', brightness: 'dark', tempo: 'medium' },
        consequent: { genre: 'pop', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'happy', energy: 'low', brightness: 'dark', tempo: 'fast' },
        consequent: { genre: 'pop', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'happy', energy: 'low', brightness: 'dim', tempo: 'slow' },
        consequent: { genre: 'chill', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'happy', energy: 'low', brightness: 'dim', tempo: 'medium' },
        consequent: { genre: 'pop', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'happy', energy: 'low', brightness: 'dim', tempo: 'fast' },
        consequent: { genre: 'pop', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'happy', energy: 'low', brightness: 'bright', tempo: 'slow' },
        consequent: { genre: 'pop', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'happy', energy: 'low', brightness: 'bright', tempo: 'medium' },
        consequent: { genre: 'pop', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'happy', energy: 'low', brightness: 'bright', tempo: 'fast' },
        consequent: { genre: 'energetic', outputTempo: 'upbeat' }
    },

    // Happy + Medium Energy
    {
        antecedent: { facial: 'happy', energy: 'medium', brightness: 'dark', tempo: 'slow' },
        consequent: { genre: 'pop', outputTempo: 'moderate' }
    },
    {
        antecedent: { facial: 'happy', energy: 'medium', brightness: 'dark', tempo: 'medium' },
        consequent: { genre: 'pop', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'happy', energy: 'medium', brightness: 'dark', tempo: 'fast' },
        consequent: { genre: 'energetic', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'happy', energy: 'medium', brightness: 'dim', tempo: 'slow' },
        consequent: { genre: 'pop', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'happy', energy: 'medium', brightness: 'dim', tempo: 'medium' },
        consequent: { genre: 'energetic', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'happy', energy: 'medium', brightness: 'dim', tempo: 'fast' },
        consequent: { genre: 'energetic', outputTempo: 'fast' }
    },
    {
        antecedent: { facial: 'happy', energy: 'medium', brightness: 'bright', tempo: 'slow' },
        consequent: { genre: 'pop', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'happy', energy: 'medium', brightness: 'bright', tempo: 'medium' },
        consequent: { genre: 'energetic', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'happy', energy: 'medium', brightness: 'bright', tempo: 'fast' },
        consequent: { genre: 'intense', outputTempo: 'fast' }
    },

    // Happy + High Energy
    {
        antecedent: { facial: 'happy', energy: 'high', brightness: 'dark', tempo: 'slow' },
        consequent: { genre: 'pop', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'happy', energy: 'high', brightness: 'dark', tempo: 'medium' },
        consequent: { genre: 'energetic', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'happy', energy: 'high', brightness: 'dark', tempo: 'fast' },
        consequent: { genre: 'intense', outputTempo: 'fast' }
    },
    {
        antecedent: { facial: 'happy', energy: 'high', brightness: 'dim', tempo: 'slow' },
        consequent: { genre: 'energetic', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'happy', energy: 'high', brightness: 'dim', tempo: 'medium' },
        consequent: { genre: 'energetic', outputTempo: 'fast' }
    },
    {
        antecedent: { facial: 'happy', energy: 'high', brightness: 'dim', tempo: 'fast' },
        consequent: { genre: 'intense', outputTempo: 'fast' }
    },
    {
        antecedent: { facial: 'happy', energy: 'high', brightness: 'bright', tempo: 'slow' },
        consequent: { genre: 'energetic', outputTempo: 'upbeat' }
    },
    {
        antecedent: { facial: 'happy', energy: 'high', brightness: 'bright', tempo: 'medium' },
        consequent: { genre: 'intense', outputTempo: 'fast' }
    },
    {
        antecedent: { facial: 'happy', energy: 'high', brightness: 'bright', tempo: 'fast' },
        consequent: { genre: 'intense', outputTempo: 'fast' }
    }
];

// ============================================
// RULE BASE CLASS
// ============================================

class RuleBase {
    constructor() {
        this.rules = ruleDefinitions.map(def => new FuzzyRule(def.antecedent, def.consequent));
    }

    /**
     * Evaluate all rules with given fuzzified inputs
     * @param {Object} fuzzifiedInputs - Fuzzified input values
     * @returns {Array} Array of {rule, firingStrength} objects
     */
    evaluateAll(fuzzifiedInputs) {
        const results = [];

        for (const rule of this.rules) {
            const firingStrength = rule.evaluate(fuzzifiedInputs);
            if (firingStrength > 0) {
                results.push({
                    rule,
                    firingStrength,
                    consequent: rule.consequent
                });
            }
        }

        return results.sort((a, b) => b.firingStrength - a.firingStrength);
    }

    /**
     * Get rules count
     */
    get count() {
        return this.rules.length;
    }

    /**
     * Get rules as string array for display
     */
    getRulesAsStrings() {
        return this.rules.map(rule => rule.toString());
    }

    /**
     * Get active rules for display (firing strength > 0)
     * @param {Object} fuzzifiedInputs - Fuzzified input values
     * @returns {Array} Active rules with descriptions
     */
    getActiveRules(fuzzifiedInputs) {
        const results = this.evaluateAll(fuzzifiedInputs);
        return results.map(r => ({
            description: r.rule.toString(),
            strength: r.firingStrength,
            genre: r.consequent.genre,
            tempo: r.consequent.outputTempo
        }));
    }
}

// Export for use in other modules
window.FuzzyRules = {
    FuzzyRule,
    RuleBase,
    ruleDefinitions
};
