// --- CENTRAL GLOBAL APP STATE ---
const State = {
    activeDataset: 'titanic',
    viewMode: 'standard', // 'standard' or 'paired'
    selectedDimensions: [],
    activePivotAxis: null,
    rawRecords: []
};

// --- MULTI-DATASET DICTIONARY REPOSITORIES ---
const MockDataConfig = {
    titanic: {
        dimensions: ['Class', 'Sex', 'Age', 'Survived'],
        generate: () => {
            const arr = [];
            for(let i=0; i<400; i++) {
                arr.push({
                    Class: Math.random() > 0.4 ? 'Third' : (Math.random() > 0.5 ? 'Second' : 'First'),
                    Sex: Math.random() > 0.52 ? 'Male' : 'Female',
                    Age: Math.random() > 0.2 ? 'Adult' : 'Child',
                    Survived: Math.random() > 0.6 ? 'Yes' : 'No'
                });
            }
            return arr;
        }
    },
    mushrooms: {
        dimensions: ['CapShape', 'CapColor', 'Odor', 'Edibility'],
        generate: () => {
            const arr = [];
            for(let i=0; i<350; i++) {
                arr.push({
                    CapShape: Math.random() > 0.5 ? 'Convex' : 'Flat',
                    CapColor: Math.random() > 0.6 ? 'Brown' : (Math.random() > 0.4 ? 'Gray' : 'Red'),
                    Odor: Math.random() > 0.7 ? 'Pungent' : 'Almond',
                    Edibility: Math.random() > 0.45 ? 'Edible' : 'Poisonous'
                });
            }
            return arr;
        }
    },
    covid: {
        dimensions: ['AgeGroup', 'RiskFactors', 'Hospitalization', 'Outcome'],
        generate: () => {
            const arr = [];
            for(let i=0; i<500; i++) {
                arr.push({
                    AgeGroup: Math.random() > 0.6 ? 'Elderly' : (Math.random() > 0.3 ? 'Adult' : 'Youth'),
                    RiskFactors: Math.random() > 0.4 ? 'Present' : 'None',
                    Hospitalization: Math.random() > 0.7 ? 'ICU' : 'Ward',
                    Outcome: Math.random() > 0.85 ? 'Deceased' : 'Recovered'
                });
            }
            return arr;
        }
    },
    survey: {
        dimensions: ['Education', 'Income', 'Satisfaction', 'Employment'],
        generate: () => {
            const arr = [];
            for(let i=0; i<300; i++) {
                arr.push({
                    Education: Math.random() > 0.5 ? 'Degree' : 'HighSchool',
                    Income: Math.random() > 0.7 ? 'High' : (Math.random() > 0.4 ? 'Medium' : 'Low'),
                    Satisfaction: Math.random() > 0.4 ? 'Satisfied' : 'Unsatisfied',
                    Employment: Math.random() > 0.2 ? 'Employed' : 'Unemployed'
                });
            }
            return arr;
        }
    }
};

// --- INITIALIZE SYSTEM ENTRY POINT ---
document.addEventListener("DOMContentLoaded", () => {
    setupTabListeners();
    setupModeToggleListeners();
    loadDataset(State.activeDataset);
    
    window.addEventListener('resize', () => renderPPCChart());
});

// --- CORE INTERFACE ACTION LISTENERS ---
function setupTabListeners() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            
            const targetData = e.target.getAttribute("data-dataset");
            loadDataset(targetData);
        });
    });
}

function setupModeToggleListeners() {
    document.querySelectorAll('input[name="viewMode"]').forEach(radio => {
        radio.addEventListener("change", (e) => {
            State.viewMode = e.target.value;
            renderPPCChart();
        });
    });
}

// --- CONFIGURATION POPULATION ENGINE ---
function loadDataset(name) {
    State.activeDataset = name;
    document.getElementById("active-dataset-title").innerText = `${name.charAt(0).toUpperCase() + name.slice(1)} Parallel Set Analysis`;
    
    // Generate/Fetch Data Array
    State.rawRecords = MockDataConfig[name].generate();
    
    // Set up default dimensions (All active on start)
    const config = MockDataConfig[name];
    State.selectedDimensions = [...config.dimensions];
    State.activePivotAxis = State.selectedDimensions[State.selectedDimensions.length - 1]; // Target final column as initial pivot 

    buildDimensionSelectors(config.dimensions);
    renderPPCChart();
}

