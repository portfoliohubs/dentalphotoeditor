// Professional Measurement and Calibration Tools for Dental Photo Editor
// Distance, angle, area measurements with calibration and professional accuracy

class MeasurementTools {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Calibration
        this.calibration = {
            isCalibrated: false,
            scale: 1, // pixels per mm
            referenceLength: null,
            referencePixels: null,
            unit: 'mm'
        };
        
        // Measurements
        this.measurements = [];
        this.currentMeasurement = null;
        this.isMeasuring = false;
        this.measurementType = 'distance';
        
        // Measurement types
        this.measurementTypes = {
            distance: { name: 'Distance', icon: 'fa-ruler-horizontal' },
            angle: { name: 'Angle', icon: 'fa-draw-polygon' },
            area: { name: 'Area', icon: 'fa-vector-square' },
            perimeter: { name: 'Perimeter', icon: 'fa-circle-notch' },
            radius: { name: 'Radius', icon: 'fa-circle' },
            diameter: { name: 'Diameter', icon: 'fa-arrows-alt-h' }
        };
        
        // Measurement settings
        this.settings = {
            precision: 2,
            showLabels: true,
            showGrid: false,
            snapToGrid: false,
            gridSize: 10,
            lineColor: '#ff0000',
            lineWidth: 2,
            fontSize: 12,
            fontFamily: 'Arial'
        };
        
        // Grid
        this.grid = {
            visible: false,
            size: 10,
            color: 'rgba(200, 200, 200, 0.3)'
        };
        
        // History
        this.history = [];
        this.historyStep = -1;
        
