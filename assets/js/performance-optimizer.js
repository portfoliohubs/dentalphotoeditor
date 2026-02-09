// Performance Optimization for Mobile Devices
// Ensures smooth operation of smart features on mobile hardware

class MobilePerformanceOptimizer {
    constructor() {
        this.deviceProfile = this.detectDeviceProfile();
        this.performanceSettings = this.getOptimalSettings();
        this.isOptimizing = false;
        this.frameRate = 60;
        this.lastFrameTime = 0;
    }

    // Detect device capabilities
    detectDeviceProfile() {
        const profile = {
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            isTablet: /iPad|Android/i.test(navigator.userAgent) && window.innerWidth > 768,
            memory: this.getDeviceMemory(),
            cores: this.getDeviceCores(),
            gpu: this.detectGPU(),
            battery: this.getBatteryLevel(),
            connection: this.getConnectionType()
        };

        profile.performanceScore = this.calculatePerformanceScore(profile);
        profile.optimizationLevel = this.getOptimizationLevel(profile.performanceScore);

        return profile;
    }

    getDeviceMemory() {
        if ('deviceMemory' in navigator) {
            return navigator.deviceMemory; // in GB
        }
        return 4; // Default assumption
    }

    getDeviceCores() {
        if ('hardwareConcurrency' in navigator) {
            return navigator.hardwareConcurrency;
        }
        return 4; // Default assumption
    }

