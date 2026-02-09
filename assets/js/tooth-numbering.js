// Professional Tooth Numbering Systems for Dental Photo Editor
// ADA (Universal), FDI (Two-Digit), and Palmer notation systems

class ToothNumberingSystem {
    constructor() {
        this.currentSystem = 'ada';
        this.toothChart = null;
        this.annotations = [];
        this.selectedTooth = null;
        
        // Tooth numbering systems
        this.systems = {
            ada: {
                name: 'ADA (Universal)',
                description: 'Universal numbering system used in the United States',
                adult: this.getADATeeth(),
                primary: this.getADAPrimaryTeeth()
            },
            fdi: {
                name: 'FDI (Two-Digit)',
                description: 'Fédération Dentaire Internationale system used worldwide',
                adult: this.getFDITeeth(),
                primary: this.getFDIPrimaryTeeth()
            },
            palmer: {
                name: 'Palmer',
                description: 'Traditional notation system with quadrant symbols',
                adult: this.getPalmerTeeth(),
                primary: this.getPalmerPrimaryTeeth()
            }
        };
        
        // Tooth types and properties
        this.toothTypes = {
            incisor: { name: 'Incisor', count: 8, color: '#FFE4B5' },
            canine: { name: 'Canine', count: 4, color: '#FFDAB9' },
            premolar: { name: 'Premolar', count: 8, color: '#F0E68C' },
            molar: { name: 'Molar', count: 12, color: '#E6E6FA' }
        };
        
        this.initialize();
    }

    // Initialize tooth numbering system
    initialize() {
        this.createToothChart();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        
        console.log('Tooth numbering system initialized');
    }

    // Create tooth chart visualization
    createToothChart() {
        this.toothChart = {
            adult: {
                maxillary: this.createMaxillaryChart(),
                mandibular: this.createMandibularChart()
            },
            primary: {
                maxillary: this.createPrimaryMaxillaryChart(),
                mandibular: this.createPrimaryMandibularChart()
            }
        };
    }

    // Create maxillary (upper) chart
    createMaxillaryChart() {
        return {
            right: [
                { number: 1, type: 'molar', quadrant: 'UR', position: { x: 50, y: 100 } },
                { number: 2, type: 'molar', quadrant: 'UR', position: { x: 100, y: 100 } },
                { number: 3, type: 'molar', quadrant: 'UR', position: { x: 150, y: 100 } },
                { number: 4, type: 'premolar', quadrant: 'UR', position: { x: 200, y: 100 } },
                { number: 5, type: 'premolar', quadrant: 'UR', position: { x: 250, y: 100 } },
                { number: 6, type: 'canine', quadrant: 'UR', position: { x: 300, y: 100 } },
                { number: 7, type: 'incisor', quadrant: 'UR', position: { x: 350, y: 100 } },
                { number: 8, type: 'incisor', quadrant: 'UR', position: { x: 400, y: 100 } }
            ],
            center: [
                { number: 9, type: 'incisor', quadrant: 'UC', position: { x: 450, y: 100 } },
                { number: 10, type: 'incisor', quadrant: 'UC', position: { x: 500, y: 100 } },
                { number: 11, type: 'canine', quadrant: 'UC', position: { x: 550, y: 100 } },
                { number: 12, type: 'premolar', quadrant: 'UC', position: { x: 600, y: 100 } },
                { number: 13, type: 'premolar', quadrant: 'UC', position: { x: 650, y: 100 } },
                { number: 14, type: 'molar', quadrant: 'UC', position: { x: 700, y: 100 } },
                { number: 15, type: 'molar', quadrant: 'UC', position: { x: 750, y: 100 } },
                { number: 16, type: 'molar', quadrant: 'UC', position: { x: 800, y: 100 } }
            ]
        };
    }

