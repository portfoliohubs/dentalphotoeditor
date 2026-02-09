// Professional UI with Tool Palette for Dental Photo Editor
// Comprehensive tool organization, professional layout, and workflow management

class ProfessionalUI {
    constructor() {
        this.toolPalette = null;
        this.propertyPanel = null;
        this.statusBar = null;
        this.currentTool = null;
        this.currentCategory = 'basic';
        
        // Tool categories
        this.categories = {
            basic: { name: 'Basic', icon: 'fa-tools', tools: ['upload', 'export', 'reset'] },
            drawing: { name: 'Drawing', icon: 'fa-pen', tools: ['pen', 'line', 'rectangle', 'circle', 'arrow', 'text', 'eraser'] },
            measurement: { name: 'Measurement', icon: 'fa-ruler', tools: ['distance', 'angle', 'area', 'calibrate'] },
            transform: { name: 'Transform', icon: 'fa-crop', tools: ['crop', 'rotate', 'straighten', 'flip'] },
            smart: { name: 'Smart', icon: 'fa-magic', tools: ['smart-enhance', 'dental-mode', 'auto-detect', 'professional-tools'] },
            dental: { name: 'Dental', icon: 'fa-tooth', tools: ['tooth-numbering', 'vita-shades', 'restoration-mapping'] },
            view: { name: 'View', icon: 'fa-eye', tools: ['zoom-in', 'zoom-out', 'fit', 'pan', 'comparison'] },
            annotation: { name: 'Annotation', icon: 'fa-comment', tools: ['note', 'highlight', 'marker'] }
        };
        
        // Tool definitions
        this.tools = {
            // Basic tools
            upload: { name: 'Upload', icon: 'fa-upload', category: 'basic', shortcut: 'Ctrl+O' },
            export: { name: 'Export', icon: 'fa-download', category: 'basic', shortcut: 'Ctrl+S' },
            reset: { name: 'Reset', icon: 'fa-undo', category: 'basic', shortcut: 'Ctrl+R' },
            
            // Drawing tools
            pen: { name: 'Pen', icon: 'fa-pen', category: 'drawing', shortcut: 'P' },
            line: { name: 'Line', icon: 'fa-minus', category: 'drawing', shortcut: 'L' },
            rectangle: { name: 'Rectangle', icon: 'fa-square', category: 'drawing', shortcut: 'R' },
            circle: { name: 'Circle', icon: 'fa-circle', category: 'drawing', shortcut: 'C' },
            arrow: { name: 'Arrow', icon: 'fa-arrow-right', category: 'drawing', shortcut: 'A' },
            text: { name: 'Text', icon: 'fa-font', category: 'drawing', shortcut: 'T' },
            eraser: { name: 'Eraser', icon: 'fa-eraser', category: 'drawing', shortcut: 'E' },
            
            // Measurement tools
            distance: { name: 'Distance', icon: 'fa-ruler-horizontal', category: 'measurement', shortcut: 'M' },
            angle: { name: 'Angle', icon: 'fa-draw-polygon', category: 'measurement', shortcut: 'N' },
            area: { name: 'Area', icon: 'fa-vector-square', category: 'measurement', shortcut: 'Shift+A' },
            calibrate: { name: 'Calibrate', icon: 'fa-crosshairs', category: 'measurement', shortcut: 'C' },
            
            // Transform tools
            crop: { name: 'Crop', icon: 'fa-crop', category: 'transform', shortcut: 'Shift+C' },
            rotate: { name: 'Rotate', icon: 'fa-sync', category: 'transform', shortcut: 'Shift+R' },
            straighten: { name: 'Straighten', icon: 'fa-level', category: 'transform', shortcut: 'Shift+S' },
            flip: { name: 'Flip', icon: 'fa-arrows-alt-h', category: 'transform', shortcut: 'Shift+F' },
            
            // Smart tools
            'smart-enhance': { name: 'Smart Enhance', icon: 'fa-magic', category: 'smart', shortcut: 'Ctrl+E' },
            'dental-mode': { name: 'Dental Mode', icon: 'fa-tooth', category: 'smart', shortcut: 'Ctrl+D' },
            'auto-detect': { name: 'Auto Detect', icon: 'fa-search', category: 'smart', shortcut: 'Ctrl+A' },
            'professional-tools': { name: 'Professional Tools', icon: 'fa-tools', category: 'smart', shortcut: 'Ctrl+P' },
            
            // Dental tools
            'tooth-numbering': { name: 'Tooth Numbering', icon: 'fa-hashtag', category: 'dental', shortcut: 'Ctrl+T' },
            'vita-shades': { name: 'VITA Shades', icon: 'fa-palette', category: 'dental', shortcut: 'Ctrl+V' },
            'restoration-mapping': { name: 'Restoration Mapping', icon: 'fa-map', category: 'dental', shortcut: 'Ctrl+M' },
            
            // View tools
            'zoom-in': { name: 'Zoom In', icon: 'fa-search-plus', category: 'view', shortcut: '+' },
            'zoom-out': { name: 'Zoom Out', icon: 'fa-search-minus', category: 'view', shortcut: '-' },
            fit: { name: 'Fit', icon: 'fa-expand', category: 'view', shortcut: 'Ctrl+0' },
            pan: { name: 'Pan', icon: 'fa-hand-paper', category: 'view', shortcut: 'Space' },
            comparison: { name: 'Comparison', icon: 'fa-columns', category: 'view', shortcut: 'Ctrl+K' },
            
            // Annotation tools
            note: { name: 'Note', icon: 'fa-sticky-note', category: 'annotation', shortcut: 'Ctrl+N' },
            highlight: { name: 'Highlight', icon: 'fa-highlighter', category: 'annotation', shortcut: 'Ctrl+H' },
            marker: { name: 'Marker', icon: 'fa-highlighter', category: 'annotation', shortcut: 'Ctrl+M' }
        };
        
        // UI state
        this.isCollapsed = false;
        this.isDarkMode = false;
        this.activeWorkflows = [];
        
        this.initialize();
    }

