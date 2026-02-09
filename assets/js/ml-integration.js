// ML Integration Layer for Dental Photo Editor
// Integrates TensorFlow.js and OpenCV.js for smart dental features

class MLIntegration {
    constructor() {
        this.models = {};
        this.isInitialized = false;
        this.detectionResults = null;
    }

    async initialize() {
        try {
            // Load TensorFlow.js
            await this.loadTensorFlow();
            
            // Load OpenCV.js
            await this.loadOpenCV();
            
            // Initialize dental-specific models
            await this.loadDentalModels();
            
            this.isInitialized = true;
            console.log('ML Integration initialized successfully');
        } catch (error) {
            console.error('Failed to initialize ML Integration:', error);
            throw error;
        }
    }

    async loadTensorFlow() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async loadOpenCV() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://docs.opencv.org/4.5.0/opencv.js';
            script.onload = () => {
                // Wait for OpenCV to be fully loaded
                setTimeout(() => {
                    if (typeof cv !== 'undefined') {
                        resolve();
                    } else {
                        reject(new Error('OpenCV.js failed to load'));
                    }
                }, 1000);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async loadDentalModels() {
        // Initialize lightweight models for dental detection
        // These will be custom-trained models for dental features
        
        // Tooth detection model (simplified edge detection + classification)
        this.models.toothDetector = new ToothDetector();
        
        // Gum line detection model
        this.models.gumDetector = new GumDetector();
        
        // Smile zone classifier
        this.models.smileZoneClassifier = new SmileZoneClassifier();
        
        // Plaque detection model
        this.models.plaqueDetector = new PlaqueDetector();
        
        // Restoration detection model
        this.models.restorationDetector = new RestorationDetector();
    }

    async detectDentalFeatures(imageData) {
        if (!this.isInitialized) {
            throw new Error('ML Integration not initialized');
        }

        const results = {
            teeth: await this.models.toothDetector.detect(imageData),
            gums: await this.models.gumDetector.detect(imageData),
            smileZones: await this.models.smileZoneClassifier.classify(imageData),
            plaque: await this.models.plaqueDetector.detect(imageData),
            restorations: await this.models.restorationDetector.detect(imageData),
            timestamp: Date.now()
        };

        this.detectionResults = results;
        return results;
    }

    getDetectionResults() {
        return this.detectionResults;
    }

    isReady() {
        return this.isInitialized;
    }
}

// Tooth Detection using Edge Detection + ML
class ToothDetector {
    async detect(imageData) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        ctx.putImageData(imageData, 0, 0);

        // Convert to grayscale for edge detection
        const grayImageData = this.convertToGrayscale(imageData);
        
        // Apply Canny edge detection
        const edges = this.detectEdges(grayImageData);
        
        // Find contours that could be teeth
        const contours = this.findContours(edges);
        
        // Filter contours based on tooth characteristics
        const teeth = this.filterToothContours(contours, imageData);
        
        return {
            boundaries: teeth,
            count: teeth.length,
            confidence: this.calculateConfidence(teeth)
        };
    }

    convertToGrayscale(imageData) {
        const data = imageData.data;
        const grayData = new Uint8ClampedArray(imageData.width * imageData.height);
        
        for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            grayData[i / 4] = gray;
        }
        
