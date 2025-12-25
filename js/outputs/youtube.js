/**
 * YouTube & Music API Integration Module
 * Supports Turkish (TR) and International (EN) music
 */

const MusicAPIManager = {
    ITUNES_API: 'https://itunes.apple.com/search',
    currentLanguage: 'tr', // Default: Turkish

    // Genre to search term mappings by language
    genreSearchTerms: {
        tr: {
            melancholic: ['türkçe slow', 'arabesk', 'türkçe duygusal', 'türkçe aşk şarkıları', 'akustik türkçe'],
            chill: ['türkçe pop sakin', 'türkçe akustik', 'türkçe lounge', 'chill türkçe'],
            pop: ['türkçe pop', 'türkçe hit', 'türk pop 2024', 'en çok dinlenen türkçe'],
            energetic: ['türkçe dans', 'türkçe club', 'türkçe remix', 'türkçe party'],
            intense: ['türkçe rap', 'türkçe rock', 'turkish hip hop', 'anadolu rock']
        },
        en: {
            melancholic: ['sad piano', 'melancholy', 'emotional ballad', 'acoustic sad'],
            chill: ['lofi chill', 'ambient relax', 'indie chill', 'soft acoustic'],
            pop: ['pop hits 2024', 'top pop', 'dance pop', 'indie pop'],
            energetic: ['workout music', 'upbeat dance', 'electronic dance', 'party music'],
            intense: ['edm', 'hard rock', 'hip hop beats', 'intense workout']
        }
    },

    tempoModifiers: {
        tr: {
            slow: ['yavaş', 'duygusal', 'romantik'],
            moderate: ['orta tempo', 'pop'],
            upbeat: ['hareketli', 'eğlenceli', 'dans'],
            fast: ['hızlı', 'enerjik', 'club']
        },
        en: {
            slow: ['slow', 'ballad', 'calm'],
            moderate: ['mid tempo', 'groovy'],
            upbeat: ['upbeat', 'dance', 'energetic'],
            fast: ['fast', 'intense', 'high energy']
        }
    },

    setLanguage(lang) {
        this.currentLanguage = lang;
        console.log('🌍 Music language set to:', lang === 'tr' ? 'Türkçe' : 'International');
    },

    async searchiTunes(searchTerm, limit = 10) {
        try {
            // Add country parameter for Turkish music
            const country = this.currentLanguage === 'tr' ? 'TR' : 'US';
            const url = `${this.ITUNES_API}?term=${encodeURIComponent(searchTerm)}&media=music&entity=song&limit=${limit}&country=${country}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error('iTunes API request failed');

            const data = await response.json();
            return data.results.map(track => ({
                id: track.trackId,
                title: track.trackName,
                artist: track.artistName,
                album: track.collectionName,
                previewUrl: track.previewUrl,
                artworkUrl: track.artworkUrl100?.replace('100x100', '300x300'),
                genre: track.primaryGenreName,
                youtubeSearchQuery: `${track.artistName} ${track.trackName} official`
            }));
        } catch (error) {
            console.warn('iTunes API error:', error);
            return [];
        }
    },

    async getRecommendations(genreName, tempo) {
        const genre = genreName.toLowerCase();
        const tempoCategory = this.getTempoCategory(tempo);
        const lang = this.currentLanguage;

        const genreTerms = this.genreSearchTerms[lang]?.[genre] || this.genreSearchTerms['en'][genre];
        const tempoTerms = this.tempoModifiers[lang]?.[tempoCategory] || [];

        const randomGenreTerm = genreTerms[Math.floor(Math.random() * genreTerms.length)];
        const randomTempoTerm = tempoTerms[Math.floor(Math.random() * tempoTerms.length)] || '';

        const searchQuery = `${randomGenreTerm} ${randomTempoTerm}`.trim();
        console.log('🔍 Searching iTunes for:', searchQuery, '| Country:', lang.toUpperCase());

        let tracks = await this.searchiTunes(searchQuery, 12);

        if (tracks.length === 0) {
            tracks = await this.searchiTunes(randomGenreTerm, 12);
        }

        return tracks.map(track => ({
            ...track,
            thumbnail: track.artworkUrl || 'https://via.placeholder.com/300x300?text=🎵',
            watchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(track.youtubeSearchQuery)}`,
            embedUrl: null
        }));
    },

    getTempoCategory(tempo) {
        if (tempo < 85) return 'slow';
        if (tempo < 115) return 'moderate';
        if (tempo < 145) return 'upbeat';
        return 'fast';
    }
};

