// Smart Filters and One-Touch Options for Dental Photo Editor
// Professional presets and intelligent workflows

class SmartFilters {
    constructor() {
        this.mlIntegration = null;
        this.smartEnhancement = null;
        this.cameraProfiles = this.loadCameraProfiles();
        this.professionalPresets = this.loadProfessionalPresets();
    }

    initialize(mlIntegration, smartEnhancement) {
        this.mlIntegration = mlIntegration;
        this.smartEnhancement = smartEnhancement;
    }

    loadCameraProfiles() {
        return {
            // Mobile phone profiles
            'iphone-13-pro': {
                name: 'iPhone 13 Pro',
                noisePattern: 'low-light-optimized',
                colorProfile: 'apple-standard',
                specularTendency: 'high',
                optimizations: {
                    noise: 60,
                    contrast: 20,
                    specular: -25
                }
            },
            'iphone-14-pro': {
                name: 'iPhone 14 Pro',
                noisePattern: 'advanced-low-light',
                colorProfile: 'apple-pro',
                specularTendency: 'medium',
                optimizations: {
                    noise: 50,
                    contrast: 25,
                    specular: -20
                }
            },
            'samsung-s23': {
                name: 'Samsung S23',
                noisePattern: 'samsung-processing',
                colorProfile: 'samsung-vibrant',
                specularTendency: 'high',
                optimizations: {
                    noise: 55,
                    contrast: 30,
                    specular: -30
                }
            },
            'google-pixel': {
                name: 'Google Pixel',
                noisePattern: 'computational-photo',
                colorProfile: 'google-natural',
                specularTendency: 'medium',
                optimizations: {
                    noise: 45,
                    contrast: 15,
                    specular: -15
                }
            },
            
            // DSLR/Mirrorless profiles
            'canon-eos': {
                name: 'Canon EOS',
                noisePattern: 'dslr-clean',
                colorProfile: 'canon-color',
                specularTendency: 'low',
                optimizations: {
                    noise: 30,
                    contrast: 10,
                    specular: -10
                }
            },
            'nikon-z': {
                name: 'Nikon Z',
                noisePattern: 'nikon-clean',
                colorProfile: 'nikon-neutral',
                specularTendency: 'low',
                optimizations: {
                    noise: 25,
                    contrast: 12,
                    specular: -8
                }
            },
            'sony-alpha': {
                name: 'Sony Alpha',
                noisePattern: 'sony-clean',
                colorProfile: 'sony-accurate',
                specularTendency: 'medium',
                optimizations: {
                    noise: 35,
                    contrast: 18,
                    specular: -12
                }
            },
            
            // Intraoral camera profiles
            'dexis': {
                name: 'Dexis Intraoral',
                noisePattern: 'medical-grade',
                colorProfile: 'clinical-accurate',
                specularTendency: 'very-high',
                optimizations: {
                    noise: 70,
                    contrast: 35,
                    specular: -40
                }
            },
            'planmeca': {
                name: 'Planmeca Intraoral',
                noisePattern: 'medical-clean',
                colorProfile: 'planmeca-standard',
                specularTendency: 'high',
                optimizations: {
                    noise: 65,
                    contrast: 30,
                    specular: -35
                }
            },
            'mikroscan': {
                name: 'Mikroscan Intraoral',
                noisePattern: 'medical-optimized',
                colorProfile: 'clinical-precise',
                specularTendency: 'high',
                optimizations: {
                    noise: 60,
                    contrast: 32,
                    specular: -38
                }
            }
        };
    }