function buildDimensionSelectors(allDimensions) {
    const box = document.getElementById("dimension-selector-box");
    box.innerHTML = ""; // Empty older nodes
    
    allDimensions.forEach(dim => {
        const label = document.createElement("label");
        label.className = "check-item";
        
        const isChecked = State.selectedDimensions.includes(dim) ? "checked" : "";
        label.innerHTML = `
            <input type="checkbox" value="${dim}" ${isChecked}>
            <span>${dim}</span>
        `;
        
        // Setup state bindings inside checkboxes
        label.querySelector('input').addEventListener('change', (e) => {
            const val = e.target.value;
            if(e.target.checked) {
                if(!State.selectedDimensions.includes(val)) State.selectedDimensions.push(val);
            } else {
                State.selectedDimensions = State.selectedDimensions.filter(d => d !== val);
            }
            
            // Validate minimum dimension counts (Requires 3 dimensions or more)
            const warning = document.getElementById("dimension-warning");
            if (State.selectedDimensions.length < 3) {
                warning.classList.remove("hidden");
            } else {
                warning.classList.add("hidden");
                // Correct pivot vector fallback assignment if old pivot removed
                if(!State.selectedDimensions.includes(State.activePivotAxis)) {
                    State.activePivotAxis = State.selectedDimensions[State.selectedDimensions.length - 1];
                }
                renderPPCChart();
            }
        });
        box.appendChild(label);
    });
}

// --- D3 CHART RENDERING GENERATOR ---
function renderPPCChart() {
    const container = document.getElementById("parallel-chart-canvas");
    container.innerHTML = ""; // Wipe canvas element clean
    
    if (State.selectedDimensions.length < 3) return; // Prevent break conditions

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const margin = { top: 60, right: 50, bottom: 40, left: 50 };

    const svg = d3.select("#parallel-chart-canvas")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // 1. Establish Layout Horizontal Axis Positioning Scales
    const xScale = d3.scalePoint()
        .domain(State.selectedDimensions)
        .range([0, chartWidth]);

    // 2. Discover Categorical Item Subdivisions per Axis Block
    const axisSubdivisions = {};
    State.selectedDimensions.forEach(dim => {
        const uniqueValues = Array.from(new Set(State.rawRecords.map(r => r[dim]))).sort();
        axisSubdivisions[dim] = uniqueValues;
    });

    // 3. Establish Categorical Palette Profiles for the Current Active Pivot
    const pivotValues = axisSubdivisions[State.activePivotAxis] || [];
    const colorScale = d3.scaleOrdinal()
        .domain(pivotValues)
        .range(d3.schemeTableau10);

    // 4. Render Parallel Node Categorical Stack Pillars
    const pillarWidth = 30;
    const verticalScales = {};

    State.selectedDimensions.forEach(dim => {
        // Compute frequencies
        const counts = {};
        axisSubdivisions[dim].forEach(v => counts[v] = 0);
        State.rawRecords.forEach(r => {
            if(counts[r[dim]] !== undefined) counts[r[dim]]++;
        });

        // Map layout bounding segment coordinates vertically
        let currentY = 0;
        const segmentMappings = {};
        
        axisSubdivisions[dim].forEach(val => {
            const size = (counts[val] / State.rawRecords.length) * chartHeight;
            segmentMappings[val] = {
                yStart: currentY,
                yEnd: currentY + size,
                size: size
            };
            currentY += size + 15; // Injects slight tracking gutter separation spacing spaces between node rows
        });

        verticalScales[dim] = segmentMappings;

        // Visual Pillar Assembly Groups
        const columnGroup = g.append("g")
            .attr("class", "axis-column-group")
            .attr("transform", `translate(${xScale(dim) - pillarWidth/2}, 0)`);

        // Inject Interactive Header labels
        columnGroup.append("text")
            .attr("class", `axis-header-text ${dim === State.activePivotAxis ? 'pivot-active' : ''}`)
            .attr("x", pillarWidth / 2)
            .attr("y", -20)
            .text(dim)
            .on("click", (event) => {
                State.activePivotAxis = dim;
                renderPPCChart();
            });

        // Draw Individual Component Stack Category Target Blocks
        axisSubdivisions[dim].forEach(val => {
            const mapData = segmentMappings[val];
            if(!mapData || mapData.size <= 0) return;

            columnGroup.append("rect")
                .attr("x", 0)
                .attr("y", mapData.yStart)
                .attr("width", pillarWidth)
                .attr("height", mapData.size)
                .attr("fill", "#2c3e50")
                .attr("stroke", "#7f8c8d")
                .attr("stroke-width", 1)
                .on("mouseover", (event) => showTooltip(event, `${dim}: <strong>${val}</strong> (${counts[val]} entries)`))
                .on("mouseout", hideTooltip);