    // Initialize professional UI
    initialize() {
        this.createToolPalette();
        this.createPropertyPanel();
        this.createStatusBar();
        this.createKeyboardShortcutsHelp();
        this.setupEventListeners();
        
        console.log('Professional UI initialized');
    }

    // Create tool palette
    createToolPalette() {
        this.toolPalette = document.createElement('div');
        this.toolPalette.id = 'toolPalette';
        this.toolPalette.className = 'fixed left-0 top-0 h-full bg-gray-900 text-white shadow-2xl z-30 transition-all duration-300';
        this.toolPalette.style.width = '80px';
        
        // Create category tabs
        const categoryTabs = document.createElement('div');
        categoryTabs.className = 'flex flex-col p-2 space-y-1';
        
        Object.entries(this.categories).forEach(([categoryId, category]) => {
            const tab = document.createElement('button');
            tab.className = 'category-tab p-3 rounded-lg hover:bg-gray-700 transition-colors group relative';
            tab.dataset.category = categoryId;
            tab.innerHTML = `
                <i class="fas ${category.icon} text-lg"></i>
                <div class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${category.name}
                </div>
            `;
            
            tab.addEventListener('click', () => this.selectCategory(categoryId));
            categoryTabs.appendChild(tab);
        });
        
        // Create tools container
        const toolsContainer = document.createElement('div');
        toolsContainer.id = 'toolsContainer';
        toolsContainer.className = 'hidden absolute left-full top-0 ml-2 bg-gray-800 rounded-lg p-2 shadow-xl';
        
        this.toolPalette.appendChild(categoryTabs);
        this.toolPalette.appendChild(toolsContainer);
        
        document.body.appendChild(this.toolPalette);
        
        // Select first category by default
        this.selectCategory('basic');
    }