    // Create mandibular (lower) chart
    createMandibularChart() {
        return {
            left: [
                { number: 17, type: 'molar', quadrant: 'LL', position: { x: 50, y: 200 } },
                { number: 18, type: 'molar', quadrant: 'LL', position: { x: 100, y: 200 } },
                { number: 19, type: 'molar', quadrant: 'LL', position: { x: 150, y: 200 } },
                { number: 20, type: 'premolar', quadrant: 'LL', position: { x: 200, y: 200 } },
                { number: 21, type: 'premolar', quadrant: 'LL', position: { x: 250, y: 200 } },
                { number: 22, type: 'canine', quadrant: 'LL', position: { x: 300, y: 200 } },
                { number: 23, type: 'incisor', quadrant: 'LL', position: { x: 350, y: 200 } },
                { number: 24, type: 'incisor', quadrant: 'LL', position: { x: 400, y: 200 } }
            ],
            center: [
                { number: 25, type: 'incisor', quadrant: 'LC', position: { x: 450, y: 200 } },
                { number: 26, type: 'incisor', quadrant: 'LC', position: { x: 500, y: 200 } },
                { number: 27, type: 'canine', quadrant: 'LC', position: { x: 550, y: 200 } },
                { number: 28, type: 'premolar', quadrant: 'LC', position: { x: 600, y: 200 } },
                { number: 29, type: 'premolar', quadrant: 'LC', position: { x: 650, y: 200 } },
                { number: 30, type: 'molar', quadrant: 'LC', position: { x: 700, y: 200 } },
                { number: 31, type: 'molar', quadrant: 'LC', position: { x: 750, y: 200 } },
                { number: 32, type: 'molar', quadrant: 'LC', position: { x: 800, y: 200 } }
            ]
        };
    }

    // Create primary maxillary chart
    createPrimaryMaxillaryChart() {
        return {
            right: [
                { number: 'A', type: 'molar', quadrant: 'UR', position: { x: 100, y: 100 } },
                { number: 'B', type: 'molar', quadrant: 'UR', position: { x: 150, y: 100 } },
                { number: 'C', type: 'canine', quadrant: 'UR', position: { x: 200, y: 100 } },
                { number: 'D', type: 'incisor', quadrant: 'UR', position: { x: 250, y: 100 } },
                { number: 'E', type: 'incisor', quadrant: 'UR', position: { x: 300, y: 100 } }
            ],
            left: [
                { number: 'F', type: 'incisor', quadrant: 'UL', position: { x: 400, y: 100 } },
                { number: 'G', type: 'incisor', quadrant: 'UL', position: { x: 450, y: 100 } },
                { number: 'H', type: 'canine', quadrant: 'UL', position: { x: 500, y: 100 } },
                { number: 'I', type: 'molar', quadrant: 'UL', position: { x: 550, y: 100 } },
                { number: 'J', type: 'molar', quadrant: 'UL', position: { x: 600, y: 100 } }
            ]
        };
    }

    // Create primary mandibular chart
    createPrimaryMandibularChart() {
        return {
            left: [
                { number: 'K', type: 'molar', quadrant: 'LL', position: { x: 100, y: 200 } },
                { number: 'L', type: 'molar', quadrant: 'LL', position: { x: 150, y: 200 } },
                { number: 'M', type: 'canine', quadrant: 'LL', position: { x: 200, y: 200 } },
                { number: 'N', type: 'incisor', quadrant: 'LL', position: { x: 250, y: 200 } },
                { number: 'O', type: 'incisor', quadrant: 'LL', position: { x: 300, y: 200 } }
            ],
            right: [
                { number: 'P', type: 'incisor', quadrant: 'LR', position: { x: 400, y: 200 } },
                { number: 'Q', type: 'incisor', quadrant: 'LR', position: { x: 450, y: 200 } },
                { number: 'R', type: 'canine', quadrant: 'LR', position: { x: 500, y: 200 } },
                { number: 'S', type: 'molar', quadrant: 'LR', position: { x: 550, y: 200 } },
                { number: 'T', type: 'molar', quadrant: 'LR', position: { x: 600, y: 200 } }
            ]
        };
    }

    // Get ADA adult teeth
    getADATeeth() {
        return {
            maxillary: {
                right: [1, 2, 3, 4, 5, 6, 7, 8],
                center: [9, 10, 11, 12, 13, 14, 15, 16]
            },
            mandibular: {
                left: [17, 18, 19, 20, 21, 22, 23, 24],
                center: [25, 26, 27, 28, 29, 30, 31, 32]
            }
        };
    }

    // Get ADA primary teeth
    getADAPrimaryTeeth() {
        return {
            maxillary: {
                right: ['A', 'B', 'C', 'D', 'E'],
                left: ['F', 'G', 'H', 'I', 'J']
            },
            mandibular: {
                left: ['K', 'L', 'M', 'N', 'O'],
                right: ['P', 'Q', 'R', 'S', 'T']
            }
        };
    }

    // Get FDI adult teeth
    getFDITeeth() {
        return {
            maxillary: {
                right: [18, 17, 16, 15, 14, 13, 12, 11],
                left: [21, 22, 23, 24, 25, 26, 27, 28]
            },
            mandibular: {
                left: [48, 47, 46, 45, 44, 43, 42, 41],
                right: [31, 32, 33, 34, 35, 36, 37, 38]
            }
        };
    }

