/**
 * Fuzzy Logic Music Recommendation System
 * Membership Functions Module
 * 
 * Implements triangular and trapezoidal membership functions
 * for fuzzy set representation
 */

// ============================================
// MEMBERSHIP FUNCTION TYPES
// ============================================

/**
 * Triangular Membership Function
 * @param {number} x - Input value
 * @param {number} a - Left foot
 * @param {number} b - Peak
 * @param {number} c - Right foot
 * @returns {number} Membership degree [0, 1]
 */
function triangular(x, a, b, c) {
    if (x <= a || x >= c) return 0;
    if (x === b) return 1;
    if (x < b) return (x - a) / (b - a);
    return (c - x) / (c - b);
}

/**
 * Trapezoidal Membership Function
 * @param {number} x - Input value
 * @param {number} a - Left foot
 * @param {number} b - Left shoulder
 * @param {number} c - Right shoulder
 * @param {number} d - Right foot
 * @returns {number} Membership degree [0, 1]
 */
function trapezoidal(x, a, b, c, d) {
    if (x <= a || x >= d) return 0;
    if (x >= b && x <= c) return 1;
    if (x < b) return (x - a) / (b - a);
    return (d - x) / (d - c);
}

// ============================================
// INPUT MEMBERSHIP FUNCTIONS
// ============================================

/**
 * Facial Expression Membership Functions
 * Range: 0-100 (0=Sad, 50=Neutral, 100=Happy)
 */
const facialMembership = {
    sad: (x) => trapezoidal(x, -10, 0, 20, 40),
    neutral: (x) => triangular(x, 25, 50, 75),
    happy: (x) => trapezoidal(x, 60, 80, 100, 110)
};

/**
 * Recent Tempo Membership Functions
 * Range: 40-200 BPM
 */
const tempoMembership = {
    slow: (x) => trapezoidal(x, 30, 40, 70, 90),
    medium: (x) => triangular(x, 70, 110, 150),
    fast: (x) => trapezoidal(x, 130, 160, 200, 210)
};

/**
 * Energy Level Membership Functions
 * Range: 0-100
 */
const energyMembership = {
    low: (x) => trapezoidal(x, -10, 0, 25, 45),
    medium: (x) => triangular(x, 30, 50, 70),
    high: (x) => trapezoidal(x, 55, 75, 100, 110)
};

/**
 * Ambient Brightness Membership Functions
 * Range: 0-100
 */
const brightnessMembership = {
    dark: (x) => trapezoidal(x, -10, 0, 20, 40),
    dim: (x) => triangular(x, 25, 50, 75),
    bright: (x) => trapezoidal(x, 60, 80, 100, 110)
};

// ============================================
// OUTPUT MEMBERSHIP FUNCTIONS
// ============================================

/**
 * Music Genre Membership Functions
 * Range: 0-100
 */
const genreMembership = {
    melancholic: (x) => trapezoidal(x, -10, 0, 15, 30),
    chill: (x) => triangular(x, 15, 30, 45),
    pop: (x) => triangular(x, 35, 50, 65),
    energetic: (x) => triangular(x, 55, 70, 85),
    intense: (x) => trapezoidal(x, 75, 90, 100, 110)
};

/**
 * Recommended Tempo Membership Functions
 * Range: 60-180 BPM
 */
const outputTempoMembership = {
    slow: (x) => trapezoidal(x, 50, 60, 75, 90),
    moderate: (x) => triangular(x, 80, 105, 130),
    upbeat: (x) => triangular(x, 120, 140, 160),
    fast: (x) => trapezoidal(x, 150, 165, 180, 190)
};

// ============================================
// MEMBERSHIP FUNCTION CLASS
// ============================================

class MembershipFunction {
    constructor(name, type, params, func) {
        this.name = name;
        this.type = type;
        this.params = params;
        this.func = func;
    }

    calculate(x) {
        return this.func(x);
    }

    /**
     * Get membership function points for visualization
     * @param {number} min - Minimum x value
     * @param {number} max - Maximum x value
     * @param {number} steps - Number of points
     * @returns {Array} Array of {x, y} points
     */
    getPoints(min, max, steps = 100) {
        const points = [];
        const step = (max - min) / steps;
        for (let x = min; x <= max; x += step) {
            points.push({ x, y: this.calculate(x) });
        }
        return points;
    }
}

// ============================================
// FUZZY VARIABLE CLASSES
// ============================================

class FuzzyVariable {
    constructor(name, min, max, membershipFunctions) {
        this.name = name;
        this.min = min;
        this.max = max;
        this.membershipFunctions = membershipFunctions;
        this.terms = Object.keys(membershipFunctions);
    }

    /**
     * Fuzzify a crisp value
     * @param {number} value - Crisp input value
     * @returns {Object} Object with term names as keys and membership degrees as values
     */
    fuzzify(value) {
        const result = {};
        for (const term of this.terms) {
            result[term] = Math.max(0, Math.min(1, this.membershipFunctions[term](value)));
        }
        return result;
    }

    /**
     * Get the term with highest membership degree
     * @param {number} value - Crisp input value
     * @returns {string} Term name with highest membership
     */
    getDominantTerm(value) {
        const fuzzified = this.fuzzify(value);
        let maxTerm = this.terms[0];
        let maxDegree = fuzzified[maxTerm];

        for (const term of this.terms) {
            if (fuzzified[term] > maxDegree) {
                maxDegree = fuzzified[term];
                maxTerm = term;
            }
        }
        return { term: maxTerm, degree: maxDegree };
    }
}

// ============================================
// PREDEFINED FUZZY VARIABLES
// ============================================

const FuzzyVariables = {
    // Input Variables
    facial: new FuzzyVariable('facial', 0, 100, facialMembership),
    tempo: new FuzzyVariable('tempo', 40, 200, tempoMembership),
    energy: new FuzzyVariable('energy', 0, 100, energyMembership),
    brightness: new FuzzyVariable('brightness', 0, 100, brightnessMembership),

    // Output Variables
    genre: new FuzzyVariable('genre', 0, 100, genreMembership),
    outputTempo: new FuzzyVariable('outputTempo', 60, 180, outputTempoMembership)
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Calculate area under a membership function
 * Used for defuzzification
 */
function calculateArea(membershipFunc, min, max, steps = 100) {
    let area = 0;
    const step = (max - min) / steps;

    for (let x = min; x < max; x += step) {
        const y1 = membershipFunc(x);
        const y2 = membershipFunc(x + step);
        area += ((y1 + y2) / 2) * step; // Trapezoidal rule
    }

    return area;
}

/**
 * Calculate centroid of a membership function
 * Used for Center of Area defuzzification
 */
function calculateCentroid(membershipFunc, min, max, steps = 100) {
    let numerator = 0;
    let denominator = 0;
    const step = (max - min) / steps;

    for (let x = min; x <= max; x += step) {
        const y = membershipFunc(x);
        numerator += x * y;
        denominator += y;
    }

    return denominator === 0 ? (min + max) / 2 : numerator / denominator;
}

// Export for use in other modules
window.FuzzyMembership = {
    triangular,
    trapezoidal,
    MembershipFunction,
    FuzzyVariable,
    FuzzyVariables,
    facialMembership,
    tempoMembership,
    energyMembership,
    brightnessMembership,
    genreMembership,
    outputTempoMembership,
    calculateArea,
    calculateCentroid
};
