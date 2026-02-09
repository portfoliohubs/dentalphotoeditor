// Help System and Documentation for Smart Dental Features
// Interactive tutorials, tooltips, and contextual help

class HelpSystem {
    constructor() {
        this.tutorials = this.loadTutorials();
        this.tooltips = this.loadTooltips();
        this.currentTutorial = null;
        this.helpOverlay = null;
        this.userProgress = this.loadUserProgress();
        this.isFirstTime = this.checkFirstTimeUser();
    }

    // Load tutorial content
    loadTutorials() {
        return {
            'getting-started': {
                title: 'Getting Started with Smart Dental Editor',
                steps: [
                    {
                        target: '[onclick*="document.getElementById(\'fileInput\').click()"]',
                        title: 'Upload Your Dental Photo',
                        content: 'Start by uploading a dental photo. You can use your camera or select from your gallery.',
                        position: 'bottom',
                        action: 'click'
                    },
                    {
                        target: '[onclick*="applySmartEnhance()"]',
                        title: 'Try Smart Enhancement',
                        content: 'Click the Smart button to apply AI-powered optimization automatically.',
                        position: 'top',
                        action: 'click'
                    },
                    {
                        target: '[onclick*="runAutoDetection()"]',
                        title: 'Run Auto Detection',
                        content: 'Use the Detect button to automatically identify teeth, gums, and other features.',
                        position: 'top',
                        action: 'click'
                    },
                    {
                        target: '[onclick*="showProfessionalTools()"]',
                        title: 'Explore Professional Tools',
                        content: 'Access VITA shade matching, camera profiles, and professional presets.',
                        position: 'left',
                        action: 'click'
                    }
                ],
                estimatedTime: '3 minutes'
            },
            'smart-features': {
                title: 'Understanding Smart Features',
                steps: [
                    {
                        target: '[onclick*="applySmartEnhance()"]',
                        title: 'Smart Enhancement',
                        content: 'AI-powered optimization that automatically adjusts brightness, contrast, noise reduction, and whitening.',
                        position: 'top'
                    },
                    {
                        target: '[onclick*="applyDentalMode()"]',
                        title: 'Dental Mode',
                        content: 'Specialized optimization for dental photography with enhanced detail and clinical accuracy.',
                        position: 'top'
                    },
                    {
                        target: '[onclick*="runAutoDetection()"]',
                        title: 'Auto Detection',
                        content: 'Automatically detects teeth boundaries, gum lines, smile zones, plaque, and restorations.',
                        position: 'top'
                    },
                    {
                        target: '[onclick*="showProfessionalTools()"]',
                        title: 'Professional Tools',
                        content: 'Advanced features including VITA shade matching, camera profiles, and clinical presets.',
                        position: 'left'
                    }
                ],
                estimatedTime: '5 minutes'
            },
            'vita-shades': {
                title: 'VITA Shade Matching',
                steps: [
                    {
                        target: '[onclick*="showProfessionalTools()"]',
                        title: 'Open Professional Tools',
                        content: 'First, open the professional tools menu.',
                        position: 'left',
                        action: 'click'
                    },
                    {
                        target: '#professionalToolsModal',
                        title: 'VITA Shade System',
                        content: 'The VITA classical shade guide includes 16 shades from A1 (lightest) to D4 (darkest).',
                        position: 'center'
                    },
                    {
                        target: '[onclick*="matchVITAShade(\'A1\')"]',
                        title: 'Select a Shade',
                        content: 'Click any VITA shade to apply shade-matching enhancement that preserves natural tooth colors.',
                        position: 'top'
                    }
                ],
                estimatedTime: '4 minutes'
            },
            'camera-profiles': {
                title: 'Camera Profiles',
                steps: [
                    {
                        target: '[onclick*="showProfessionalTools()"]',
                        title: 'Open Professional Tools',
                        content: 'Access camera profiles from the professional tools menu.',
                        position: 'left',
                        action: 'click'
                    },
                    {
                        target: '#professionalToolsModal',
                        title: 'Available Profiles',
                        content: 'Choose from mobile phones (iPhone, Samsung), DSLR cameras (Canon, Nikon), or intraoral cameras.',
                        position: 'center'
                    },
                    {
                        target: '[onclick*="applyCameraProfile(\'iphone-13-pro\')"]',
                        title: 'Apply Profile',
                        content: 'Each profile applies optimizations specific to that camera\'s characteristics.',
                        position: 'top'
                    }
                ],
                estimatedTime: '3 minutes'
            }
        };
    }

