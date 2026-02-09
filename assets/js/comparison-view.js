// Before/After Comparison Views for Dental Photo Editor
// Side-by-side, overlay, slider, and professional comparison modes

class ComparisonView {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Images
        this.originalImage = null;
        this.enhancedImage = null;
        
        // Comparison modes
        this.modes = {
            sideBySide: { name: 'Side by Side', icon: 'fa-columns' },
            slider: { name: 'Slider', icon: 'fa-sliders-h' },
            overlay: { name: 'Overlay', icon: 'fa-layer-group' },
            diff: { name: 'Difference', icon: 'fa-exchange-alt' },
            mirror: { name: 'Mirror', icon: 'fa-clone' },
            fade: { name: 'Fade', icon: 'fa-adjust' }
        };
        
        this.currentMode = 'sideBySide';
        
        // Slider properties
        this.sliderPosition = 0.5;
        this.isDraggingSlider = false;
        
        // Overlay properties
        this.overlayOpacity = 0.5;
        this.fadePosition = 0.5;
        
        // Animation
        this.animationId = null;
        this.isAnimating = false;
        
        // View settings
        this.settings = {
            showLabels: true,
            showGrid: false,
            syncZoom: true,
            autoPlay: false,
            playSpeed: 2000
        };
        
        this.initialize();
    }

    // Initialize comparison view
    initialize() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        
        console.log('Comparison view initialized');
    }

    // Setup event listeners
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        
        // Touch events
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Wheel event for slider
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
    }

    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.setMode('sideBySide');
                        break;
                    case '2':
                        e.preventDefault();
                        this.setMode('slider');
                        break;
                    case '3':
                        e.preventDefault();
                        this.setMode('overlay');
                        break;
                    case '4':
                        e.preventDefault();
                        this.setMode('diff');
                        break;
                    case '5':
                        e.preventDefault();
                        this.setMode('mirror');
                        break;
                    case '6':
                        e.preventDefault();
                        this.setMode('fade');
                        break;
                    case ' ':
                        e.preventDefault();
                        this.toggleAutoPlay();
                        break;
                }
            } else {
                switch(e.key) {
                    case 'ArrowLeft':
                        this.adjustSlider(-0.05);
                        break;
                    case 'ArrowRight':
                        this.adjustSlider(0.05);
                        break;
                    case ' ':
                        this.toggleAutoPlay();
                        break;
                    case 'Escape':
                        this.stopAutoPlay();
                        break;
                }
            }
        });
    }

    // Set images for comparison
    setImages(original, enhanced) {
        this.originalImage = original;
        this.enhancedImage = enhanced;
        this.redrawComparison();
    }

    // Set comparison mode
    setMode(mode) {
        if (this.modes[mode]) {
            this.currentMode = mode;
            this.stopAutoPlay();
            this.redrawComparison();
            this.updateModeUI();
            
            if (window.accessibilityManager) {
                window.accessibilityManager.announce(`Comparison mode changed to ${this.modes[mode].name}`);
            }
        }
    }

    // Handle mouse down
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        
        if (this.currentMode === 'slider') {
            // Check if clicking on slider
            const sliderX = this.canvas.width * this.sliderPosition;
            if (Math.abs(x - sliderX) < 10) {
                this.isDraggingSlider = true;
                this.canvas.style.cursor = 'ew-resize';
            }
        }
    }

    // Handle mouse move
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        
        if (this.isDraggingSlider) {
            this.sliderPosition = Math.max(0, Math.min(1, x / this.canvas.width));
            this.redrawComparison();
        } else {
            // Update cursor
            if (this.currentMode === 'slider') {
                const sliderX = this.canvas.width * this.sliderPosition;
                if (Math.abs(x - sliderX) < 10) {
                    this.canvas.style.cursor = 'ew-resize';
                } else {
                    this.canvas.style.cursor = 'default';
                }
            }
        }
    }

    // Handle mouse up
    handleMouseUp(e) {
        this.isDraggingSlider = false;
        this.canvas.style.cursor = 'default';
    }

    // Handle touch events
    handleTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
        }
    }

    handleTouchMove(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
        }
    }

    handleTouchEnd(e) {
        this.handleMouseUp({});
    }

    // Handle wheel event
    handleWheel(e) {
        if (this.currentMode === 'slider') {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.05 : 0.05;
            this.adjustSlider(delta);
        }
    }

    // Adjust slider position
    adjustSlider(delta) {
        this.sliderPosition = Math.max(0, Math.min(1, this.sliderPosition + delta));
        this.redrawComparison();
    }

    // Redraw comparison view
    redrawComparison() {
        if (!this.originalImage || !this.enhancedImage) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        switch (this.currentMode) {
            case 'sideBySide':
                this.drawSideBySide();
                break;
            case 'slider':
                this.drawSlider();
                break;
            case 'overlay':
                this.drawOverlay();
                break;
            case 'diff':
                this.drawDifference();
                break;
            case 'mirror':
                this.drawMirror();
                break;
            case 'fade':
                this.drawFade();
                break;
        }
        
        // Draw labels if enabled
        if (this.settings.showLabels) {
            this.drawLabels();
        }
        
        // Draw grid if enabled
        if (this.settings.showGrid) {
            this.drawGrid();
        }
    }

    // Draw side by side comparison
    drawSideBySide() {
        const halfWidth = this.canvas.width / 2;
        
        // Draw original image (left)
        this.ctx.save();
        this.ctx.drawImage(this.originalImage, 0, 0, halfWidth, this.canvas.height);
        this.ctx.restore();
        
        // Draw enhanced image (right)
        this.ctx.save();
        this.ctx.drawImage(this.enhancedImage, halfWidth, 0, halfWidth, this.canvas.height);
        this.ctx.restore();
        
        // Draw divider line
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(halfWidth, 0);
        this.ctx.lineTo(halfWidth, this.canvas.height);
        this.ctx.stroke();
    }

    // Draw slider comparison
    drawSlider() {
        const sliderX = this.canvas.width * this.sliderPosition;
        
        // Draw original image (left)
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(0, 0, sliderX, this.canvas.height);
        this.ctx.clip();
        this.ctx.drawImage(this.originalImage, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        
        // Draw enhanced image (right)
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(sliderX, 0, this.canvas.width - sliderX, this.canvas.height);
        this.ctx.clip();
        this.ctx.drawImage(this.enhancedImage, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        
        // Draw slider line
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(sliderX, 0);
        this.ctx.lineTo(sliderX, this.canvas.height);
        this.ctx.stroke();
        
        // Draw slider handle
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(sliderX, this.canvas.height / 2, 10, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
    }

    // Draw overlay comparison
    drawOverlay() {
        // Draw original image (bottom layer)
        this.ctx.drawImage(this.originalImage, 0, 0, this.canvas.width, this.canvas.height);
        
        // Draw enhanced image (top layer) with opacity
        this.ctx.save();
        this.ctx.globalAlpha = this.overlayOpacity;
        this.ctx.drawImage(this.enhancedImage, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        
        // Draw opacity slider
        this.drawOpacitySlider();
    }

    // Draw difference view
    drawDifference() {
        // Create temporary canvas for difference calculation
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Draw original image
        tempCtx.drawImage(this.originalImage, 0, 0, this.canvas.width, this.canvas.height);
        const originalData = tempCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw enhanced image
        tempCtx.drawImage(this.enhancedImage, 0, 0, this.canvas.width, this.canvas.height);
        const enhancedData = tempCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        
        // Calculate difference
        const diffData = this.calculateDifference(originalData, enhancedData);
        
        // Draw difference
        this.ctx.putImageData(diffData, 0, 0);
    }

    // Draw mirror comparison
    drawMirror() {
        const halfWidth = this.canvas.width / 2;
        
        // Draw original image (left)
        this.ctx.drawImage(this.originalImage, 0, 0, halfWidth, this.canvas.height);
        
        // Draw mirrored enhanced image (right)
        this.ctx.save();
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(this.enhancedImage, -this.canvas.width, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        
        // Draw divider line
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(halfWidth, 0);
        this.ctx.lineTo(halfWidth, this.canvas.height);
        this.ctx.stroke();
    }

    // Draw fade comparison
    drawFade() {
        const fadeX = this.canvas.width * this.fadePosition;
        
        // Create gradient for fade effect
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(this.fadePosition, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(Math.min(1, this.fadePosition + 0.1), 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        // Draw original image
        this.ctx.drawImage(this.originalImage, 0, 0, this.canvas.width, this.canvas.height);
        
        // Draw enhanced image with gradient mask
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.drawImage(this.enhancedImage, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalCompositeOperation = 'destination-in';
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        
        // Draw fade line
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(fadeX, 0);
        this.ctx.lineTo(fadeX, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    // Draw opacity slider
    drawOpacitySlider() {
        const sliderY = this.canvas.height - 30;
        const sliderWidth = this.canvas.width - 40;
        const sliderX = 20;
        const handleX = sliderX + sliderWidth * this.overlayOpacity;
        
        // Draw slider track
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(sliderX, sliderY, sliderWidth, 4);
        
        // Draw handle
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(handleX, sliderY + 2, 8, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw opacity value
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${Math.round(this.overlayOpacity * 100)}%`, this.canvas.width / 2, sliderY - 10);
    }

    // Calculate difference between images
    calculateDifference(data1, data2) {
        const diffData = new ImageData(data1.width, data1.height);
        
        for (let i = 0; i < data1.data.length; i += 4) {
            const diff = Math.abs(data1.data[i] - data2.data[i]) +
                         Math.abs(data1.data[i + 1] - data2.data[i + 1]) +
                         Math.abs(data1.data[i + 2] - data2.data[i + 2]);
            
            // Normalize difference to 0-255 range
            const normalizedDiff = Math.min(255, diff * 2);
            
            // Create color-coded difference
            if (normalizedDiff > 50) {
                // Significant difference - show in red
                diffData.data[i] = normalizedDiff;
                diffData.data[i + 1] = 0;
                diffData.data[i + 2] = 0;
            } else {
                // Small difference - show in grayscale
                const gray = normalizedDiff;
                diffData.data[i] = gray;
                diffData.data[i + 1] = gray;
                diffData.data[i + 2] = gray;
            }
            
            diffData.data[i + 3] = 255; // Alpha
        }
        
        return diffData;
    }

    // Draw labels
    drawLabels() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;
        this.ctx.font = 'bold 14px Arial';
        
        switch (this.currentMode) {
            case 'sideBySide':
                this.ctx.strokeText('Original', this.canvas.width / 4, 30);
                this.ctx.fillText('Original', this.canvas.width / 4, 30);
                this.ctx.strokeText('Enhanced', this.canvas.width * 3 / 4, 30);
                this.ctx.fillText('Enhanced', this.canvas.width * 3 / 4, 30);
                break;
                
            case 'slider':
                this.ctx.strokeText('Original', this.canvas.width * this.sliderPosition / 2, 30);
                this.ctx.fillText('Original', this.canvas.width * this.sliderPosition / 2, 30);
                this.ctx.strokeText('Enhanced', this.canvas.width * (this.sliderPosition + 1) / 2, 30);
                this.ctx.fillText('Enhanced', this.canvas.width * (this.sliderPosition + 1) / 2, 30);
                break;
                
            case 'overlay':
                this.ctx.strokeText('Overlay Mode', this.canvas.width / 2, 30);
                this.ctx.fillText('Overlay Mode', this.canvas.width / 2, 30);
                break;
                
            case 'diff':
                this.ctx.strokeText('Difference View', this.canvas.width / 2, 30);
                this.ctx.fillText('Difference View', this.canvas.width / 2, 30);
                break;
                
            case 'mirror':
                this.ctx.strokeText('Original', this.canvas.width / 4, 30);
                this.ctx.fillText('Original', this.canvas.width / 4, 30);
                this.ctx.strokeText('Mirrored', this.canvas.width * 3 / 4, 30);
                this.ctx.fillText('Mirrored', this.canvas.width * 3 / 4, 30);
                break;
                
            case 'fade':
                this.ctx.strokeText('Fade Mode', this.canvas.width / 2, 30);
                this.ctx.fillText('Fade Mode', this.canvas.width / 2, 30);
                break;
        }
    }

    // Draw grid
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 1;
        
        const gridSize = 50;
        
        // Vertical lines
        for (let x = 0; x <= this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    // Toggle auto play
    toggleAutoPlay() {
        if (this.isAnimating) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }

    // Start auto play animation
    startAutoPlay() {
        this.isAnimating = true;
        this.animate();
        
        if (typeof showToast === 'function') {
            showToast('Auto play started');
        }
    }

    // Stop auto play animation
    stopAutoPlay() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        if (typeof showToast === 'function') {
            showToast('Auto play stopped');
        }
    }

    // Animate comparison
    animate() {
        if (!this.isAnimating) return;
        
        const time = Date.now();
        const progress = (time % this.settings.playSpeed) / this.settings.playSpeed;
        
        switch (this.currentMode) {
            case 'slider':
                this.sliderPosition = progress;
                break;
            case 'overlay':
                this.overlayOpacity = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
                break;
            case 'fade':
                this.fadePosition = progress;
                break;
        }
        
        this.redrawComparison();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    // Update mode UI
    updateModeUI() {
        document.querySelectorAll('[data-comparison-mode]').forEach(btn => {
            btn.classList.remove('bg-blue-500', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-700');
        });
        
        const activeBtn = document.querySelector(`[data-comparison-mode="${this.currentMode}"]`);
        if (activeBtn) {
            activeBtn.classList.remove('bg-gray-100', 'text-gray-700');
            activeBtn.classList.add('bg-blue-500', 'text-white');
        }
    }

    // Get comparison modes
    getAvailableModes() {
        return Object.keys(this.modes).map(key => ({
            id: key,
            name: this.modes[key].name,
            icon: this.modes[key].icon
        }));
    }

    // Get current mode
    getCurrentMode() {
        return this.currentMode;
    }

    // Get settings
    getSettings() {
        return { ...this.settings };
    }

    // Set settings
    setSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.redrawComparison();
    }

    // Export comparison as image
    exportComparison() {
        return this.canvas.toDataURL('image/png');
    }

    // Get comparison summary
    getComparisonSummary() {
        return {
            mode: this.currentMode,
            hasImages: !!(this.originalImage && this.enhancedImage),
            sliderPosition: this.sliderPosition,
            overlayOpacity: this.overlayOpacity,
            fadePosition: this.fadePosition,
            isAnimating: this.isAnimating
        };
    }
}

// Export for use in main application
window.ComparisonView = ComparisonView;