// Turkish curated playlists (fallback)
const TurkishPlaylists = {
    melancholic: {
        slow: [
            { id: 'cXLJxLXg3Fk', title: 'Gece Golgenin Rahatina Bak', artist: 'Çağatay Akman' },
            { id: 'FvGl2Xtg1Vg', title: 'İmkansızım', artist: 'Murat Boz' },
            { id: 'q8q-GBrRqlw', title: 'Aşk Bu', artist: 'Simge' },
            { id: 'RlDLVBfDfQs', title: 'Sen Olsan Bari', artist: 'Aleyna Tilki' },
            { id: 'H0a5rNF1j9g', title: 'Yanıyoruz', artist: 'Edis' }
        ],
        moderate: [
            { id: 'VZRg-WBpzrM', title: 'Yalan', artist: 'Sezen Aksu' },
            { id: 'SkOYgPkdE7M', title: 'İncir', artist: 'Buray' },
            { id: 'dQVKcrMXeBA', title: 'Sorma Neden', artist: 'Emre Aydın' }
        ]
    },
    chill: {
        slow: [
            { id: 'FlEoXKGKGzQ', title: 'Kalbim Tatilde', artist: 'Model' },
            { id: 'bVMXYlWqwKk', title: 'İyisin Sen', artist: 'Semicenk' },
            { id: 'K4DyBUG242c', title: 'Bir Bilebilsen', artist: 'MFÖ' }
        ],
        moderate: [
            { id: '4G6QDNC4jPs', title: 'Ex Love', artist: 'Gülşen' },
            { id: 'Hm48c-AJLsE', title: 'Rüya Gibi', artist: 'Ayla Çelik' }
        ]
    },
    pop: {
        moderate: [
            { id: 'o7O5ra5M-zQ', title: 'Ela', artist: 'Reynmen' },
            { id: 'OGzG_VrWKDU', title: 'Versene', artist: 'Demet Akalın' },
            { id: 'xMl3bdl2C2s', title: 'Leyla', artist: 'Tarkan' }
        ],
        upbeat: [
            { id: 'YEJ6PZ_wOlw', title: 'Dudu', artist: 'Tarkan' },
            { id: 'c-qY4bLvANw', title: 'Yüksek Yüksek Tepelere', artist: 'Athena' },
            { id: 'PLXt0Y1_yg8', title: 'Şımarık', artist: 'Tarkan' }
        ],
        fast: [
            { id: 'OGzG_VrWKDU', title: 'Hop De', artist: 'Hadise' },
            { id: 'KfV40jMvKko', title: 'Haydi Söyle', artist: 'Kalben' }
        ]
    },
    energetic: {
        upbeat: [
            { id: 'c-qY4bLvANw', title: 'Yüksek Yüksek Tepelere', artist: 'Athena' },
            { id: 'xLbDu8pJkYA', title: 'Fırtına', artist: 'Gökhan Özen' },
            { id: 'sG02-FGZlgA', title: 'Kolpa', artist: 'maNga' }
        ],
        fast: [
            { id: 'V1PBGBbKpes', title: 'Danza Kuduro Turkish', artist: 'DJ Remix' },
            { id: 'YEJ6PZ_wOlw', title: 'Bounce', artist: 'Hadise' }
        ]
    },
    intense: {
        fast: [
            { id: 'sG02-FGZlgA', title: 'Cevapsız Çınlama', artist: 'maNga' },
            { id: 'LBznP7fmnoM', title: 'Fesuphanallah', artist: 'Ceza' },
            { id: 'D3Fdjv7eJpw', title: 'Holocaust', artist: 'Sagopa Kajmer' },
            { id: 'K0BpPqHnxb4', title: 'Suspus', artist: 'Ceza' }
        ]
    }
};

