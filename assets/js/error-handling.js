// Error Handling and Fallback Mechanisms for Smart Dental Features
// Ensures graceful degradation when AI features fail

class SmartFeaturesErrorHandler {
    constructor() {
        this.errorCounts = {};
        this.maxRetries = 3;
        this.fallbackMode = false;
        this.errorLog = [];
    }

    // Handle ML initialization errors
    handleMLError(error, context = 'ml_initialization') {
        this.logError(error, context);
        this.incrementErrorCount(context);
        
        if (this.errorCounts[context] >= this.maxRetries) {
            this.enableFallbackMode();
            return {
                success: false,
                fallback: true,
                message: 'Smart features unavailable. Using manual controls.',
                error: error.message
            };
        }
        
        return {
            success: false,
            fallback: false,
            message: `AI features temporarily unavailable. Retrying... (${this.errorCounts[context]}/${this.maxRetries})`,
            error: error.message
        };
    }

    // Handle detection errors
    handleDetectionError(error, context = 'detection') {
        this.logError(error, context);
        
        // Provide fallback detection results
        const fallbackResults = this.getFallbackDetectionResults();
        
        return {
            success: false,
            fallback: true,
            results: fallbackResults,
            message: 'Auto-detection failed. Using basic analysis.',
            error: error.message
        };
    }

    // Handle enhancement errors
    handleEnhancementError(error, context = 'enhancement') {
        this.logError(error, context);
        
        // Provide fallback enhancement
        const fallbackEnhancement = this.getFallbackEnhancement();
        
        return {
            success: false,
            fallback: true,
            enhancement: fallbackEnhancement,
            message: 'Smart enhancement failed. Using basic filters.',
            error: error.message
        };
    }

    // Handle network errors
    handleNetworkError(error, context = 'network') {
        this.logError(error, context);
        
        if (navigator.onLine === false) {
            return {
                success: false,
                offline: true,
                message: 'Offline mode. Smart features require internet connection.',
                error: error.message
            };
        }
        
        return {
            success: false,
            retry: true,
            message: 'Network error. Retrying...',
            error: error.message
        };
    }

    // Handle memory errors
    handleMemoryError(error, context = 'memory') {
        this.logError(error, context);
        
        // Clear caches and reduce memory usage
        this.clearMemoryCaches();
        
        return {
            success: false,
            memory: true,
            message: 'Low memory. Optimizing performance...',
            error: error.message
        };
    }

    // Enable fallback mode
    enableFallbackMode() {
        this.fallbackMode = true;
        console.warn('Smart features fallback mode enabled');
        
        // Notify user
        if (typeof showToast === 'function') {
            showToast('Smart features unavailable. Using enhanced manual controls.');
        }
        
        // Disable smart feature buttons
        this.disableSmartButtons();
    }

    // Disable smart feature buttons
    disableSmartButtons() {
        const smartButtons = [
            'button[onclick*="applySmartEnhance"]',
            'button[onclick*="applyDentalMode"]',
            'button[onclick*="runAutoDetection"]'
        ];
        
        smartButtons.forEach(selector => {
            const button = document.querySelector(selector);
            if (button) {
                button.disabled = true;
                button.style.opacity = '0.5';
                button.title = 'Smart features unavailable';
            }
        });
    }

    // Get fallback detection results
    getFallbackDetectionResults() {
        return {
            teeth: {
                boundaries: [],
                count: 0,
                confidence: 0,
                fallback: true
            },
            gums: {
                line: null,
                confidence: 0,
                fallback: true
            },
            smileZones: {
                anterior: null,
                posterior: null,
                fallback: true
            },
            plaque: {
                areas: [],
                confidence: 0,
                fallback: true
            },
            restorations: {
                areas: [],
                confidence: 0,
                fallback: true
            },
            timestamp: Date.now(),
            fallback: true
        };
    }

    // Get fallback enhancement
    getFallbackEnhancement() {
        return {
            whitening: 20,
            contrast: 15,
            noise: 30,
            specular: -20,
            brightness: 10,
            fallback: true
        };
    }

    // Clear memory caches
    clearMemoryCaches() {
        // Clear image data caches
        if (typeof originalImageData !== 'undefined') {
            // Keep only essential data
        }
        
        // Clear detection results
        if (typeof detectionResults !== 'undefined') {
            detectionResults = null;
        }
        
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }

    // Increment error count
    incrementErrorCount(context) {
        this.errorCounts[context] = (this.errorCounts[context] || 0) + 1;
    }