    loadProfessionalPresets() {
        return {
            // Clinical documentation presets
            'clinical-standard': {
                name: 'Clinical Standard',
                description: 'Standard clinical documentation',
                category: 'clinical',
                settings: {
                    whitening: 0,  // Preserve natural shades
                    contrast: 15,
                    noise: 60,
                    specular: -30,
                    colorCorrection: true,
                    preserveDetails: true
                }
            },
            'before-after': {
                name: 'Before/After',
                description: 'Optimized for treatment comparison',
                category: 'clinical',
                settings: {
                    whitening: 10,
                    contrast: 20,
                    noise: 50,
                    specular: -25,
                    colorCorrection: true,
                    preserveDetails: true
                }
            },
            'shade-matching': {
                name: 'Shade Matching',
                description: 'Optimized for VITA shade analysis',
                category: 'clinical',
                settings: {
                    whitening: 0,
                    contrast: 10,
                    noise: 70,
                    specular: -35,
                    colorCorrection: true,
                    preserveDetails: true,
                    enhanceShades: true
                }
            },
            
            // Aesthetic presets
            'cosmetic-enhanced': {
                name: 'Cosmetic Enhanced',
                description: 'Enhanced for patient presentation',
                category: 'aesthetic',
                settings: {
                    whitening: 40,
                    contrast: 25,
                    noise: 40,
                    specular: -20,
                    colorCorrection: true,
                    preserveDetails: false
                }
            },
            'social-media': {
                name: 'Social Media',
                description: 'Optimized for social sharing',
                category: 'aesthetic',
                settings: {
                    whitening: 50,
                    contrast: 30,
                    noise: 35,
                    specular: -15,
                    colorCorrection: true,
                    preserveDetails: false
                }
            },
            'portfolio': {
                name: 'Portfolio',
                description: 'Professional portfolio quality',
                category: 'aesthetic',
                settings: {
                    whitening: 30,
                    contrast: 35,
                    noise: 45,
                    specular: -25,
                    colorCorrection: true,
                    preserveDetails: true
                }
            },
            
            // Diagnostic presets
            'diagnostic-detail': {
                name: 'Diagnostic Detail',
                description: 'Maximum detail for diagnosis',
                category: 'diagnostic',
                settings: {
                    whitening: 0,
                    contrast: 40,
                    noise: 80,
                    specular: -45,
                    colorCorrection: true,
                    preserveDetails: true,
                    enhanceEdges: true
                }
            },
            'plaque-detection': {
                name: 'Plaque Detection',
                description: 'Enhanced plaque visualization',
                category: 'diagnostic',
                settings: {
                    whitening: -10,
                    contrast: 50,
                    noise: 30,
                    specular: -40,
                    colorCorrection: true,
                    preserveDetails: true,
                    enhancePlaque: true
                }
            },
            'restoration-analysis': {
                name: 'Restoration Analysis',
                description: 'Optimized for restoration evaluation',
                category: 'diagnostic',
                settings: {
                    whitening: 0,
                    contrast: 45,
                    noise: 75,
                    specular: -50,
                    colorCorrection: true,
                    preserveDetails: true,
                    enhanceRestorations: true
                }
            }
        };
    }

    async applySmartEnhance(imageData) {
        // One-touch smart enhancement
        if (!this.smartEnhancement) {
            throw new Error('Smart enhancement engine not initialized');
        }

        // Run detection first
        const detectionResults = await this.mlIntegration.detectDentalFeatures(imageData);
        this.smartEnhancement.setDetectionResults(detectionResults);

        // Apply smart enhancement
        return await this.smartEnhancement.applySmartEnhance(imageData);
    }

    async applyDentalMode(imageData) {
        // Dental mode optimization
        if (!this.smartEnhancement) {
            throw new Error('Smart enhancement engine not initialized');
        }

        // Run detection first
        const detectionResults = await this.mlIntegration.detectDentalFeatures(imageData);
        this.smartEnhancement.setDetectionResults(detectionResults);

        // Apply dental mode
        return await this.smartEnhancement.applyDentalMode(imageData);
    }

    async applyCameraProfile(imageData, profileName) {
        const profile = this.cameraProfiles[profileName];
        if (!profile) {
            throw new Error(`Camera profile '${profileName}' not found`);
        }

        // Apply camera-specific optimizations
        const options = {
            adaptiveNoise: true,
            noise: profile.optimizations.noise,
            adaptiveContrast: true,
            contrast: profile.optimizations.contrast,
            smartSpecular: true,
            specular: profile.optimizations.specular,
            colorCorrection: true
        };

        return await this.smartEnhancement.applySmartEnhancement(imageData, options);
    }

    async applyProfessionalPreset(imageData, presetName) {
        const preset = this.professionalPresets[presetName];
        if (!preset) {
            throw new Error(`Professional preset '${presetName}' not found`);
        }

        // Run detection for context-aware processing
        const detectionResults = await this.mlIntegration.detectDentalFeatures(imageData);
        this.smartEnhancement.setDetectionResults(detectionResults);

        // Apply preset settings
        return await this.smartEnhancement.applySmartEnhancement(imageData, preset.settings);
    }

    detectCameraProfile(imageData) {
        // Simple camera profile detection based on image characteristics
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        // Analyze noise patterns
        const noiseLevel = this.analyzeNoisePattern(data, width, height);
        
        // Analyze color characteristics
        const colorProfile = this.analyzeColorProfile(data);
        
        // Analyze specular tendencies
        const specularTendency = this.analyzeSpecularTendency(data);
        
        // Match to best profile
        let bestMatch = null;
        let bestScore = 0;
        
        for (const [profileId, profile] of Object.entries(this.cameraProfiles)) {
            const score = this.calculateProfileMatch(
                noiseLevel, colorProfile, specularTendency, profile
            );
            
            if (score > bestScore) {
                bestScore = score;
                bestMatch = profileId;
            }
        }
        
        return bestMatch;
    }

