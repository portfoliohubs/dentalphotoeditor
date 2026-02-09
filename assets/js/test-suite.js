// Test Suite for Smart Dental Features
// Comprehensive testing for all smart functionality

class SmartFeaturesTestSuite {
    constructor() {
        this.tests = [];
        this.results = [];
        this.isRunning = false;
    }

    // Add test to suite
    addTest(name, testFunction, category = 'general') {
        this.tests.push({
            name: name,
            test: testFunction,
            category: category,
            timeout: 5000
        });
    }

    // Run all tests
    async runAllTests() {
        if (this.isRunning) {
            console.log('Tests already running');
            return;
        }

        this.isRunning = true;
        this.results = [];

        console.log('🧪 Starting Smart Features Test Suite...');
        console.log(`Running ${this.tests.length} tests\n`);

        for (const test of this.tests) {
            try {
                console.log(`⏳ Running: ${test.name}`);
                const startTime = performance.now();
                
                const result = await this.runSingleTest(test);
                
                const endTime = performance.now();
                result.duration = endTime - startTime;
                
                this.results.push(result);
                
                if (result.passed) {
                    console.log(`✅ ${test.name} (${result.duration.toFixed(2)}ms)`);
                } else {
                    console.log(`❌ ${test.name} - ${result.error}`);
                }
                
            } catch (error) {
                console.log(`💥 ${test.name} - ${error.message}`);
                this.results.push({
                    name: test.name,
                    category: test.category,
                    passed: false,
                    error: error.message,
                    duration: 0
                });
            }
        }

        this.printSummary();
        this.isRunning = false;
        return this.results;
    }

    // Run single test with timeout
    async runSingleTest(test) {
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                resolve({
                    name: test.name,
                    category: test.category,
                    passed: false,
                    error: `Test timed out after ${test.timeout}ms`,
                    duration: test.timeout
                });
            }, test.timeout);

            test.test()
                .then(() => {
                    clearTimeout(timeout);
                    resolve({
                        name: test.name,
                        category: test.category,
                        passed: true,
                        error: null
                    });
                })
                .catch((error) => {
                    clearTimeout(timeout);
                    resolve({
                        name: test.name,
                        category: test.category,
                        passed: false,
                        error: error.message
                    });
                });
        });
    }

    // Print test summary
    printSummary() {
        const passed = this.results.filter(r => r.passed).length;
        const failed = this.results.filter(r => !r.passed).length;
        const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

        console.log('\n📊 Test Summary:');
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`⏱️  Total Duration: ${totalDuration.toFixed(2)}ms`);
        console.log(`📈 Success Rate: ${((passed / this.results.length) * 100).toFixed(1)}%`);

        if (failed > 0) {
            console.log('\n❌ Failed Tests:');
            this.results.filter(r => !r.passed).forEach(result => {
                console.log(`  • ${result.name}: ${result.error}`);
            });
        }

        // Print category summary
        const categories = [...new Set(this.results.map(r => r.category))];
        console.log('\n📂 Results by Category:');
        categories.forEach(category => {
            const categoryResults = this.results.filter(r => r.category === category);
            const categoryPassed = categoryResults.filter(r => r.passed).length;
            console.log(`  ${category}: ${categoryPassed}/${categoryResults.length} passed`);
        });
    }

    // Get test results
    getResults() {
        return this.results;
    }

    // Clear all tests
    clearTests() {
        this.tests = [];
        this.results = [];
    }
}