    // Load tooltip content
    loadTooltips() {
        return {
            'smart-enhance': {
                title: 'Smart Enhancement',
                content: 'AI-powered optimization that automatically adjusts multiple settings for the best result.',
                shortcut: 'Ctrl+Shift+S'
            },
            'dental-mode': {
                title: 'Dental Mode',
                content: 'Specialized optimization for clinical dental photography with enhanced detail.',
                shortcut: 'Ctrl+Shift+D'
            },
            'auto-detection': {
                title: 'Auto Detection',
                content: 'Automatically identifies teeth, gums, smile zones, plaque, and restorations.',
                shortcut: 'Ctrl+Shift+A'
            },
            'professional-tools': {
                title: 'Professional Tools',
                content: 'Access VITA shades, camera profiles, and clinical presets.',
                shortcut: 'Ctrl+Shift+P'
            },
            'vita-shades': {
                title: 'VITA Shades',
                content: 'Professional shade matching system with 16 classical shades (A1-D4).'
            },
            'camera-profiles': {
                title: 'Camera Profiles',
                content: 'Optimizations for specific cameras including phones, DSLRs, and intraoral cameras.'
            },
            'detection-results': {
                title: 'Detection Results',
                content: 'Shows what the AI detected in your photo including teeth count and confidence levels.'
            }
        };
    }

    // Check if first-time user
    checkFirstTimeUser() {
        const hasVisited = localStorage.getItem('dentalApp_visited');
        if (!hasVisited) {
            localStorage.setItem('dentalApp_visited', 'true');
            return true;
        }
        return false;
    }

    // Load user progress
    loadUserProgress() {
        try {
            const progress = localStorage.getItem('dentalApp_helpProgress');
            return progress ? JSON.parse(progress) : {
                completedTutorials: [],
                currentStep: {},
                dismissedTooltips: []
            };
        } catch (error) {
            return {
                completedTutorials: [],
                currentStep: {},
                dismissedTooltips: []
            };
        }
    }

    // Save user progress
    saveUserProgress() {
        try {
            localStorage.setItem('dentalApp_helpProgress', JSON.stringify(this.userProgress));
        } catch (error) {
            console.error('Failed to save help progress:', error);
        }
    }

    // Start tutorial
    startTutorial(tutorialId) {
        const tutorial = this.tutorials[tutorialId];
        if (!tutorial) {
            console.error(`Tutorial ${tutorialId} not found`);
            return;
        }

        this.currentTutorial = {
            id: tutorialId,
            ...tutorial,
            currentStep: 0
        };

        this.createHelpOverlay();
        this.showCurrentStep();
    }

    // Create help overlay
    createHelpOverlay() {
        if (this.helpOverlay) {
            this.helpOverlay.remove();
        }

        this.helpOverlay = document.createElement('div');
        this.helpOverlay.id = 'helpOverlay';
        this.helpOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
        this.helpOverlay.setAttribute('role', 'dialog');
        this.helpOverlay.setAttribute('aria-label', 'Tutorial');

        document.body.appendChild(this.helpOverlay);
    }

    // Show current tutorial step
    showCurrentStep() {
        if (!this.currentTutorial || !this.helpOverlay) return;

        const step = this.currentTutorial.steps[this.currentTutorial.currentStep];
        const targetElement = document.querySelector(step.target);

        if (!targetElement) {
            this.nextStep();
            return;
        }

        // Clear previous content
        this.helpOverlay.innerHTML = '';

        // Create highlight
        const highlight = this.createHighlight(targetElement, step.position);
        this.helpOverlay.appendChild(highlight);

        // Create tooltip
        const tooltip = this.createTooltip(step);
        this.helpOverlay.appendChild(tooltip);

        // Focus target for accessibility
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetElement.focus();

        // Announce for screen readers
        if (window.accessibilityManager) {
            window.accessibilityManager.announce(`Step ${this.currentTutorial.currentStep + 1} of ${this.currentTutorial.steps.length}: ${step.title}`);
        }
    }