    detectGPU() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return 'unknown';

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            
            if (renderer.includes('Apple')) return 'apple';
            if (renderer.includes('NVIDIA')) return 'nvidia';
            if (renderer.includes('AMD') || renderer.includes('Radeon')) return 'amd';
            if (renderer.includes('Intel')) return 'intel';
            if (renderer.includes('Adreno')) return 'adreno';
            if (renderer.includes('Mali')) return 'mali';
            if (renderer.includes('PowerVR')) return 'powervr';
        }
        
        return 'unknown';
    }

    getBatteryLevel() {
        if ('getBattery' in navigator) {
            return navigator.getBattery().then(battery => ({
                level: battery.level,
                charging: battery.charging
            }));
        }
        return Promise.resolve({ level: 1, charging: true });
    }

    getConnectionType() {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            return {
                type: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt
            };
        }
        return { type: 'unknown', downlink: 10, rtt: 100 };
    }

    calculatePerformanceScore(profile) {
        let score = 0;
        
        // Memory scoring (0-30 points)
        score += Math.min(profile.memory * 6, 30);
        
        // CPU scoring (0-25 points)
        score += Math.min(profile.cores * 6.25, 25);
        
        // GPU scoring (0-25 points)
        const gpuScores = {
            'apple': 25, 'nvidia': 23, 'amd': 22, 'intel': 18,
            'adreno': 15, 'mali': 14, 'powervr': 12, 'unknown': 10
        };
        score += gpuScores[profile.gpu] || 10;
        
        // Connection scoring (0-20 points)
        const connScores = { '4g': 20, '3g': 12, '2g': 5, 'unknown': 10 };
        score += connScores[profile.connection.type] || 10;
        
        return Math.min(score, 100);
    }

    getOptimizationLevel(score) {
        if (score >= 80) return 'high';
        if (score >= 60) return 'medium';
        if (score >= 40) return 'low';
        return 'minimal';
    }

    getOptimalSettings() {
        const level = this.deviceProfile.optimizationLevel;
        
        const settings = {
            high: {
                imageQuality: 1.0,
                processingResolution: 1.0,
                aiModelComplexity: 'full',
                maxProcessingTime: 5000,
                enableGPU: true,
                enableWebAssembly: true,
                batchSize: 1,
                cacheSize: 100
            },
            medium: {
                imageQuality: 0.8,
                processingResolution: 0.75,
                aiModelComplexity: 'medium',
                maxProcessingTime: 3000,
                enableGPU: true,
                enableWebAssembly: true,
                batchSize: 2,
                cacheSize: 50
            },
            low: {
                imageQuality: 0.6,
                processingResolution: 0.5,
                aiModelComplexity: 'light',
                maxProcessingTime: 2000,
                enableGPU: false,
                enableWebAssembly: false,
                batchSize: 4,
                cacheSize: 20
            },
            minimal: {
                imageQuality: 0.4,
                processingResolution: 0.25,
                aiModelComplexity: 'minimal',
                maxProcessingTime: 1000,
                enableGPU: false,
                enableWebAssembly: false,
                batchSize: 8,
                cacheSize: 10
            }
        };
        
        return settings[level];
    }

    // Optimize image processing
    optimizeImageProcessing(imageData) {
        const settings = this.performanceSettings;
        
        // Reduce resolution if needed
        if (settings.processingResolution < 1.0) {
            imageData = this.resizeImageData(imageData, settings.processingResolution);
        }
        
        // Reduce quality if needed
        if (settings.imageQuality < 1.0) {
            imageData = this.reduceImageQuality(imageData, settings.imageQuality);
        }
        
        return imageData;
    }

    resizeImageData(imageData, scale) {
        const newWidth = Math.floor(imageData.width * scale);
        const newHeight = Math.floor(imageData.height * scale);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Create temporary canvas for original image
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = imageData.width;
        tempCanvas.height = imageData.height;
        tempCtx.putImageData(imageData, 0, 0);
        
        // Draw scaled image
        ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
        
        return ctx.getImageData(0, 0, newWidth, newHeight);
    }

    reduceImageQuality(imageData, quality) {
        const data = imageData.data;
        const factor = Math.max(0.5, quality);
        
        for (let i = 0; i < data.length; i += 4) {
            // Reduce color precision
            data[i] = Math.round(data[i] / factor) * factor;
            data[i + 1] = Math.round(data[i + 1] / factor) * factor;
            data[i + 2] = Math.round(data[i + 2] / factor) * factor;
        }
        
        return imageData;
    }

    // Optimize AI processing
    optimizeAIProcessing() {
        const settings = this.performanceSettings;
        
        return {
            modelComplexity: settings.aiModelComplexity,
            batchSize: settings.batchSize,
            maxProcessingTime: settings.maxProcessingTime,
            enableGPU: settings.enableGPU,
            enableWebAssembly: settings.enableWebAssembly
        };
    }

    // Monitor and optimize performance in real-time
    startPerformanceMonitoring() {
        this.monitorFrameRate();
        this.monitorMemoryUsage();
        this.monitorBatteryLevel();
        this.monitorNetworkConditions();
    }

    monitorFrameRate() {
        const checkFrameRate = (currentTime) => {
            if (this.lastFrameTime > 0) {
                const deltaTime = currentTime - this.lastFrameTime;
                this.frameRate = 1000 / deltaTime;
                
                // Optimize if frame rate drops below 30fps
                if (this.frameRate < 30 && !this.isOptimizing) {
                    this.optimizePerformance();
                }
            }
            
            this.lastFrameTime = currentTime;
            requestAnimationFrame(checkFrameRate);
        };
        
        requestAnimationFrame(checkFrameRate);
    }

    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memoryInfo = performance.memory;
                const usedMemory = memoryInfo.usedJSHeapSize / 1024 / 1024; // MB
                
                // Optimize if memory usage is high
                if (usedMemory > this.deviceProfile.memory * 0.8) {
                    this.optimizeMemory();
                }
            }, 5000);
        }
    }

    monitorBatteryLevel() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const updateBatteryStatus = () => {
                    if (battery.level < 0.2 && !battery.charging) {
                        this.enableBatterySaver();
                    }
                };
                
                battery.addEventListener('levelchange', updateBatteryStatus);
                battery.addEventListener('chargingchange', updateBatteryStatus);
                updateBatteryStatus();
            });
        }
    }

    monitorNetworkConditions() {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            
            const updateConnection = () => {
                if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
                    this.enableLowBandwidthMode();
                }
            };
            
            conn.addEventListener('change', updateConnection);
            updateConnection();
        }
    }

    optimizePerformance() {
        if (this.isOptimizing) return;
        
        this.isOptimizing = true;
        
        // Reduce processing quality
        const currentLevel = this.deviceProfile.optimizationLevel;
        const levels = ['high', 'medium', 'low', 'minimal'];
        const currentIndex = levels.indexOf(currentLevel);
        
        if (currentIndex < levels.length - 1) {
            this.deviceProfile.optimizationLevel = levels[currentIndex + 1];
            this.performanceSettings = this.getOptimalSettings();
            
            // Notify user
            if (typeof showToast === 'function') {
                showToast('Optimizing performance for better experience');
            }
        }
        
        this.isOptimizing = false;
    }

    optimizeMemory() {
        // Clear caches
        if (typeof smartFeaturesErrorHandler !== 'undefined') {
            smartFeaturesErrorHandler.clearMemoryCaches();
        }
        
        // Reduce image quality
        this.performanceSettings.imageQuality *= 0.8;
        this.performanceSettings.cacheSize *= 0.5;
        
        // Force garbage collection
        if (window.gc) {
            window.gc();
        }
    }

    enableBatterySaver() {
        // Reduce processing intensity
        this.performanceSettings.imageQuality *= 0.7;
        this.performanceSettings.processingResolution *= 0.7;
        this.performanceSettings.maxProcessingTime *= 0.5;
        
        // Disable GPU acceleration
        this.performanceSettings.enableGPU = false;
        
        // Notify user
        if (typeof showToast === 'function') {
            showToast('Battery saver mode enabled');
        }
    }

    enableLowBandwidthMode() {
        // Reduce data transfer
        this.performanceSettings.imageQuality *= 0.6;
        this.performanceSettings.processingResolution *= 0.6;
        
        // Increase batch size to reduce requests
        this.performanceSettings.batchSize *= 2;
        
        // Notify user
        if (typeof showToast === 'function') {
            showToast('Low bandwidth mode enabled');
        }
    }

    // Get performance recommendations
    getPerformanceRecommendations() {
        const recommendations = [];
        const profile = this.deviceProfile;
        
        if (profile.memory < 4) {
            recommendations.push('Consider closing other apps to free up memory');
        }
        
        if (profile.cores < 4) {
            recommendations.push('Processing may be slower on this device');
        }
        
        if (profile.gpu === 'unknown') {
            recommendations.push('GPU acceleration not available');
        }
        
        if (profile.connection.type === '2g' || profile.connection.type === 'slow-2g') {
            recommendations.push('Use WiFi for better performance');
        }
        
        return recommendations;
    }

    // Get current performance status
    getPerformanceStatus() {
        return {
            deviceProfile: this.deviceProfile,
            currentSettings: this.performanceSettings,
            frameRate: this.frameRate,
            isOptimizing: this.isOptimizing,
            recommendations: this.getPerformanceRecommendations()
        };
    }
}

