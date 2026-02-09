// Accessibility Features for Smart Dental Tools
// Ensures inclusive design for all users including those with disabilities

class AccessibilityManager {
    constructor() {
        this.isHighContrast = false;
        this.isReducedMotion = false;
        this.isScreenReader = false;
        this.keyboardNavigation = true;
        this.announcements = [];
        this.focusTrap = null;
    }

    // Initialize accessibility features
    initialize() {
        this.detectAccessibilityPreferences();
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupFocusManagement();
        this.addAccessibilityLabels();
        this.setupHighContrastMode();
        this.setupReducedMotion();
    }

    // Detect user accessibility preferences
    detectAccessibilityPreferences() {
        // Check for high contrast mode
        if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
            this.isHighContrast = true;
            document.body.classList.add('high-contrast');
        }

        // Check for reduced motion preference
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.isReducedMotion = true;
            document.body.classList.add('reduced-motion');
        }

        // Check for screen reader
        this.isScreenReader = this.detectScreenReader();
        
        // Check for keyboard navigation
        this.keyboardNavigation = this.detectKeyboardNavigation();
    }

    detectScreenReader() {
        // Common screen reader detection methods
        const hasAriaLive = document.querySelector('[aria-live]') !== null;
        const hasVoiceOver = /VoiceOver/i.test(navigator.userAgent);
        const hasNVDA = /NVDA/i.test(navigator.userAgent);
        const hasJAWS = /JAWS/i.test(navigator.userAgent);
        
        return hasAriaLive || hasVoiceOver || hasNVDA || hasJAWS;
    }

    detectKeyboardNavigation() {
        // Detect if user is navigating with keyboard
        let keyboardUser = false;
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                keyboardUser = true;
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            keyboardUser = false;
            document.body.classList.remove('keyboard-navigation');
        });
        
        return keyboardUser;
    }

    // Setup keyboard navigation
    setupKeyboardNavigation() {
        // Add keyboard shortcuts for smart features
        const shortcuts = {
            'Ctrl+Shift+S': () => this.triggerSmartEnhance(),
            'Ctrl+Shift+D': () => this.triggerDentalMode(),
            'Ctrl+Shift+A': () => this.triggerAutoDetection(),
            'Ctrl+Shift+P': () => this.triggerProfessionalTools(),
            'Escape': () => this.closeModals(),
            'Tab': () => this.handleTabNavigation(),
            'Enter': () => this.handleEnterActivation(),
            'Space': () => this.handleSpaceActivation()
        };

        document.addEventListener('keydown', (e) => {
            const key = this.getShortcutKey(e);
            if (shortcuts[key]) {
                e.preventDefault();
                shortcuts[key]();
            }
        });
    }

    getShortcutKey(e) {
        const parts = [];
        if (e.ctrlKey) parts.push('Ctrl');
        if (e.shiftKey) parts.push('Shift');
        if (e.altKey) parts.push('Alt');
        if (e.metaKey) parts.push('Meta');
        
        if (e.key && e.key.length === 1) {
            parts.push(e.key.toUpperCase());
        } else {
            parts.push(e.key);
        }
        
        return parts.join('+');
    }

    // Setup screen reader support
    setupScreenReaderSupport() {
        // Add ARIA live regions for dynamic content
        this.createLiveRegion('polite', 'smart-status');
        this.createLiveRegion('assertive', 'smart-errors');
        this.createLiveRegion('polite', 'processing-status');
        
        // Add screen reader announcements for smart features
        this.setupSmartFeatureAnnouncements();
    }

    createLiveRegion(politeness, id) {
        const region = document.createElement('div');
        region.setAttribute('aria-live', politeness);
        region.setAttribute('aria-atomic', 'true');
        region.id = id;
        region.className = 'sr-only';
        document.body.appendChild(region);
    }

    setupSmartFeatureAnnouncements() {
        // Announce when smart features are ready
        this.observeSmartFeatureStatus();
        
        // Announce processing status
        this.observeProcessingStatus();
        
        // Announce detection results
        this.observeDetectionResults();
    }

    observeSmartFeatureStatus() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('smart-ready')) {
                    this.announce('Smart features are ready for use');
                }
            });
        });
        
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    observeProcessingStatus() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('hidden')) {
                    this.announce('Processing complete');
                } else {
                    const message = document.getElementById('loadingMessage')?.textContent;
                    if (message) {
                        this.announce(`Processing started: ${message}`);
                    }
                }
            });
        });
        
        if (loadingOverlay) {
            observer.observe(loadingOverlay, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }

    observeDetectionResults() {
        const resultsDiv = document.getElementById('detectionResults');
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const text = mutation.target.textContent;
                if (text && text !== 'Run auto-detection to see results') {
                    this.announce(`Detection results: ${text}`);
                }
            });
        });
        
        if (resultsDiv) {
            observer.observe(resultsDiv, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
    }

    // Setup focus management
    setupFocusManagement() {
        // Add focus indicators
        this.addFocusIndicators();
        
        // Setup focus trap for modals
        this.setupModalFocusTrap();
        
        // Manage focus for dynamic content
        this.manageDynamicFocus();
    }

    addFocusIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 3px solid #0ea5e9 !important;
                outline-offset: 2px !important;
            }
            
            .high-contrast *:focus {
                outline: 3px #ffffff !important;
                background: #000000 !important;
                color: #ffffff !important;
            }
            
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(style);
    }

    setupModalFocusTrap() {
        const modals = document.querySelectorAll('[role="dialog"]');
        
        modals.forEach(modal => {
            modal.addEventListener('show', () => {
                this.trapFocus(modal);
            });
            
            modal.addEventListener('hide', () => {
                this.releaseFocus();
            });
        });
    }

    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        this.focusTrap = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };
        
        element.addEventListener('keydown', this.focusTrap);
        firstElement.focus();
    }

    releaseFocus() {
        if (this.focusTrap) {
            document.removeEventListener('keydown', this.focusTrap);
            this.focusTrap = null;
        }
    }

    manageDynamicFocus() {
        // Auto-focus smart feature buttons when activated
        const smartButtons = document.querySelectorAll('[onclick*="applySmart"], [onclick*="runAuto"]');
        
        smartButtons.forEach(button => {
            button.addEventListener('click', () => {
                setTimeout(() => {
                    const canvas = document.getElementById('mainCanvas');
                    if (canvas) {
                        canvas.setAttribute('tabindex', '0');
                        canvas.focus();
                        this.announce('Image canvas focused. Use arrow keys to navigate detection results.');
                    }
                }, 100);
            });
        });
    }

    // Add accessibility labels
    addAccessibilityLabels() {
        // Add ARIA labels to smart feature buttons
        this.addSmartButtonLabels();
        
        // Add descriptions to canvas
        this.addCanvasLabels();
        
        // Add labels to sliders
        this.addSliderLabels();
    }

    addSmartButtonLabels() {
        const labels = {
            'applySmartEnhance': 'Apply AI-powered smart enhancement to automatically optimize the dental image',
            'applyDentalMode': 'Apply dental mode optimization specifically designed for dental photography',
            'runAutoDetection': 'Run automatic detection to identify teeth, gums, and other dental features',
            'showProfessionalTools': 'Open professional tools menu with VITA shades and camera profiles'
        };
        
        Object.entries(labels).forEach(([functionName, label]) => {
            const buttons = document.querySelectorAll(`[onclick*="${functionName}"]`);
            buttons.forEach(button => {
                button.setAttribute('aria-label', label);
                button.setAttribute('title', label);
            });
        });
    }

    addCanvasLabels() {
        const canvas = document.getElementById('mainCanvas');
        if (canvas) {
            canvas.setAttribute('role', 'img');
            canvas.setAttribute('aria-label', 'Dental image editing canvas. Use smart features to enhance and analyze dental photos.');
        }
    }

    addSliderLabels() {
        const sliders = document.querySelectorAll('input[type="range"]');
        
        sliders.forEach(slider => {
            const label = document.querySelector(`label[for="${slider.id}"]`);
            if (label) {
                slider.setAttribute('aria-label', label.textContent);
                slider.setAttribute('aria-valuemin', slider.min);
                slider.setAttribute('aria-valuemax', slider.max);
                slider.setAttribute('aria-valuenow', slider.value);
                
                // Announce value changes
                slider.addEventListener('input', () => {
                    slider.setAttribute('aria-valuenow', slider.value);
                    this.announce(`${label.textContent} set to ${slider.value}%`);
                });
            }
        });
    }

    // Setup high contrast mode
    setupHighContrastMode() {
        if (this.isHighContrast) {
            this.applyHighContrastStyles();
        }
        
        // Listen for high contrast changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-contrast: high)');
            mediaQuery.addListener((e) => {
                if (e.matches) {
                    this.applyHighContrastStyles();
                } else {
                    this.removeHighContrastStyles();
                }
            });
        }
    }

    applyHighContrastStyles() {
        const style = document.createElement('style');
        style.id = 'high-contrast-styles';
        style.textContent = `
            .high-contrast {
                --brand-primary: #ffffff !important;
                --brand-secondary: #000000 !important;
                --text-primary: #ffffff !important;
                --text-secondary: #cccccc !important;
                --bg-primary: #000000 !important;
                --bg-secondary: #1a1a1a !important;
            }
            
            .high-contrast .tool-button {
                border: 2px solid #ffffff !important;
                background: #000000 !important;
                color: #ffffff !important;
            }
            
            .high-contrast .tool-button:hover {
                background: #ffffff !important;
                color: #000000 !important;
            }
            
            .high-contrast #mainCanvas {
                border: 2px solid #ffffff !important;
            }
        `;
        document.head.appendChild(style);
    }

    removeHighContrastStyles() {
        const style = document.getElementById('high-contrast-styles');
        if (style) {
            style.remove();
        }
    }

    // Setup reduced motion
    setupReducedMotion() {
        if (this.isReducedMotion) {
            this.applyReducedMotionStyles();
        }
    }

    applyReducedMotionStyles() {
        const style = document.createElement('style');
        style.id = 'reduced-motion-styles';
        style.textContent = `
            .reduced-motion *,
            .reduced-motion *::before,
            .reduced-motion *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Keyboard shortcut handlers
    triggerSmartEnhance() {
        const button = document.querySelector('[onclick*="applySmartEnhance"]');
        if (button && !button.disabled) {
            button.click();
            this.announce('Smart enhancement activated');
        }
    }

    triggerDentalMode() {
        const button = document.querySelector('[onclick*="applyDentalMode"]');
        if (button && !button.disabled) {
            button.click();
            this.announce('Dental mode activated');
        }
    }

    triggerAutoDetection() {
        const button = document.querySelector('[onclick*="runAutoDetection"]');
        if (button && !button.disabled) {
            button.click();
            this.announce('Auto detection started');
        }
    }

    triggerProfessionalTools() {
        const button = document.querySelector('[onclick*="showProfessionalTools"]');
        if (button && !button.disabled) {
            button.click();
            this.announce('Professional tools menu opened');
        }
    }

    closeModals() {
        const modals = document.querySelectorAll('.fixed.inset-0:not(.hidden)');
        modals.forEach(modal => {
            const closeButton = modal.querySelector('[onclick*="close"]');
            if (closeButton) {
                closeButton.click();
            }
        });
        this.announce('Modal closed');
    }

    handleTabNavigation() {
        // Custom tab navigation logic if needed
        return true;
    }

    handleEnterActivation() {
        // Activate focused element
        if (document.activeElement) {
            document.activeElement.click();
        }
    }

    handleSpaceActivation() {
        // Space bar activation for buttons
        if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
            document.activeElement.click();
        }
    }

    // Screen reader announcements
    announce(message, priority = 'polite') {
        const liveRegion = document.getElementById(priority === 'assertive' ? 'smart-errors' : 'smart-status');
        
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    // Get accessibility status
    getAccessibilityStatus() {
        return {
            highContrast: this.isHighContrast,
            reducedMotion: this.isReducedMotion,
            screenReader: this.isScreenReader,
            keyboardNavigation: this.keyboardNavigation,
            announcements: this.announcements.length
        };
    }
}

// Initialize accessibility manager
window.accessibilityManager = new AccessibilityManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    window.accessibilityManager.initialize();
    
    // Announce page load for screen readers
    setTimeout(() => {
        window.accessibilityManager.announce('Dental Photo Editor loaded with smart features. Use Tab to navigate, Enter to activate.');
    }, 1000);
});

// Export for use in other modules
window.AccessibilityManager = AccessibilityManager;
