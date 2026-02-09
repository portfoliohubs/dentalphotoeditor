// Professional Drawing and Annotation Tools for Dental Photo Editor
// Manual outlining, shapes, text, and professional dental annotations

class DrawingTools {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.currentTool = 'pen';
        this.annotations = [];
        this.currentAnnotation = null;
        this.history = [];
        this.historyStep = -1;
        
        // Drawing settings
        this.strokeColor = '#ff0000';
        this.strokeWidth = 2;
        this.fillColor = 'rgba(255, 0, 0, 0.3)';
        this.fontSize = 14;
        this.fontFamily = 'Arial';
        
        // Tool settings
        this.tools = {
            pen: { name: 'Pen', icon: 'fa-pen', cursor: 'crosshair' },
            line: { name: 'Line', icon: 'fa-minus', cursor: 'crosshair' },
            rectangle: { name: 'Rectangle', icon: 'fa-square', cursor: 'crosshair' },
            circle: { name: 'Circle', icon: 'fa-circle', cursor: 'crosshair' },
            arrow: { name: 'Arrow', icon: 'fa-arrow-right', cursor: 'crosshair' },
            text: { name: 'Text', icon: 'fa-font', cursor: 'text' },
            eraser: { name: 'Eraser', icon: 'fa-eraser', cursor: 'grab' },
            select: { name: 'Select', icon: 'fa-mouse-pointer', cursor: 'move' },
            toothNumber: { name: 'Tooth Number', icon: 'fa-hashtag', cursor: 'crosshair' },
            measurement: { name: 'Measurement', icon: 'fa-ruler', cursor: 'crosshair' },
            angle: { name: 'Angle', icon: 'fa-draw-polygon', cursor: 'crosshair' },
            highlight: { name: 'Highlight', icon: 'fa-highlighter', cursor: 'crosshair' }
        };
        
        // Tooth numbering systems
        this.toothNumberingSystems = {
            ada: {
                name: 'ADA (Universal)',
                teeth: this.getADATeeth()
            },
            fdi: {
                name: 'FDI (Two-Digit)',
                teeth: this.getFDITeeth()
            },
            palmer: {
                name: 'Palmer',
                teeth: this.getPalmerTeeth()
            }
        };
        
