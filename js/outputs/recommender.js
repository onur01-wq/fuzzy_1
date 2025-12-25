/**
 * Music Recommender Module
 * Bridges fuzzy output to music recommendations
 * Supports both async API and sync fallback
 */

const MusicRecommender = {
    genreDescriptions: {
        melancholic: {
            name: 'Melancholic',
            nametr: 'Melankolik',
            description: 'Soft, emotional music for reflective moments',
            descriptionTr: 'Düşünceli anlar için yumuşak, duygusal müzik',
            keywords: ['sad piano', 'acoustic ballads', 'emotional', 'reflective'],
            color: '#6366f1',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        chill: {
            name: 'Chill',
            nametr: 'Rahatlatıcı',
            description: 'Relaxing tunes for unwinding and peace',
            descriptionTr: 'Rahatlama ve huzur için sakin melodiler',
            keywords: ['lofi', 'ambient', 'soft rock', 'relaxing'],
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)'
        },
        pop: {
            name: 'Pop',
            nametr: 'Pop',
            description: 'Popular hits for everyday enjoyment',
            descriptionTr: 'Günlük keyif için popüler hitler',
            keywords: ['pop hits', 'indie pop', 'mainstream', 'radio'],
            color: '#ec4899',
            gradient: 'linear-gradient(135deg, #f472b6 0%, #db2777 100%)'
        },
        energetic: {
            name: 'Energetic',
            nametr: 'Enerjik',
            description: 'Uplifting beats to boost your energy',
            descriptionTr: 'Enerjinizi artıran coşkulu ritimler',
            keywords: ['dance', 'electronic', 'upbeat', 'workout'],
            color: '#f97316',
            gradient: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)'
        },
        intense: {
            name: 'Intense',
            nametr: 'Yoğun',
            description: 'High-energy music for maximum impact',
            descriptionTr: 'Maksimum etki için yüksek enerjili müzik',
            keywords: ['EDM', 'hard rock', 'hip-hop', 'intense'],
            color: '#ef4444',
            gradient: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)'
        }
    },

    tempoDescriptions: {
        slow: { range: '60-85 BPM', description: 'Slow & Relaxing', descriptionTr: 'Yavaş ve Rahatlatıcı' },
        moderate: { range: '85-115 BPM', description: 'Moderate & Balanced', descriptionTr: 'Orta Tempolu ve Dengeli' },
        upbeat: { range: '115-145 BPM', description: 'Upbeat & Lively', descriptionTr: 'Canlı ve Neşeli' },
        fast: { range: '145-180 BPM', description: 'Fast & Intense', descriptionTr: 'Hızlı ve Yoğun' }
    },

    /**
     * Get full recommendation based on fuzzy output (async - uses API)
     */
    async getRecommendationAsync(fuzzyOutput) {
        const { genre, tempo } = fuzzyOutput;
        const genreName = genre.name.toLowerCase();
        const genreInfo = this.genreDescriptions[genreName] || this.genreDescriptions.pop;
        const tempoCategory = this.getTempoCategory(tempo);
        const tempoInfo = this.tempoDescriptions[tempoCategory];

        // Get recommendations from API (or fallback)
        const songs = await window.YouTubeManager.getRecommendations(genreName, tempo);

        return {
            genre: {
                ...genreInfo,
                value: fuzzyOutput.genreValue
            },
            tempo: {
                bpm: tempo,
                category: tempoCategory,
                ...tempoInfo
            },
            songs: songs,
            confidence: this.calculateConfidence(fuzzyOutput),
            source: songs[0]?.isYouTube ? 'youtube' : 'itunes'
        };
    },

    /**
     * Get recommendation synchronously (fallback only)
     */
    getRecommendation(fuzzyOutput) {
        const { genre, tempo } = fuzzyOutput;
        const genreName = genre.name.toLowerCase();
        const genreInfo = this.genreDescriptions[genreName] || this.genreDescriptions.pop;
        const tempoCategory = this.getTempoCategory(tempo);
        const tempoInfo = this.tempoDescriptions[tempoCategory];

        // Sync fallback
        const songs = window.YouTubeManager.getRecommendationsSync(genreName, tempo);

        return {
            genre: {
                ...genreInfo,
                value: fuzzyOutput.genreValue
            },
            tempo: {
                bpm: tempo,
                category: tempoCategory,
                ...tempoInfo
            },
            songs: songs,
            confidence: this.calculateConfidence(fuzzyOutput),
            source: 'youtube'
        };
    },

    getTempoCategory(tempo) {
        if (tempo < 85) return 'slow';
        if (tempo < 115) return 'moderate';
        if (tempo < 145) return 'upbeat';
        return 'fast';
    },

    calculateConfidence(fuzzyOutput) {
        const genreScore = Math.abs(fuzzyOutput.genreValue - 50) / 50;
        return Math.round((0.5 + genreScore * 0.5) * 100);
    }
};

window.MusicRecommender = MusicRecommender;