    // Get FDI primary teeth
    getFDIPrimaryTeeth() {
        return {
            maxillary: {
                right: [55, 54, 53, 52, 51],
                left: [61, 62, 63, 64, 65]
            },
            mandibular: {
                left: [85, 84, 83, 82, 81],
                right: [71, 72, 73, 74, 75]
            }
        };
    }

    // Get Palmer adult teeth
    getPalmerTeeth() {
        return {
            maxillary: {
                right: ['8┘', '7┘', '6┘', '5┘', '4┘', '3┘', '2┘', '1┘'],
                left: ['1┐', '2┐', '3┐', '4┐', '5┐', '6┐', '7┐', '8┐']
            },
            mandibular: {
                left: ['8┙', '7┙', '6┙', '5┙', '4┙', '3┙', '2┙', '1┙'],
                right: ['1└', '2└', '3└', '4└', '5└', '6└', '7└', '8└']
            }
        };
    }

    // Get Palmer primary teeth
    getPalmerPrimaryTeeth() {
        return {
            maxillary: {
                right: ['E┘', 'D┘', 'C┘', 'B┘', 'A┘'],
                left: ['A┐', 'B┐', 'C┐', 'D┐', 'E┐']
            },
            mandibular: {
                left: ['E┙', 'D┙', 'C┙', 'B┙', 'A┙'],
                right: ['A└', 'B└', 'C└', 'D└', 'E└']
            }
        };
    }

