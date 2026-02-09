// Data Persistence for User Preferences and Settings
// Stores smart feature preferences, detection results, and usage data

class DataPersistenceManager {
    constructor() {
        this.storageKey = 'dentalApp_smartFeatures';
        this.maxStorageSize = 5 * 1024 * 1024; // 5MB
        this.version = '1.0.0';
        this.defaultSettings = this.getDefaultSettings();
    }

    // Default user settings
    getDefaultSettings() {
        return {
            version: this.version,
            userPreferences: {
                smartFeatures: {
                    autoDetect: true,
                    smartEnhance: true,
                    vitaShades: true,
                    cameraProfiles: true,
                    professionalPresets: true
                },
                processing: {
                    quality: 'high',
                    enableGPU: true,
                    maxProcessingTime: 5000,
                    autoOptimize: true
                },
                ui: {
                    showDetectionResults: true,
                    showPerformanceStatus: false,
                    enableAnimations: true,
                    compactMode: false
                },
                privacy: {
                    shareUsageData: false,
                    storeDetectionResults: true,
                    cacheImages: true
                }
            },
            recentSettings: {
                lastCameraProfile: null,
                lastVITAShade: null,
                lastPreset: null,
                customPresets: []
            },
            usageStats: {
                totalSessions: 0,
                totalImagesProcessed: 0,
                smartFeaturesUsed: {
                    smartEnhance: 0,
                    dentalMode: 0,
                    autoDetection: 0,
                    vitaMatching: 0
                },
                averageProcessingTime: 0,
                errorCount: 0
            },
            performanceCache: {
                deviceProfile: null,
                optimizationLevel: null,
                lastOptimization: null
            }
        };
    }

    // Load user settings
    loadSettings() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            
            if (!stored) {
                return this.defaultSettings;
            }
            
            const data = JSON.parse(stored);
            
            // Check version compatibility
            if (data.version !== this.version) {
                return this.migrateSettings(data);
            }
            
