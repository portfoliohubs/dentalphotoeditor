// Image Transformation Tools for Dental Photo Editor
// Crop, rotate, straighten, flip, and professional image adjustments

class ImageTransformTools {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Original image data
        this.originalImageData = null;
        this.originalWidth = 0;
        this.originalHeight = 0;
        
        // Transformation state
        this.rotation = 0;
        this.flipHorizontal = false;
        this.flipVertical = false;
        this.cropArea = null;
        this.straightenAngle = 0;
        
        // Tool states
        this.currentTool = null;
        this.isDragging = false;
        this.isRotating = false;
        this.startPoint = null;
        
        // Crop handles
        this.cropHandles = [];
        this.selectedHandle = null;
        
        // Straighten guide
        this.straightenGuide = null;
        
        // History for undo/redo
        this.history = [];
        this.historyStep = -1;
        
        this.initialize();
    }

    // Initialize tools
    initialize() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        
        console.log('Image transform tools initialized');
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
    }

    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'r':
                        e.preventDefault();
                        this.rotateImage(90);
                        break;
                    case 'f':
                        e.preventDefault();
                        this.flipImage('horizontal');
                        break;
                    case 'c':
                        e.preventDefault();
                        this.setTool('crop');
                        break;
                    case 's':
                        e.preventDefault();
                        this.setTool('straighten');
                        break;
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                        break;
                }
            }
        });
    }

    // Set original image data
    setOriginalImageData(imageData) {
        this.originalImageData = imageData;
        this.originalWidth = imageData.width;
        this.originalHeight = imageData.height;
        
        // Reset transformations
        this.resetTransformations();
    }

    // Reset all transformations
    resetTransformations() {
        this.rotation = 0;
        this.flipHorizontal = false;
        this.flipVertical = false;
        this.cropArea = null;
        this.straightenAngle = 0;
        this.currentTool = null;
        
        this.redrawImage();
    }

    // Set current tool
    setTool(tool) {
        this.currentTool = tool;
        this.isDragging = false;
        this.isRotating = false;
        
        // Initialize tool-specific setup
        switch(tool) {
            case 'crop':
                this.initializeCrop();
                break;
            case 'straighten':
                this.initializeStraighten();
                break;
            default:
                this.cropArea = null;
                this.straightenGuide = null;
        }
        
        this.redrawImage();
        this.updateToolUI();
    }

    // Initialize crop tool
    initializeCrop() {
        if (!this.cropArea) {
            // Default crop area (centered 80% of image)
            const margin = Math.min(this.originalWidth, this.originalHeight) * 0.1;
            this.cropArea = {
                x: margin,
                y: margin,
                width: this.originalWidth - margin * 2,
                height: this.originalHeight - margin * 2
            };
        }
        
        this.updateCropHandles();
    }

    // Initialize straighten tool
    initializeStraighten() {
        this.straightenGuide = {
            startX: this.originalWidth / 2,
            startY: this.originalHeight / 2,
            endX: this.originalWidth / 2 + 100,
            endY: this.originalHeight / 2
        };
    }

    // Update crop handles
    updateCropHandles() {
        if (!this.cropArea) return;
        
        this.cropHandles = [
            { type: 'nw', x: this.cropArea.x, y: this.cropArea.y },
            { type: 'ne', x: this.cropArea.x + this.cropArea.width, y: this.cropArea.y },
            { type: 'sw', x: this.cropArea.x, y: this.cropArea.y + this.cropArea.height },
            { type: 'se', x: this.cropArea.x + this.cropArea.width, y: this.cropArea.y + this.cropArea.height },
            { type: 'n', x: this.cropArea.x + this.cropArea.width / 2, y: this.cropArea.y },
            { type: 's', x: this.cropArea.x + this.cropArea.width / 2, y: this.cropArea.y + this.cropArea.height },
            { type: 'w', x: this.cropArea.x, y: this.cropArea.y + this.cropArea.height / 2 },
            { type: 'e', x: this.cropArea.x + this.cropArea.width, y: this.cropArea.y + this.cropArea.height / 2 }
        ];
    }

    // Handle mouse down
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        
        this.startPoint = { x, y };
        
        if (this.currentTool === 'crop') {
            this.handleCropMouseDown(x, y);
        } else if (this.currentTool === 'straighten') {
            this.handleStraightenMouseDown(x, y);
        }
    }

    // Handle mouse move
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        
        if (this.currentTool === 'crop' && this.isDragging) {
            this.handleCropMouseMove(x, y);
        } else if (this.currentTool === 'straighten' && this.isDragging) {
            this.handleStraightenMouseMove(x, y);
        }
        
        // Update cursor
        this.updateCursor(x, y);
    }

    // Handle mouse up
    handleMouseUp(e) {
        if (this.currentTool === 'crop') {
            this.handleCropMouseUp();
        } else if (this.currentTool === 'straighten') {
            this.handleStraightenMouseUp();
        }
        
        this.isDragging = false;
        this.isRotating = false;
        this.selectedHandle = null;
    }

    // Handle touch events
    handleTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
            const y = (touch.clientY - rect.top) * (this.canvas.height / rect.height);
            
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

    // Handle crop mouse down
    handleCropMouseDown(x, y) {
        // Check if clicking on a handle
        for (const handle of this.cropHandles) {
            if (this.isPointNearHandle(x, y, handle)) {
                this.selectedHandle = handle.type;
                this.isDragging = true;
                return;
            }
        }
        
        // Check if clicking inside crop area
        if (this.isPointInCropArea(x, y)) {
            this.selectedHandle = 'move';
            this.isDragging = true;
            this.cropDragOffset = {
                x: x - this.cropArea.x,
                y: y - this.cropArea.y
            };
        }
    }

    // Handle crop mouse move
    handleCropMouseMove(x, y) {
        if (!this.cropArea || !this.isDragging) return;
        
        switch (this.selectedHandle) {
            case 'nw':
                this.resizeCropFromNW(x, y);
                break;
            case 'ne':
                this.resizeCropFromNE(x, y);
                break;
            case 'sw':
                this.resizeCropFromSW(x, y);
                break;
            case 'se':
                this.resizeCropFromSE(x, y);
                break;
            case 'n':
                this.resizeCropFromN(x, y);
                break;
            case 's':
                this.resizeCropFromS(x, y);
                break;
            case 'w':
                this.resizeCropFromW(x, y);
                break;
            case 'e':
                this.resizeCropFromE(x, y);
                break;
            case 'move':
                this.moveCropArea(x, y);
                break;
        }
        
        this.updateCropHandles();
        this.redrawImage();
    }

    // Handle crop mouse up
    handleCropMouseUp() {
        // Crop operation completed
        this.saveHistory();
    }

    // Handle straighten mouse down
    handleStraightenMouseDown(x, y) {
        // Check if clicking near guide line
        if (this.isPointNearLine(x, y, this.straightenGuide)) {
            this.isDragging = true;
        } else {
            // Start new guide line
            this.straightenGuide = {
                startX: x,
                startY: y,
                endX: x,
                endY: y
            };
            this.isDragging = true;
        }
    }

    // Handle straighten mouse move
    handleStraightenMouseMove(x, y) {
        if (!this.straightenGuide || !this.isDragging) return;
        
        this.straightenGuide.endX = x;
        this.straightenGuide.endY = y;
        
        // Calculate angle
        const angle = Math.atan2(
            this.straightenGuide.endY - this.straightenGuide.startY,
            this.straightenGuide.endX - this.straightenGuide.startX
        );
        
        this.straightenAngle = angle * 180 / Math.PI;
        
        this.redrawImage();
    }

    // Handle straighten mouse up
    handleStraightenMouseUp() {
        this.saveHistory();
    }

    // Resize crop from northwest
    resizeCropFromNW(x, y) {
        const newWidth = this.cropArea.x + this.cropArea.width - x;
        const newHeight = this.cropArea.y + this.cropArea.height - y;
        
        if (newWidth > 20 && newHeight > 20) {
            this.cropArea.x = x;
            this.cropArea.y = y;
            this.cropArea.width = newWidth;
            this.cropArea.height = newHeight;
        }
    }

    // Resize crop from northeast
    resizeCropFromNE(x, y) {
        const newWidth = x - this.cropArea.x;
        const newHeight = this.cropArea.y + this.cropArea.height - y;
        
        if (newWidth > 20 && newHeight > 20) {
            this.cropArea.y = y;
            this.cropArea.width = newWidth;
            this.cropArea.height = newHeight;
        }
    }

    // Resize crop from southwest
    resizeCropFromSW(x, y) {
        const newWidth = this.cropArea.x + this.cropArea.width - x;
        const newHeight = y - this.cropArea.y;
        
        if (newWidth > 20 && newHeight > 20) {
            this.cropArea.x = x;
            this.cropArea.width = newWidth;
            this.cropArea.height = newHeight;
        }
    }

    // Resize crop from southeast
    resizeCropFromSE(x, y) {
        const newWidth = x - this.cropArea.x;
        const newHeight = y - this.cropArea.y;
        
        if (newWidth > 20 && newHeight > 20) {
            this.cropArea.width = newWidth;
            this.cropArea.height = newHeight;
        }
    }

    // Resize crop from north
    resizeCropFromN(x, y) {
        const newHeight = this.cropArea.y + this.cropArea.height - y;
        
        if (newHeight > 20) {
            this.cropArea.y = y;
            this.cropArea.height = newHeight;
        }
    }

    // Resize crop from south
    resizeCropFromS(x, y) {
        const newHeight = y - this.cropArea.y;
        
        if (newHeight > 20) {
            this.cropArea.height = newHeight;
        }
    }

    // Resize crop from west
    resizeCropFromW(x, y) {
        const newWidth = this.cropArea.x + this.cropArea.width - x;
        
        if (newWidth > 20) {
            this.cropArea.x = x;
            this.cropArea.width = newWidth;
        }
    }

    // Resize crop from east
    resizeCropFromE(x, y) {
        const newWidth = x - this.cropArea.x;
        
        if (newWidth > 20) {
            this.cropArea.width = newWidth;
        }
    }

    // Move crop area
    moveCropArea(x, y) {
        const newX = x - this.cropDragOffset.x;
        const newY = y - this.cropDragOffset.y;
        
        // Constrain to image bounds
        this.cropArea.x = Math.max(0, Math.min(newX, this.originalWidth - this.cropArea.width));
        this.cropArea.y = Math.max(0, Math.min(newY, this.originalHeight - this.cropArea.height));
    }

    // Check if point is near handle
    isPointNearHandle(x, y, handle) {
        const threshold = 10;
        const distance = Math.sqrt(Math.pow(x - handle.x, 2) + Math.pow(y - handle.y, 2));
        return distance < threshold;
    }

    // Check if point is in crop area
    isPointInCropArea(x, y) {
        return x >= this.cropArea.x && 
               x <= this.cropArea.x + this.cropArea.width &&
               y >= this.cropArea.y && 
               y <= this.cropArea.y + this.cropArea.height;
    }

    // Check if point is near line
    isPointNearLine(x, y, line) {
        const threshold = 10;
        const distance = this.pointToLineDistance(x, y, line.startX, line.startY, line.endX, line.endY);
        return distance < threshold;
    }

    // Calculate distance from point to line
    pointToLineDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        
        if (lenSq !== 0) {
            param = dot / lenSq;
        }
        
        let xx, yy;
        
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = px - xx;
        const dy = py - yy;
        
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Update cursor
    updateCursor(x, y) {
        if (this.currentTool === 'crop') {
            for (const handle of this.cropHandles) {
                if (this.isPointNearHandle(x, y, handle)) {
                    this.canvas.style.cursor = this.getCursorForHandle(handle.type);
                    return;
                }
            }
            
            if (this.isPointInCropArea(x, y)) {
                this.canvas.style.cursor = 'move';
            } else {
                this.canvas.style.cursor = 'default';
            }
        } else if (this.currentTool === 'straighten') {
            if (this.isPointNearLine(x, y, this.straightenGuide)) {
                this.canvas.style.cursor = 'crosshair';
            } else {
                this.canvas.style.cursor = 'default';
            }
        } else {
            this.canvas.style.cursor = 'default';
        }
    }

    // Get cursor for handle
    getCursorForHandle(handleType) {
        const cursors = {
            'nw': 'nw-resize',
            'ne': 'ne-resize',
            'sw': 'sw-resize',
            'se': 'se-resize',
            'n': 'n-resize',
            's': 's-resize',
            'w': 'w-resize',
            'e': 'e-resize'
        };
        
        return cursors[handleType] || 'default';
    }

    // Redraw image with transformations
    redrawImage() {
        if (!this.originalImageData) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Save context state
        this.ctx.save();
        
        // Apply transformations
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.rotate(this.rotation * Math.PI / 180);
        this.ctx.scale(
            this.flipHorizontal ? -1 : 1,
            this.flipVertical ? -1 : 1
        );
        this.ctx.translate(-this.originalWidth / 2, -this.originalHeight / 2);
        
        // Apply straighten
        if (this.straightenAngle !== 0) {
            this.ctx.translate(this.originalWidth / 2, this.originalHeight / 2);
            this.ctx.rotate(this.straightenAngle * Math.PI / 180);
            this.ctx.translate(-this.originalWidth / 2, -this.originalHeight / 2);
        }
        
        // Draw image
        this.ctx.putImageData(this.originalImageData, 0, 0);
        
        // Restore context state
        this.ctx.restore();
        
        // Draw overlays
        if (this.currentTool === 'crop') {
            this.drawCropOverlay();
        } else if (this.currentTool === 'straighten') {
            this.drawStraightenOverlay();
        }
    }

    // Draw crop overlay
    drawCropOverlay() {
        if (!this.cropArea) return;
        
        // Draw semi-transparent overlay outside crop area
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        
        // Top area
        this.ctx.fillRect(0, 0, this.canvas.width, this.cropArea.y);
        // Bottom area
        this.ctx.fillRect(0, this.cropArea.y + this.cropArea.height, this.canvas.width, this.canvas.height - this.cropArea.y - this.cropArea.height);
        // Left area
        this.ctx.fillRect(0, this.cropArea.y, this.cropArea.x, this.cropArea.height);
        // Right area
        this.ctx.fillRect(this.cropArea.x + this.cropArea.width, this.cropArea.y, this.canvas.width - this.cropArea.x - this.cropArea.width, this.cropArea.height);
        
        // Draw crop border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(this.cropArea.x, this.cropArea.y, this.cropArea.width, this.cropArea.height);
        this.ctx.setLineDash([]);
        
        // Draw handles
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        
        for (const handle of this.cropHandles) {
            this.ctx.beginPath();
            this.ctx.arc(handle.x, handle.y, 6, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    // Draw straighten overlay
    drawStraightenOverlay() {
        if (!this.straightenGuide) return;
        
        // Draw guide line
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.straightenGuide.startX, this.straightenGuide.startY);
        this.ctx.lineTo(this.straightenGuide.endX, this.straightenGuide.endY);
        this.ctx.stroke();
        
        // Draw angle indicator
        const centerX = (this.straightenGuide.startX + this.straightenGuide.endX) / 2;
        const centerY = (this.straightenGuide.startY + this.straightenGuide.endY) / 2;
        
        this.ctx.fillStyle = '#ff0000';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`${this.straightenAngle.toFixed(1)}°`, centerX + 10, centerY - 10);
        
        // Draw horizontal reference line
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.straightenGuide.startX - 50, this.straightenGuide.startY);
        this.ctx.lineTo(this.straightenGuide.startX + 50, this.straightenGuide.startY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    // Rotate image
    rotateImage(degrees) {
        this.rotation = (this.rotation + degrees) % 360;
        this.redrawImage();
        this.saveHistory();
    }

    // Flip image
    flipImage(direction) {
        if (direction === 'horizontal') {
            this.flipHorizontal = !this.flipHorizontal;
        } else if (direction === 'vertical') {
            this.flipVertical = !this.flipVertical;
        }
        
        this.redrawImage();
        this.saveHistory();
    }

    // Apply crop
    applyCrop() {
        if (!this.cropArea) return null;
        
        // Create temporary canvas for cropped image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.cropArea.width;
        tempCanvas.height = this.cropArea.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Copy cropped area
        tempCtx.putImageData(
            this.ctx.getImageData(
                this.cropArea.x,
                this.cropArea.y,
                this.cropArea.width,
                this.cropArea.height
            ),
            0,
            0
        );
        
        // Update original image data
        const croppedImageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        this.setOriginalImageData(croppedImageData);
        
        // Clear crop area
        this.cropArea = null;
        this.currentTool = null;
        
        return croppedImageData;
    }

    // Apply straighten
    applyStraighten() {
        if (this.straightenAngle === 0) return;
        
        // Create temporary canvas for straightened image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.originalWidth;
        tempCanvas.height = this.originalHeight;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Apply straighten transformation
        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
        tempCtx.rotate(this.straightenAngle * Math.PI / 180);
        tempCtx.translate(-tempCanvas.width / 2, -tempCanvas.height / 2);
        tempCtx.putImageData(this.originalImageData, 0, 0);
        
        // Get straightened image data
        const straightenedImageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        this.setOriginalImageData(straightenedImageData);
        
        // Clear straighten angle
        this.straightenAngle = 0;
        this.straightenGuide = null;
        this.currentTool = null;
        
        return straightenedImageData;
    }

    // Apply all transformations
    applyAllTransformations() {
        if (!this.originalImageData) return null;
        
        // Create temporary canvas
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.originalWidth;
        tempCanvas.height = this.originalHeight;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Apply transformations
        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
        tempCtx.rotate(this.rotation * Math.PI / 180);
        tempCtx.scale(
            this.flipHorizontal ? -1 : 1,
            this.flipVertical ? -1 : 1
        );
        tempCtx.translate(-tempCanvas.width / 2, -tempCanvas.height / 2);
        
        if (this.straightenAngle !== 0) {
            tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
            tempCtx.rotate(this.straightenAngle * Math.PI / 180);
            tempCtx.translate(-tempCanvas.width / 2, -tempCanvas.height / 2);
        }
        
        tempCtx.putImageData(this.originalImageData, 0, 0);
        
        return tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    }

    // Save history
    saveHistory() {
        const state = {
            rotation: this.rotation,
            flipHorizontal: this.flipHorizontal,
            flipVertical: this.flipVertical,
            cropArea: this.cropArea ? { ...this.cropArea } : null,
            straightenAngle: this.straightenAngle
        };
        
        this.historyStep++;
        this.history = this.history.slice(0, this.historyStep);
        this.history.push(JSON.parse(JSON.stringify(state)));
        
        // Limit history size
        if (this.history.length > 20) {
            this.history.shift();
            this.historyStep--;
        }
    }

    // Undo
    undo() {
        if (this.historyStep > 0) {
            this.historyStep--;
            this.restoreState(this.history[this.historyStep]);
        }
    }

    // Redo
    redo() {
        if (this.historyStep < this.history.length - 1) {
            this.historyStep++;
            this.restoreState(this.history[this.historyStep]);
        }
    }

    // Restore state
    restoreState(state) {
        this.rotation = state.rotation;
        this.flipHorizontal = state.flipHorizontal;
        this.flipVertical = state.flipVertical;
        this.cropArea = state.cropArea ? { ...state.cropArea } : null;
        this.straightenAngle = state.straightenAngle;
        
        if (this.cropArea) {
            this.updateCropHandles();
        }
        
        this.redrawImage();
    }

    // Update tool UI
    updateToolUI() {
        // Update tool buttons
        document.querySelectorAll('[data-transform-tool]').forEach(btn => {
            btn.classList.remove('bg-blue-500', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-700');
        });
        
        const activeBtn = document.querySelector(`[data-transform-tool="${this.currentTool}"]`);
        if (activeBtn) {
            activeBtn.classList.remove('bg-gray-100', 'text-gray-700');
            activeBtn.classList.add('bg-blue-500', 'text-white');
        }
    }

    // Get transformation summary
    getTransformationSummary() {
        return {
            rotation: this.rotation,
            flipHorizontal: this.flipHorizontal,
            flipVertical: this.flipVertical,
            cropArea: this.cropArea,
            straightenAngle: this.straightenAngle,
            hasTransformations: this.rotation !== 0 || this.flipHorizontal || this.flipVertical || this.cropArea || this.straightenAngle !== 0
        };
    }
}

// Export for use in main application
window.ImageTransformTools = ImageTransformTools;