// International fallback playlists
const InternationalPlaylists = {
    melancholic: {
        slow: [
            { id: 'RBumgq5yVrA', title: 'Sad Piano Music', artist: 'Relaxing Piano' },
            { id: 'jWFWazj7Ye8', title: 'River Flows In You', artist: 'Yiruma' },
            { id: '4NmUF8vDHoo', title: 'Someone Like You', artist: 'Adele' },
            { id: 'hLQl3WQQoQ0', title: 'Someone You Loved', artist: 'Lewis Capaldi' }
        ],
        moderate: [
            { id: '1k8craCGpgs', title: 'Mad World', artist: 'Gary Jules' },
            { id: 'YQHsXMglC9A', title: 'Hello', artist: 'Adele' }
        ]
    },
    chill: {
        slow: [
            { id: '5qap5aO4i9A', title: 'Lofi Hip Hop Radio', artist: 'ChilledCow' },
            { id: 'lTRiuFIWV54', title: 'Weightless', artist: 'Marconi Union' }
        ],
        moderate: [
            { id: 'papuvlVeZg8', title: 'Electric Feel', artist: 'MGMT' }
        ],
        upbeat: [
            { id: '60ItHLz5WEA', title: 'On Top of the World', artist: 'Imagine Dragons' }
        ]
    },
    pop: {
        moderate: [
            { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran' },
            { id: 'ru0K8uYEZWw', title: 'Perfect', artist: 'Ed Sheeran' }
        ],
        upbeat: [
            { id: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Bruno Mars' },
            { id: 'CevxZvSJLk8', title: 'Roar', artist: 'Katy Perry' }
        ],
        fast: [
            { id: 'kJQP7kiw5Fk', title: 'Despacito', artist: 'Luis Fonsi' }
        ]
    },
    energetic: {
        upbeat: [
            { id: 'fJ9rUzIMcZQ', title: 'Bohemian Rhapsody', artist: 'Queen' },
            { id: 'btPJPFnesV4', title: 'Eye of the Tiger', artist: 'Survivor' }
        ],
        fast: [
            { id: 'y6120QOlsfU', title: 'Sandstorm', artist: 'Darude' },
            { id: '3O1_3zBUKM8', title: 'Levels', artist: 'Avicii' }
        ]
    },
    intense: {
        fast: [
            { id: '04F4xlWSFh0', title: 'Lose Yourself', artist: 'Eminem' },
            { id: 'fLexgOxsZu0', title: 'Believer', artist: 'Imagine Dragons' },
            { id: 'n1WpP7iowLc', title: 'Dont Stop Me Now', artist: 'Queen' }
        ]
    }
};

// Fallback manager
const YouTubeFallback = {
    currentLanguage: 'tr',

    setLanguage(lang) {
        this.currentLanguage = lang;
    },

    getPlaylists() {
        return this.currentLanguage === 'tr' ? TurkishPlaylists : InternationalPlaylists;
    },

    getRecommendations(genreName, tempo) {
        const genre = genreName.toLowerCase();
        const tempoCategory = this.getTempoCategory(tempo);
        const playlists = this.getPlaylists();

        let songs = [];

        if (playlists[genre]) {
            if (playlists[genre][tempoCategory]) {
                songs = [...playlists[genre][tempoCategory]];
            }

            const tempoOrder = ['slow', 'moderate', 'upbeat', 'fast'];
            const currentIndex = tempoOrder.indexOf(tempoCategory);

            if (songs.length < 5) {
                for (let offset = 1; offset <= 2 && songs.length < 5; offset++) {
                    if (currentIndex - offset >= 0) {
                        const adjacent = playlists[genre][tempoOrder[currentIndex - offset]];
                        if (adjacent) songs = songs.concat(adjacent);
                    }
                    if (currentIndex + offset < tempoOrder.length) {
                        const adjacent = playlists[genre][tempoOrder[currentIndex + offset]];
                        if (adjacent) songs = songs.concat(adjacent);
                    }
                }
            }
        }

        if (songs.length === 0) {
            songs = playlists.pop?.upbeat || [];
        }

        return this.shuffleArray(songs).slice(0, 6).map(song => ({
            ...song,
            thumbnail: `https://img.youtube.com/vi/${song.id}/mqdefault.jpg`,
            watchUrl: `https://www.youtube.com/watch?v=${song.id}`,
            embedUrl: `https://www.youtube.com/embed/${song.id}?autoplay=0&rel=0`,
            isYouTube: true
        }));
    },

    getTempoCategory(tempo) {
        if (tempo < 85) return 'slow';
        if (tempo < 115) return 'moderate';
        if (tempo < 145) return 'upbeat';
        return 'fast';
    },

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
};

// Main YouTube Manager
const YouTubeManager = {
    useAPI: true,
    currentLanguage: 'tr',

    setLanguage(lang) {
        this.currentLanguage = lang;
        MusicAPIManager.setLanguage(lang);
        YouTubeFallback.setLanguage(lang);
    },

    async getRecommendations(genreName, tempo) {
        if (this.useAPI) {
            try {
                const apiResults = await MusicAPIManager.getRecommendations(genreName, tempo);
                if (apiResults.length >= 4) {
                    console.log('✅ Got', apiResults.length, 'tracks from iTunes API');
                    return apiResults.slice(0, 6);
                }
            } catch (error) {
                console.warn('API failed, using fallback:', error);
            }
        }

        console.log('📼 Using curated', this.currentLanguage === 'tr' ? 'Turkish' : 'International', 'playlists');
        return YouTubeFallback.getRecommendations(genreName, tempo);
    },

    getRecommendationsSync(genreName, tempo) {
        return YouTubeFallback.getRecommendations(genreName, tempo);
    },

    getTempoCategory(tempo) {
        if (tempo < 85) return 'slow';
        if (tempo < 115) return 'moderate';
        if (tempo < 145) return 'upbeat';
        return 'fast';
    }
};

window.MusicAPIManager = MusicAPIManager;
window.YouTubeFallback = YouTubeFallback;
window.YouTubeManager = YouTubeManager;
window.TurkishPlaylists = TurkishPlaylists;
window.InternationalPlaylists = InternationalPlaylists;