    // Create property panel
    createPropertyPanel() {
        this.propertyPanel = document.createElement('div');
        this.propertyPanel.id = 'propertyPanel';
        this.propertyPanel.className = 'fixed right-0 top-0 w-80 h-full bg-white shadow-2xl z-30 transition-all duration-300 transform translate-x-full';
        
        // Panel header
        const header = document.createElement('div');
        header.className = 'bg-gray-100 p-4 border-b border-gray-200 flex items-center justify-between';
        header.innerHTML = `
            <h3 class="font-semibold text-gray-900">Properties</h3>
            <button id="collapsePanel" class="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        // Panel content
        const content = document.createElement('div');
        content.id = 'propertyContent';
        content.className = 'p-4 overflow-y-auto h-full';
        content.innerHTML = `
            <div class="space-y-4">
                <div id="toolProperties" class="space-y-3">
                    <p class="text-gray-500 text-sm">Select a tool to see properties</p>
                </div>
                
                <div id="imageInfo" class="space-y-3">
                    <h4 class="font-medium text-gray-900">Image Information</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Dimensions:</span>
                            <span id="imageDimensions" class="font-mono">-</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Size:</span>
                            <span id="imageSize" class="font-mono">-</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Format:</span>
                            <span id="imageFormat" class="font-mono">-</span>
                        </div>
                    </div>
                </div>
                
                <div id="smartFeatures" class="space-y-3">
                    <h4 class="font-medium text-gray-900">Smart Features</h4>
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-gray-600">AI Detection:</span>
                            <span id="aiStatus" class="px-2 py-1 bg-gray-200 rounded text-xs">-</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-600">Enhancement:</span>
                            <span id="enhancementStatus" class="px-2 py-1 bg-gray-200 rounded text-xs">-</span>
                        </div>
                    </div>
                </div>
                
                <div id="workflowInfo" class="space-y-3">
                    <h4 class="font-medium text-gray-900">Active Workflows</h4>
                    <div id="workflowList" class="space-y-1">
                        <p class="text-gray-500 text-sm">No active workflows</p>
                    </div>
                </div>
            </div>
        `;
        
        this.propertyPanel.appendChild(header);
        this.propertyPanel.appendChild(content);
        
        document.body.appendChild(this.propertyPanel);
        
        // Setup collapse functionality
        document.getElementById('collapsePanel').addEventListener('click', () => {
            this.togglePanel();
        });
    }

    // Create status bar
    createStatusBar() {
        this.statusBar = document.createElement('div');
        this.statusBar.id = 'statusBar';
        this.statusBar.className = 'fixed bottom-0 left-0 right-0 bg-gray-900 text-white px-4 py-2 z-20';
        
        this.statusBar.innerHTML = `
            <div class="flex items-center justify-between text-sm">
                <div class="flex items-center space-x-4">
                    <span id="currentTool" class="font-medium">No tool selected</span>
                    <span id="coordinates" class="text-gray-400">X: 0, Y: 0</span>
                    <span id="zoom" class="text-gray-400">100%</span>
                </div>
                <div class="flex items-center space-x-4">
                    <span id="smartStatus" class="text-gray-400">Smart features ready</span>
                    <span id="performance" class="text-gray-400">Performance: Good</span>
                    <button id="toggleUI" class="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.statusBar);
        
        // Setup UI toggle
        document.getElementById('toggleUI').addEventListener('click', () => {
            this.toggleUI();
        });
    }

    // Create keyboard shortcuts help
    createKeyboardShortcutsHelp() {
        const helpModal = document.createElement('div');
        helpModal.id = 'keyboardHelpModal';
        helpModal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4';
        
        helpModal.innerHTML = `
            <div class="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold">Keyboard Shortcuts</h3>
                    <button onclick="this.closest('.fixed').remove()" class="p-2 hover:bg-gray-100 rounded-lg">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="space-y-2">
                    ${this.generateKeyboardShortcutsHTML()}
                </div>
            </div>
        `;
        
        document.body.appendChild(helpModal);
    }

    // Generate keyboard shortcuts HTML
    generateKeyboardShortcutsHTML() {
        const shortcuts = Object.entries(this.tools).map(([toolId, tool]) => `
            <div class="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <div class="flex items-center space-x-3">
                    <i class="fas ${tool.icon} text-gray-600 w-5"></i>
                    <span class="font-medium">${tool.name}</span>
                </div>
                <kbd class="px-2 py-1 bg-gray-100 border rounded text-xs font-mono">${tool.shortcut}</kbd>
            </div>
        `).join('');
        
        return shortcuts;
    }

    // Setup event listeners
    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Check for tool shortcuts
            Object.entries(this.tools).forEach(([toolId, tool]) => {
                if (this.matchesShortcut(e, tool.shortcut)) {
                    e.preventDefault();
                    this.selectTool(toolId);
                }
            });
            