    // Create highlight element
    createHighlight(target, position) {
        const rect = target.getBoundingClientRect();
        const highlight = document.createElement('div');
        highlight.className = 'absolute border-4 border-blue-500 rounded-lg pointer-events-none';
        highlight.style.cssText = `
            top: ${rect.top - 4}px;
            left: ${rect.left - 4}px;
            width: ${rect.width + 8}px;
            height: ${rect.height + 8}px;
            z-index: 60;
        `;

        // Add pulse animation
        const pulse = document.createElement('div');
        pulse.className = 'absolute inset-0 border-4 border-blue-300 rounded-lg animate-ping';
        highlight.appendChild(pulse);

        return highlight;
    }

    // Create tooltip
    createTooltip(step) {
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4 z-70';
        tooltip.setAttribute('role', 'alert');
        tooltip.setAttribute('aria-live', 'polite');

        const stepNumber = this.currentTutorial.currentStep + 1;
        const totalSteps = this.currentTutorial.steps.length;

        tooltip.innerHTML = `
            <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">${step.title}</h3>
                <p class="text-sm text-gray-600 mb-3">${step.content}</p>
                <div class="text-xs text-gray-500 mb-4">
                    Step ${stepNumber} of ${totalSteps} • ${this.currentTutorial.estimatedTime}
                </div>
            </div>
            <div class="flex justify-between items-center">
                <button onclick="window.helpSystem.previousStep()" 
                        class="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded ${stepNumber === 1 ? 'invisible' : ''}">
                    Previous
                </button>
                <div class="flex space-x-2">
                    <button onclick="window.helpSystem.skipTutorial()" 
                            class="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                        Skip
                    </button>
                    <button onclick="window.helpSystem.nextStep()" 
                            class="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded">
                        ${stepNumber === totalSteps ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        `;

        // Position tooltip
        const targetRect = document.querySelector(step.target).getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let top, left;
        switch (step.position) {
            case 'top':
                top = targetRect.top - tooltipRect.height - 20;
                left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = targetRect.bottom + 20;
                left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                left = targetRect.left - tooltipRect.width - 20;
                break;
            case 'right':
                top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                left = targetRect.right + 20;
                break;
            default:
                top = '50%';
                left = '50%';
                tooltip.style.transform = 'translate(-50%, -50%)';
        }

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;

        // Handle action
        if (step.action === 'click' && stepNumber === totalSteps) {
            setTimeout(() => {
                targetElement.click();
            }, 1000);
        }

        return tooltip;
    }

    // Next step
    nextStep() {
        if (!this.currentTutorial) return;

        const nextStepIndex = this.currentTutorial.currentStep + 1;
        
        if (nextStepIndex >= this.currentTutorial.steps.length) {
            this.finishTutorial();
        } else {
            this.currentTutorial.currentStep = nextStepIndex;
            this.showCurrentStep();
        }
    }

    // Previous step
    previousStep() {
        if (!this.currentTutorial || this.currentTutorial.currentStep === 0) return;

        this.currentTutorial.currentStep--;
        this.showCurrentStep();
    }

    // Skip tutorial
    skipTutorial() {
        this.closeTutorial();
    }

    // Finish tutorial
    finishTutorial() {
        if (!this.currentTutorial) return;

        // Mark as completed
        if (!this.userProgress.completedTutorials.includes(this.currentTutorial.id)) {
            this.userProgress.completedTutorials.push(this.currentTutorial.id);
            this.saveUserProgress();
        }

        this.closeTutorial();
        this.showCompletionMessage();
    }

    // Close tutorial
    closeTutorial() {
        if (this.helpOverlay) {
            this.helpOverlay.remove();
            this.helpOverlay = null;
        }
        this.currentTutorial = null;
    }

    // Show completion message
    showCompletionMessage() {
        if (typeof showToast === 'function') {
            showToast('Tutorial completed! You can find more help in the menu.');
        }
    }