    // Setup event listeners
    setupEventListeners() {
        // Will be connected to UI elements
    }

    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.setSystem('ada');
                        break;
                    case '2':
                        e.preventDefault();
                        this.setSystem('fdi');
                        break;
                    case '3':
                        e.preventDefault();
                        this.setSystem('palmer');
                        break;
                }
            }
        });
    }

    // Set numbering system
    setSystem(system) {
        if (this.systems[system]) {
            this.currentSystem = system;
            this.updateUI();
            
            // Announce for accessibility
            if (window.accessibilityManager) {
                window.accessibilityManager.announce(`Tooth numbering system changed to ${this.systems[system].name}`);
            }
        }
    }

    // Get tooth number in current system
    getToothNumber(originalNumber, originalSystem = 'ada') {
        if (originalSystem === this.currentSystem) {
            return originalNumber;
        }
        
        // Convert between systems
        return this.convertToothNumber(originalNumber, originalSystem, this.currentSystem);
    }

    // Convert tooth number between systems
    convertToothNumber(number, fromSystem, toSystem) {
        // This is a simplified conversion - in practice, you'd need a comprehensive mapping
        const conversions = {
            'ada-to-fdi': {
                1: 18, 2: 17, 3: 16, 4: 15, 5: 14, 6: 13, 7: 12, 8: 11,
                9: 21, 10: 22, 11: 23, 12: 24, 13: 25, 14: 26, 15: 27, 16: 28,
                17: 48, 18: 47, 19: 46, 20: 45, 21: 44, 22: 43, 23: 42, 24: 41,
                25: 31, 26: 32, 27: 33, 28: 34, 29: 35, 30: 36, 31: 37, 32: 38
            },
            'fdi-to-ada': {
                18: 1, 17: 2, 16: 3, 15: 4, 14: 5, 13: 6, 12: 7, 11: 8,
                21: 9, 22: 10, 23: 11, 24: 12, 25: 13, 26: 14, 27: 15, 28: 16,
                48: 17, 47: 18, 46: 19, 45: 20, 44: 21, 43: 22, 42: 23, 41: 24,
                31: 25, 32: 26, 33: 27, 34: 28, 35: 29, 36: 30, 37: 31, 38: 32
            }
        };
        
        const conversionKey = `${fromSystem}-to-${toSystem}`;
        const conversionMap = conversions[conversionKey];
        
        return conversionMap && conversionMap[number] ? conversionMap[number] : number;
    }

    // Get tooth info
    getToothInfo(number) {
        // Search through all systems to find tooth info
        for (const [systemName, system] of Object.entries(this.systems)) {
            for (const dentition of ['adult', 'primary']) {
                if (system[dentition]) {
                    for (const [arch, teeth] of Object.entries(system[dentition])) {
                        for (const [side, toothList] of Object.entries(teeth)) {
                            if (Array.isArray(toothList) && toothList.includes(number)) {
                                return {
                                    number: number,
                                    system: systemName,
                                    dentition: dentition,
                                    arch: arch,
                                    side: side,
                                    type: this.getToothType(number, dentition)
                                };
                            }
                        }
                    }
                }
            }
        }
        
        return null;
    }

    // Get tooth type
    getToothType(number, dentition) {
        if (dentition === 'adult') {
            if (typeof number === 'number') {
                if (number >= 1 && number <= 8) return 'molar';
                if (number >= 9 && number <= 12) return 'incisor';
                if (number === 13 || number === 22) return 'canine';
                if ((number >= 14 && number <= 15) || (number >= 24 && number <= 25)) return 'premolar';
                if (number >= 16 && number <= 18) return 'molar';
                if (number >= 19 && number <= 21) return 'premolar';
                if (number === 23 || number === 32) return 'canine';
                if (number >= 24 && number <= 25) return 'incisor';
                if (number >= 26 && number <= 28) return 'molar';
                if (number >= 29 && number <= 31) return 'premolar';
                if (number >= 32 && number <= 38) return 'molar';
            }
        } else {
            // Primary teeth
            if (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'].includes(number)) {
                if (['C', 'H', 'M', 'R'].includes(number)) return 'canine';
                if (['D', 'E', 'F', 'G', 'N', 'O', 'P', 'Q'].includes(number)) return 'incisor';
                if (['A', 'B', 'I', 'J', 'K', 'L', 'S', 'T'].includes(number)) return 'molar';
            }
        }
        
        return 'unknown';
    }

    // Add tooth annotation
    addToothAnnotation(toothNumber, position, notes = '') {
        const toothInfo = this.getToothInfo(toothNumber);
        
        const annotation = {
            toothNumber: toothNumber,
            system: this.currentSystem,
            position: position,
            notes: notes,
            timestamp: Date.now(),
            info: toothInfo
        };
        
        this.annotations.push(annotation);
        return annotation;
    }

    // Remove tooth annotation
    removeToothAnnotation(annotationId) {
        this.annotations = this.annotations.filter(annotation => annotation.id !== annotationId);
    }

    // Get annotations for tooth
    getToothAnnotations(toothNumber) {
        return this.annotations.filter(annotation => annotation.toothNumber === toothNumber);
    }

    // Get all annotations
    getAllAnnotations() {
        return this.annotations;
    }

    // Clear all annotations
    clearAnnotations() {
        this.annotations = [];
    }

    // Export annotations
    exportAnnotations() {
        return {
            system: this.currentSystem,
            annotations: this.annotations,
            timestamp: Date.now()
        };
    }

    // Import annotations
    importAnnotations(data) {
        this.currentSystem = data.system || 'ada';
        this.annotations = data.annotations || [];
        this.updateUI();
    }

    // Generate tooth chart HTML
    generateToothChartHTML() {
        const system = this.systems[this.currentSystem];
        const chart = this.toothChart.adult; // Default to adult
        
        let html = '<div class="tooth-chart">';
        
        // Maxillary (upper) teeth
        html += '<div class="arch maxillary">';
        html += '<h3>Maxillary (Upper)</h3>';
        html += '<div class="teeth-row">';
        
        // Right side
        if (chart.maxillary.right) {
            chart.maxillary.right.forEach(tooth => {
                html += this.generateToothHTML(tooth, 'right');
            });
        }
        
        // Center teeth
        if (chart.maxillary.center) {
            chart.maxillary.center.forEach(tooth => {
                html += this.generateToothHTML(tooth, 'center');
            });
        }
        
        html += '</div></div>';
        
        // Mandibular (lower) teeth
        html += '<div class="arch mandibular">';
        html += '<h3>Mandibular (Lower)</h3>';
        html += '<div class="teeth-row">';
        
        // Left side
        if (chart.mandibular.left) {
            chart.mandibular.left.forEach(tooth => {
                html += this.generateToothHTML(tooth, 'left');
            });
        }
        
        // Center teeth
        if (chart.mandibular.center) {
            chart.mandibular.center.forEach(tooth => {
                html += this.generateToothHTML(tooth, 'center');
            });
        }
        
        html += '</div></div>';
        
        html += '</div>';
        
        return html;
    }

    // Generate individual tooth HTML
    generateToothHTML(tooth, position) {
        const typeInfo = this.toothTypes[tooth.type] || { color: '#ffffff' };
        const hasAnnotation = this.annotations.some(a => a.toothNumber === tooth.number);
        
        return `
            <div class="tooth ${tooth.type} ${position}" 
                 data-tooth="${tooth.number}" 
                 data-type="${tooth.type}"
                 style="background-color: ${typeInfo.color}; 
                        border: ${hasAnnotation ? '2px solid #ff0000' : '1px solid #333'};">
                <div class="tooth-number">${tooth.number}</div>
                <div class="tooth-type">${typeInfo.name}</div>
            </div>
        `;
    }

    // Update UI
    updateUI() {
        // Update system selector
        const systemSelector = document.getElementById('toothSystemSelector');
        if (systemSelector) {
            systemSelector.value = this.currentSystem;
        }
        
        // Update tooth chart
        const chartContainer = document.getElementById('toothChartContainer');
        if (chartContainer) {
            chartContainer.innerHTML = this.generateToothChartHTML();
        }
        
        // Update system info
        const systemInfo = document.getElementById('toothSystemInfo');
        if (systemInfo) {
            const system = this.systems[this.currentSystem];
            systemInfo.innerHTML = `
                <h4>${system.name}</h4>
                <p>${system.description}</p>
            `;
        }
    }

    // Get available systems
    getAvailableSystems() {
        return Object.keys(this.systems).map(key => ({
            id: key,
            name: this.systems[key].name,
            description: this.systems[key].description
        }));
    }

    // Validate tooth number
    validateToothNumber(number, system = null) {
        const targetSystem = system || this.currentSystem;
        const systemData = this.systems[targetSystem];
        
        if (!systemData) return false;
        
        for (const dentition of ['adult', 'primary']) {
            if (systemData[dentition]) {
                for (const arch of Object.values(systemData[dentition])) {
                    if (Array.isArray(arch) && arch.includes(number)) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }

    // Get tooth numbering guide
    getNumberingGuide() {
        return {
            ada: {
                name: 'ADA (Universal)',
                description: 'Numbers 1-32, starting from upper right wisdom tooth',
                adult: '1-16 (upper), 17-32 (lower)',
                primary: 'A-T (A-J upper, K-T lower)'
            },
            fdi: {
                name: 'FDI (Two-Digit)',
                description: 'Two-digit system, first digit = quadrant, second = tooth',
                adult: '18-28 (upper), 48-38 (lower)',
                primary: '55-65 (upper), 85-75 (lower)'
            },
            palmer: {
                name: 'Palmer',
                description: 'Uses quadrant symbols (┘┐└┙) with numbers',
                adult: '1-8 with quadrant symbols',
                primary: 'A-E with quadrant symbols'
            }
        };
    }

    // Get current system info
    getCurrentSystemInfo() {
        return this.systems[this.currentSystem];
    }

    // Search teeth by criteria
    searchTeeth(criteria) {
        const results = [];
        
        for (const [systemName, system] of Object.entries(this.systems)) {
            for (const dentition of ['adult', 'primary']) {
                if (system[dentition]) {
                    for (const [arch, teeth] of Object.entries(system[dentition])) {
                        for (const [side, toothList] of Object.entries(teeth)) {
                            if (Array.isArray(toothList)) {
                                toothList.forEach(toothNumber => {
                                    const toothInfo = this.getToothInfo(toothNumber);
                                    if (this.matchesCriteria(toothInfo, criteria)) {
                                        results.push({
                                            number: toothNumber,
                                            system: systemName,
                                            dentition: dentition,
                                            arch: arch,
                                            side: side,
                                            info: toothInfo
                                        });
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
        
        return results;
    }

    // Check if tooth matches search criteria
    matchesCriteria(toothInfo, criteria) {
        if (!toothInfo) return false;
        
        if (criteria.type && toothInfo.type !== criteria.type) return false;
        if (criteria.dentition && toothInfo.dentition !== criteria.dentition) return false;
        if (criteria.arch && toothInfo.arch !== criteria.arch) return false;
        if (criteria.side && toothInfo.side !== criteria.side) return false;
        if (criteria.system && toothInfo.system !== criteria.system) return false;
        
        return true;
    }

    // Get statistics
    getStatistics() {
        const stats = {
            totalAnnotations: this.annotations.length,
            annotationsBySystem: {},
            annotationsByType: {},
            annotationsByDentition: {},
            currentSystem: this.currentSystem
        };
        
        this.annotations.forEach(annotation => {
            // By system
            stats.annotationsBySystem[annotation.system] = (stats.annotationsBySystem[annotation.system] || 0) + 1;
            
            // By type
            if (annotation.info && annotation.info.type) {
                stats.annotationsByType[annotation.info.type] = (stats.annotationsByType[annotation.info.type] || 0) + 1;
            }
            
            // By dentition
            if (annotation.info && annotation.info.dentition) {
                stats.annotationsByDentition[annotation.info.dentition] = (stats.annotationsByDentition[annotation.info.dentition] || 0) + 1;
            }
        });
        
        return stats;
    }
}

// Export for use in main application
window.ToothNumberingSystem = ToothNumberingSystem;
