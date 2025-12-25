/**
 * Fuzzy Logic Music Recommendation System
 * Defuzzification Module
 */

class Defuzzifier {
    static centerOfArea(aggregatedOutput, outputVariable) {
        const { min, max, membershipFunctions } = outputVariable;
        const steps = 200;
        const step = (max - min) / steps;

        let numerator = 0;
        let denominator = 0;

        for (let x = min; x <= max; x += step) {
            let maxMembership = 0;

            for (const [term, strength] of Object.entries(aggregatedOutput)) {
                if (membershipFunctions[term]) {
                    const membership = Math.min(strength, membershipFunctions[term](x));
                    maxMembership = Math.max(maxMembership, membership);
                }
            }

            numerator += x * maxMembership;
            denominator += maxMembership;
        }

        return denominator === 0 ? (min + max) / 2 : numerator / denominator;
    }

    static meanOfMaximum(aggregatedOutput, outputVariable) {
        const { min, max, membershipFunctions } = outputVariable;
        const steps = 200;
        const step = (max - min) / steps;

        let maxMembership = 0;
        const maxPoints = [];

        for (let x = min; x <= max; x += step) {
            let membership = 0;

            for (const [term, strength] of Object.entries(aggregatedOutput)) {
                if (membershipFunctions[term]) {
                    const m = Math.min(strength, membershipFunctions[term](x));
                    membership = Math.max(membership, m);
                }
            }

            if (membership > maxMembership) {
                maxMembership = membership;
                maxPoints.length = 0;
                maxPoints.push(x);
            } else if (membership === maxMembership && membership > 0) {
                maxPoints.push(x);
            }
        }

        if (maxPoints.length === 0) return (min + max) / 2;
        return maxPoints.reduce((a, b) => a + b, 0) / maxPoints.length;
    }

    static weightedAverage(ruleResults) {
        let numerator = 0;
        let denominator = 0;

        for (const result of ruleResults) {
            numerator += result.firingStrength * result.crispOutput;
            denominator += result.firingStrength;
        }

        return denominator === 0 ? 0 : numerator / denominator;
    }
}

class Aggregator {
    static maximum(ruleResults) {
        const aggregated = {};

        for (const result of ruleResults) {
            for (const [output, term] of Object.entries(result.consequent)) {
                if (!aggregated[output]) aggregated[output] = {};
                if (!aggregated[output][term]) aggregated[output][term] = 0;
                aggregated[output][term] = Math.max(aggregated[output][term], result.firingStrength);
            }
        }

        return aggregated;
    }
}

window.FuzzyDefuzzifier = { Defuzzifier, Aggregator };