    analyzeNoisePattern(data, width, height) {
        // Analyze noise patterns in the image
        let noiseSum = 0;
        let sampleCount = 0;
        
        // Sample noise from uniform areas
        for (let y = 10; y < height - 10; y += 20) {
            for (let x = 10; x < width - 10; x += 20) {
                const centerIdx = (y * width + x) * 4;
                const centerValue = (data[centerIdx] + data[centerIdx + 1] + data[centerIdx + 2]) / 3;
                
                let variance = 0;
                let count = 0;
                
                // Calculate local variance
                for (let dy = -2; dy <= 2; dy++) {
                    for (let dx = -2; dx <= 2; dx++) {
                        const idx = ((y + dy) * width + (x + dx)) * 4;
                        const value = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
                        variance += Math.pow(value - centerValue, 2);
                        count++;
                    }
                }
                
                noiseSum += variance / count;
                sampleCount++;
            }
        }
        
        return noiseSum / sampleCount;
    }

    analyzeColorProfile(data) {
        // Analyze color characteristics
        let rSum = 0, gSum = 0, bSum = 0;
        let pixelCount = 0;
        
        for (let i = 0; i < data.length; i += 4) {
            rSum += data[i];
            gSum += data[i + 1];
            bSum += data[i + 2];
            pixelCount++;
        }
        
        const avgR = rSum / pixelCount;
        const avgG = gSum / pixelCount;
        const avgB = bSum / pixelCount;
        
        return { r: avgR, g: avgG, b: avgB };
    }

    analyzeSpecularTendency(data) {
        // Analyze specular highlight tendencies
        let specularCount = 0;
        let brightPixelCount = 0;
        
        for (let i = 0; i < data.length; i += 4) {
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            
            if (brightness > 200) {
                brightPixelCount++;
                
                // Check for specular characteristics
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const colorVariance = Math.max(r, g, b) - Math.min(r, g, b);
                
                if (colorVariance < 20) { // Low color variance indicates specular
                    specularCount++;
                }
            }
        }
        
        return brightPixelCount > 0 ? specularCount / brightPixelCount : 0;
    }

    calculateProfileMatch(noiseLevel, colorProfile, specularTendency, profile) {
        let score = 0;
        
        // Noise pattern matching
        score += this.calculateNoiseMatch(noiseLevel, profile.noisePattern);
        
        // Color profile matching
        score += this.calculateColorMatch(colorProfile, profile.colorProfile);
        
        // Specular tendency matching
        score += this.calculateSpecularMatch(specularTendency, profile.specularTendency);
        
        return score / 3;
    }

    calculateNoiseMatch(noiseLevel, pattern) {
        // Simplified noise pattern matching
        if (pattern.includes('medical')) {
            return noiseLevel < 100 ? 0.8 : 0.4;
        } else if (pattern.includes('dslr')) {
            return noiseLevel < 50 ? 0.9 : 0.3;
        } else if (pattern.includes('low-light')) {
            return noiseLevel > 100 ? 0.8 : 0.5;
        }
        
        return 0.5;
    }

    calculateColorMatch(colorProfile, profile) {
        // Simplified color profile matching
        if (profile.includes('apple')) {
            return colorProfile.r > colorProfile.g ? 0.7 : 0.5;
        } else if (profile.includes('samsung')) {
            return colorProfile.g > colorProfile.b ? 0.7 : 0.5;
        } else if (profile.includes('clinical')) {
            return Math.abs(colorProfile.r - colorProfile.g) < 10 ? 0.8 : 0.4;
        }
        
        return 0.5;
    }

    calculateSpecularMatch(tendency, profile) {
        // Specular tendency matching
        if (profile === 'very-high') return tendency > 0.7 ? 0.9 : 0.3;
        if (profile === 'high') return tendency > 0.5 ? 0.8 : 0.4;
        if (profile === 'medium') return tendency > 0.3 && tendency < 0.7 ? 0.8 : 0.4;
        if (profile === 'low') return tendency < 0.3 ? 0.8 : 0.4;
        
        return 0.5;
    }

    getAvailableProfiles() {
        return Object.keys(this.cameraProfiles).map(key => ({
            id: key,
            name: this.cameraProfiles[key].name,
            category: this.getProfileCategory(key)
        }));
    }

    getProfileCategory(profileId) {
        if (profileId.includes('iphone') || profileId.includes('samsung') || profileId.includes('pixel')) {
            return 'mobile';
        } else if (profileId.includes('canon') || profileId.includes('nikon') || profileId.includes('sony')) {
            return 'dslr';
        } else if (profileId.includes('dexis') || profileId.includes('planmeca') || profileId.includes('mikroscan')) {
            return 'intraoral';
        }
        
        return 'unknown';
    }

    getAvailablePresets() {
        return Object.keys(this.professionalPresets).map(key => ({
            id: key,
            name: this.professionalPresets[key].name,
            description: this.professionalPresets[key].description,
            category: this.professionalPresets[key].category
        }));
    }
}

// Export for use in main application
window.SmartFilters = SmartFilters;