            // Merge with defaults to handle new properties
            return this.mergeSettings(this.defaultSettings, data);
            
        } catch (error) {
            console.error('Failed to load settings:', error);
            return this.defaultSettings;
        }
    }

    // Save user settings
    saveSettings(settings) {
        try {
            // Check storage size
            const dataSize = JSON.stringify(settings).length;
            if (dataSize > this.maxStorageSize) {
                this.cleanupOldData(settings);
            }
            
            // Add timestamp
            settings.lastSaved = new Date().toISOString();
            
            localStorage.setItem(this.storageKey, JSON.stringify(settings));
            return true;
            
        } catch (error) {
            console.error('Failed to save settings:', error);
            
            if (error.name === 'QuotaExceededError') {
                this.handleStorageQuotaExceeded();
            }
            
            return false;
        }
    }

    // Merge settings with defaults
    mergeSettings(defaults, stored) {
        const merged = JSON.parse(JSON.stringify(defaults));
        
        function mergeDeep(target, source) {
            for (const key in source) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    if (!target[key]) target[key] = {};
                    mergeDeep(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
        
        mergeDeep(merged, stored);
        return merged;
    }

    // Migrate settings between versions
    migrateSettings(oldData) {
        console.log('Migrating settings from version', oldData.version || 'unknown');
        
        // Start with current defaults
        const newData = JSON.parse(JSON.stringify(this.defaultSettings));
        
        // Preserve user preferences from old data
        if (oldData.userPreferences) {
            newData.userPreferences = { ...newData.userPreferences, ...oldData.userPreferences };
        }
        
        if (oldData.usageStats) {
            newData.usageStats = { ...newData.usageStats, ...oldData.usageStats };
        }
        
        // Update version
        newData.version = this.version;
        
        return newData;
    }

    // Clean up old data to save space
    cleanupOldData(settings) {
        // Clear old detection results
        if (settings.detectionResults) {
            settings.detectionResults = settings.detectionResults.slice(-10);
        }
        
        // Clear old usage stats (keep only last 1000 sessions)
        if (settings.usageStats && settings.usageStats.sessionHistory) {
            settings.usageStats.sessionHistory = settings.usageStats.sessionHistory.slice(-1000);
        }
        
        // Clear performance cache
        if (settings.performanceCache) {
            settings.performanceCache = {
                deviceProfile: settings.performanceCache.deviceProfile,
                optimizationLevel: settings.performanceCache.optimizationLevel,
                lastOptimization: settings.performanceCache.lastOptimization
            };
        }
    }

    // Handle storage quota exceeded
    handleStorageQuotaExceeded() {
        console.warn('Storage quota exceeded, clearing old data');
        
        try {
            // Clear all but essential settings
            const essentialData = {
                version: this.version,
                userPreferences: this.defaultSettings.userPreferences,
                lastSaved: new Date().toISOString()
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(essentialData));
            
            if (typeof showToast === 'function') {
                showToast('Storage full. Some data has been cleared.');
            }
            
        } catch (error) {
            console.error('Failed to handle storage quota exceeded:', error);
        }
    }

    // Update specific setting
    updateSetting(category, key, value) {
        const settings = this.loadSettings();
        
        if (!settings[category]) {
            settings[category] = {};
        }
        
        settings[category][key] = value;
        this.saveSettings(settings);
    }

    // Get specific setting
    getSetting(category, key) {
        const settings = this.loadSettings();
        return settings[category] && settings[category][key];
    }

    // Track usage statistics
    trackUsage(action, details = {}) {
        const settings = this.loadSettings();
        
        // Update general stats
        settings.usageStats.totalSessions++;
        
        // Update specific action stats
        if (settings.usageStats.smartFeaturesUsed[action] !== undefined) {
            settings.usageStats.smartFeaturesUsed[action]++;
        }
        
        // Update processing time if provided
        if (details.processingTime) {
            const currentAvg = settings.usageStats.averageProcessingTime;
            const count = settings.usageStats.smartFeaturesUsed[action] || 1;
            settings.usageStats.averageProcessingTime = (currentAvg * (count - 1) + details.processingTime) / count;
        }
        
        // Add to session history
        if (!settings.usageStats.sessionHistory) {
            settings.usageStats.sessionHistory = [];
        }
        
        settings.usageStats.sessionHistory.push({
            action: action,
            timestamp: new Date().toISOString(),
            details: details
        });
        
        // Keep only last 100 sessions
        if (settings.usageStats.sessionHistory.length > 100) {
            settings.usageStats.sessionHistory = settings.usageStats.sessionHistory.slice(-100);
        }
        
        this.saveSettings(settings);
    }

    // Save detection results
    saveDetectionResults(results) {
        if (!this.getSetting('userPreferences', 'privacy').storeDetectionResults) {
            return;
        }
        
        const settings = this.loadSettings();
        
        if (!settings.detectionResults) {
            settings.detectionResults = [];
        }
        
        settings.detectionResults.push({
            ...results,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 20 results
        if (settings.detectionResults.length > 20) {
            settings.detectionResults = settings.detectionResults.slice(-20);
        }
        
        this.saveSettings(settings);
    }

    // Get recent detection results
    getRecentDetectionResults(limit = 5) {
        const settings = this.loadSettings();
        
        if (!settings.detectionResults) {
            return [];
        }
        
        return settings.detectionResults.slice(-limit);
    }

    // Save custom preset
    saveCustomPreset(preset) {
        const settings = this.loadSettings();
        
        if (!settings.recentSettings.customPresets) {
            settings.recentSettings.customPresets = [];
        }
        
        // Add unique ID
        preset.id = Date.now().toString();
        preset.createdAt = new Date().toISOString();
        
        settings.recentSettings.customPresets.push(preset);
        
        // Keep only 10 custom presets
        if (settings.recentSettings.customPresets.length > 10) {
            settings.recentSettings.customPresets = settings.recentSettings.customPresets.slice(-10);
        }
        
        this.saveSettings(settings);
        return preset.id;
    }

    // Get custom presets
    getCustomPresets() {
        const settings = this.loadSettings();
        return settings.recentSettings.customPresets || [];
    }

    // Delete custom preset
    deleteCustomPreset(presetId) {
        const settings = this.loadSettings();
        
        if (settings.recentSettings.customPresets) {
            settings.recentSettings.customPresets = settings.recentSettings.customPresets.filter(
                preset => preset.id !== presetId
            );
            this.saveSettings(settings);
        }
    }

    // Cache performance profile
    cachePerformanceProfile(profile) {
        const settings = this.loadSettings();
        
        settings.performanceCache = {
            deviceProfile: profile,
            optimizationLevel: profile.optimizationLevel,
            lastOptimization: new Date().toISOString()
        };
        
        this.saveSettings(settings);
    }

    // Get cached performance profile
    getCachedPerformanceProfile() {
        const settings = this.loadSettings();
        return settings.performanceCache;
    }

    // Export user data
    exportUserData() {
        const settings = this.loadSettings();
        
        // Remove sensitive data
        const exportData = {
            ...settings,
            userPreferences: settings.userPreferences,
            recentSettings: settings.recentSettings,
            customPresets: settings.recentSettings.customPresets || [],
            exportedAt: new Date().toISOString()
        };
        
        return JSON.stringify(exportData, null, 2);
    }

    // Import user data
    importUserData(dataString) {
        try {
            const importedData = JSON.parse(dataString);
            
            // Validate data structure
            if (!importedData.userPreferences) {
                throw new Error('Invalid data format');
            }
            
            // Merge with current settings
            const currentSettings = this.loadSettings();
            const mergedSettings = this.mergeSettings(currentSettings, importedData);
            
            // Update version
            mergedSettings.version = this.version;
            
            this.saveSettings(mergedSettings);
            
            return true;
            
        } catch (error) {
            console.error('Failed to import user data:', error);
            return false;
        }
    }

    // Clear all data
    clearAllData() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Failed to clear data:', error);
            return false;
        }
    }

    // Get storage usage
    getStorageUsage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            const size = data ? data.length : 0;
            const percentage = (size / this.maxStorageSize) * 100;
            
            return {
                used: size,
                max: this.maxStorageSize,
                percentage: percentage,
                status: percentage > 80 ? 'warning' : 'normal'
            };
        } catch (error) {
            return { used: 0, max: this.maxStorageSize, percentage: 0, status: 'error' };
        }
    }

    // Initialize on page load
    initialize() {
        // Load settings
        const settings = this.loadSettings();
        
        // Apply user preferences
        this.applyUserPreferences(settings.userPreferences);
        
        // Update session count
        settings.usageStats.totalSessions++;
        this.saveSettings(settings);
        
        console.log('Data persistence initialized');
    }

    // Apply user preferences to the app
    applyUserPreferences(preferences) {
        // Apply UI preferences
        if (preferences.ui) {
            if (preferences.ui.enableAnimations === false) {
                document.body.style.setProperty('--transition-duration', '0ms');
            }
            
            if (preferences.ui.compactMode === true) {
                document.body.classList.add('compact-mode');
            }
        }
        
        // Apply processing preferences
        if (preferences.processing && window.mobilePerformanceOptimizer) {
            const optimizer = window.mobilePerformanceOptimizer;
            
            if (preferences.processing.quality) {
                optimizer.performanceSettings.imageQuality = parseFloat(preferences.processing.quality) / 100;
            }
            
            if (preferences.processing.enableGPU === false) {
                optimizer.performanceSettings.enableGPU = false;
            }
        }
    }
}

// Initialize data persistence manager
window.dataPersistenceManager = new DataPersistenceManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    window.dataPersistenceManager.initialize();
});

// Export for use in other modules
window.DataPersistenceManager = DataPersistenceManager;