        this.initialize();
    }

    // Initialize measurement tools
    initialize() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        
        console.log('Measurement tools initialized');
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
                    case 'm':
                        e.preventDefault();
                        this.setMeasurementType('distance');
                        break;
                    case 'a':
                        e.preventDefault();
                        this.setMeasurementType('angle');
                        break;
                    case 'g':
                        e.preventDefault();
                        this.toggleGrid();
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
            } else {
                switch(e.key) {
                    case 'Escape':
                        this.cancelCurrentMeasurement();
                        break;
                    case 'Delete':
                    case 'Backspace':
                        this.deleteLastMeasurement();
                        break;
                    case 'c':
                        this.startCalibration();
                        break;
                }
            }
        });
    }

    // Get mouse position
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
            y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
        };
    }

    // Handle mouse down
    handleMouseDown(e) {
        const pos = this.getMousePos(e);
        
        if (this.calibration.isCalibrating) {
            this.handleCalibrationClick(pos);
        } else {
            this.startMeasurement(pos);
        }
    }

    // Handle mouse move
    handleMouseMove(e) {
        const pos = this.getMousePos(e);
        
        if (this.isMeasuring && this.currentMeasurement) {
            this.updateMeasurement(pos);
        }
        
        // Update cursor
        this.updateCursor(pos);
        
        // Show coordinates
        this.updateCoordinateDisplay(pos);
    }

    // Handle mouse up
    handleMouseUp(e) {
        if (this.isMeasuring) {
            this.finishMeasurement();
        }
    }

    // Handle touch events
    handleTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const pos = this.getMousePos(touch);
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

    // Start calibration
    startCalibration() {
        this.calibration.isCalibrating = true;
        this.calibration.calibrationPoints = [];
        
        if (typeof showToast === 'function') {
            showToast('Click two points to set calibration reference');
        }
        
        if (window.accessibilityManager) {
            window.accessibilityManager.announce('Calibration mode: Click two points to set reference length');
        }
    }

    // Handle calibration click
    handleCalibrationClick(pos) {
        if (!this.calibration.calibrationPoints) {
            this.calibration.calibrationPoints = [];
        }
        
        this.calibration.calibrationPoints.push(pos);
        
        // Draw calibration point
        this.drawCalibrationPoint(pos, this.calibration.calibrationPoints.length);
        
        if (this.calibration.calibrationPoints.length === 2) {
            // Complete calibration
            const length = this.calculateDistance(
                this.calibration.calibrationPoints[0],
                this.calibration.calibrationPoints[1]
            );
            
            const referenceLength = prompt('Enter reference length (mm):', '10');
            if (referenceLength && !isNaN(referenceLength)) {
                this.calibration.scale = length / parseFloat(referenceLength);
                this.calibration.referenceLength = parseFloat(referenceLength);
                this.calibration.referencePixels = length;
                this.calibration.isCalibrated = true;
                this.calibration.isCalibrating = false;
                
                if (typeof showToast === 'function') {
                    showToast(`Calibrated: ${referenceLength}mm = ${length.toFixed(1)}px`);
                }
                
                this.saveHistory();
            } else {
                // Cancel calibration
                this.calibration.isCalibrating = false;
                this.calibration.calibrationPoints = [];
            }
            
            this.redrawMeasurements();
        }
    }

    // Draw calibration point
    drawCalibrationPoint(pos, number) {
        this.ctx.save();
        this.ctx.fillStyle = '#00ff00';
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;
        
        // Draw circle
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, 8, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Draw number
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(number.toString(), pos.x, pos.y);
        
        this.ctx.restore();
    }

    // Start measurement
    startMeasurement(pos) {
        this.isMeasuring = true;
        this.currentMeasurement = {
            type: this.measurementType,
            points: [pos],
            timestamp: Date.now()
        };
        
        switch (this.measurementType) {
            case 'distance':
                this.currentMeasurement.startPoint = pos;
                break;
            case 'angle':
                this.currentMeasurement.vertex = pos;
                break;
            case 'area':
                this.currentMeasurement.polygon = [pos];
                break;
            case 'radius':
            case 'diameter':
                this.currentMeasurement.center = pos;
                break;
        }
    }

    // Update measurement
    updateMeasurement(pos) {
        if (!this.currentMeasurement) return;
        
        switch (this.measurementType) {
            case 'distance':
                this.currentMeasurement.endPoint = pos;
                break;
            case 'angle':
                if (this.currentMeasurement.points.length === 1) {
                    this.currentMeasurement.points.push(pos);
                } else {
                    this.currentMeasurement.points[1] = pos;
                }
                break;
            case 'area':
                this.currentMeasurement.polygon.push(pos);
                break;
            case 'radius':
            case 'diameter':
                this.currentMeasurement.radius = this.calculateDistance(
                    this.currentMeasurement.center, pos
                );
                break;
        }
        
        this.redrawMeasurements();
        this.drawCurrentMeasurement();
    }

    // Finish measurement
    finishMeasurement() {
        if (!this.currentMeasurement) return;
        
        // Calculate measurement value
        this.calculateMeasurementValue();
        
        // Add to measurements list
        this.measurements.push(this.currentMeasurement);
        
        // Save history
        this.saveHistory();
        
        // Reset current measurement
        this.currentMeasurement = null;
        this.isMeasuring = false;
        
        this.redrawMeasurements();
    }

    // Calculate measurement value
    calculateMeasurementValue() {
        if (!this.currentMeasurement) return;
        
        switch (this.measurementType) {
            case 'distance':
                this.currentMeasurement.value = this.calculateDistance(
                    this.currentMeasurement.startPoint,
                    this.currentMeasurement.endPoint
                );
                break;
                
            case 'angle':
                if (this.currentMeasurement.points.length >= 2) {
                    this.currentMeasurement.value = this.calculateAngle(
                        this.currentMeasurement.points[0],
                        this.currentMeasurement.points[1],
                        this.currentMeasurement.points[2] || this.currentMeasurement.points[1]
                    );
                }
                break;
                
            case 'area':
                if (this.currentMeasurement.polygon && this.currentMeasurement.polygon.length >= 3) {
                    this.currentMeasurement.value = this.calculateArea(this.currentMeasurement.polygon);
                }
                break;
                
            case 'perimeter':
                if (this.currentMeasurement.polygon && this.currentMeasurement.polygon.length >= 2) {
                    this.currentMeasurement.value = this.calculatePerimeter(this.currentMeasurement.polygon);
                }
                break;
                
            case 'radius':
                this.currentMeasurement.value = this.currentMeasurement.radius;
                break;
                
            case 'diameter':
                this.currentMeasurement.value = this.currentMeasurement.radius * 2;
                break;
        }
        
        // Convert to real units if calibrated
        if (this.calibration.isCalibrated) {
            this.currentMeasurement.realValue = this.currentMeasurement.value / this.calibration.scale;
            this.currentMeasurement.unit = this.calibration.unit;
        } else {
            this.currentMeasurement.realValue = this.currentMeasurement.value;
            this.currentMeasurement.unit = 'px';
        }
    }

    // Calculate distance between two points
    calculateDistance(point1, point2) {
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Calculate angle between three points
    calculateAngle(point1, vertex, point2) {
        const angle1 = Math.atan2(point1.y - vertex.y, point1.x - vertex.x);
        const angle2 = Math.atan2(point2.y - vertex.y, point2.x - vertex.x);
        
        let angle = Math.abs(angle2 - angle1) * 180 / Math.PI;
        
        // Ensure angle is <= 180
        if (angle > 180) {
            angle = 360 - angle;
        }
        
        return angle;
    }

    // Calculate area of polygon
    calculateArea(polygon) {
        if (polygon.length < 3) return 0;
        
        let area = 0;
        for (let i = 0; i < polygon.length; i++) {
            const j = (i + 1) % polygon.length;
            area += polygon[i].x * polygon[j].y;
            area -= polygon[j].x * polygon[i].y;
        }
        
        return Math.abs(area / 2);
    }

    // Calculate perimeter of polygon
    calculatePerimeter(polygon) {
        if (polygon.length < 2) return 0;
        
        let perimeter = 0;
        for (let i = 0; i < polygon.length; i++) {
            const j = (i + 1) % polygon.length;
            perimeter += this.calculateDistance(polygon[i], polygon[j]);
        }
        
        return perimeter;
    }

    // Draw current measurement
    drawCurrentMeasurement() {
        if (!this.currentMeasurement) return;
        
        this.ctx.save();
        this.ctx.strokeStyle = this.settings.lineColor;
        this.ctx.lineWidth = this.settings.lineWidth;
        this.ctx.fillStyle = this.settings.lineColor;
        this.ctx.font = `${this.settings.fontSize}px ${this.settings.fontFamily}`;
        
        switch (this.measurementType) {
            case 'distance':
                this.drawDistanceMeasurement(this.currentMeasurement);
                break;
            case 'angle':
                this.drawAngleMeasurement(this.currentMeasurement);
                break;
            case 'area':
                this.drawAreaMeasurement(this.currentMeasurement);
                break;
            case 'radius':
            case 'diameter':
                this.drawRadiusMeasurement(this.currentMeasurement);
                break;
        }
        
        this.ctx.restore();
    }

    // Draw distance measurement
    drawDistanceMeasurement(measurement) {
        if (!measurement.startPoint || !measurement.endPoint) return;
        
        // Draw line
        this.ctx.beginPath();
        this.ctx.moveTo(measurement.startPoint.x, measurement.startPoint.y);
        this.ctx.lineTo(measurement.endPoint.x, measurement.endPoint.y);
        this.ctx.stroke();
        
        // Draw endpoints
        this.drawPoint(measurement.startPoint);
        this.drawPoint(measurement.endPoint);
        
        // Draw label
        const midX = (measurement.startPoint.x + measurement.endPoint.x) / 2;
        const midY = (measurement.startPoint.y + measurement.endPoint.y) / 2;
        
        const value = measurement.realValue || measurement.value;
        const unit = measurement.unit || 'px';
        const label = `${value.toFixed(this.settings.precision)} ${unit}`;
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        
        // Draw background for label
        const textWidth = this.ctx.measureText(label).width;
        this.ctx.fillRect(midX - textWidth/2 - 4, midY - 10, textWidth + 8, 16);
        this.ctx.strokeRect(midX - textWidth/2 - 4, midY - 10, textWidth + 8, 16);
        
        // Draw text
        this.ctx.fillStyle = '#000000';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(label, midX, midY);
    }

    // Draw angle measurement
    drawAngleMeasurement(measurement) {
        if (measurement.points.length < 2) return;
        
        const vertex = measurement.points[0];
        const point1 = measurement.points[1];
        const point2 = measurement.points[2] || measurement.points[1];
        
        // Draw lines
        this.ctx.beginPath();
        this.ctx.moveTo(point1.x, point1.y);
        this.ctx.lineTo(vertex.x, vertex.y);
        this.ctx.lineTo(point2.x, point2.y);
        this.ctx.stroke();
        
        // Draw angle arc
        const radius = 30;
        const angle1 = Math.atan2(point1.y - vertex.y, point1.x - vertex.x);
        const angle2 = Math.atan2(point2.y - vertex.y, point2.x - vertex.x);
        
        this.ctx.beginPath();
        this.ctx.arc(vertex.x, vertex.y, radius, angle1, angle2);
        this.ctx.stroke();
        
        // Draw angle label
        const value = measurement.realValue || measurement.value;
        const unit = measurement.unit || 'px';
        const label = `${value.toFixed(this.settings.precision)}°`;
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        
        const textX = vertex.x + radius + 10;
        const textY = vertex.y - 10;
        const textWidth = this.ctx.measureText(label).width;
        
        this.ctx.fillRect(textX - 2, textY - 8, textWidth + 4, 12);
        this.ctx.strokeRect(textX - 2, textY - 8, textWidth + 4, 12);
        
        this.ctx.fillStyle = '#000000';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(label, textX, textY);
    }

    // Draw area measurement
    drawAreaMeasurement(measurement) {
        if (!measurement.polygon || measurement.polygon.length < 3) return;
        
        // Draw polygon
        this.ctx.beginPath();
        this.ctx.moveTo(measurement.polygon[0].x, measurement.polygon[0].y);
        for (let i = 1; i < measurement.polygon.length; i++) {
            this.ctx.lineTo(measurement.polygon[i].x, measurement.polygon[i].y);
        }
        this.ctx.closePath();
        
        // Fill with semi-transparent color
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        this.ctx.fill();
        
        // Draw outline
        this.ctx.stroke();
        
        // Draw vertices
        measurement.polygon.forEach(point => {
            this.drawPoint(point);
        });
        
        // Draw area label
        const centerX = measurement.polygon.reduce((sum, p) => sum + p.x, 0) / measurement.polygon.length;
        const centerY = measurement.polygon.reduce((sum, p) => sum + p.y, 0) / measurement.polygon.length;
        
        const value = measurement.realValue || measurement.value;
        const unit = measurement.unit || 'px²';
        const label = `${value.toFixed(this.settings.precision)} ${unit}`;
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        
        const textWidth = this.ctx.measureText(label).width;
        this.ctx.fillRect(centerX - textWidth/2 - 4, centerY - 8, textWidth + 8, 12);
        this.ctx.strokeRect(centerX - textWidth/2 - 4, centerY - 8, textWidth + 8, 12);
        
        this.ctx.fillStyle = '#000000';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(label, centerX, centerY);
    }

    // Draw radius measurement
    drawRadiusMeasurement(measurement) {
        if (!measurement.center || !measurement.radius) return;
        
        // Draw circle
        this.ctx.beginPath();
        this.ctx.arc(measurement.center.x, measurement.center.y, measurement.radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Draw center point
        this.drawPoint(measurement.center);
        
        // Draw radius line
        const edgePoint = {
            x: measurement.center.x + measurement.radius,
            y: measurement.center.y
        };
        this.ctx.beginPath();
        this.ctx.moveTo(measurement.center.x, measurement.center.y);
        this.ctx.lineTo(edgePoint.x, edgePoint.y);
        this.ctx.stroke();
        
        // Draw edge point
        this.drawPoint(edgePoint);
        
        // Draw label
        const value = measurement.realValue || measurement.radius;
        const unit = measurement.unit || 'px';
        const label = `${value.toFixed(this.settings.precision)} ${unit}`;
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        
        const textWidth = this.ctx.measureText(label).width;
        this.ctx.fillRect(edgePoint.x + 10 - 2, edgePoint.y - 8, textWidth + 4, 12);
        this.ctx.strokeRect(edgePoint.x + 10 - 2, edgePoint.y - 8, textWidth + 4, 12);
        
        this.ctx.fillStyle = '#000000';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(label, edgePoint.x + 10, edgePoint);
    }

    // Draw point
    drawPoint(point) {
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    // Redraw all measurements
    redrawMeasurements() {
        // Clear measurement layer (if separate canvas)
        // For now, we'll assume measurements are drawn on main canvas
        
        // Draw grid if enabled
        if (this.grid.visible) {
            this.drawGrid();
        }
        
        // Draw all saved measurements
        this.measurements.forEach(measurement => {
            this.drawMeasurement(measurement);
        });
    }

    // Draw individual measurement
    drawMeasurement(measurement) {
        this.ctx.save();
        this.ctx.strokeStyle = this.settings.lineColor;
        this.ctx.lineWidth = this.settings.lineWidth;
        this.ctx.fillStyle = this.settings.lineColor;
        this.ctx.font = `${this.settings.fontSize}px ${this.settings.fontFamily}`;
        
        switch (measurement.type) {
            case 'distance':
                this.drawDistanceMeasurement(measurement);
                break;
            case 'angle':
                this.drawAngleMeasurement(measurement);
                break;
            case 'area':
                this.drawAreaMeasurement(measurement);
                break;
            case 'perimeter':
                this.drawPerimeterMeasurement(measurement);
                break;
            case 'radius':
            case 'diameter':
                this.drawRadiusMeasurement(measurement);
                break;
        }
        
        this.ctx.restore();
    }

    // Draw perimeter measurement
    drawPerimeterMeasurement(measurement) {
        if (!measurement.polygon || measurement.polygon.length < 2) return;
        
        // Draw polygon
        this.ctx.beginPath();
        this.ctx.moveTo(measurement.polygon[0].x, measurement.polygon[0].y);
        for (let i = 1; i < measurement.polygon.length; i++) {
            this.ctx.lineTo(measurement.polygon[i].x, measurement.polygon[i].y);
        }
        this.ctx.stroke();
        
        // Draw vertices
        measurement.polygon.forEach(point => {
            this.drawPoint(point);
        });
        
        // Draw perimeter label
        const centerX = measurement.polygon.reduce((sum, p) => sum + p.x, 0) / measurement.polygon.length;
        const centerY = measurement.polygon.reduce((sum, p) => sum + p.y, 0) / measurement.polygon.length;
        
        const value = measurement.realValue || measurement.value;
        const unit = measurement.unit || 'px';
        const label = `${value.toFixed(this.settings.precision)} ${unit}`;
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        
        const textWidth = this.ctx.measureText(label).width;
        this.ctx.fillRect(centerX - textWidth/2 - 4, centerY - 8, textWidth + 8, 12);
        this.ctx.strokeRect(centerX - textWidth/2 - 4, centerY - 8, textWidth + 8, 12);
        
        this.ctx.fillStyle = '#000000';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(label, centerX, centerY);
    }

    // Draw grid
    drawGrid() {
        this.ctx.save();
        this.ctx.strokeStyle = this.grid.color;
        this.ctx.lineWidth = 1;
        
        // Draw vertical lines
        for (let x = 0; x <= this.canvas.width; x += this.grid.size) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= this.canvas.height; y += this.grid.size) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }

    // Update cursor
    updateCursor(pos) {
        if (this.calibration.isCalibrating) {
            this.canvas.style.cursor = 'crosshair';
        } else if (this.isMeasuring) {
            this.canvas.style.cursor = 'crosshair';
        } else {
            this.canvas.style.cursor = 'default';
        }
    }

    // Update coordinate display
    updateCoordinateDisplay(pos) {
        const coordDisplay = document.getElementById('coordinateDisplay');
        if (coordDisplay) {
            let x = pos.x;
            let y = pos.y;
            let unit = 'px';
            
            if (this.calibration.isCalibrated) {
                x = (pos.x / this.calibration.scale).toFixed(1);
                y = (pos.y / this.calibration.scale).toFixed(1);
                unit = this.calibration.unit;
            }
            
            coordDisplay.textContent = `X: ${x} ${unit}, Y: ${y} ${unit}`;
        }
    }

    // Set measurement type
    setMeasurementType(type) {
        this.measurementType = type;
        this.cancelCurrentMeasurement();
        
        // Update UI
        this.updateMeasurementTypeUI();
        
        if (window.accessibilityManager) {
            window.accessibilityManager.announce(`Measurement type changed to ${this.measurementTypes[type].name}`);
        }
    }

    // Toggle grid
    toggleGrid() {
        this.grid.visible = !this.grid.visible;
        this.redrawMeasurements();
        
        if (typeof showToast === 'function') {
            showToast(`Grid ${this.grid.visible ? 'enabled' : 'disabled'}`);
        }
    }

    // Cancel current measurement
    cancelCurrentMeasurement() {
        this.isMeasuring = false;
        this.currentMeasurement = null;
        this.redrawMeasurements();
    }

    // Delete last measurement
    deleteLastMeasurement() {
        if (this.measurements.length > 0) {
            this.measurements.pop();
            this.saveHistory();
            this.redrawMeasurements();
        }
    }

    // Clear all measurements
    clearAllMeasurements() {
        if (confirm('Clear all measurements?')) {
            this.measurements = [];
            this.saveHistory();
            this.redrawMeasurements();
        }
    }

    // Save history
    saveHistory() {
        const state = {
            measurements: JSON.parse(JSON.stringify(this.measurements)),
            calibration: JSON.parse(JSON.stringify(this.calibration))
        };
        
        this.historyStep++;
        this.history = this.history.slice(0, this.historyStep);
        this.history.push(state);
        
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
        this.measurements = JSON.parse(JSON.stringify(state.measurements));
        this.calibration = JSON.parse(JSON.stringify(state.calibration));
        this.redrawMeasurements();
        this.updateCalibrationUI();
    }

    // Update measurement type UI
    updateMeasurementTypeUI() {
        document.querySelectorAll('[data-measurement-type]').forEach(btn => {
            btn.classList.remove('bg-blue-500', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-700');
        });
        
        const activeBtn = document.querySelector(`[data-measurement-type="${this.measurementType}"]`);
        if (activeBtn) {
            activeBtn.classList.remove('bg-gray-100', 'text-gray-700');
            activeBtn.classList.add('bg-blue-500', 'text-white');
        }
    }

    // Update calibration UI
    updateCalibrationUI() {
        const calibrationStatus = document.getElementById('calibrationStatus');
        if (calibrationStatus) {
            if (this.calibration.isCalibrated) {
                calibrationStatus.textContent = `Calibrated: ${this.calibration.referenceLength}${this.calibration.unit} = ${this.calibration.referencePixels.toFixed(1)}px`;
                calibrationStatus.className = 'text-green-600';
            } else {
                calibrationStatus.textContent = 'Not calibrated';
                calibrationStatus.className = 'text-red-600';
            }
        }
    }

    // Get measurement summary
    getMeasurementSummary() {
        const summary = {
            total: this.measurements.length,
            byType: {},
            calibrated: this.calibration.isCalibrated,
            scale: this.calibration.scale,
            unit: this.calibration.unit
        };
        
        this.measurements.forEach(measurement => {
            summary.byType[measurement.type] = (summary.byType[measurement.type] || 0) + 1;
        });
        
        return summary;
    }

    // Export measurements
    exportMeasurements() {
        return {
            measurements: this.measurements,
            calibration: this.calibration,
            settings: this.settings,
            timestamp: Date.now()
        };
    }

    // Import measurements
    importMeasurements(data) {
        this.measurements = data.measurements || [];
        this.calibration = data.calibration || this.calibration;
        this.settings = { ...this.settings, ...data.settings };
        
        this.redrawMeasurements();
        this.updateCalibrationUI();
    }
}

// Export for use in main application
window.MeasurementTools = MeasurementTools;