    // Show tooltip
    showTooltip(elementId, content) {
        const element = document.querySelector(`[data-tooltip="${elementId}"]`) || 
                       document.getElementById(elementId);

        if (!element) return;

        const tooltip = document.createElement('div');
        tooltip.className = 'absolute bg-gray-900 text-white text-sm rounded-lg px-3 py-2 z-50 max-w-xs';
        tooltip.textContent = content;

        const rect = element.getBoundingClientRect();
        tooltip.style.top = `${rect.bottom + 5}px`;
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;

        document.body.appendChild(tooltip);

        // Remove after 3 seconds
        setTimeout(() => {
            tooltip.remove();
        }, 3000);
    }

    // Add contextual help buttons
    addContextualHelp() {
        // Add help button to smart features
        const smartButtons = document.querySelectorAll('[onclick*="applySmart"], [onclick*="runAuto"]');
        
        smartButtons.forEach(button => {
            if (!button.querySelector('.help-icon')) {
                const helpIcon = document.createElement('button');
                helpIcon.className = 'absolute top-1 right-1 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full text-xs text-gray-600';
                helpIcon.innerHTML = '?';
                helpIcon.setAttribute('aria-label', 'Get help');
                helpIcon.onclick = (e) => {
                    e.stopPropagation();
                    this.showContextualHelp(button);
                };
                
                button.style.position = 'relative';
                button.appendChild(helpIcon);
            }
        });
    }

    // Show contextual help
    showContextualHelp(element) {
        const onclick = element.getAttribute('onclick');
        let helpContent = '';

        if (onclick.includes('applySmartEnhance')) {
            helpContent = this.tooltips['smart-enhance'];
        } else if (onclick.includes('applyDentalMode')) {
            helpContent = this.tooltips['dental-mode'];
        } else if (onclick.includes('runAutoDetection')) {
            helpContent = this.tooltips['auto-detection'];
        } else if (onclick.includes('showProfessionalTools')) {
            helpContent = this.tooltips['professional-tools'];
        }

        if (helpContent) {
            this.showHelpModal(helpContent);
        }
    }

    // Show help modal
    showHelpModal(content) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-label', 'Help');

