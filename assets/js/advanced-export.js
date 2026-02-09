// Advanced Export Options for Dental Photo Editor
// Professional export formats, DICOM support, batch processing, and clinical documentation

class AdvancedExport {
    constructor() {
        this.exportFormats = {
            // Image formats
            png: { name: 'PNG', extension: '.png', mimeType: 'image/png', quality: 1.0, supportsTransparency: true },
            jpeg: { name: 'JPEG', extension: '.jpg', mimeType: 'image/jpeg', quality: 0.9, supportsTransparency: false },
            tiff: { name: 'TIFF', extension: '.tiff', mimeType: 'image/tiff', quality: 1.0, supportsTransparency: true },
            bmp: { name: 'BMP', extension: '.bmp', mimeType: 'image/bmp', quality: 1.0, supportsTransparency: false },
            webp: { name: 'WebP', extension: '.webp', mimeType: 'image/webp', quality: 0.9, supportsTransparency: true },
            
            // Medical formats
            dicom: { name: 'DICOM', extension: '.dcm', mimeType: 'application/dicom', quality: 1.0, supportsTransparency: false },
            nifti: { name: 'NIfTI', extension: '.nii', mimeType: 'application/octet-stream', quality: 1.0, supportsTransparency: false },
            
            // Document formats
            pdf: { name: 'PDF', extension: '.pdf', mimeType: 'application/pdf', quality: 1.0, supportsTransparency: false },
            svg: { name: 'SVG', extension: '.svg', mimeType: 'image/svg+xml', quality: 1.0, supportsTransparency: true }
        };
        
        // Export presets
        this.presets = {
            clinical: {
                name: 'Clinical Documentation',
                description: 'High-quality images for clinical records',
                format: 'png',
                quality: 1.0,
                dpi: 300,
                colorSpace: 'sRGB',
                annotations: true,
                metadata: true
            },
            presentation: {
                name: 'Patient Presentation',
                description: 'Optimized for patient viewing',
                format: 'jpeg',
                quality: 0.85,
                dpi: 150,
                colorSpace: 'sRGB',
                annotations: true,
                metadata: false
            },
            publication: {
                name: 'Publication/Research',
                description: 'High-resolution for academic use',
                format: 'tiff',
                quality: 1.0,
                dpi: 600,
                colorSpace: 'Adobe RGB',
                annotations: true,
                metadata: true
            },
            web: {
                name: 'Web/Online',
                description: 'Optimized for web use',
                format: 'webp',
                quality: 0.8,
                dpi: 72,
                colorSpace: 'sRGB',
                annotations: false,
                metadata: false
            },
            dicom: {
                name: 'DICOM Medical',
                description: 'Medical imaging format',
                format: 'dicom',
                quality: 1.0,
                dpi: 300,
                colorSpace: 'sRGB',
                annotations: true,
                metadata: true
            }
        };
        
        // Batch processing
        this.batchQueue = [];
        this.isProcessingBatch = false;
        this.batchResults = [];
        
        // Export settings
        this.settings = {
            defaultFormat: 'png',
            defaultQuality: 0.9,
            defaultDPI: 300,
            includeAnnotations: true,
            includeMetadata: true,
            watermark: false,
            compression: 'medium',
            colorProfile: 'sRGB'
        };
        
        this.initialize();
    }

    // Initialize advanced export
    initialize() {
        this.setupEventListeners();
        console.log('Advanced export initialized');
    }

    // Setup event listeners
    setupEventListeners() {
        // Will be connected to UI elements
    }

