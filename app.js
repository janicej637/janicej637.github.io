/**
 * Pivoting Parallel Charts (PPC) - Core Application Engine
 * Architecture: Declarative State-Driven UI
 */

// ==========================================
// 1. GLOBAL APPLICATION STATE MANAGEMENT
// ==========================================
const State = {
    activeDataset: 'titanic',
    viewMode: 'standard', // Options: 'standard' | 'paired'
    selectedDimensions: [],
    activePivotAxis: null,
    rawRecords: []
};

// ==========================================
// 2. DATA MOCK FACTORIES & CONFIGURATIONS
// ==========================================
const DatasetConfig = {
    titanic: {
        dimensions: ['Class', 'Sex', 'Age', 'Survived'],
        generate: () => {
            const records = [];
            for (let i = 0; i < 400; i++) {
                records.push({
                    Class: Math.random() > 0.4 ? 'Third' : (Math.random() > 0.5 ? 'Second' : 'First'),
                    Sex: Math.random() > 0.52 ? 'Male' : 'Female',
                    Age: Math.random() > 0.2 ? 'Adult' : 'Child',
                    Survived: Math.random() > 0.6 ? 'Yes' : 'No'
                });
            }
            return records;
        }
    },
    mushrooms: {
        dimensions: ['CapShape', 'CapColor', 'Odor', 'Edibility'],
        generate: () => {
            const records = [];
            for (let i = 0; i < 350; i++) {
                records.push({
                    CapShape: Math.random() > 0.5 ? 'Convex' : 'Flat',
                    CapColor: Math.random() > 0.6 ? 'Brown' : (Math.random() > 0.4 ? 'Gray' : 'Red'),
                    Odor: Math.random() > 0.7 ? 'Pungent' : 'Almond',
                    Edibility: Math.random() > 0.45 ? 'Edible' : 'Poisonous'
                });
            }
            return records;
        }
    },
    covid: {
        dimensions: ['AgeGroup', 'RiskFactors', 'Hospitalization', 'Outcome'],
        generate: () => {
            const records = [];
            for (let i = 0; i < 500; i++) {
                records.push({
                    AgeGroup: Math.random() > 0.6 ? 'Elderly' : (Math.random() > 0.3 ? 'Adult' : 'Youth'),
                    RiskFactors: Math.random() > 0.4 ? 'Present' : 'None',
                    Hospitalization: Math.random() > 0.7 ? 'ICU' : 'Ward',
                    Outcome: Math.random() > 0.85 ? 'Deceased' : 'Recovered'
                });
            }
            return records;
        }
    },
    survey: {
        dimensions: ['Education', 'Income', 'Satisfaction', 'Employment'],
        generate: () => {
            const records = [];
            for (let i = 0; i < 300; i++) {
                records.push({
                    Education: Math.random() > 0.5 ? 'Degree' : 'HighSchool',
                    Income: Math.random() > 0.7 ? 'High' : (Math.random() > 0.4 ? 'Medium' : 'Low'),
                    Satisfaction: Math.random() > 0.4 ? 'Satisfied' : 'Unsatisfied',
                    Employment: Math.random() > 0.2 ? 'Employed' : 'Unemployed'
                });
            }
            return records;
        }
    }
};

// ==========================================
// 3. APPLICATION INITIALIZATION & EVENT RUNTIME
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    initDatasetTabs();
    initModeToggles();
    switchDataset(State.activeDataset);
    
    // Efficiently redrafts the visualization on browser frame changes
    window.addEventListener('resize', debounce(() => renderPPCChart(), 150));
});

function initDatasetTabs() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            
            const datasetName = e.target.getAttribute("data-dataset");
            switchDataset(datasetName);
        });
    });
}

function initModeToggles() {
    document.querySelectorAll('input[name="viewMode"]').forEach(radio => {
        radio.addEventListener("change", (e) => {
            State.viewMode = e.target.value;
            renderPPCChart();
        });
    });
}