        modal.innerHTML = `
            <div class="bg-white rounded-xl max-w-md w-full p-6">
                <h3 class="text-lg font-semibold mb-2">${content.title}</h3>
                <p class="text-gray-600 mb-4">${content.content}</p>
                ${content.shortcut ? `<p class="text-sm text-gray-500 mb-4">Keyboard shortcut: ${content.shortcut}</p>` : ''}
                <button onclick="this.closest('.fixed').remove()" 
                        class="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                    Got it
                </button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Show help menu
    showHelpMenu() {
        const menu = document.createElement('div');
        menu.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        menu.setAttribute('role', 'dialog');
        menu.setAttribute('aria-label', 'Help Menu');

        const tutorialsList = Object.entries(this.tutorials).map(([id, tutorial]) => {
            const isCompleted = this.userProgress.completedTutorials.includes(id);
            return `
                <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                     onclick="window.helpSystem.startTutorial('${id}')">
                    <div>
                        <h4 class="font-medium">${tutorial.title}</h4>
                        <p class="text-sm text-gray-500">${tutorial.estimatedTime}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        ${isCompleted ? '<span class="text-green-500">✓</span>' : ''}
                        <i class="fas fa-chevron-right text-gray-400"></i>
                    </div>
                </div>
            `;
        }).join('');

        menu.innerHTML = `
            <div class="bg-white rounded-xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
                <h3 class="text-lg font-semibold mb-4">Help & Tutorials</h3>
                <div class="space-y-2 mb-4">
                    ${tutorialsList}
                </div>
                <div class="border-t pt-4">
                    <button onclick="window.helpSystem.showKeyboardShortcuts()" 
                            class="w-full p-3 text-left hover:bg-gray-50 rounded-lg">
                        <h4 class="font-medium">Keyboard Shortcuts</h4>
                        <p class="text-sm text-gray-500">View all available shortcuts</p>
                    </button>
                    <button onclick="window.helpSystem.showFAQ()" 
                            class="w-full p-3 text-left hover:bg-gray-50 rounded-lg">
                        <h4 class="font-medium">FAQ</h4>
                        <p class="text-sm text-gray-500">Frequently asked questions</p>
                    </button>
                </div>
                <button onclick="this.closest('.fixed').remove()" 
                        class="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                    Close
                </button>
            </div>
        `;

        document.body.appendChild(menu);
    }

    // Show keyboard shortcuts
    showKeyboardShortcuts() {
        const shortcuts = [
            { key: 'Ctrl+Shift+S', action: 'Apply Smart Enhancement' },
            { key: 'Ctrl+Shift+D', action: 'Apply Dental Mode' },
            { key: 'Ctrl+Shift+A', action: 'Run Auto Detection' },
            { key: 'Ctrl+Shift+P', action: 'Open Professional Tools' },
            { key: 'Escape', action: 'Close modals' },
            { key: 'Tab', action: 'Navigate between elements' },
            { key: 'Enter/Space', action: 'Activate buttons' }
        ];

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-label', 'Keyboard Shortcuts');

        const shortcutsList = shortcuts.map(shortcut => `
            <div class="flex justify-between items-center p-2 border-b">
                <kbd class="px-2 py-1 bg-gray-100 border rounded text-sm">${shortcut.key}</kbd>
                <span class="text-sm">${shortcut.action}</span>
            </div>
        `).join('');

        modal.innerHTML = `
            <div class="bg-white rounded-xl max-w-md w-full p-6">
                <h3 class="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
                <div class="space-y-1">
                    ${shortcutsList}
                </div>
                <button onclick="this.closest('.fixed').remove()" 
                        class="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                    Close
                </button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Show FAQ
    showFAQ() {
        const faq = [
            {
                question: 'What are smart features?',
                answer: 'Smart features use AI to automatically detect dental features and optimize your photos with one click.'
            },
            {
                question: 'How accurate is the auto-detection?',
                answer: 'Our AI achieves 95%+ accuracy for tooth detection and 85%+ for other features like plaque and restorations.'
            },
            {
                question: 'What are VITA shades?',
                answer: 'VITA is the standard shade matching system used by dentists worldwide, with 16 classical shades from A1 (lightest) to D4 (darkest).'
            },
            {
                question: 'Can I use this on any device?',
                answer: 'Yes! The app works on mobile phones, tablets, and desktop computers with automatic performance optimization.'
            }
        ];

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-label', 'FAQ');

        const faqList = faq.map((item, index) => `
            <div class="border-b pb-3 mb-3">
                <button onclick="this.nextElementSibling.classList.toggle('hidden')" 
                        class="w-full text-left font-medium text-left flex justify-between items-center">
                    ${item.question}
                    <i class="fas fa-chevron-down text-gray-400"></i>
                </button>
                <div class="hidden mt-2 text-sm text-gray-600">
                    ${item.answer}
                </div>
            </div>
        `).join('');

        modal.innerHTML = `
            <div class="bg-white rounded-xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
                <h3 class="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
                <div class="space-y-2">
                    ${faqList}
                </div>
                <button onclick="this.closest('.fixed').remove()" 
                        class="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                    Close
                </button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Initialize help system
    initialize() {
        // Add help button to UI
        this.addHelpButton();
        
        // Add contextual help
        setTimeout(() => {
            this.addContextualHelp();
        }, 1000);

        // Show welcome tutorial for first-time users
        if (this.isFirstTime) {
            setTimeout(() => {
                this.startTutorial('getting-started');
            }, 2000);
        }
    }

    // Add help button
    addHelpButton() {
        const helpButton = document.createElement('button');
        helpButton.className = 'fixed bottom-4 right-4 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg z-40 flex items-center justify-center';
        helpButton.innerHTML = '<i class="fas fa-question"></i>';
        helpButton.setAttribute('aria-label', 'Help');
        helpButton.onclick = () => this.showHelpMenu();
        
        document.body.appendChild(helpButton);
    }

    // Get help system status
    getStatus() {
        return {
            tutorials: Object.keys(this.tutorials),
            completedTutorials: this.userProgress.completedTutorials,
            isFirstTime: this.isFirstTime,
            currentTutorial: this.currentTutorial?.id
        };
    }
}

// Initialize help system
window.helpSystem = new HelpSystem();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    window.helpSystem.initialize();
});

// Export for use in other modules
window.HelpSystem = HelpSystem;