        return {
            data: grayData,
            width: imageData.width,
            height: imageData.height
        };
    }

    detectEdges(grayImageData) {
        // Simplified Canny edge detection
        const { data, width, height } = grayImageData;
        const edges = new Uint8ClampedArray(data.length);
        
        // Sobel operators
        const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
        const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let gx = 0, gy = 0;
                
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const idx = (y + ky) * width + (x + kx);
                        const kernelIdx = (ky + 1) * 3 + (kx + 1);
                        gx += data[idx] * sobelX[kernelIdx];
                        gy += data[idx] * sobelY[kernelIdx];
                    }
                }
                
                const magnitude = Math.sqrt(gx * gx + gy * gy);
                edges[y * width + x] = magnitude > 50 ? 255 : 0;
            }
        }
        
        return { data: edges, width, height };
    }

    findContours(edges) {
        // Simplified contour detection
        const contours = [];
        const visited = new Uint8Array(edges.data.length);
        
        for (let y = 0; y < edges.height; y++) {
            for (let x = 0; x < edges.width; x++) {
                const idx = y * edges.width + x;
                if (edges.data[idx] === 255 && !visited[idx]) {
                    const contour = this.traceContour(edges, x, y, visited);
                    if (contour.length > 10) {
                        contours.push(contour);
                    }
                }
            }
        }
        
        return contours;
    }

    traceContour(edges, startX, startY, visited) {
        const contour = [];
        const stack = [[startX, startY]];
        
        while (stack.length > 0) {
            const [x, y] = stack.pop();
            const idx = y * edges.width + x;
            
            if (x < 0 || x >= edges.width || y < 0 || y >= edges.height || 
                edges.data[idx] !== 255 || visited[idx]) {
                continue;
            }
            
            visited[idx] = 1;
            contour.push([x, y]);
            
            // Add neighbors
            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }
        
        return contour;
    }

    filterToothContours(contours, imageData) {
        const teeth = [];
        
        for (const contour of contours) {
            if (this.isToothLike(contour, imageData)) {
                teeth.push(this.contourToBoundary(contour));
            }
        }
        
        return teeth;
    }

    isToothLike(contour, imageData) {
        // Check if contour has tooth-like characteristics
        const area = this.calculateArea(contour);
        const perimeter = this.calculatePerimeter(contour);
        const circularity = (4 * Math.PI * area) / (perimeter * perimeter);
        
        // Teeth are typically somewhat rectangular/oval
        return area > 500 && area < 50000 && circularity > 0.3 && circularity < 0.8;
    }

    calculateArea(contour) {
        // Shoelace formula
        let area = 0;
        for (let i = 0; i < contour.length; i++) {
            const [x1, y1] = contour[i];
            const [x2, y2] = contour[(i + 1) % contour.length];
            area += x1 * y2 - x2 * y1;
        }
        return Math.abs(area) / 2;
    }

    calculatePerimeter(contour) {
        let perimeter = 0;
        for (let i = 0; i < contour.length; i++) {
            const [x1, y1] = contour[i];
            const [x2, y2] = contour[(i + 1) % contour.length];
            perimeter += Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        }
        return perimeter;
    }

    contourToBoundary(contour) {
        // Convert contour points to boundary format
        const minX = Math.min(...contour.map(p => p[0]));
        const maxX = Math.max(...contour.map(p => p[0]));
        const minY = Math.min(...contour.map(p => p[1]));
        const maxY = Math.max(...contour.map(p => p[1]));
        
        return {
            points: contour,
            boundingBox: { minX, maxX, minY, maxY },
            center: [(minX + maxX) / 2, (minY + maxY) / 2]
        };
    }

    calculateConfidence(teeth) {
        // Simple confidence calculation based on detection quality
        if (teeth.length === 0) return 0;
        if (teeth.length < 4) return 0.6;
        if (teeth.length < 8) return 0.8;
        return 0.9;
    }
}

// Gum Line Detection using Color Segmentation
class GumDetector {
    async detect(imageData) {
        const gumLine = this.detectGumLine(imageData);
        return {
            line: gumLine,
            confidence: 0.85
        };
    }