            // Special shortcuts
            if (e.key === '?' && e.shiftKey) {
                document.getElementById('keyboardHelpModal').classList.remove('hidden');
            }
        });
        
        // Close help modal on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const helpModal = document.getElementById('keyboardHelpModal');
                if (helpModal && !helpModal.classList.contains('hidden')) {
                    helpModal.classList.add('hidden');
                }
            }
        });
    }

    // Check if event matches shortcut
    matchesShortcut(e, shortcut) {
        const parts = shortcut.toLowerCase().split('+');
        const ctrl = parts.includes('ctrl') || parts.includes('meta');
        const shift = parts.includes('shift');
        const key = parts[parts.length - 1];
        
        return e.ctrlKey === ctrl && 
               e.shiftKey === shift && 
               e.key.toLowerCase() === key;
    }

    // Select category
    selectCategory(categoryId) {
        this.currentCategory = categoryId;
        
        // Update category tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            if (tab.dataset.category === categoryId) {
                tab.classList.add('bg-blue-600');
                tab.classList.remove('bg-gray-700');
            } else {
                tab.classList.remove('bg-blue-600');
                tab.classList.add('bg-gray-700');
            }
        });
        
        // Update tools container
        this.updateToolsContainer();
    }

    // Update tools container
    updateToolsContainer() {
        const container = document.getElementById('toolsContainer');
        const category = this.categories[this.currentCategory];
        
        container.innerHTML = '';
        
        category.tools.forEach(toolId => {
            const tool = this.tools[toolId];
            const toolButton = document.createElement('button');
            toolButton.className = 'tool-button p-3 rounded-lg hover:bg-gray-700 transition-colors group relative';
            toolButton.dataset.tool = toolId;
            toolButton.innerHTML = `
                <i class="fas ${tool.icon} text-lg"></i>
                <div class="absolute left-full ml-2 px-2 py-1 bg-gray-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${tool.name}
                    <div class="text-xs text-gray-400">${tool.shortcut}</div>
                </div>
            `;
            
            toolButton.addEventListener('click', () => this.selectTool(toolId));
            container.appendChild(toolButton);
        });
        
        // Show container
        container.classList.remove('hidden');
    }

    // Select tool
    selectTool(toolId) {
        this.currentTool = toolId;
        const tool = this.tools[toolId];
        
        // Update UI
        this.updateToolSelection(toolId);
        this.updatePropertyPanel(toolId);
        this.updateStatusBar(tool);
        
        // Trigger tool selection event
        this.onToolSelected(toolId);
        
        if (window.accessibilityManager) {
            window.accessibilityManager.announce(`Selected tool: ${tool.name}`);
        }
    }

    // Update tool selection UI
    updateToolSelection(toolId) {
        // Update tool buttons
        document.querySelectorAll('.tool-button').forEach(btn => {
            if (btn.dataset.tool === toolId) {
                btn.classList.add('bg-blue-600');
                btn.classList.remove('hover:bg-gray-700');
            } else {
                btn.classList.remove('bg-blue-600');
                btn.classList.add('hover:bg-gray-700');
            }
        });
    }

    // Update property panel
    updatePropertyPanel(toolId) {
        const tool = this.tools[toolId];
        const propertiesContainer = document.getElementById('toolProperties');
        
        if (!tool) {
            propertiesContainer.innerHTML = '<p class="text-gray-500 text-sm">Select a tool to see properties</p>';
            return;
        }
        
        // Generate tool-specific properties
        let propertiesHTML = '';
        
        switch (toolId) {
            case 'pen':
            case 'line':
            case 'rectangle':
            case 'circle':
            case 'arrow':
                propertiesHTML = this.generateDrawingToolProperties();
                break;
                
            case 'text':
                propertiesHTML = this.generateTextToolProperties();
                break;
                
            case 'distance':
            case 'angle':
            case 'area':
                propertiesHTML = this.generateMeasurementToolProperties();
                break;
                
            case 'crop':
            case 'rotate':
            case 'straighten':
                propertiesHTML = this.generateTransformToolProperties();
                break;
                
            case 'smart-enhance':
            case 'dental-mode':
            case 'auto-detect':
                propertiesHTML = this.generateSmartToolProperties();
                break;
                
            case 'tooth-numbering':
                propertiesHTML = this.generateToothNumberingProperties();
                break;
                
            default:
                propertiesHTML = `
                    <div class="space-y-3">
                        <p class="text-sm text-gray-600">${tool.description || 'No properties available'}</p>
                    </div>
                `;
        }
        
        propertiesContainer.innerHTML = `
            <h4 class="font-medium text-gray-900 mb-3">${tool.name}</h4>
            ${propertiesHTML}
        `;
    }

    // Generate drawing tool properties
    generateDrawingToolProperties() {
        return `
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Stroke Color</label>
                    <input type="color" id="strokeColor" value="#ff0000" class="w-full h-8 rounded cursor-pointer">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Stroke Width</label>
                    <input type="range" id="strokeWidth" min="1" max="20" value="2" class="w-full">
                    <div class="flex justify-between text-xs text-gray-500">
                        <span>1px</span>
                        <span id="strokeWidthValue">2px</span>
                        <span>20px</span>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fill Color</label>
                    <input type="color" id="fillColor" value="#ff0000" class="w-full h-8 rounded cursor-pointer">
                </div>
            </div>
        `;
    }

    // Generate text tool properties
    generateTextToolProperties() {
        return `
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Text</label>
                    <input type="text" id="textInput" placeholder="Enter text..." class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                    <input type="range" id="fontSize" min="8" max="48" value="14" class="w-full">
                    <div class="flex justify-between text-xs text-gray-500">
                        <span>8px</span>
                        <span id="fontSizeValue">14px</span>
                        <span>48px</span>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                    <select id="fontFamily" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                    </select>
                </div>
            </div>
        `;
    }

    // Generate measurement tool properties
    generateMeasurementToolProperties() {
        return `
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Precision</label>
                    <select id="precision" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="1">1 decimal place</option>
                        <option value="2" selected>2 decimal places</option>
                        <option value="3">3 decimal places</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select id="unit" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="mm">Millimeters</option>
                        <option value="cm">Centimeters</option>
                        <option value="px">Pixels</option>
                        <option value="in">Inches</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        <input type="checkbox" id="showLabels" checked> Show Labels
                    </label>
                </div>
            </div>
        `;
    }

    // Generate transform tool properties
    generateTransformToolProperties() {
        return `
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Rotation</label>
                    <input type="range" id="rotation" min="-180" max="180" value="0" class="w-full">
                    <div class="flex justify-between text-xs text-gray-500">
                        <span>-180°</span>
                        <span id="rotationValue">0°</span>
                        <span>180°</span>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        <input type="checkbox" id="flipHorizontal"> Flip Horizontal
                    </label>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        <input type="checkbox" id="flipVertical"> Flip Vertical
                    </label>
                </div>
            </div>
        `;
    }

    // Generate smart tool properties
    generateSmartToolProperties() {
        return `
            <div class="space-y-3">
                <div class="p-3 bg-blue-50 rounded-lg">
                    <h5 class="font-medium text-blue-900 mb-2">AI-Powered Tool</h5>
                    <p class="text-sm text-blue-700">This tool uses artificial intelligence to automatically enhance your dental photos.</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Processing Quality</label>
                    <select id="quality" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="fast">Fast (Lower quality)</option>
                        <option value="balanced" selected>Balanced</option>
                        <option value="high">High (Slower)</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        <input type="checkbox" id="autoApply" checked> Auto-apply
                    </label>
                </div>
            </div>
        `;
    }

    // Generate tooth numbering properties
    generateToothNumberingProperties() {
        return `
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Numbering System</label>
                    <select id="numberingSystem" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="ada">ADA (Universal)</option>
                        <option value="fdi">FDI (Two-Digit)</option>
                        <option value="palmer">Palmer</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Dentition</label>
                    <select id="dentition" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="adult">Adult</option>
                        <option value="primary">Primary</option>
                    </select>
                </div>
                <div id="toothChart" class="p-3 bg-gray-50 rounded-lg">
                    <p class="text-sm text-gray-600">Tooth chart will appear here</p>
                </div>
            </div>
        `;
    }

    // Update status bar
    updateStatusBar(tool) {
        const currentToolElement = document.getElementById('currentTool');
        if (currentToolElement) {
            currentToolElement.textContent = tool.name;
        }
    }

    // Toggle panel
    togglePanel() {
        this.isCollapsed = !this.isCollapsed;
        
        if (this.isCollapsed) {
            this.propertyPanel.style.transform = 'translateX(0)';
            document.getElementById('collapsePanel').innerHTML = '<i class="fas fa-chevron-left"></i>';
        } else {
            this.propertyPanel.style.transform = 'translateX(100%)';
            document.getElementById('collapsePanel').innerHTML = '<i class="fas fa-chevron-right"></i>';
        }
    }

    // Toggle UI
    toggleUI() {
        this.isCollapsed = !this.isCollapsed;
        
        if (this.isCollapsed) {
            this.toolPalette.style.transform = 'translateX(-100%)';
            this.propertyPanel.style.transform = 'translateX(100%)';
        } else {
            this.toolPalette.style.transform = 'translateX(0)';
            this.propertyPanel.style.transform = 'translateX(0)';
        }
    }

    // On tool selected (override in main application)
    onToolSelected(toolId) {
        // This will be overridden by the main application
        console.log(`Tool selected: ${toolId}`);
    }

    // Update image information
    updateImageInfo(imageData) {
        if (!imageData) return;
        
        const dimensionsElement = document.getElementById('imageDimensions');
        const sizeElement = document.getElementById('imageSize');
        const formatElement = document.getElementById('imageFormat');
        
        if (dimensionsElement) {
            dimensionsElement.textContent = `${imageData.width} × ${imageData.height}`;
        }
        
        if (sizeElement) {
            const size = imageData.width * imageData.height * 4 / 1024 / 1024; // Rough estimate
            sizeElement.textContent = `${size.toFixed(1)} MB`;
        }
        
        if (formatElement) {
            formatElement.textContent = 'PNG'; // Assuming PNG for now
        }
    }

    // Update smart features status
    updateSmartFeaturesStatus(status) {
        const aiStatus = document.getElementById('aiStatus');
        const enhancementStatus = document.getElementById('enhancementStatus');
        
        if (aiStatus) {
            aiStatus.textContent = status.ai ? 'Active' : 'Inactive';
            aiStatus.className = `px-2 py-1 ${status.ai ? 'bg-green-500' : 'bg-gray-200'} rounded text-xs`;
        }
        
        if (enhancementStatus) {
            enhancementStatus.textContent = status.enhancement ? 'Active' : 'Inactive';
            enhancementStatus.className = `px-2 py-1 ${status.enhancement ? 'bg-green-500' : 'bg-gray-200'} rounded text-xs`;
        }
    }

    // Update coordinates
    updateCoordinates(x, y) {
        const coordinatesElement = document.getElementById('coordinates');
        if (coordinatesElement) {
            coordinatesElement.textContent = `X: ${Math.round(x)}, Y: ${Math.round(y)}`;
        }
    }

    // Update zoom level
    updateZoomLevel(zoom) {
        const zoomElement = document.getElementById('zoom');
        if (zoomElement) {
            zoomElement.textContent = `${Math.round(zoom * 100)}%`;
        }
    }

    // Update performance status
    updatePerformanceStatus(status) {
        const performanceElement = document.getElementById('performance');
        if (performanceElement) {
            performanceElement.textContent = `Performance: ${status}`;
        }
    }

    // Get current tool
    getCurrentTool() {
        return this.currentTool;
    }

    // Get current category
    getCurrentCategory() {
        return this.currentCategory;
    }

    // Get available tools
    getAvailableTools() {
        return Object.keys(this.tools).map(id => ({
            id: id,
            ...this.tools[id]
        }));
    }

    // Get available categories
    getAvailableCategories() {
        return Object.keys(this.categories).map(id => ({
            id: id,
            ...this.categories[id]
        }));
    }

    // Add workflow
    addWorkflow(workflow) {
        this.activeWorkflows.push(workflow);
        this.updateWorkflowList();
    }

    // Remove workflow
    removeWorkflow(workflowId) {
        this.activeWorkflows = this.activeWorkflows.filter(w => w.id !== workflowId);
        this.updateWorkflowList();
    }

    // Update workflow list
    updateWorkflowList() {
        const workflowList = document.getElementById('workflowList');
        if (!workflowList) return;
        
        if (this.activeWorkflows.length === 0) {
            workflowList.innerHTML = '<p class="text-gray-500 text-sm">No active workflows</p>';
        } else {
            workflowList.innerHTML = this.activeWorkflows.map(workflow => `
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span class="text-sm">${workflow.name}</span>
                    <button onclick="professionalUI.removeWorkflow('${workflow.id}')" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    // Export UI state
    exportState() {
        return {
            currentTool: this.currentTool,
            currentCategory: this.currentCategory,
            isCollapsed: this.isCollapsed,
            isDarkMode: this.isDarkMode,
            activeWorkflows: this.activeWorkflows
        };
    }

    // Import UI state
    importState(state) {
        if (state.currentTool) this.selectTool(state.currentTool);
        if (state.currentCategory) this.selectCategory(state.currentCategory);
        this.isCollapsed = state.isCollapsed || false;
        this.isDarkMode = state.isDarkMode || false;
        this.activeWorkflows = state.activeWorkflows || [];
        
        this.updateUI();
    }

    // Update UI based on state
    updateUI() {
        this.toggleUI();
        this.updateWorkflowList();
    }
}

// Export for use in main application
window.ProfessionalUI = ProfessionalUI;