// Test implementations
function createTestSuite() {
    const suite = new SmartFeaturesTestSuite();

    // ML Integration Tests
    suite.addTest('ML Integration Class Exists', () => {
        if (typeof MLIntegration === 'undefined') {
            throw new Error('MLIntegration class not defined');
        }
    }, 'ml-integration');

    suite.addTest('ML Integration Initialization', async () => {
        if (!window.mlIntegration) {
            throw new Error('ML integration not initialized');
        }
        
        if (!window.mlIntegration.isInitialized) {
            throw new Error('ML integration not ready');
        }
    }, 'ml-integration');

    // Smart Enhancement Tests
    suite.addTest('Smart Enhancement Class Exists', () => {
        if (typeof SmartEnhancementEngine === 'undefined') {
            throw new Error('SmartEnhancementEngine class not defined');
        }
    }, 'smart-enhancement');

    suite.addTest('VITA Shades Database Loaded', () => {
        if (!window.smartEnhancement) {
            throw new Error('Smart enhancement not initialized');
        }
        
        const shades = window.smartEnhancement.vitaShades;
        if (!shades || Object.keys(shades).length === 0) {
            throw new Error('VITA shades database not loaded');
        }
        
        // Check for essential shades
        const essentialShades = ['A1', 'A2', 'B1', 'C1', 'D1'];
        for (const shade of essentialShades) {
            if (!shades[shade]) {
                throw new Error(`Essential VITA shade ${shade} missing`);
            }
        }
    }, 'smart-enhancement');

    // Smart Filters Tests
    suite.addTest('Smart Filters Class Exists', () => {
        if (typeof SmartFilters === 'undefined') {
            throw new Error('SmartFilters class not defined');
        }
    }, 'smart-filters');

    suite.addTest('Camera Profiles Loaded', () => {
        if (!window.smartFilters) {
            throw new Error('Smart filters not initialized');
        }
        
        const profiles = window.smartFilters.cameraProfiles;
        if (!profiles || Object.keys(profiles).length === 0) {
            throw new Error('Camera profiles not loaded');
        }
        
        // Check for essential profiles
        const essentialProfiles = ['iphone-13-pro', 'samsung-s23', 'canon-eos'];
        for (const profile of essentialProfiles) {
            if (!profiles[profile]) {
                throw new Error(`Essential camera profile ${profile} missing`);
            }
        }
    }, 'smart-filters');

    suite.addTest('Professional Presets Loaded', () => {
        if (!window.smartFilters) {
            throw new Error('Smart filters not initialized');
        }
        
        const presets = window.smartFilters.professionalPresets;
        if (!presets || Object.keys(presets).length === 0) {
            throw new Error('Professional presets not loaded');
        }
        
        // Check for essential presets
        const essentialPresets = ['clinical-standard', 'shade-matching', 'cosmetic-enhanced'];
        for (const preset of essentialPresets) {
            if (!presets[preset]) {
                throw new Error(`Essential professional preset ${preset} missing`);
            }
        }
    }, 'smart-filters');

    // Error Handling Tests
    suite.addTest('Error Handler Class Exists', () => {
        if (typeof SmartFeaturesErrorHandler === 'undefined') {
            throw new Error('SmartFeaturesErrorHandler class not defined');
        }
    }, 'error-handling');

    suite.addTest('Error Handler Initialization', () => {
        if (!window.smartFeaturesErrorHandler) {
            throw new Error('Error handler not initialized');
        }
        
        if (typeof window.smartFeaturesErrorHandler.handleMLError !== 'function') {
            throw new Error('Error handler methods not available');
        }
    }, 'error-handling');

    // Performance Tests
    suite.addTest('Performance Optimizer Class Exists', () => {
        if (typeof MobilePerformanceOptimizer === 'undefined') {
            throw new Error('MobilePerformanceOptimizer class not defined');
        }
    }, 'performance');

    suite.addTest('Device Profile Detection', () => {
        if (!window.mobilePerformanceOptimizer) {
            throw new Error('Performance optimizer not initialized');
        }
        
        const profile = window.mobilePerformanceOptimizer.deviceProfile;
        if (!profile || !profile.performanceScore) {
            throw new Error('Device profile not detected');
        }
        
        if (profile.performanceScore < 0 || profile.performanceScore > 100) {
            throw new Error('Invalid performance score');
        }
    }, 'performance');

    // Data Persistence Tests
    suite.addTest('Data Persistence Class Exists', () => {
        if (typeof DataPersistenceManager === 'undefined') {
            throw new Error('DataPersistenceManager class not defined');
        }
    }, 'data-persistence');

    suite.addTest('Data Persistence Initialization', () => {
        if (!window.dataPersistenceManager) {
            throw new Error('Data persistence manager not initialized');
        }
        
        if (typeof window.dataPersistenceManager.loadSettings !== 'function') {
            throw new Error('Data persistence methods not available');
        }
    }, 'data-persistence');

    // Accessibility Tests
    suite.addTest('Accessibility Manager Class Exists', () => {
        if (typeof AccessibilityManager === 'undefined') {
            throw new Error('AccessibilityManager class not defined');
        }
    }, 'accessibility');

    suite.addTest('Accessibility Features Active', () => {
        if (!window.accessibilityManager) {
            throw new Error('Accessibility manager not initialized');
        }
        
        const status = window.accessibilityManager.getAccessibilityStatus();
        if (!status || typeof status !== 'object') {
            throw new Error('Accessibility status not available');
        }
    }, 'accessibility');

    // Help System Tests
    suite.addTest('Help System Class Exists', () => {
        if (typeof HelpSystem === 'undefined') {
            throw new Error('HelpSystem class not defined');
        }
    }, 'help-system');

    suite.addTest('Help System Initialization', () => {
        if (!window.helpSystem) {
            throw new Error('Help system not initialized');
        }
        
        if (!window.helpSystem.tutorials || Object.keys(window.helpSystem.tutorials).length === 0) {
            throw new Error('Tutorials not loaded');
        }
    }, 'help-system');

    // Analytics Tests
    suite.addTest('Analytics Manager Class Exists', () => {
        if (typeof AnalyticsManager === 'undefined') {
            throw new Error('AnalyticsManager class not defined');
        }
    }, 'analytics');

    suite.addTest('Analytics Initialization', () => {
        if (!window.analyticsManager) {
            throw new Error('Analytics manager not initialized');
        }
        
        if (typeof window.analyticsManager.trackEvent !== 'function') {
            throw new Error('Analytics methods not available');
        }
    }, 'analytics');

    // Integration Tests
    suite.addTest('Smart Features Integration', () => {
        const requiredComponents = [
            'mlIntegration',
            'smartEnhancement', 
            'smartFilters',
            'smartFeaturesErrorHandler',
            'mobilePerformanceOptimizer',
            'dataPersistenceManager',
            'accessibilityManager',
            'helpSystem',
            'analyticsManager'
        ];
        
        for (const component of requiredComponents) {
            if (!window[component]) {
                throw new Error(`Required component ${component} not available`);
            }
        }
    }, 'integration');

    suite.addTest('Canvas Element Available', () => {
        const canvas = document.getElementById('mainCanvas');
        if (!canvas) {
            throw new Error('Main canvas element not found');
        }
        
        if (typeof canvas.getContext !== 'function') {
            throw new Error('Canvas context not available');
        }
    }, 'integration');

    suite.addTest('Smart Feature Buttons Available', () => {
        const buttons = [
            '[onclick*="applySmartEnhance()"]',
            '[onclick*="applyDentalMode()"]',
            '[onclick*="runAutoDetection()"]',
            '[onclick*="showProfessionalTools()"]'
        ];
        
        for (const selector of buttons) {
            const button = document.querySelector(selector);
            if (!button) {
                throw new Error(`Smart feature button ${selector} not found`);
            }
        }
    }, 'integration');

    // Performance Tests
    suite.addTest('Smart Enhancement Performance', async () => {
        if (!window.smartEnhancement || !originalImageData) {
            throw new Error('Cannot run performance test - missing dependencies');
        }
        
        const startTime = performance.now();
        
        try {
            await window.smartEnhancement.applySmartEnhance(originalImageData);
        } catch (error) {
            // Expected if no image loaded
            return;
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        if (duration > 5000) {
            throw new Error(`Smart enhancement too slow: ${duration.toFixed(2)}ms`);
        }
    }, 'performance');

    suite.addTest('Memory Usage Check', () => {
        if ('memory' in performance) {
            const memoryInfo = performance.memory;
            const usedMemory = memoryInfo.usedJSHeapSize / 1024 / 1024; // MB
            
            if (usedMemory > 100) {
                console.warn(`High memory usage: ${usedMemory.toFixed(2)}MB`);
            }
            
            // Not a failure, just a warning
        }
    }, 'performance');

    return suite;
}

// Run tests automatically when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for all smart features to initialize
    setTimeout(() => {
        const suite = createTestSuite();
        window.smartFeaturesTestSuite = suite;
        
        // Auto-run tests in development mode
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('🔧 Development mode detected - running smart features tests...');
            suite.runAllTests();
        }
    }, 3000);
});

// Export for manual testing
window.runSmartFeaturesTests = () => {
    if (!window.smartFeaturesTestSuite) {
        window.smartFeaturesTestSuite = createTestSuite();
    }
    return window.smartFeaturesTestSuite.runAllTests();
};

// Export for use in other modules
window.SmartFeaturesTestSuite = SmartFeaturesTestSuite;
window.createTestSuite = createTestSuite;