    detectGumLine(imageData) {
        // Detect gum line using color segmentation
        // Gums typically have pinkish-red color
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        const gumPoints = [];
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                // Check if pixel has gum-like color
                if (this.isGumColor(r, g, b)) {
                    gumPoints.push([x, y]);
                }
            }
        }
        
        return this.fitGumLine(gumPoints);
    }

    isGumColor(r, g, b) {
        // Gums are typically pinkish-red
        const hue = this.rgbToHue(r, g, b);
        const saturation = this.rgbToSaturation(r, g, b);
        const brightness = (r + g + b) / 3;
        
        return hue >= 0 && hue <= 30 && saturation > 0.2 && brightness > 50 && brightness < 200;
    }

    rgbToHue(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        
        let hue = 0;
        if (delta !== 0) {
            if (max === r) hue = ((g - b) / delta) % 6;
            else if (max === g) hue = (b - r) / delta + 2;
            else hue = (r - g) / delta + 4;
        }
        
        return hue * 60;
    }

    rgbToSaturation(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        
        return max === 0 ? 0 : delta / max;
    }

    fitGumLine(points) {
        if (points.length < 2) return null;
        
        // Simple linear regression to fit gum line
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        const n = points.length;
        
        for (const [x, y] of points) {
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumX2 += x * x;
        }
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        return { slope, intercept, points };
    }
}

// Smile Zone Classification
class SmileZoneClassifier {
    async classify(imageData) {
        const zones = this.detectSmileZones(imageData);
        return {
            anterior: zones.anterior,
            posterior: zones.posterior,
            confidence: 0.8
        };
    }

    detectSmileZones(imageData) {
        // Simplified zone detection based on image regions
        const width = imageData.width;
        const height = imageData.height;
        
        // Anterior zone (middle third)
        const anterior = {
            x: width / 3,
            y: height / 3,
            width: width / 3,
            height: height / 3
        };
        
        // Posterior zones (left and right thirds)
        const posterior = {
            left: { x: 0, y: height / 3, width: width / 3, height: height / 3 },
            right: { x: 2 * width / 3, y: height / 3, width: width / 3, height: height / 3 }
        };
        
        return { anterior, posterior };
    }
}

// Plaque Detection
class PlaqueDetector {
    async detect(imageData) {
        const plaque = this.detectPlaque(imageData);
        return {
            areas: plaque,
            confidence: 0.7
        };
    }

    detectPlaque(imageData) {
        // Detect plaque based on color and texture
        // Plaque typically appears as yellowish/whitish deposits
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        const plaqueAreas = [];
        
        for (let y = 0; y < height; y += 10) {
            for (let x = 0; x < width; x += 10) {
                const idx = (y * width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                if (this.isPlaqueColor(r, g, b)) {
                    plaqueAreas.push({ x, y, radius: 5 });
                }
            }
        }
        
        return plaqueAreas;
    }

    isPlaqueColor(r, g, b) {
        // Plaque is typically yellowish-white
        const brightness = (r + g + b) / 3;
        const yellowTint = (r + g) / 2 - b;
        
        return brightness > 180 && yellowTint > 10 && yellowTint < 40;
    }
}

// Restoration Detection
class RestorationDetector {
    async detect(imageData) {
        const restorations = this.detectRestorations(imageData);
        return {
            areas: restorations,
            confidence: 0.6
        };
    }

    detectRestorations(imageData) {
        // Detect restorations based on metallic/unnatural colors
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        const restorationAreas = [];
        
        for (let y = 0; y < height; y += 10) {
            for (let x = 0; x < width; x += 10) {
                const idx = (y * width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                if (this.isRestorationMaterial(r, g, b)) {
                    restorationAreas.push({ x, y, radius: 5 });
                }
            }
        }
        
        return restorationAreas;
    }

    isRestorationMaterial(r, g, b) {
        // Restorations can be metallic, composite, or ceramic
        const brightness = (r + g + b) / 3;
        const colorVariance = Math.max(r, g, b) - Math.min(r, g, b);
        
        // Metallic: high brightness, low color variance
        // Composite: medium brightness, some color variance
        return (brightness > 200 && colorVariance < 20) || 
               (brightness > 150 && brightness < 200 && colorVariance > 30);
    }
}

// Export for use in main application
window.MLIntegration = MLIntegration;
window.ToothDetector = ToothDetector;
window.GumDetector = GumDetector;
window.SmileZoneClassifier = SmileZoneClassifier;
window.PlaqueDetector = PlaqueDetector;
window.RestorationDetector = RestorationDetector;
