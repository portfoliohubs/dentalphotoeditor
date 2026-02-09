// Smart Enhancement Engine for Dental Photo Editor
// AI-powered content-aware enhancement with professional dental standards

class SmartEnhancementEngine {
    constructor() {
        this.detectionResults = null;
        this.vitaShades = this.loadVITAShades();
        this.enhancementSettings = {
            whitening: { strength: 0, preserveShades: true },
            contrast: { adaptive: true, regions: {} },
            noise: { adaptive: true, cameraProfile: null },
            specular: { smart: true, preserveDetails: true }
        };
    }

    loadVITAShades() {
        return {
            // VITA Classical shades
            A1: { r: 255, g: 248, b: 240, name: "A1 - Lightest" },
            A2: { r: 255, g: 245, b: 230, name: "A2 - Light" },
            A3: { r: 255, g: 240, b: 220, name: "A3 - Medium" },
            A3.5: { r: 255, g: 235, b: 210, name: "A3.5 - Medium Dark" },
            A4: { r: 255, g: 230, b: 200, name: "A4 - Dark" },
            
            B1: { r: 255, g: 248, b: 235, name: "B1 - Lightest" },
            B2: { r: 255, g: 243, b: 225, name: "B2 - Light" },
            B3: { r: 255, g: 238, b: 215, name: "B3 - Medium" },
            B4: { r: 255, g: 233, b: 205, name: "B4 - Dark" },
            
            C1: { r: 255, g: 245, b: 220, name: "C1 - Lightest" },
            C2: { r: 255, g: 240, b: 210, name: "C2 - Light" },
            C3: { r: 255, g: 235, b: 200, name: "C3 - Medium" },
            C4: { r: 255, g: 230, b: 190, name: "C4 - Dark" },
            
            D1: { r: 255, g: 243, b: 215, name: "D1 - Lightest" },
            D2: { r: 255, g: 238, b: 205, name: "D2 - Light" },
            D3: { r: 255, g: 233, b: 195, name: "D3 - Medium" },
            D4: { r: 255, g: 228, b: 185, name: "D4 - Dark" }
        };
    }

    setDetectionResults(results) {
        this.detectionResults = results;
    }

    async applySmartEnhancement(imageData, options = {}) {
        const enhancedData = new ImageData(
            new Uint8ClampedArray(imageData.data),
            imageData.width,
            imageData.height
        );

        // Apply enhancements in order
        if (options.smartWhitening || options.whitening > 0) {
            this.applySmartWhitening(enhancedData, options.whitening || 50);
        }

        if (options.adaptiveContrast || options.contrast > 0) {
            this.applyAdaptiveContrast(enhancedData, options.contrast || 30);
        }

        if (options.adaptiveNoise || options.noise > 0) {
            this.applyAdaptiveNoiseReduction(enhancedData, options.noise || 40);
        }

        if (options.smartSpecular || options.specular !== undefined) {
            this.applySmartSpecularControl(enhancedData, options.specular || -20);
        }

        if (options.colorCorrection) {
            this.applyColorCorrection(enhancedData);
        }

        return enhancedData;
    }