    // Log error
    logError(error, context) {
        const errorEntry = {
            timestamp: new Date().toISOString(),
            context: context,
            error: error.message,
            stack: error.stack,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.errorLog.push(errorEntry);
        
        // Keep only last 100 errors
        if (this.errorLog.length > 100) {
            this.errorLog = this.errorLog.slice(-100);
        }
        
        console.error(`Smart Features Error [${context}]:`, error);
    }

    // Check if smart features are available
    isSmartFeaturesAvailable() {
        return !this.fallbackMode && this.errorCounts['ml_initialization'] < this.maxRetries;
    }

    // Get error statistics
    getErrorStats() {
        const stats = {
            totalErrors: this.errorLog.length,
            errorsByContext: {},
            recentErrors: this.errorLog.slice(-10),
            fallbackMode: this.fallbackMode
        };
        
        this.errorLog.forEach(error => {
            stats.errorsByContext[error.context] = (stats.errorsByContext[error.context] || 0) + 1;
        });
        
        return stats;
    }

    // Reset error counts
    resetErrors() {
        this.errorCounts = {};
        this.fallbackMode = false;
        this.errorLog = [];
        
        // Re-enable smart buttons
        this.enableSmartButtons();
        
        console.log('Smart features error handler reset');
    }

    // Enable smart buttons
    enableSmartButtons() {
        const smartButtons = [
            'button[onclick*="applySmartEnhance"]',
            'button[onclick*="applyDentalMode"]',
            'button[onclick*="runAutoDetection"]'
        ];
        
        smartButtons.forEach(selector => {
            const button = document.querySelector(selector);
            if (button) {
                button.disabled = false;
                button.style.opacity = '1';
                button.title = '';
            }
        });
    }

    // Check browser compatibility
    checkBrowserCompatibility() {
        const compatibility = {
            webgl: this.checkWebGL(),
            webassembly: this.checkWebAssembly(),
            fileAPI: this.checkFileAPI(),
            canvas: this.checkCanvas(),
            es6: this.checkES6()
        };
        
        const isCompatible = Object.values(compatibility).every(Boolean);
        
        if (!isCompatible) {
            this.enableFallbackMode();
            console.warn('Browser compatibility issues detected:', compatibility);
        }
        
        return { compatible: isCompatible, details: compatibility };
    }

    checkWebGL() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }

    checkWebAssembly() {
        return typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function';
    }

    checkFileAPI() {
        return typeof File !== 'undefined' && typeof FileReader !== 'undefined';
    }

    checkCanvas() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext && canvas.getContext('2d'));
        } catch (e) {
            return false;
        }
    }

    checkES6() {
        try {
            new Function('(a = 0) => a');
            return true;
        } catch (e) {
            return false;
        }
    }

    // Monitor performance
    monitorPerformance() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('measure');
            const slowOperations = perfData.filter(entry => entry.duration > 1000);
            
            if (slowOperations.length > 0) {
                console.warn('Slow operations detected:', slowOperations);
                this.optimizePerformance();
            }
        }
    }

    optimizePerformance() {
        // Reduce image processing quality
        if (typeof smartEnhancement !== 'undefined') {
            smartEnhancement.setQuality('medium');
        }
        
        // Clear caches
        this.clearMemoryCaches();
        
        // Notify user
        if (typeof showToast === 'function') {
            showToast('Optimizing performance for better experience.');
        }
    }
}

// Global error handler for smart features
window.smartFeaturesErrorHandler = new SmartFeaturesErrorHandler();

// Wrap smart feature functions with error handling
function wrapSmartFunction(originalFunction, errorHandler, context) {
    return async function(...args) {
        try {
            // Check if smart features are available
            if (!errorHandler.isSmartFeaturesAvailable()) {
                const fallback = errorHandler.getFallbackEnhancement();
                return { success: false, fallback: true, result: fallback };
            }
            
            // Monitor performance
            const startTime = performance.now();
            
            // Execute original function
            const result = await originalFunction.apply(this, args);
            
            // Log performance
            const endTime = performance.now();
            if (endTime - startTime > 3000) {
                console.warn(`Slow operation detected: ${context} took ${endTime - startTime}ms`);
            }
            
            return result;
        } catch (error) {
            // Handle specific error types
            if (error.message.includes('network') || error.message.includes('fetch')) {
                return errorHandler.handleNetworkError(error, context);
            } else if (error.message.includes('memory') || error.message.includes('out of memory')) {
                return errorHandler.handleMemoryError(error, context);
            } else if (context.includes('detection')) {
                return errorHandler.handleDetectionError(error, context);
            } else if (context.includes('enhancement')) {
                return errorHandler.handleEnhancementError(error, context);
            } else {
                return errorHandler.handleMLError(error, context);
            }
        }
    };
}

// Initialize error handling on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check browser compatibility
    const compatibility = window.smartFeaturesErrorHandler.checkBrowserCompatibility();
    
    if (!compatibility.compatible) {
        console.warn('Limited browser compatibility detected:', compatibility.details);
    }
    
    // Monitor performance periodically
    setInterval(() => {
        window.smartFeaturesErrorHandler.monitorPerformance();
    }, 30000); // Every 30 seconds
});

// Export for use in other modules
window.SmartFeaturesErrorHandler = SmartFeaturesErrorHandler;
window.wrapSmartFunction = wrapSmartFunction;