// ==========================================
// 4. DATA COMPOSITION & CONFIGURATION ENGINE
// ==========================================
function switchDataset(datasetName) {
    State.activeDataset = datasetName;
    
    const titleContainer = document.getElementById("active-dataset-title");
    if (titleContainer) {
        titleContainer.innerText = `${datasetName.charAt(0).toUpperCase() + datasetName.slice(1)} Parallel Set Analysis`;
    }
    
    // Ingest newly compiled dataset records into application state
    const config = DatasetConfig[datasetName];
    State.rawRecords = config.generate();
    State.selectedDimensions = [...config.dimensions];
    
    // Default fallback pivot targets the final categorical column axis
    State.activePivotAxis = State.selectedDimensions[State.selectedDimensions.length - 1]; 

    renderDimensionCheckboxes(config.dimensions);
    renderPPCChart();
}

function renderDimensionCheckboxes(allDimensions) {
    const selectorBox = document.getElementById("dimension-selector-box");
    if (!selectorBox) return;
    selectorBox.innerHTML = ""; 
    
    allDimensions.forEach(dim => {
        const label = document.createElement("label");
        label.className = "check-item";
        
        const isChecked = State.selectedDimensions.includes(dim) ? "checked" : "";
        label.innerHTML = `
            <input type="checkbox" value="${dim}" ${isChecked}>
            <span>${dim}</span>
        `;
        
        label.querySelector('input').addEventListener('change', (e) => {
            const value = e.target.value;
            if (e.target.checked) {
                if (!State.selectedDimensions.includes(value)) State.selectedDimensions.push(value);
            } else {
                State.selectedDimensions = State.selectedDimensions.filter(d => d !== value);
            }
            
            // Evaluates user parameters: requires at least 3 active dimensional axes
            const warningElement = document.getElementById("dimension-warning");
            if (State.selectedDimensions.length < 3) {
                warningElement.classList.remove("hidden");
            } else {
                warningElement.classList.add("hidden");
                
                // Realignment condition if the current active pivot column is deselected
                if (!State.selectedDimensions.includes(State.activePivotAxis)) {
                    State.activePivotAxis = State.selectedDimensions[State.selectedDimensions.length - 1];
                }
                renderPPCChart();
            }
        });
        selectorBox.appendChild(label);
    });
}