    applySmartWhitening(imageData, strength) {
        const data = imageData.data;
        const factor = strength / 100;

        // Analyze current tooth shades
        const currentShades = this.analyzeToothShades(imageData);
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            // Check if pixel is in tooth region
            if (this.isToothPixel(r, g, b)) {
                const closestShade = this.findClosestVITAShade(r, g, b);
                const targetShade = this.getTargetWhitenedShade(closestShade, factor);
                
                // Apply shade-safe whitening
                const newColor = this.interpolateColor(r, g, b, targetShade.r, targetShade.g, targetShade.b, factor);
                
                data[i] = newColor.r;
                data[i + 1] = newColor.g;
                data[i + 2] = newColor.b;
            }
        }
    }

    analyzeToothShades(imageData) {
        const data = imageData.data;
        const shadeCounts = {};
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            if (this.isToothPixel(r, g, b)) {
                const shade = this.findClosestVITAShade(r, g, b);
                shadeCounts[shade.name] = (shadeCounts[shade.name] || 0) + 1;
            }
        }
        
        return shadeCounts;
    }

    isToothPixel(r, g, b) {
        // Enhanced tooth detection using HSV color space
        const hsv = this.rgbToHsv(r, g, b);
        
        // Teeth are typically:
        // - Hue: 20-80 (yellowish to white)
        // - Saturation: 0-0.3 (low saturation)
        // - Value: 70-100 (bright)
        return hsv.h >= 20 && hsv.h <= 80 && 
               hsv.s <= 0.3 && 
               hsv.v >= 0.7 && hsv.v <= 1.0;
    }

    rgbToHsv(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        
        let h = 0;
        let s = max === 0 ? 0 : delta / max;
        let v = max;
        
        if (delta !== 0) {
            if (max === r) h = ((g - b) / delta) % 6;
            else if (max === g) h = (b - r) / delta + 2;
            else h = (r - g) / delta + 4;
        }
        
        h = h * 60;
        if (h < 0) h += 360;
        
        return { h, s, v };
    }

    findClosestVITAShade(r, g, b) {
        let minDistance = Infinity;
        let closestShade = null;
        
        for (const [shadeName, shade] of Object.entries(this.vitaShades)) {
            const distance = Math.sqrt(
                Math.pow(r - shade.r, 2) + 
                Math.pow(g - shade.g, 2) + 
                Math.pow(b - shade.b, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                closestShade = { ...shade, name: shadeName };
            }
        }
        
        return closestShade;
    }

    getTargetWhitenedShade(currentShade, factor) {
        // Find appropriate whitened shade based on current shade and desired whitening level
        const shadeOrder = ['A4', 'A3.5', 'A3', 'A2', 'A1', 'B4', 'B3', 'B2', 'B1', 'C4', 'C3', 'C2', 'C1', 'D4', 'D3', 'D2', 'D1'];
        const currentIndex = shadeOrder.indexOf(currentShade.name);
        
        if (currentIndex === -1) return currentShade;
        
        // Calculate how many shades to move up
        const stepsToMove = Math.floor(factor * (shadeOrder.length - currentIndex - 1));
        const targetIndex = Math.min(currentIndex + stepsToMove, shadeOrder.length - 1);
        
        return this.vitaShades[shadeOrder[targetIndex]];
    }

    interpolateColor(r1, g1, b1, r2, g2, b2, factor) {
        return {
            r: Math.round(r1 + (r2 - r1) * factor),
            g: Math.round(g1 + (g2 - g1) * factor),
            b: Math.round(b1 + (b2 - b1) * factor)
        };
    }

    applyAdaptiveContrast(imageData, strength) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const factor = strength / 100;

        // Create regions based on detection results
        const regions = this.createEnhancementRegions(width, height);
        
        for (const region of regions) {
            this.applyRegionalContrast(data, width, height, region, factor);
        }
    }

    createEnhancementRegions(width, height) {
        const regions = [];
        
        if (this.detectionResults && this.detectionResults.teeth) {
            // Create regions for each detected tooth
            for (const tooth of this.detectionResults.teeth.boundaries) {
                regions.push({
                    type: 'tooth',
                    bounds: tooth.boundingBox,
                    contrastFactor: 1.2
                });
            }
        }
        
        // Add gum regions
        if (this.detectionResults && this.detectionResults.gums) {
            regions.push({
                type: 'gums',
                bounds: this.estimateGumBounds(width, height),
                contrastFactor: 1.1
            });
        }
        
        // Add background region
        regions.push({
            type: 'background',
            bounds: { minX: 0, maxX: width, minY: 0, maxY: height },
            contrastFactor: 1.0
        });
        
        return regions;
    }

    estimateGumBounds(width, height) {
        // Estimate gum region based on typical dental anatomy
        return {
            minX: width * 0.1,
            maxX: width * 0.9,
            minY: height * 0.6,
            maxY: height * 0.9
        };
    }

    applyRegionalContrast(data, width, height, region, globalFactor) {
        const { minX, maxX, minY, maxY, contrastFactor } = region.bounds;
        const factor = globalFactor * contrastFactor;
        
        for (let y = Math.floor(minY); y < Math.floor(maxY); y++) {
            for (let x = Math.floor(minX); x < Math.floor(maxX); x++) {
                const idx = (y * width + x) * 4;
                
                // Apply contrast adjustment
                for (let c = 0; c < 3; c++) {
                    const value = data[idx + c];
                    const adjusted = ((value - 128) * (1 + factor)) + 128;
                    data[idx + c] = Math.max(0, Math.min(255, adjusted));
                }
            }
        }
    }

    applyAdaptiveNoiseReduction(imageData, strength) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const factor = strength / 100;

        // Apply bilateral filter for edge-preserving noise reduction
        const output = new Uint8ClampedArray(data);
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                for (let c = 0; c < 3; c++) {
                    const centerIdx = (y * width + x) * 4 + c;
                    const centerValue = data[centerIdx];
                    
                    let weightedSum = 0;
                    let weightSum = 0;
                    
                    // Apply bilateral filter
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            const idx = ((y + dy) * width + (x + dx)) * 4 + c;
                            const value = data[idx];
                            
                            // Spatial weight
                            const spatialWeight = Math.exp(-(dx * dx + dy * dy) / (2 * 1 * 1));
                            
                            // Intensity weight
                            const intensityWeight = Math.exp(-Math.pow(value - centerValue, 2) / (2 * 30 * 30));
                            
                            const totalWeight = spatialWeight * intensityWeight;
                            weightedSum += value * totalWeight;
                            weightSum += totalWeight;
                        }
                    }
                    
                    const filteredValue = weightedSum / weightSum;
                    output[centerIdx] = centerValue * (1 - factor) + filteredValue * factor;
                }
            }
        }
        
        // Copy output back to data
        for (let i = 0; i < data.length; i++) {
            data[i] = output[i];
        }
    }

    applySmartSpecularControl(imageData, level) {
        const data = imageData.data;
        const factor = level / 100;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            const brightness = (r + g + b) / 3;
            
            // Detect and reduce specular highlights
            if (brightness > 200) {
                const reduction = factor * (brightness - 200) / 55;
                const adjustedBrightness = brightness - (brightness - 200) * reduction;
                
                const scale = adjustedBrightness / brightness;
                data[i] = r * scale;
                data[i + 1] = g * scale;
                data[i + 2] = b * scale;
            }
        }
    }

    applyColorCorrection(imageData) {
        const data = imageData.data;
        
        // Calculate histogram
        const histogram = this.calculateHistogram(data);
        
        // Apply automatic white balance
        const whiteBalance = this.calculateWhiteBalance(histogram);
        
        // Apply color correction
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * whiteBalance.r);
            data[i + 1] = Math.min(255, data[i + 1] * whiteBalance.g);
            data[i + 2] = Math.min(255, data[i + 2] * whiteBalance.b);
        }
    }

    calculateHistogram(data) {
        const histogram = { r: new Array(256).fill(0), g: new Array(256).fill(0), b: new Array(256).fill(0) };
        
        for (let i = 0; i < data.length; i += 4) {
            histogram.r[data[i]]++;
            histogram.g[data[i + 1]]++;
            histogram.b[data[i + 2]]++;
        }
        
        return histogram;
    }

    calculateWhiteBalance(histogram) {
        // Find gray point using gray world assumption
        const findGrayPoint = (hist) => {
            let sum = 0;
            for (let i = 0; i < 256; i++) {
                sum += hist[i] * i;
            }
            return sum / (data.length / 4);
        };
        
        const grayR = findGrayPoint(histogram.r);
        const grayG = findGrayPoint(histogram.g);
        const grayB = findGrayPoint(histogram.b);
        
        const avgGray = (grayR + grayG + grayB) / 3;
        
        return {
            r: avgGray / grayR,
            g: avgGray / grayG,
            b: avgGray / grayB
        };
    }

    // One-touch smart enhancement
    async applySmartEnhance(imageData) {
        const options = {
            smartWhitening: true,
            whitening: 30,
            adaptiveContrast: true,
            contrast: 25,
            adaptiveNoise: true,
            noise: 35,
            smartSpecular: true,
            specular: -15,
            colorCorrection: true
        };
        
        return await this.applySmartEnhancement(imageData, options);
    }

    // Dental mode optimization
    async applyDentalMode(imageData) {
        const options = {
            smartWhitening: true,
            whitening: 20,
            adaptiveContrast: true,
            contrast: 40,
            adaptiveNoise: true,
            noise: 50,
            smartSpecular: true,
            specular: -25,
            colorCorrection: true
        };
        
        return await this.applySmartEnhancement(imageData, options);
    }

    // Professional clinical documentation preset
    async applyClinicalMode(imageData) {
        const options = {
            smartWhitening: false, // Preserve natural shades for documentation
            whitening: 0,
            adaptiveContrast: true,
            contrast: 15,
            adaptiveNoise: true,
            noise: 60,
            smartSpecular: true,
            specular: -30,
            colorCorrection: true
        };
        
        return await this.applySmartEnhancement(imageData, options);
    }
}

// Export for use in main application
window.SmartEnhancementEngine = SmartEnhancementEngine;
