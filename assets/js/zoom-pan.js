// Zoom and Pan Controls for Dental Photo Editor
// Professional navigation with touch support and precision controls

class ZoomPanController {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Zoom and pan state
        this.scale = 1;
        this.minScale = 0.1;
        this.maxScale = 10;
        this.translationX = 0;
        this.translationY = 0;
        
        // Interaction state
        this.isPanning = false;
        this.isZooming = false;
        this.lastX = 0;
        this.lastY = 0;
        this.pinchStartDistance = 0;
        
        // Animation state
        this.animationId = null;
        this.targetScale = 1;
        this.targetTranslationX = 0;
        this.targetTranslationY = 0;
        
        // Viewport
        this.viewportWidth = 0;
        this.viewportHeight = 0;
        
        // Original image data
        this.originalImageData = null;
        this.originalWidth = 0;
        this.originalHeight = 0;
        
        // Zoom presets
        this.zoomPresets = [
            { label: 'Fit', scale: 'fit' },
            { label: '25%', scale: 0.25 },
            { label: '50%', scale: 0.5 },
            { label: '100%', scale: 1 },
            { label: '200%', scale: 2 },
            { label: '400%', scale: 4 }
        ];
        
        this.currentPreset = 0;
        
        this.initialize();
    }

    // Initialize zoom and pan
    initialize() {
        this.setupEventListeners();
        this.updateViewport();
        this.setupKeyboardShortcuts();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.updateViewport();
            this.constrainPan();
        });
        
        console.log('Zoom and pan controller initialized');
    }

    // Setup event listeners
    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
        
        // Touch events
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '0':
                        e.preventDefault();
                        this.fitToScreen();
                        break;
                    case '+':
                    case '=':
                        e.preventDefault();
                        this.zoomIn();
                        break;
                    case '-':
                        e.preventDefault();
                        this.zoomOut();
                        break;
                }
            } else {
                switch(e.key) {
                    case '+':
                    case '=':
                        this.zoomIn();
                        break;
                    case '-':
                    case '_':
                        this.zoomOut();
                        break;
                    case '0':
                        this.fitToScreen();
                        break;
                    case 'ArrowUp':
                    case 'w':
                    case 'W':
                        this.pan(0, 50);
                        break;
                    case 'ArrowDown':
                    case 's':
                    case 'S':
                        this.pan(0, -50);
                        break;
                    case 'ArrowLeft':
                    case 'a':
                    case 'A':
                        this.pan(50, 0);
                        break;
                    case 'ArrowRight':
                    case 'd':
                    case 'D':
                        this.pan(-50, 0);
                        break;
                }
            }
        });
    }

    // Update viewport dimensions
    updateViewport() {
        const rect = this.canvas.getBoundingClientRect();
        this.viewportWidth = rect.width;
        this.viewportHeight = rect.height;
    }

    // Handle mouse down
    handleMouseDown(e) {
        if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
            // Middle mouse button or Ctrl+left click for panning
            this.startPan(e.clientX, e.clientY);
            e.preventDefault();
        }
    }

    // Handle mouse move
    handleMouseMove(e) {
        if (this.isPanning) {
            this.updatePan(e.clientX, e.clientY);
            e.preventDefault();
        }
    }

    // Handle mouse up
    handleMouseUp(e) {
        if (this.isPanning) {
            this.endPan();
            e.preventDefault();
        }
    }

    // Handle mouse wheel
    handleWheel(e) {
        e.preventDefault();
        
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.zoomAtPoint(delta, x, y);
    }

    // Handle touch start
    handleTouchStart(e) {
        if (e.touches.length === 1) {
            // Single touch for panning
            this.startPan(e.touches[0].clientX, e.touches[0].clientY);
        } else if (e.touches.length === 2) {
            // Two touches for pinch zoom
            this.isZooming = true;
            this.pinchStartDistance = this.getTouchDistance(e.touches);
            this.lastX = this.getTouchCenter(e.touches).x;
            this.lastY = this.getTouchCenter(e.touches).y;
        }
        
        e.preventDefault();
    }

    // Handle touch move
    handleTouchMove(e) {
        if (e.touches.length === 1 && this.isPanning) {
            this.updatePan(e.touches[0].clientX, e.touches[0].clientY);
        } else if (e.touches.length === 2 && this.isZooming) {
            const currentDistance = this.getTouchDistance(e.touches);
            const scale = currentDistance / this.pinchStartDistance;
            
            const center = this.getTouchCenter(e.touches);
            const rect = this.canvas.getBoundingClientRect();
            const x = center.x - rect.left;
            const y = center.y - rect.top;
            
            this.zoomAtPoint(scale, x, y);
            this.pinchStartDistance = currentDistance;
        }
        
        e.preventDefault();
    }

    // Handle touch end
    handleTouchEnd(e) {
        if (e.touches.length === 0) {
            this.endPan();
            this.isZooming = false;
        }
        
        e.preventDefault();
    }

    // Get touch distance
    getTouchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Get touch center
    getTouchCenter(touches) {
        return {
            x: (touches[0].clientX + touches[1].clientX) / 2,
            y: (touches[0].clientY + touches[1].clientY) / 2
        };
    }

    // Start panning
    startPan(x, y) {
        this.isPanning = true;
        this.lastX = x;
        this.lastY = y;
        this.canvas.style.cursor = 'grabbing';
    }

    // Update panning
    updatePan(x, y) {
        const deltaX = x - this.lastX;
        const deltaY = y - this.lastY;
        
        this.translationX += deltaX;
        this.translationY += deltaY;
        
        this.constrainPan();
        this.applyTransform();
        
        this.lastX = x;
        this.lastY = y;
    }

    // End panning
    endPan() {
        this.isPanning = false;
        this.canvas.style.cursor = 'grab';
    }

    // Pan by specified amounts
    pan(deltaX, deltaY) {
        this.translationX += deltaX;
        this.translationY += deltaY;
        
        this.constrainPan();
        this.animateTransform();
    }

    // Zoom at specific point
    zoomAtPoint(deltaScale, pointX, pointY) {
        const oldScale = this.scale;
        const newScale = Math.max(this.minScale, Math.min(this.maxScale, oldScale * deltaScale));
        
        if (newScale !== oldScale) {
            // Calculate translation to keep point fixed
            const scaleChange = newScale - oldScale;
            this.translationX -= (pointX - this.viewportWidth / 2) * scaleChange / oldScale;
            this.translationY -= (pointY - this.viewportHeight / 2) * scaleChange / oldScale;
            
            this.scale = newScale;
            this.constrainPan();
            this.animateTransform();
        }
    }

    // Zoom in
    zoomIn() {
        this.zoomAtPoint(1.2, this.viewportWidth / 2, this.viewportHeight / 2);
    }

    // Zoom out
    zoomOut() {
        this.zoomAtPoint(0.8, this.viewportWidth / 2, this.viewportHeight / 2);
    }

    // Zoom to specific scale
    zoomTo(scale, animate = true) {
        if (scale === 'fit') {
            this.fitToScreen(animate);
            return;
        }
        
        scale = Math.max(this.minScale, Math.min(this.maxScale, scale));
        
        if (scale !== this.scale) {
            this.scale = scale;
            this.constrainPan();
            
            if (animate) {
                this.animateTransform();
            } else {
                this.applyTransform();
            }
        }
    }

    // Fit to screen
    fitToScreen(animate = true) {
        if (!this.originalWidth || !this.originalHeight) {
            return;
        }
        
        const scaleX = this.viewportWidth / this.originalWidth;
        const scaleY = this.viewportHeight / this.originalHeight;
        const fitScale = Math.min(scaleX, scaleY, 1);
        
        this.scale = fitScale;
        this.translationX = 0;
        this.translationY = 0;
        
        if (animate) {
            this.animateTransform();
        } else {
            this.applyTransform();
        }
    }

    // Reset zoom and pan
    reset(animate = true) {
        this.scale = 1;
        this.translationX = 0;
        this.translationY = 0;
        
        if (animate) {
            this.animateTransform();
        } else {
            this.applyTransform();
        }
    }

    // Constrain panning to image bounds
    constrainPan() {
        if (!this.originalWidth || !this.originalHeight) {
            return;
        }
        
        const scaledWidth = this.originalWidth * this.scale;
        const scaledHeight = this.originalHeight * this.scale;
        
        // Calculate max translation
        const maxTranslateX = Math.max(0, (scaledWidth - this.viewportWidth) / 2);
        const maxTranslateY = Math.max(0, (scaledHeight - this.viewportHeight) / 2);
        
        // Constrain translation
        this.translationX = Math.max(-maxTranslateX, Math.min(maxTranslateX, this.translationX));
        this.translationY = Math.max(-maxTranslateY, Math.min(maxTranslateY, this.translationY));
    }

    // Apply transformation
    applyTransform() {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        
        this.ctx.save();
        this.ctx.translate(this.viewportWidth / 2 + this.translationX, this.viewportHeight / 2 + this.translationY);
        this.ctx.scale(this.scale, this.scale);
        this.ctx.translate(-this.originalWidth / 2, -this.originalHeight / 2);
        
        // Redraw image if available
        if (this.originalImageData) {
            this.ctx.putImageData(this.originalImageData, 0, 0);
        }
        
        this.ctx.restore();
        
        this.updateZoomUI();
    }

    // Animate transformation
    animateTransform() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        const animate = () => {
            const easing = 0.1;
            
            this.translationX += (this.targetTranslationX - this.translationX) * easing;
            this.translationY += (this.targetTranslationY - this.translationY) * easing;
            this.scale += (this.targetScale - this.scale) * easing;
            
            this.applyTransform();
            
            // Check if animation is complete
            const dx = Math.abs(this.targetTranslationX - this.translationX);
            const dy = Math.abs(this.targetTranslationY - this.translationY);
            const ds = Math.abs(this.targetScale - this.scale);
            
            if (dx > 0.1 || dy > 0.1 || ds > 0.001) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                this.translationX = this.targetTranslationX;
                this.translationY = this.targetTranslationY;
                this.scale = this.targetScale;
                this.applyTransform();
            }
        };
        
        // Set targets
        this.targetTranslationX = this.translationX;
        this.targetTranslationY = this.translationY;
        this.targetScale = this.scale;
        
        animate();
    }

    // Set image data
    setImageData(imageData) {
        this.originalImageData = imageData;
        this.originalWidth = imageData.width;
        this.originalHeight = imageData.height;
        
        // Resize canvas to match viewport
        this.canvas.width = this.viewportWidth;
        this.canvas.height = this.viewportHeight;
        
        // Fit to screen initially
        this.fitToScreen(false);
    }

    // Get current zoom level
    getZoomLevel() {
        return Math.round(this.scale * 100);
    }

    // Get zoom preset index
    getCurrentPreset() {
        for (let i = 0; i < this.zoomPresets.length; i++) {
            const preset = this.zoomPresets[i];
            if (preset.scale === 'fit' && this.scale === this.getFitScale()) {
                return i;
            } else if (preset.scale === this.scale) {
                return i;
            }
        }
        return -1;
    }

    // Get fit scale
    getFitScale() {
        if (!this.originalWidth || !this.originalHeight) {
            return 1;
        }
        
        const scaleX = this.viewportWidth / this.originalWidth;
        const scaleY = this.viewportHeight / this.originalHeight;
        return Math.min(scaleX, scaleY, 1);
    }

    // Cycle through zoom presets
    cycleZoomPresets() {
        this.currentPreset = (this.currentPreset + 1) % this.zoomPresets.length;
        const preset = this.zoomPresets[this.currentPreset];
        this.zoomTo(preset.scale);
    }

    // Update zoom UI
    updateZoomUI() {
        const zoomLevel = this.getZoomLevel();
        
        // Update zoom display
        const zoomDisplay = document.getElementById('zoomDisplay');
        if (zoomDisplay) {
            zoomDisplay.textContent = `${zoomLevel}%`;
        }
        
        // Update zoom slider
        const zoomSlider = document.getElementById('zoomSlider');
        if (zoomSlider) {
            zoomSlider.value = zoomLevel;
        }
        
        // Update preset buttons
        this.updatePresetButtons();
    }

    // Update preset buttons
    updatePresetButtons() {
        const currentPreset = this.getCurrentPreset();
        
        document.querySelectorAll('[data-zoom-preset]').forEach((btn, index) => {
            if (index === currentPreset) {
                btn.classList.add('bg-blue-500', 'text-white');
                btn.classList.remove('bg-gray-100', 'text-gray-700');
            } else {
                btn.classList.remove('bg-blue-500', 'text-white');
                btn.classList.add('bg-gray-100', 'text-gray-700');
            }
        });
    }

    // Get visible area
    getVisibleArea() {
        if (!this.originalWidth || !this.originalHeight) {
            return null;
        }
        
        const scaledWidth = this.originalWidth * this.scale;
        const scaledHeight = this.originalHeight * this.scale;
        
        const visibleX = (this.viewportWidth / 2 - this.translationX) / this.scale;
        const visibleY = (this.viewportHeight / 2 - this.translationY) / this.scale;
        const visibleWidth = this.viewportWidth / this.scale;
        const visibleHeight = this.viewportHeight / this.scale;
        
        return {
            x: Math.max(0, visibleX - visibleWidth / 2),
            y: Math.max(0, visibleY - visibleHeight / 2),
            width: Math.min(this.originalWidth, visibleWidth),
            height: Math.min(this.originalHeight, visibleHeight)
        };
    }

    // Center on specific point
    centerOnPoint(x, y, animate = true) {
        this.translationX = -x * this.scale + this.viewportWidth / 2;
        this.translationY = -y * this.scale + this.viewportHeight / 2;
        
        this.constrainPan();
        
        if (animate) {
            this.animateTransform();
        } else {
            this.applyTransform();
        }
    }

    // Get transformation matrix
    getTransformMatrix() {
        return {
            scale: this.scale,
            translateX: this.translationX,
            translateY: this.translationY
        };
    }

    // Set transformation matrix
    setTransformMatrix(matrix, animate = true) {
        this.scale = matrix.scale || 1;
        this.translationX = matrix.translateX || 0;
        this.translationY = matrix.translateY || 0;
        
        this.constrainPan();
        
        if (animate) {
            this.animateTransform();
        } else {
            this.applyTransform();
        }
    }

    // Enable/disable zoom and pan
    setEnabled(enabled) {
        this.enabled = enabled;
        
        if (!enabled) {
            this.reset();
        }
    }

    // Get zoom and pan state
    getState() {
        return {
            scale: this.scale,
            translationX: this.translationX,
            translationY: this.translationY,
            viewportWidth: this.viewportWidth,
            viewportHeight: this.viewportHeight,
            originalWidth: this.originalWidth,
            originalHeight: this.originalHeight
        };
    }

    // Set zoom and pan state
    setState(state, animate = true) {
        this.scale = state.scale || 1;
        this.translationX = state.translationX || 0;
        this.translationY = state.translationY || 0;
        
        if (state.originalWidth && state.originalHeight) {
            this.originalWidth = state.originalWidth;
            this.originalHeight = state.originalHeight;
        }
        
        this.constrainPan();
        
        if (animate) {
            this.animateTransform();
        } else {
            this.applyTransform();
        }
    }
}

// Export for use in main application
window.ZoomPanController = ZoomPanController;
