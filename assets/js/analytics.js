// Analytics and Usage Tracking for Smart Dental Features
// Tracks user behavior, feature usage, and performance metrics

class AnalyticsManager {
    constructor() {
        this.isEnabled = true;
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.events = [];
        this.performanceMetrics = [];
        this.errorEvents = [];
        this.startTime = Date.now();
        this.config = this.getAnalyticsConfig();
    }

    // Generate unique session ID
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Get or generate user ID
    getUserId() {
        let userId = localStorage.getItem('dentalApp_userId');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('dentalApp_userId', userId);
        }
        return userId;
    }

    // Get analytics configuration
    getAnalyticsConfig() {
        return {
            batchSize: 10,
            flushInterval: 30000, // 30 seconds
            maxRetries: 3,
            endpoint: '/api/analytics', // Would be configured for real backend
            enablePerformanceTracking: true,
            enableErrorTracking: true,
            enableFeatureTracking: true,
            enableUserTracking: true
        };
    }

    // Initialize analytics
    initialize() {
        // Check user consent
        const consent = this.getUserConsent();
        if (!consent) {
            this.isEnabled = false;
            return;
        }

        // Start session tracking
        this.trackSessionStart();

        // Setup periodic flush
        setInterval(() => {
            this.flushEvents();
        }, this.config.flushInterval);

        // Track page unload
        window.addEventListener('beforeunload', () => {
            this.trackSessionEnd();
            this.flushEvents(true);
        });

        // Track errors
        window.addEventListener('error', (e) => {
            this.trackError('javascript', e.error, {
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno
            });
        });

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.trackError('promise', e.reason, {
                type: 'unhandledrejection'
            });
        });

        console.log('Analytics initialized');
    }

    // Get user consent for analytics
    getUserConsent() {
        const consent = localStorage.getItem('dentalApp_analyticsConsent');
        if (consent === null) {
            // Show consent dialog on first visit
            this.showConsentDialog();
            return false;
        }
        return consent === 'true';
    }

    // Show consent dialog
    showConsentDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        dialog.innerHTML = `
            <div class="bg-white rounded-xl max-w-md w-full p-6">
                <h3 class="text-lg font-semibold mb-4">Analytics & Usage Data</h3>
                <p class="text-gray-600 mb-4">
                    Help us improve the app by allowing anonymous usage analytics. 
                    We track feature usage, performance, and errors - no personal data is collected.
                </p>
                <div class="flex space-x-3">
                    <button onclick="window.analyticsManager.setConsent(true); this.closest('.fixed').remove();" 
                            class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                        Allow Analytics
                    </button>
                    <button onclick="window.analyticsManager.setConsent(false); this.closest('.fixed').remove();" 
                            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
                        Decline
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
    }

    // Set user consent
    setConsent(allowed) {
        localStorage.setItem('dentalApp_analyticsConsent', allowed.toString());
        this.isEnabled = allowed;
        
        if (allowed) {
            this.initialize();
        }
    }

    // Track session start
    trackSessionStart() {
        this.trackEvent('session_start', {
            sessionId: this.sessionId,
            userId: this.userId,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            deviceType: this.getDeviceType(),
            browserInfo: this.getBrowserInfo()
        });
    }

    // Track session end
    trackSessionEnd() {
        const sessionDuration = Date.now() - this.startTime;
        
        this.trackEvent('session_end', {
            sessionId: this.sessionId,
            duration: sessionDuration,
            timestamp: Date.now()
        });
    }

    // Track generic event
    trackEvent(eventName, properties = {}) {
        if (!this.isEnabled) return;

        const event = {
            name: eventName,
            properties: {
                ...properties,
                sessionId: this.sessionId,
                userId: this.userId,
                timestamp: Date.now(),
                url: window.location.href
            }
        };

        this.events.push(event);

        // Auto-flush if batch is full
        if (this.events.length >= this.config.batchSize) {
            this.flushEvents();
        }
    }

    // Track smart feature usage
    trackFeatureUsage(featureName, details = {}) {
        if (!this.config.enableFeatureTracking) return;

        this.trackEvent('feature_usage', {
            feature: featureName,
            category: 'smart_features',
            ...details
        });
    }

    // Track performance metrics
    trackPerformance(metricName, value, details = {}) {
        if (!this.config.enablePerformanceTracking) return;

        const metric = {
            name: metricName,
            value: value,
            timestamp: Date.now(),
            ...details
        };

        this.performanceMetrics.push(metric);

        // Also track as event
        this.trackEvent('performance_metric', {
            metric: metricName,
            value: value,
            ...details
        });
    }

    // Track errors
    trackError(errorType, error, context = {}) {
        if (!this.config.enableErrorTracking) return;

        const errorEvent = {
            type: errorType,
            message: error.message || error,
            stack: error.stack,
            context: context,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId
        };

        this.errorEvents.push(errorEvent);

        // Also track as event
        this.trackEvent('error', {
            errorType: errorType,
            message: error.message || error,
            context: context
        });
    }

    // Track smart enhancement performance
    trackSmartEnhancement(processingTime, success, details = {}) {
        this.trackPerformance('smart_enhancement_time', processingTime, {
            success: success,
            ...details
        });

        this.trackFeatureUsage('smart_enhancement', {
            processingTime: processingTime,
            success: success,
            ...details
        });
    }

    // Track detection results
    trackDetectionResults(results, processingTime) {
        this.trackPerformance('detection_time', processingTime, {
            teethCount: results.teeth?.count || 0,
            confidence: results.teeth?.confidence || 0
        });

        this.trackFeatureUsage('auto_detection', {
            teethDetected: results.teeth?.count || 0,
            confidence: results.teeth?.confidence || 0,
            processingTime: processingTime,
            plaqueDetected: results.plaque?.areas?.length || 0,
            restorationsDetected: results.restorations?.areas?.length || 0
        });
    }

    // Track VITA shade usage
    trackVITAShadeUsage(shade, processingTime) {
        this.trackFeatureUsage('vita_shade_matching', {
            shade: shade,
            processingTime: processingTime
        });
    }

    // Track camera profile usage
    trackCameraProfileUsage(profile, processingTime) {
        this.trackFeatureUsage('camera_profile', {
            profile: profile,
            processingTime: processingTime
        });
    }

    // Track professional preset usage
    trackProfessionalPresetUsage(preset, processingTime) {
        this.trackFeatureUsage('professional_preset', {
            preset: preset,
            processingTime: processingTime
        });
    }

    // Track user interactions
    trackUserInteraction(action, target, details = {}) {
        this.trackEvent('user_interaction', {
            action: action,
            target: target,
            ...details
        });
    }

    // Track image upload
    trackImageUpload(fileSize, fileType, success) {
        this.trackEvent('image_upload', {
            fileSize: fileSize,
            fileType: fileType,
            success: success
        });
    }

    // Track image export
    trackImageExport(preset, fileSize, success) {
        this.trackEvent('image_export', {
            preset: preset,
            fileSize: fileSize,
            success: success
        });
    }

    // Get device type
    getDeviceType() {
        const ua = navigator.userAgent;
        if (/tablet|ipad|playbook|silk/i.test(ua)) {
            return 'tablet';
        }
        if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
            return 'mobile';
        }
        return 'desktop';
    }

    // Get browser info
    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browserName = 'unknown';
        let browserVersion = 'unknown';

        if (ua.indexOf('Chrome') > -1) {
            browserName = 'Chrome';
            browserVersion = ua.match(/Chrome\/(\d+)/)?.[1] || 'unknown';
        } else if (ua.indexOf('Safari') > -1) {
            browserName = 'Safari';
            browserVersion = ua.match(/Version\/(\d+)/)?.[1] || 'unknown';
        } else if (ua.indexOf('Firefox') > -1) {
            browserName = 'Firefox';
            browserVersion = ua.match(/Firefox\/(\d+)/)?.[1] || 'unknown';
        } else if (ua.indexOf('Edge') > -1) {
            browserName = 'Edge';
            browserVersion = ua.match(/Edge\/(\d+)/)?.[1] || 'unknown';
        }

        return {
            name: browserName,
            version: browserVersion
        };
    }

    // Flush events to server
    async flushEvents(isSync = false) {
        if (!this.isEnabled || this.events.length === 0) return;

        const payload = {
            events: this.events,
            performanceMetrics: this.performanceMetrics,
            errorEvents: this.errorEvents,
            sessionId: this.sessionId,
            userId: this.userId
        };

        try {
            if (isSync) {
                // Synchronous request for page unload
                this.sendSync(payload);
            } else {
                // Asynchronous request
                await this.sendAsync(payload);
            }

            // Clear sent events
            this.events = [];
            this.performanceMetrics = [];
            this.errorEvents = [];

        } catch (error) {
            console.error('Failed to send analytics:', error);
            // Keep events for retry
        }
    }

    // Send async request
    async sendAsync(payload) {
        const response = await fetch(this.config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    }

    // Send sync request (for page unload)
    sendSync(payload) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', this.config.endpoint, false); // Synchronous
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(payload));
    }

    // Get analytics summary
    getAnalyticsSummary() {
        return {
            sessionId: this.sessionId,
            userId: this.userId,
            sessionDuration: Date.now() - this.startTime,
            eventsCount: this.events.length,
            performanceMetricsCount: this.performanceMetrics.length,
            errorEventsCount: this.errorEvents.length,
            isEnabled: this.isEnabled
        };
    }

    // Export analytics data
    exportAnalyticsData() {
        const data = {
            summary: this.getAnalyticsSummary(),
            events: this.events,
            performanceMetrics: this.performanceMetrics,
            errorEvents: this.errorEvents,
            config: this.config
        };

        return JSON.stringify(data, null, 2);
    }

    // Clear all analytics data
    clearAnalyticsData() {
        this.events = [];
        this.performanceMetrics = [];
        this.errorEvents = [];
        localStorage.removeItem('dentalApp_userId');
        localStorage.removeItem('dentalApp_analyticsConsent');
    }
}

// Initialize analytics manager
window.analyticsManager = new AnalyticsManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    window.analyticsManager.initialize();
});

// Export for use in other modules
window.AnalyticsManager = AnalyticsManager;