// ==========================================
// 5. GRAPHICS CALCULATIONS & D3 CANVAS DRAWING
// ==========================================
function renderPPCChart() {
    const canvas = document.getElementById("parallel-chart-canvas");
    if (!canvas) return;
    canvas.innerHTML = ""; // Complete canvas flush
    
    if (State.selectedDimensions.length < 3) return; 

    // Setup chart boundaries dynamically
    const canvasWidth = canvas.clientWidth || 800;
    const canvasHeight = canvas.clientHeight || 500;
    const padding = { top: 65, right: 60, bottom: 40, left: 60 };

    const svg = d3.select("#parallel-chart-canvas")
        .append("svg")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight);

    const innerWidth = canvasWidth - padding.left - padding.right;
    const innerHeight = canvasHeight - padding.top - padding.bottom;

    const mainGroup = svg.append("g")
        .attr("transform", `translate(${padding.left}, ${padding.top})`);

    // Scale mapping out spatial positions horizontally for our selected categorical pillars
    const xScale = d3.scalePoint()
        .domain(State.selectedDimensions)
        .range([0, innerWidth]);

    // Track categoric variations available per dimension index
    const uniqueValuesMap = {};
    State.selectedDimensions.forEach(dim => {
        uniqueValuesMap[dim] = Array.from(new Set(State.rawRecords.map(r => r[dim]))).sort();
    });

    // Categorical color distribution mappings configured by active user pivot choices
    const targetPivotCategories = uniqueValuesMap[State.activePivotAxis] || [];
    const colorManager = d3.scaleOrdinal()
        .domain(targetPivotCategories)
        .range(d3.schemeTableau10);

    const pillarThickness = 32;
    const structuralScales = {};

    // --- LOOP 1: CALCULATING STACKED COLUMN PILLARS ---
    State.selectedDimensions.forEach(dim => {
        const elementFrequencies = {};
        uniqueValuesMap[dim].forEach(val => elementFrequencies[val] = 0);
        State.rawRecords.forEach(r => {
            if (elementFrequencies[r[dim]] !== undefined) elementFrequencies[r[dim]]++;
        });

        let currentYTracker = 0;
        const dimensionSlices = {};
        const sliceSpacingGutter = 14; // Controls segment tracking spaces within node stacks
        
        uniqueValuesMap[dim].forEach(categoryValue => {
            const computedSize = (elementFrequencies[categoryValue] / State.rawRecords.length) * innerHeight;
            dimensionSlices[categoryValue] = {
                yStart: currentYTracker,
                yEnd: currentYTracker + computedSize,
                size: computedSize
            };
            currentYTracker += computedSize + sliceSpacingGutter; 
        });

        structuralScales[dim] = dimensionSlices;

        // Draw structural UI component containers for nodes
        const axisGroup = mainGroup.append("g")
            .attr("class", "axis-column-group")
            .attr("transform", `translate(${xScale(dim) - pillarThickness / 2}, 0)`);

        // Interactive Header Nodes
        axisGroup.append("text")
            .attr("class", `axis-header-text ${dim === State.activePivotAxis ? 'pivot-active' : ''}`)
            .attr("x", pillarThickness / 2)
            .attr("y", -24)
            .text(dim)
            .on("click", () => {
                State.activePivotAxis = dim;
                renderPPCChart();
            });

        // Building blocks of multi-categorical stacked column profiles
        uniqueValuesMap[dim].forEach(categoryValue => {
            const dataMetrics = dimensionSlices[categoryValue];
            if (!dataMetrics || dataMetrics.size <= 0) return;

            axisGroup.append("rect")
                .attr("x", 0)
                .attr("y", dataMetrics.yStart)
                .attr("width", pillarThickness)
                .attr("height", dataMetrics.size)
                .attr("fill", "#24292e")
                .attr("stroke", "#444d56")
                .attr("stroke-width", 1.5)
                .attr("rx", 3)
                .on("mouseover", (event) => {
                    showTooltip(event, `${dim}: <strong>${categoryValue}</strong> (${elementFrequencies[categoryValue]} records)`);
                })
                .on("mouseout", hideTooltip);

            // Conditional label optimization tags inside block metrics
            if (dataMetrics.size > 20) {
                axisGroup.append("text")
                    .attr("x", pillarThickness / 2)
                    .attr("y", dataMetrics.yStart + dataMetrics.size / 2 + 4)
                    .attr("fill", "#adbac7")
                    .attr("font-size", "10px")
                    .attr("text-anchor", "middle")
                    .style("pointer-events", "none")
                    .text(categoryValue);
            }
        });
    });

    // --- LOOP 2: VECTOR BEZIER STREAM RIBBON GENERATION ---
    for (let i = 0; i < State.selectedDimensions.length - 1; i++) {
        const leftDimension = State.selectedDimensions[i];
        const rightDimension = State.selectedDimensions[i + 1];
        const connectionAggregates = {};

        // Ingest and sort connection frequencies based on view type
        State.rawRecords.forEach(record => {
            const leftVal = record[leftDimension];
            const rightVal = record[rightDimension];
            const pivotVal = record[State.activePivotAxis];

            // In Standard Mode, coloring relies globally on active pivot keys.
            // In Paired Mode, ribbons trace origin tracking from the left adjacent column component node.
            const uniqueKey = State.viewMode === 'standard'
                ? `${leftVal}|||${rightVal}|||${pivotVal}`
                : `${leftVal}|||${rightVal}|||${leftVal}`;

            if (!connectionAggregates[uniqueKey]) {
                connectionAggregates[uniqueKey] = {
                    leftVal: leftVal,
                    rightVal: rightVal,
                    pivotVal: pivotVal,
                    volume: 0
                };
            }
            connectionAggregates[uniqueKey].volume++;
        });

        // Tracks exact running alignment height metrics to eliminate intersection rendering overlaps
        const dynamicOffsetsLeft = {};
        const dynamicOffsetsRight = {};

        Object.values(connectionAggregates).forEach(stream => {
            const xCoordLeft = xScale(leftDimension) + pillarThickness / 2;
            const xCoordRight = xScale(rightDimension) - pillarThickness / 2;

            const scaleLeft = structuralScales[leftDimension][stream.leftVal];
            const scaleRight = structuralScales[rightDimension][stream.rightVal];

            if (!scaleLeft || !scaleRight) return;

            if (!dynamicOffsetsLeft[stream.leftVal]) dynamicOffsetsLeft[stream.leftVal] = scaleLeft.yStart;
            if (!dynamicOffsetsRight[stream.rightVal]) dynamicOffsetsRight[stream.rightVal] = scaleRight.yStart;

            const streamThickness = (stream.volume / State.rawRecords.length) * innerHeight;

            const yLeftStart = dynamicOffsetsLeft[stream.leftVal];
            const yRightStart = dynamicOffsetsRight[stream.rightVal];

            // Advance offset markers chronologically along with connection widths
            dynamicOffsetsLeft[stream.leftVal] += streamThickness;
            dynamicOffsetsRight[stream.rightVal] += streamThickness;

            // Generate fluid architectural flow patterns via coordinate curve tracing paths
            const ribbonCurvePath = d3.path();
            ribbonCurvePath.moveTo(xCoordLeft, yLeftStart);
            ribbonCurvePath.bezierCurveTo((xCoordLeft + xCoordRight) / 2, yLeftStart, (xCoordLeft + xCoordRight) / 2, yRightStart, xCoordRight, yRightStart);
            ribbonCurvePath.lineTo(xCoordRight, yRightStart + streamThickness);
            ribbonCurvePath.bezierCurveTo((xCoordLeft + xCoordRight) / 2, yRightStart + streamThickness, (xCoordLeft + xCoordRight) / 2, yLeftStart + streamThickness, xCoordLeft, yLeftStart + streamThickness);
            ribbonCurvePath.closePath();

            const finalRibbonColor = State.viewMode === 'standard' 
                ? colorManager(stream.pivotVal) 
                : colorManager(stream.leftVal);

            mainGroup.append("path")
                .attr("class", "ribbon-link")
                .attr("d", ribbonCurvePath.toString())
                .attr("fill", finalRibbonColor)
                .on("mouseover", (event) => {
                    showTooltip(event, `
                        <strong>Flow Path Route:</strong><br/>
                        ${leftDimension} (${stream.leftVal}) → ${rightDimension} (${stream.rightVal})<br/>
                        <strong>Volume Track:</strong> ${stream.volume} records
                    `);
                })
                .on("mouseout", hideTooltip);
        });
    }
}

// ==========================================
// 6. TOOLTIP OVERLAYS & HELPER UTILITIES
// ==========================================
function showTooltip(event, markup) {
    const tooltip = document.getElementById("chart-tooltip");
    if (!tooltip) return;
    tooltip.innerHTML = markup;
    tooltip.classList.remove("hidden");
    tooltip.style.left = (event.pageX + 16) + "px";
    tooltip.style.top = (event.pageY + 16) + "px";
}

function hideTooltip() {
    const tooltip = document.getElementById("chart-tooltip");
    if (tooltip) tooltip.classList.add("hidden");
}

/**
 * Standard utility wrapper limits execution frequencies of expensive resize layout reflow routines
 */
function debounce(callback, delayWindow) {
    let timeoutToken;
    return (...args) => {
        clearTimeout(timeoutToken);
        timeoutToken = setTimeout(() => callback.apply(this, args), delayWindow);
    };
}