// Initialize performance optimizer
window.mobilePerformanceOptimizer = new MobilePerformanceOptimizer();

// Auto-optimization wrapper for smart functions
function optimizeSmartFunction(originalFunction, optimizer) {
    return async function(...args) {
        // Check if optimization is needed
        if (optimizer.frameRate < 30) {
            optimizer.optimizePerformance();
        }
        
        // Optimize input data
        if (args[0] && args[0].width) {
            args[0] = optimizer.optimizeImageProcessing(args[0]);
        }
        
        // Get optimized AI settings
        const aiSettings = optimizer.optimizeAIProcessing();
        
        // Execute with timeout
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Processing timeout')), aiSettings.maxProcessingTime);
        });
        
        try {
            return await Promise.race([
                originalFunction.apply(this, args),
                timeoutPromise
            ]);
        } catch (error) {
            if (error.message === 'Processing timeout') {
                optimizer.optimizePerformance();
                throw new Error('Processing took too long. Performance optimized.');
            }
            throw error;
        }
    };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    window.mobilePerformanceOptimizer.startPerformanceMonitoring();
    
    // Log performance status
    console.log('Performance Profile:', window.mobilePerformanceOptimizer.getPerformanceStatus());
});

// Export for use in other modules
window.MobilePerformanceOptimizer = MobilePerformanceOptimizer;
window.optimizeSmartFunction = optimizeSmartFunction;