        this.currentNumberingSystem = 'ada';
    }

    // Initialize drawing tools
    initialize(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Create annotation layer
        this.createAnnotationLayer();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        console.log('Drawing tools initialized');
    }

    // Create separate annotation layer
    createAnnotationLayer() {
        this.annotationCanvas = document.createElement('canvas');
        this.annotationCanvas.id = 'annotationCanvas';
        this.annotationCanvas.style.position = 'absolute';
        this.annotationCanvas.style.top = '0';
        this.annotationCanvas.style.left = '0';
        this.annotationCanvas.style.pointerEvents = 'none';
        this.annotationCanvas.style.zIndex = '10';
        
        // Match main canvas size
        this.annotationCanvas.width = this.canvas.width;
        this.annotationCanvas.height = this.canvas.height;
        
        this.annotationCtx = this.annotationCanvas.getContext('2d');
        
        // Add to canvas container
        this.canvas.parentNode.appendChild(this.annotationCanvas);
    }

    // Setup event listeners
    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', (e) => this.stopDrawing(e));
        this.canvas.addEventListener('mouseout', (e) => this.stopDrawing(e));
        
        // Touch events
        this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e, 'start'));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouch(e, 'move'));
        this.canvas.addEventListener('touchend', (e) => this.handleTouch(e, 'end'));
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // Handle touch events
    handleTouch(e, type) {
        e.preventDefault();
        const touch = e.touches[0] || e.changedTouches[0];
        const rect = this.canvas.getBoundingClientRect();
        const mouseEvent = new MouseEvent(
            type === 'start' ? 'mousedown' : type === 'move' ? 'mousemove' : 'mouseup',
            {
                clientX: touch.clientX,
                clientY: touch.clientY
            }
        );
        
        if (type === 'start') this.startDrawing(mouseEvent);
        else if (type === 'move') this.draw(mouseEvent);
        else if (type === 'end') this.stopDrawing(mouseEvent);
    }

    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                        break;
                    case 'y':
                        e.preventDefault();
                        this.redo();
                        break;
                    case 'a':
                        e.preventDefault();
                        this.selectAll();
                        break;
                    case 'd':
                        e.preventDefault();
                        this.deleteSelected();
                        break;
                }
            } else {
                switch(e.key) {
                    case 'Delete':
                    case 'Backspace':
                        this.deleteSelected();
                        break;
                    case 'Escape':
                        this.cancelCurrentOperation();
                        break;
                    case '1':
                        this.setTool('pen');
                        break;
                    case '2':
                        this.setTool('line');
                        break;
                    case '3':
                        this.setTool('rectangle');
                        break;
                    case '4':
                        this.setTool('circle');
                        break;
                    case '5':
                        this.setTool('arrow');
                        break;
                    case '6':
                        this.setTool('text');
                        break;
                    case '7':
                        this.setTool('toothNumber');
                        break;
                    case '8':
                        this.setTool('measurement');
                        break;
                    case 'e':
                        this.setTool('eraser');
                        break;
                    case 's':
                        this.setTool('select');
                        break;
                }
            }
        });
    }

    // Get mouse position relative to canvas
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
            y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
        };
    }

    // Start drawing
    startDrawing(e) {
        const pos = this.getMousePos(e);
        
        if (this.currentTool === 'text') {
            this.addTextAnnotation(pos);
            return;
        }
        
        if (this.currentTool === 'toothNumber') {
            this.addToothNumber(pos);
            return;
        }
        
        this.isDrawing = true;
        this.startPos = pos;
        this.currentAnnotation = {
            tool: this.currentTool,
            color: this.strokeColor,
            strokeWidth: this.strokeWidth,
            fillColor: this.fillColor,
            points: [pos],
            timestamp: Date.now()
        };
    }

    // Draw
    draw(e) {
        if (!this.isDrawing) return;
        
        const pos = this.getMousePos(e);
        
        if (this.currentTool === 'pen' || this.currentTool === 'highlight') {
            this.currentAnnotation.points.push(pos);
            this.redrawAnnotations();
            this.drawCurrentPath();
        } else if (this.currentTool === 'eraser') {
            this.eraseAt(pos);
        } else {
            // For shapes, update preview
            this.redrawAnnotations();
            this.drawShapePreview(pos);
        }
    }

    // Stop drawing
    stopDrawing(e) {
        if (!this.isDrawing) return;
        
        this.isDrawing = false;
        
        if (this.currentAnnotation && this.currentAnnotation.points.length > 0) {
            this.annotations.push(this.currentAnnotation);
            this.saveHistory();
        }
        
        this.currentAnnotation = null;
        this.redrawAnnotations();
    }

    // Draw current path
    drawCurrentPath() {
        if (!this.currentAnnotation || this.currentAnnotation.points.length < 2) return;
        
        this.annotationCtx.strokeStyle = this.currentAnnotation.color;
        this.annotationCtx.lineWidth = this.currentAnnotation.strokeWidth;
        this.annotationCtx.lineCap = 'round';
        this.annotationCtx.lineJoin = 'round';
        
        if (this.currentTool === 'highlight') {
            this.annotationCtx.globalAlpha = 0.3;
            this.annotationCtx.lineWidth = this.strokeWidth * 3;
        }
        
        this.annotationCtx.beginPath();
        const points = this.currentAnnotation.points;
        this.annotationCtx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            this.annotationCtx.lineTo(points[i].x, points[i].y);
        }
        
        this.annotationCtx.stroke();
        this.annotationCtx.globalAlpha = 1;
    }

    // Draw shape preview
    drawShapePreview(currentPos) {
        if (!this.currentAnnotation) return;
        
        this.annotationCtx.strokeStyle = this.currentAnnotation.color;
        this.annotationCtx.lineWidth = this.currentAnnotation.strokeWidth;
        this.annotationCtx.fillStyle = this.currentAnnotation.fillColor;
        
        const start = this.startPos;
        const end = currentPos;
        
        switch (this.currentTool) {
            case 'line':
                this.annotationCtx.beginPath();
                this.annotationCtx.moveTo(start.x, start.y);
                this.annotationCtx.lineTo(end.x, end.y);
                this.annotationCtx.stroke();
                break;
                
            case 'rectangle':
                const width = end.x - start.x;
                const height = end.y - start.y;
                this.annotationCtx.strokeRect(start.x, start.y, width, height);
                if (this.fillColor !== 'transparent') {
                    this.annotationCtx.fillRect(start.x, start.y, width, height);
                }
                break;
                
            case 'circle':
                const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
                this.annotationCtx.beginPath();
                this.annotationCtx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
                this.annotationCtx.stroke();
                if (this.fillColor !== 'transparent') {
                    this.annotationCtx.fill();
                }
                break;
                
            case 'arrow':
                this.drawArrow(start, end);
                break;
                
            case 'angle':
                if (this.currentAnnotation.points.length === 2) {
                    this.currentAnnotation.points.push(currentPos);
                    this.drawAngle(this.currentAnnotation.points[0], this.currentAnnotation.points[1], currentPos);
                } else {
                    this.currentAnnotation.points = [start, currentPos];
                }
                break;
        }
    }

    // Draw arrow
    drawArrow(start, end) {
        const headLength = 15;
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        
        // Draw line
        this.annotationCtx.beginPath();
        this.annotationCtx.moveTo(start.x, start.y);
        this.annotationCtx.lineTo(end.x, end.y);
        this.annotationCtx.stroke();
        
        // Draw arrowhead
        this.annotationCtx.beginPath();
        this.annotationCtx.moveTo(end.x, end.y);
        this.annotationCtx.lineTo(
            end.x - headLength * Math.cos(angle - Math.PI / 6),
            end.y - headLength * Math.sin(angle - Math.PI / 6)
        );
        this.annotationCtx.moveTo(end.x, end.y);
        this.annotationCtx.lineTo(
            end.x - headLength * Math.cos(angle + Math.PI / 6),
            end.y - headLength * Math.sin(angle + Math.PI / 6)
        );
        this.annotationCtx.stroke();
    }

    // Draw angle
    drawAngle(point1, vertex, point2) {
        const angle1 = Math.atan2(point1.y - vertex.y, point1.x - vertex.x);
        const angle2 = Math.atan2(point2.y - vertex.y, point2.x - vertex.x);
        
        // Draw lines
        this.annotationCtx.beginPath();
        this.annotationCtx.moveTo(point1.x, point1.y);
        this.annotationCtx.lineTo(vertex.x, vertex.y);
        this.annotationCtx.lineTo(point2.x, point2.y);
        this.annotationCtx.stroke();
        
        // Draw angle arc
        const radius = 30;
        this.annotationCtx.beginPath();
        this.annotationCtx.arc(vertex.x, vertex.y, radius, angle1, angle2);
        this.annotationCtx.stroke();
        
        // Calculate and display angle
        const angleDegrees = Math.abs(angle2 - angle1) * 180 / Math.PI;
        this.annotationCtx.fillStyle = this.strokeColor;
        this.annotationCtx.font = '12px Arial';
        this.annotationCtx.fillText(
            angleDegrees.toFixed(1) + '°',
            vertex.x + radius + 10,
            vertex.y - 10
        );
    }

    // Add text annotation
    addTextAnnotation(pos) {
        const text = prompt('Enter text:');
        if (!text) return;
        
        const annotation = {
            tool: 'text',
            text: text,
            x: pos.x,
            y: pos.y,
            color: this.strokeColor,
            fontSize: this.fontSize,
            fontFamily: this.fontFamily,
            timestamp: Date.now()
        };
        
        this.annotations.push(annotation);
        this.saveHistory();
        this.redrawAnnotations();
    }

    // Add tooth number
    addToothNumber(pos) {
        const system = this.toothNumberingSystems[this.currentNumberingSystem];
        const teeth = system.teeth;
        
        // Create simple tooth selection dialog
        const toothNumber = prompt(`Enter tooth number (${system.name} system):`);
        if (!toothNumber) return;
        
        const annotation = {
            tool: 'toothNumber',
            toothNumber: toothNumber,
            system: this.currentNumberingSystem,
            x: pos.x,
            y: pos.y,
            color: this.strokeColor,
            fontSize: this.fontSize + 4,
            timestamp: Date.now()
        };
        
        this.annotations.push(annotation);
        this.saveHistory();
        this.redrawAnnotations();
    }

    // Erase at position
    eraseAt(pos) {
        const eraseRadius = this.strokeWidth * 5;
        
        this.annotations = this.annotations.filter(annotation => {
            if (annotation.tool === 'pen' || annotation.tool === 'highlight') {
                // Check if any point is within erase radius
                return !annotation.points.some(point => {
                    const distance = Math.sqrt(
                        Math.pow(point.x - pos.x, 2) + 
                        Math.pow(point.y - pos.y, 2)
                    );
                    return distance < eraseRadius;
                });
            }
            return true;
        });
        
        this.redrawAnnotations();
    }

    // Redraw all annotations
    redrawAnnotations() {
        this.annotationCtx.clearRect(0, 0, this.annotationCanvas.width, this.annotationCanvas.height);
        
        this.annotations.forEach(annotation => {
            this.drawAnnotation(annotation);
        });
    }

    // Draw single annotation
    drawAnnotation(annotation) {
        this.annotationCtx.save();
        
        switch (annotation.tool) {
            case 'pen':
                this.drawPath(annotation);
                break;
            case 'line':
                this.drawLine(annotation);
                break;
            case 'rectangle':
                this.drawRectangle(annotation);
                break;
            case 'circle':
                this.drawCircle(annotation);
                break;
            case 'arrow':
                this.drawArrowAnnotation(annotation);
                break;
            case 'text':
                this.drawText(annotation);
                break;
            case 'toothNumber':
                this.drawToothNumber(annotation);
                break;
            case 'measurement':
                this.drawMeasurement(annotation);
                break;
            case 'angle':
                this.drawAngleAnnotation(annotation);
                break;
            case 'highlight':
                this.drawHighlight(annotation);
                break;
        }
        
        this.annotationCtx.restore();
    }

    // Draw path
    drawPath(annotation) {
        if (annotation.points.length < 2) return;
        
        this.annotationCtx.strokeStyle = annotation.color;
        this.annotationCtx.lineWidth = annotation.strokeWidth;
        this.annotationCtx.lineCap = 'round';
        this.annotationCtx.lineJoin = 'round';
        
        this.annotationCtx.beginPath();
        this.annotationCtx.moveTo(annotation.points[0].x, annotation.points[0].y);
        
        for (let i = 1; i < annotation.points.length; i++) {
            this.annotationCtx.lineTo(annotation.points[i].x, annotation.points[i].y);
        }
        
        this.annotationCtx.stroke();
    }

    // Draw line
    drawLine(annotation) {
        this.annotationCtx.strokeStyle = annotation.color;
        this.annotationCtx.lineWidth = annotation.strokeWidth;
        
        this.annotationCtx.beginPath();
        this.annotationCtx.moveTo(annotation.points[0].x, annotation.points[0].y);
        this.annotationCtx.lineTo(annotation.points[1].x, annotation.points[1].y);
        this.annotationCtx.stroke();
    }

    // Draw rectangle
    drawRectangle(annotation) {
        this.annotationCtx.strokeStyle = annotation.color;
        this.annotationCtx.lineWidth = annotation.strokeWidth;
        this.annotationCtx.fillStyle = annotation.fillColor;
        
        const start = annotation.points[0];
        const end = annotation.points[1];
        const width = end.x - start.x;
        const height = end.y - start.y;
        
        this.annotationCtx.strokeRect(start.x, start.y, width, height);
        if (annotation.fillColor !== 'transparent') {
            this.annotationCtx.fillRect(start.x, start.y, width, height);
        }
    }

    // Draw circle
    drawCircle(annotation) {
        this.annotationCtx.strokeStyle = annotation.color;
        this.annotationCtx.lineWidth = annotation.strokeWidth;
        this.annotationCtx.fillStyle = annotation.fillColor;
        
        const start = annotation.points[0];
        const end = annotation.points[1];
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        
        this.annotationCtx.beginPath();
        this.annotationCtx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        this.annotationCtx.stroke();
        if (annotation.fillColor !== 'transparent') {
            this.annotationCtx.fill();
        }
    }

    // Draw arrow annotation
    drawArrowAnnotation(annotation) {
        this.annotationCtx.strokeStyle = annotation.color;
        this.annotationCtx.lineWidth = annotation.strokeWidth;
        
        this.drawArrow(annotation.points[0], annotation.points[1]);
    }

    // Draw text
    drawText(annotation) {
        this.annotationCtx.fillStyle = annotation.color;
        this.annotationCtx.font = `${annotation.fontSize}px ${annotation.fontFamily}`;
        this.annotationCtx.fillText(annotation.text, annotation.x, annotation.y);
    }

    // Draw tooth number
    drawToothNumber(annotation) {
        this.annotationCtx.fillStyle = annotation.color;
        this.annotationCtx.strokeStyle = 'white';
        this.annotationCtx.lineWidth = 3;
        this.annotationCtx.font = `bold ${annotation.fontSize}px Arial`;
        
        const text = `#${annotation.toothNumber}`;
        
        // Draw white outline
        this.annotationCtx.strokeText(text, annotation.x, annotation.y);
        // Draw text
        this.annotationCtx.fillText(text, annotation.x, annotation.y);
    }

    // Draw measurement
    drawMeasurement(annotation) {
        this.annotationCtx.strokeStyle = annotation.color;
        this.annotationCtx.fillStyle = annotation.color;
        this.annotationCtx.lineWidth = annotation.strokeWidth;
        
        const start = annotation.points[0];
        const end = annotation.points[1];
        
        // Draw line
        this.annotationCtx.beginPath();
        this.annotationCtx.moveTo(start.x, start.y);
        this.annotationCtx.lineTo(end.x, end.y);
        this.annotationCtx.stroke();
        
        // Calculate distance
        const pixels = Math.sqrt(
            Math.pow(end.x - start.x, 2) + 
            Math.pow(end.y - start.y, 2)
        );
        
        // Convert to mm (assuming calibration)
        const mm = (pixels / 100).toFixed(1); // Default 100px = 1mm
        
        // Draw measurement text
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        this.annotationCtx.font = '12px Arial';
        this.annotationCtx.fillText(`${mm}mm`, midX, midY - 10);
    }

    // Draw angle annotation
    drawAngleAnnotation(annotation) {
        this.drawAngle(annotation.points[0], annotation.points[1], annotation.points[2]);
    }

    // Draw highlight
    drawHighlight(annotation) {
        this.annotationCtx.globalAlpha = 0.3;
        this.annotationCtx.strokeStyle = annotation.color;
        this.annotationCtx.lineWidth = annotation.strokeWidth * 3;
        this.annotationCtx.lineCap = 'round';
        this.annotationCtx.lineJoin = 'round';
        
        this.annotationCtx.beginPath();
        this.annotationCtx.moveTo(annotation.points[0].x, annotation.points[0].y);
        
        for (let i = 1; i < annotation.points.length; i++) {
            this.annotationCtx.lineTo(annotation.points[i].x, annotation.points[i].y);
        }
        
        this.annotationCtx.stroke();
        this.annotationCtx.globalAlpha = 1;
    }

    // Get ADA teeth numbering
    getADATeeth() {
        return {
            adult: {
                maxillary: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
                mandibular: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]
            },
            primary: {
                maxillary: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
                mandibular: ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T']
            }
        };
    }

    // Get FDI teeth numbering
    getFDITeeth() {
        return {
            adult: {
                maxillary: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
                mandibular: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
            },
            primary: {
                maxillary: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
                mandibular: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75]
            }
        };
    }

    // Get Palmer teeth numbering
    getPalmerTeeth() {
        return {
            adult: {
                maxillary: ['8┘', '7┘', '6┘', '5┘', '4┘', '3┘', '2┘', '1┘', '1┐', '2┐', '3┐', '4┐', '5┐', '6┐', '7┐', '8┐'],
                mandibular: ['8┙', '7┙', '6┙', '5┙', '4┙', '3┙', '2┙', '1┙', '1└', '2└', '3└', '4└', '5└', '6└', '7└', '8└']
            }
        };
    }

    // Set current tool
    setTool(tool) {
        this.currentTool = tool;
        this.canvas.style.cursor = this.tools[tool].cursor;
        
        // Update UI
        this.updateToolUI();
        
        // Announce for accessibility
        if (window.accessibilityManager) {
            window.accessibilityManager.announce(`Tool changed to ${this.tools[tool].name}`);
        }
    }

    // Update tool UI
    updateToolUI() {
        // Update tool buttons
        document.querySelectorAll('[data-tool]').forEach(btn => {
            btn.classList.remove('bg-blue-500', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-700');
        });
        
        const activeBtn = document.querySelector(`[data-tool="${this.currentTool}"]`);
        if (activeBtn) {
            activeBtn.classList.remove('bg-gray-100', 'text-gray-700');
            activeBtn.classList.add('bg-blue-500', 'text-white');
        }
    }

    // Set stroke color
    setStrokeColor(color) {
        this.strokeColor = color;
    }

    // Set stroke width
    setStrokeWidth(width) {
        this.strokeWidth = width;
    }

    // Set fill color
    setFillColor(color) {
        this.fillColor = color;
    }

    // Undo
    undo() {
        if (this.historyStep > 0) {
            this.historyStep--;
            this.annotations = JSON.parse(JSON.stringify(this.history[this.historyStep]));
            this.redrawAnnotations();
        }
    }

    // Redo
    redo() {
        if (this.historyStep < this.history.length - 1) {
            this.historyStep++;
            this.annotations = JSON.parse(JSON.stringify(this.history[this.historyStep]));
            this.redrawAnnotations();
        }
    }

    // Save history
    saveHistory() {
        this.historyStep++;
        this.history = this.history.slice(0, this.historyStep);
        this.history.push(JSON.parse(JSON.stringify(this.annotations)));
        
        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
            this.historyStep--;
        }
    }

    // Clear all annotations
    clearAll() {
        if (confirm('Clear all annotations?')) {
            this.annotations = [];
            this.saveHistory();
            this.redrawAnnotations();
        }
    }

    // Delete selected annotations
    deleteSelected() {
        // Implementation for selection and deletion
        this.annotations = this.annotations.filter(annotation => !annotation.selected);
        this.saveHistory();
        this.redrawAnnotations();
    }

    // Select all annotations
    selectAll() {
        this.annotations.forEach(annotation => {
            annotation.selected = true;
        });
        this.redrawAnnotations();
    }

    // Cancel current operation
    cancelCurrentOperation() {
        this.isDrawing = false;
        this.currentAnnotation = null;
        this.redrawAnnotations();
    }

    // Export annotations
    exportAnnotations() {
        return {
            annotations: this.annotations,
            settings: {
                strokeColor: this.strokeColor,
                strokeWidth: this.strokeWidth,
                fillColor: this.fillColor,
                fontSize: this.fontSize,
                fontFamily: this.fontFamily
            },
            timestamp: Date.now()
        };
    }

    // Import annotations
    importAnnotations(data) {
        this.annotations = data.annotations || [];
        this.strokeColor = data.settings?.strokeColor || '#ff0000';
        this.strokeWidth = data.settings?.strokeWidth || 2;
        this.fillColor = data.settings?.fillColor || 'rgba(255, 0, 0, 0.3)';
        this.fontSize = data.settings?.fontSize || 14;
        this.fontFamily = data.settings?.fontFamily || 'Arial';
        
        this.saveHistory();
        this.redrawAnnotations();
    }

    // Resize annotation canvas
    resize(newWidth, newHeight) {
        const oldWidth = this.annotationCanvas.width;
        const oldHeight = this.annotationCanvas.height;
        
        this.annotationCanvas.width = newWidth;
        this.annotationCanvas.height = newHeight;
        
        // Scale annotations
        const scaleX = newWidth / oldWidth;
        const scaleY = newHeight / oldHeight;
        
        this.annotations.forEach(annotation => {
            if (annotation.points) {
                annotation.points.forEach(point => {
                    point.x *= scaleX;
                    point.y *= scaleY;
                });
            }
            if (annotation.x !== undefined) {
                annotation.x *= scaleX;
            }
            if (annotation.y !== undefined) {
                annotation.y *= scaleY;
            }
        });
        
        this.redrawAnnotations();
    }

    // Get annotation summary
    getAnnotationSummary() {
        const summary = {
            total: this.annotations.length,
            byType: {}
        };
        
        this.annotations.forEach(annotation => {
            summary.byType[annotation.tool] = (summary.byType[annotation.tool] || 0) + 1;
        });
        
        return summary;
    }
}

// Export for use in main application
window.DrawingTools = DrawingTools;