    // Export single image
    async exportImage(imageData, options = {}) {
        const settings = { ...this.settings, ...options };
        
        try {
            // Create export canvas
            const exportCanvas = this.createExportCanvas(imageData, settings);
            
            // Convert to desired format
            const blob = await this.convertToFormat(exportCanvas, settings.format, settings.quality);
            
            // Generate filename
            const filename = this.generateFilename(settings);
            
            // Download file
            this.downloadFile(blob, filename);
            
            return {
                success: true,
                filename: filename,
                size: blob.size,
                format: settings.format
            };
            
        } catch (error) {
            console.error('Export failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Create export canvas
    createExportCanvas(imageData, settings) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size based on DPI
        const scale = settings.dpi / 72; // 72 DPI is default
        canvas.width = imageData.width * scale;
        canvas.height = imageData.height * scale;
        
        // Apply color profile if needed
        if (settings.colorProfile === 'Adobe RGB') {
            // Apply Adobe RGB color space conversion
            this.applyColorProfile(ctx, 'adobe-rgb');
        }
        
        // Scale and draw image
        ctx.scale(scale, scale);
        ctx.drawImage(imageData, 0, 0);
        
        // Add annotations if enabled
        if (settings.annotations) {
            this.addAnnotationsToCanvas(ctx, canvas);
        }
        
        // Add watermark if enabled
        if (settings.watermark) {
            this.addWatermarkToCanvas(ctx, canvas);
        }
        
        return canvas;
    }

    // Convert canvas to desired format
    async convertToFormat(canvas, format, quality) {
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to convert image'));
                }
            }, this.exportFormats[format].mimeType, quality);
        });
    }

    // Generate filename
    generateFilename(settings) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const prefix = settings.prefix || 'dental-photo';
        const format = this.exportFormats[settings.format].extension;
        
        return `${prefix}-${timestamp}${format}`;
    }

    // Download file
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Add annotations to canvas
    addAnnotationsToCanvas(ctx, canvas) {
        // Implementation depends on annotation system
        // This would integrate with the drawing tools
        if (window.drawingTools && window.drawingTools.annotations) {
            window.drawingTools.redrawAnnotations();
            
            // Copy annotation canvas to export canvas
            const annotationCanvas = document.getElementById('annotationCanvas');
            if (annotationCanvas) {
                ctx.drawImage(annotationCanvas, 0, 0);
            }
        }
    }

    // Add watermark to canvas
    addWatermarkToCanvas(ctx, canvas) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Dental Photo Editor', canvas.width / 2, canvas.height - 30);
        ctx.restore();
    }

    // Apply color profile
    applyColorProfile(ctx, profile) {
        // Simplified color profile application
        // In a real implementation, you'd use proper color management
        if (profile === 'adobe-rgb') {
            // Apply Adobe RGB color space conversion
            ctx.filter = 'url(#adobe-rgb-filter)';
        }
    }

    // Export to DICOM
    async exportToDICOM(imageData, metadata = {}) {
        try {
            // Create DICOM file
            const dicomData = this.createDICOMFile(imageData, metadata);
            
            // Convert to blob
            const blob = new Blob([dicomData], { type: 'application/dicom' });
            
            // Generate filename
            const filename = this.generateFilename({ format: 'dicom', prefix: 'dental-dicom' });
            
            // Download file
            this.downloadFile(blob, filename);
            
            return {
                success: true,
                filename: filename,
                format: 'dicom'
            };
            
        } catch (error) {
            console.error('DICOM export failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Create DICOM file
    createDICOMFile(imageData, metadata) {
        // Simplified DICOM creation
        // In a real implementation, you'd use a DICOM library like dcmjs
        
        const dicomHeader = {
            patientName: metadata.patientName || 'Anonymous',
            patientID: metadata.patientID || 'UNKNOWN',
            studyDate: metadata.studyDate || new Date().toISOString().split('T')[0],
            modality: 'XC', // External Photography
            bodyPart: 'MOUTH', // Mouth
            manufacturer: 'Dental Photo Editor',
            institutionName: metadata.institutionName || 'Unknown'
        };
        
        // Create DICOM dataset (simplified)
        const dataset = {
            pixelData: imageData.data,
            width: imageData.width,
            height: imageData.height,
            rows: imageData.height,
            columns: imageData.width,
            samplesPerPixel: 4,
            bitsAllocated: 8,
            highBit: 7,
            photometricInterpretation: 'RGB',
            planarConfiguration: '0'
        };
        
        // Convert to DICOM binary format (simplified)
        const encoder = new TextEncoder();
        const headerString = JSON.stringify(dicomHeader);
        const datasetString = JSON.stringify(dataset);
        
        const headerBytes = encoder.encode(headerString);
        const datasetBytes = encoder.encode(datasetString);
        
        // Create binary DICOM file (simplified structure)
        const totalLength = 128 + 4 + headerBytes.length + 4 + datasetBytes.length + 4;
        const buffer = new ArrayBuffer(totalLength);
        const view = new DataView(buffer);
        
        let offset = 0;
        
        // Write DICOM preamble (128 bytes)
        const preamble = 'DICM';
        for (let i = 0; i < 128; i++) {
            view.setUint8(offset++, preamble.charCodeAt(i) || 0);
        }
        
        // Write DICOM magic number
        view.setUint32(offset, 0x42434242);
        offset += 4;
        
        // Write header length
        view.setUint32(offset, headerBytes.length);
        offset += 4;
        
        // Write header data
        for (let i = 0; i < headerBytes.length; i++) {
            view.setUint8(offset++, headerBytes[i]);
        }
        
        // Write dataset length
        view.setUint32(offset, datasetBytes.length);
        offset += 4;
        
        // Write dataset data
        for (let i = 0; i < datasetBytes.length; i++) {
            view.setUint8(offset++, datasetBytes[i]);
        }
        
        // Write end marker
        view.setUint32(offset, 0x0);
        
        return buffer;
    }

    // Batch export
    async batchExport(images, options = {}) {
        this.batchQueue = images;
        this.batchResults = [];
        this.isProcessingBatch = true;
        
        try {
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const result = await this.exportImage(image.data, {
                    ...options,
                    prefix: `${options.prefix || 'batch'}-${i + 1}`
                });
                
                this.batchResults.push({
                    index: i,
                    filename: result.filename,
                    success: result.success,
                    error: result.error,
                    size: result.size
                });
                
                // Update progress
                this.updateBatchProgress(i + 1, images.length);
            }
            
            return {
                success: true,
                results: this.batchResults,
                total: images.length
            };
            
        } catch (error) {
            console.error('Batch export failed:', error);
            return {
                success: false,
                error: error.message,
                results: this.batchResults
            };
        } finally {
            this.isProcessingBatch = false;
            this.batchQueue = [];
        }
    }

    // Update batch progress
    updateBatchProgress(current, total) {
        // Update UI with progress
        const progressElement = document.getElementById('batchProgress');
        if (progressElement) {
            const percentage = Math.round((current / total) * 100);
            progressElement.textContent = `Exporting: ${current}/${total} (${percentage}%)`;
        }
        
        if (typeof showToast === 'function') {
            showToast(`Exporting ${current} of ${total} images...`);
        }
    }

    // Create PDF report
    async createPDFReport(images, options = {}) {
        try {
            const { jsPDF } = await import('jspdf');
            
            const pdf = new jsPDF();
            
            // Add title page
            pdf.setFontSize(20);
            pdf.text('Dental Photo Report', 105, 20);
            pdf.setFontSize(12);
            pdf.text(`Generated: ${new Date().toLocaleString()}`, 105, 30);
            pdf.text(`Total Images: ${images.length}`, 105, 40);
            
            // Add images
            let yPosition = 60;
            images.forEach((image, index) => {
                if (yPosition > 250) {
                    pdf.addPage();
                    yPosition = 20;
                }
                
                pdf.text(`Image ${index + 1}: ${image.filename || 'Unknown'}`, 20, yPosition);
                
                if (image.data) {
                    const imgData = this.imageDataToDataURL(image.data);
                    pdf.addImage(imgData, 20, yPosition + 10, 80, 60);
                    yPosition += 80;
                }
            });
            
            // Save PDF
            const filename = this.generateFilename({ format: 'pdf', prefix: 'dental-report' });
            pdf.save(filename);
            
            return {
                success: true,
                filename: filename
            };
            
        } catch (error) {
            console.error('PDF creation failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Convert ImageData to DataURL
    imageDataToDataURL(imageData) {
        const canvas = document.createElement('canvas');
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        const ctx = canvas.getContext('2d');
        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL();
    }

    // Create comparison image
    async createComparisonImage(original, enhanced, mode = 'sideBySide') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = Math.max(original.width, enhanced.width) * 2;
        canvas.height = Math.max(original.height, enhanced.height);
        
        // Draw comparison based on mode
        switch (mode) {
            case 'sideBySide':
                ctx.drawImage(original, 0, 0, canvas.width / 2, canvas.height);
                ctx.drawImage(enhanced, canvas.width / 2, 0, canvas.width / 2, canvas.height);
                break;
                
            case 'slider':
                // Draw original on left half
                ctx.drawImage(original, 0, 0, canvas.width / 2, canvas.height);
                // Draw enhanced on right half
                ctx.drawImage(enhanced, canvas.width / 2, 0, canvas.width / 2, canvas.height);
                break;
                
            case 'overlay':
                ctx.drawImage(original, 0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 0.5;
                ctx.drawImage(enhanced, 0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 1.0;
                break;
        }
        
        return canvas;
    }

    // Export comparison
    async exportComparison(original, enhanced, mode = 'sideBySide', options = {}) {
        try {
            const comparisonCanvas = await this.createComparisonImage(original, enhanced, mode);
            
            const settings = { ...this.settings, ...options };
            const blob = await this.convertToFormat(comparisonCanvas, settings.format, settings.quality);
            
            const filename = this.generateFilename({ 
                format: settings.format, 
                prefix: `comparison-${mode}` 
            });
            
            this.downloadFile(blob, filename);
            
            return {
                success: true,
                filename: filename,
                mode: mode
            };
            
        } catch (error) {
            console.error('Comparison export failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get available formats
    getAvailableFormats() {
        return Object.keys(this.exportFormats).map(key => ({
            id: key,
            ...this.exportFormats[key]
        }));
    }

    // Get available presets
    getAvailablePresets() {
        return Object.keys(this.presets).map(key => ({
            id: key,
            ...this.presets[key]
        }));
    }

    // Get export settings
    getExportSettings() {
        return { ...this.settings };
    }

    // Set export settings
    setExportSettings(settings) {
        this.settings = { ...this.settings, ...settings };
    }

    // Validate export options
    validateExportOptions(options) {
        const errors = [];
        
        if (options.format && !this.exportFormats[options.format]) {
            errors.push(`Unsupported format: ${options.format}`);
        }
        
        if (options.quality && (options.quality < 0 || options.quality > 1)) {
            errors.push('Quality must be between 0 and 1');
        }
        
        if (options.dpi && (options.dpi < 72 || options.dpi > 600)) {
            errors.push('DPI must be between 72 and 600');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    // Get export statistics
    getExportStatistics() {
        return {
            availableFormats: Object.keys(this.exportFormats).length,
            availablePresets: Object.keys(this.presets).length,
            batchQueueLength: this.batchQueue.length,
            isProcessingBatch: this.isProcessingBatch,
            batchResults: this.batchResults.length
        };
    }

    // Create export modal UI
    createExportModal() {
        const modal = document.createElement('div');
        modal.id = 'advancedExportModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4';
        
        modal.innerHTML = `
            <div class="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-gray-900">Advanced Export Options</h2>
                    <button onclick="this.closest('.fixed').remove()" class="p-2 hover:bg-gray-100 rounded-lg">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <!-- Export Format -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Export Format</h3>
                    <div class="grid grid-cols-3 gap-3">
                        ${Object.entries(this.exportFormats).map(([id, format]) => `
                            <label class="flex flex-col items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="format" value="${id}" class="mb-2">
                                <i class="fas ${this.getFormatIcon(id)} text-2xl mb-2"></i>
                                <div class="text-sm font-medium">${format.name}</div>
                                <div class="text-xs text-gray-500">${format.extension}</div>
                            </label>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Export Presets -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Export Presets</h3>
                    <div class="grid grid-cols-2 gap-3">
                        ${Object.entries(this.presets).map(([id, preset]) => `
                            <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="preset" value="${id}" class="mr-3">
                                <div>
                                    <div class="font-medium">${preset.name}</div>
                                    <div class="text-sm text-gray-500">${preset.description}</div>
                                </div>
                            </label>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Advanced Options -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Advanced Options</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Quality</label>
                            <input type="range" id="exportQuality" min="0" max="1" step="0.1" value="0.9" class="w-full">
                            <div class="flex justify-between text-xs text-gray-500">
                                <span>Low</span>
                                <span id="qualityValue">90%</span>
                                <span>High</span>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">DPI</label>
                            <select id="exportDPI" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                <option value="72">72 DPI (Web)</option>
                                <option value="150" selected>150 DPI (Screen)</option>
                                <option value="300">300 DPI (Print)</option>
                                <option value="600">600 DPI (Professional)</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Color Space</label>
                            <select id="colorSpace" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                <option value="sRGB" selected>sRGB</option>
                                <option value="Adobe RGB">Adobe RGB</option>
                                <option value="ProPhoto RGB">ProPhoto RGB</option>
                            </select>
                        </div>
                        
                        <div class="space-y-2">
                            <label class="flex items-center">
                                <input type="checkbox" id="includeAnnotations" checked class="mr-2">
                                <span class="text-sm font-medium text-gray-700">Include Annotations</span>
                            </label>
                            
                            <label class="flex items-center">
                                <input type="checkbox" id="includeMetadata" checked class="mr-2">
                                <span class="text-sm font-medium text-gray-700">Include Metadata</span>
                            </label>
                            
                            <label class="flex items-center">
                                <input type="checkbox" id="addWatermark" class="mr-2">
                                <span class="text-sm font-medium text-gray-700">Add Watermark</span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Batch Export -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Batch Export</h3>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <p class="text-gray-500 mb-2">Drop images here for batch export</p>
                        <button onclick="document.getElementById('batchFileInput').click()" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                            <i class="fas fa-upload mr-2"></i>
                            Select Images
                        </button>
                        <input type="file" id="batchFileInput" multiple accept="image/*" class="hidden">
                    </div>
                </div>
                
                <!-- Export Buttons -->
                <div class="flex justify-end space-x-3">
                    <button onclick="advancedExport.cancelExport()" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                        Cancel
                    </button>
                    <button onclick="advancedExport.performExport()" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Export
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup event listeners
        this.setupModalEventListeners();
        
        return modal;
    }

    // Setup modal event listeners
    setupModalEventListeners() {
        const modal = document.getElementById('advancedExportModal');
        
        // Quality slider
        const qualitySlider = document.getElementById('exportQuality');
        const qualityValue = document.getElementById('qualityValue');
        if (qualitySlider && qualityValue) {
            qualitySlider.addEventListener('input', (e) => {
                    qualityValue.textContent = `${Math.round(e.target.value * 100)}%`;
                });
        }
        
        // Batch file input
        const batchFileInput = document.getElementById('batchFileInput');
        if (batchFileInput) {
            batchFileInput.addEventListener('change', (e) => {
                this.handleBatchFileSelect(e);
            });
        }
    }

    // Handle batch file selection
    handleBatchFileSelect(event) {
        const files = Array.from(event.target.files);
        
        // Process files for batch export
        const imagePromises = files.map(file => this.loadFileAsImageData(file));
        
        Promise.all(imagePromises).then(images => {
            const validImages = images.filter(img => img !== null);
            this.batchQueue = validImages;
            
            if (validImages.length > 0) {
                if (typeof showToast === 'function') {
                    showToast(`${validImages.length} images ready for batch export`);
                }
            }
        }).catch(error => {
            console.error('Failed to load images:', error);
            if (typeof showToast === 'function') {
                showToast('Failed to load some images');
            }
        });
    }

    // Load file as ImageData
    loadFileAsImageData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    
                    resolve({
                        data: imageData,
                        filename: file.name,
                        size: file.size,
                        type: file.type
                    });
                };
                
                img.onerror = () => reject(new Error('Failed to load image'));
                
                reader.readAsDataURL(file);
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
        });
    }

    // Get format icon
    getFormatIcon(format) {
        const icons = {
            png: 'fa-file-image',
            jpeg: 'fa-file-image',
            tiff: 'fa-file-image',
            bmp: 'fa-file-image',
            webp: 'fa-file-image',
            dicom: 'fa-file-medical',
            nifti: 'fa-file-medical',
            pdf: 'fa-file-pdf',
            svg: 'fa-file-code'
        };
        
        return icons[format] || 'fa-file';
    }

    // Cancel export
    cancelExport() {
        const modal = document.getElementById('advancedExportModal');
        if (modal) {
            modal.remove();
        }
    }

    // Perform export
    async performExport() {
        const modal = document.getElementById('advancedExportModal');
        
        // Get selected options
        const format = document.querySelector('input[name="format"]:checked')?.value || 'png';
        const preset = document.querySelector('input[name="preset"]:checked')?.value;
        const quality = parseFloat(document.getElementById('exportQuality')?.value || 0.9);
        const dpi = parseInt(document.getElementById('exportDPI')?.value || 300);
        const colorSpace = document.getElementById('colorSpace')?.value || 'sRGB';
        const includeAnnotations = document.getElementById('includeAnnotations')?.checked;
        const includeMetadata = document.getElementById('includeMetadata')?.checked;
        const addWatermark = document.getElementById('addWatermark')?.checked;
        
        const options = {
            format,
            quality,
            dpi,
            colorSpace,
            includeAnnotations,
            includeMetadata,
            addWatermark
        };
        
        // Use preset if selected
        if (preset && this.presets[preset]) {
            Object.assign(options, this.presets[preset]);
        }
        
        // Validate options
        const validation = this.validateExportOptions(options);
        if (!validation.valid) {
            if (typeof showToast === 'function') {
                showToast('Invalid export options: ' + validation.errors.join(', '));
            }
            return;
        }
        
        // Close modal
        modal.remove();
        
        // Perform export
        if (this.batchQueue.length > 0) {
            // Batch export
            const result = await this.batchExport(this.batchQueue, options);
            
            if (result.success) {
                if (typeof showToast === 'function') {
                    showToast(`Batch export completed: ${result.total} files exported`);
                }
            }
        } else {
            // Single image export (would need current image)
            if (typeof showToast === 'function') {
                showToast('Please select an image to export');
            }
        }
    }
}

// Export for use in main application
window.AdvancedExport = AdvancedExport;
