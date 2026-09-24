
/*
 * Pivoting Parallel Charts (PPC) - Corrected Core Engine
 *
 * Features:
 *   - Titanic
 *   - Mushrooms
 *   - Covid
 *   - Survey
 *   - Standard Mode
 *   - Paired Mode
 *   - Dimension selection
 *   - Minimum 3 dimensions
 *   - Pivot-axis selection
 *   - Safe dataset switching
 *   - D3 parallel-set rendering
 *   - Automatic creation of missing UI containers
 */

"use strict";


/* =========================================================
   1. GLOBAL APPLICATION STATE
   ========================================================= */

const State = {

    activeDataset: "titanic",

    viewMode: "standard",

    selectedDimensions: [],

    activePivotAxis: null,

    rawRecords: []

};


/* =========================================================
   2. DATASET CONFIGURATION
   ========================================================= */

const DatasetConfig = {

    titanic: {

        dimensions: [
            "Class",
            "Sex",
            "Age",
            "Survived"
        ],

        generate: () => {

            const records = [];

            for (let i = 0; i < 400; i++) {

                records.push({

                    Class:
                        Math.random() > 0.4
                            ? "Third"
                            : (
                                Math.random() > 0.5
                                    ? "Second"
                                    : "First"
                            ),

                    Sex:
                        Math.random() > 0.52
                            ? "Male"
                            : "Female",

                    Age:
                        Math.random() > 0.2
                            ? "Adult"
                            : "Child",

                    Survived:
                        Math.random() > 0.6
                            ? "Yes"
                            : "No"

                });

            }

            return records;
        }
    },


    mushrooms: {

        dimensions: [
            "CapShape",
            "CapColor",
            "Odor",
            "Edibility"
        ],

        generate: () => {

            const records = [];

            for (let i = 0; i < 350; i++) {

                records.push({

                    CapShape:
                        Math.random() > 0.5
                            ? "Convex"
                            : "Flat",

                    CapColor:
                        Math.random() > 0.6
                            ? "Brown"
                            : (
                                Math.random() > 0.4
                                    ? "Gray"
                                    : "Red"
                            ),

                    Odor:
                        Math.random() > 0.7
                            ? "Pungent"
                            : "Almond",

                    Edibility:
                        Math.random() > 0.45
                            ? "Edible"
                            : "Poisonous"

                });

            }

            return records;
        }
    },


    covid: {

        dimensions: [
            "AgeGroup",
            "RiskFactors",
            "Hospitalization",
            "Outcome"
        ],

        generate: () => {

            const records = [];

            for (let i = 0; i < 500; i++) {

                records.push({

                    AgeGroup:
                        Math.random() > 0.6
                            ? "Elderly"
                            : (
                                Math.random() > 0.3
                                    ? "Adult"
                                    : "Youth"
                            ),

                    RiskFactors:
                        Math.random() > 0.4
                            ? "Present"
                            : "None",

                    Hospitalization:
                        Math.random() > 0.7
                            ? "ICU"
                            : "Ward",

                    Outcome:
                        Math.random() > 0.85
                            ? "Deceased"
                            : "Recovered"

                });

            }

            return records;
        }
    },


    survey: {

        dimensions: [
            "Education",
            "Income",
            "Satisfaction",
            "Employment"
        ],

        generate: () => {

            const records = [];

            for (let i = 0; i < 300; i++) {

                records.push({

                    Education:
                        Math.random() > 0.5
                            ? "Degree"
                            : "HighSchool",

                    Income:
                        Math.random() > 0.7
                            ? "High"
                            : (
                                Math.random() > 0.4
                                    ? "Medium"
                                    : "Low"
                            ),

                    Satisfaction:
                        Math.random() > 0.4
                            ? "Satisfied"
                            : "Unsatisfied",

                    Employment:
                        Math.random() > 0.2
                            ? "Employed"
                            : "Unemployed"

                });

            }

            return records;
        }
    }

};


/* =========================================================
   3. DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    ensureRequiredUI();

    initDatasetTabs();

    initModeToggles();

    switchDataset(State.activeDataset);

    window.addEventListener(
        "resize",
        debounce(
            () => renderPPCChart(),
            150
        )
    );

});


/* =========================================================
   4. CREATE MISSING UI ELEMENTS
   ========================================================= */

function ensureRequiredUI() {

    /*
     * Dimension selector
     */

    let selector =
        document.getElementById(
            "dimension-selector-box"
        );

    if (!selector) {

        selector =
            document.createElement("div");

        selector.id =
            "dimension-selector-box";

        selector.className =
            "dimension-selector-box";

        const warning =
            document.getElementById(
                "dimension-warning"
            );

        if (warning && warning.parentNode) {

            warning.parentNode.insertBefore(
                selector,
                warning
            );

        } else {

            const mode =
                document.querySelector(
                    'input[name="viewMode"]'
                );

            if (
                mode &&
                mode.parentNode
            ) {

                mode.parentNode.appendChild(
                    selector
                );

            } else {

                document.body.appendChild(
                    selector
                );
            }
        }
    }


    /*
     * Dimension warning
     */

    let warning =
        document.getElementById(
            "dimension-warning"
        );

    if (!warning) {

        warning =
            document.createElement("div");

        warning.id =
            "dimension-warning";

        warning.className =
            "hidden";

        warning.textContent =
            "Select 3 or more dimensions to visualize.";

        selector.parentNode.insertBefore(
            warning,
            selector.nextSibling
        );
    }


    /*
     * Chart container
     */

    let chart =
        document.getElementById(
            "parallel-chart-canvas"
        );

    if (!chart) {

        chart =
            document.createElement("div");

        chart.id =
            "parallel-chart-canvas";

        chart.style.width =
            "100%";

        chart.style.minHeight =
            "500px";

        chart.style.position =
            "relative";

        document.body.appendChild(
            chart
        );
    }


    /*
     * Tooltip
     */

    let tooltip =
        document.getElementById(
            "chart-tooltip"
        );

    if (!tooltip) {

        tooltip =
            document.createElement("div");

        tooltip.id =
            "chart-tooltip";

        tooltip.className =
            "hidden";

        document.body.appendChild(
            tooltip
        );
    }

}


/* =========================================================
   5. DATASET TABS
   ========================================================= */

function initDatasetTabs() {

    document
        .querySelectorAll(".tab-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".tab-btn"
                        )
                        .forEach(btn => {

                            btn.classList.remove(
                                "active"
                            );

                        });

                    this.classList.add(
                        "active"
                    );

                    const datasetName =
                        this.getAttribute(
                            "data-dataset"
                        );

                    if (
                        DatasetConfig[
                            datasetName
                        ]
                    ) {

                        switchDataset(
                            datasetName
                        );
                    }

                }
            );

        });

}


/* =========================================================
   6. MODE TOGGLES
   ========================================================= */

function initModeToggles() {

    document
        .querySelectorAll(
            'input[name="viewMode"]'
        )
        .forEach(radio => {

            radio.addEventListener(
                "change",
                function () {

                    if (!this.checked) {
                        return;
                    }

                    State.viewMode =
                        this.value === "paired"
                            ? "paired"
                            : "standard";

                    renderPPCChart();

                }
            );

        });

}


/* =========================================================
   7. SWITCH DATASET
   ========================================================= */

function switchDataset(datasetName) {

    const config =
        DatasetConfig[
            datasetName
        ];

    if (!config) {

        console.error(
            "Unknown dataset:",
            datasetName
        );

        return;
    }


    State.activeDataset =
        datasetName;


    /*
     * Generate records.
     */

    State.rawRecords =
        config.generate();


    /*
     * Reset dimensions.
     */

    State.selectedDimensions =
        [...config.dimensions];


    /*
     * Last dimension is default pivot.
     */

    State.activePivotAxis =
        State.selectedDimensions[
            State.selectedDimensions.length - 1
        ] || null;


    /*
     * Update title.
     */

    const titleContainer =
        document.getElementById(
            "active-dataset-title"
        );

    if (titleContainer) {

        titleContainer.innerText =
            `${capitalize(datasetName)} Parallel Set Analysis`;

    }


    /*
     * Highlight correct tab.
     */

    document
        .querySelectorAll(".tab-btn")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.getAttribute(
                    "data-dataset"
                ) === datasetName
            );

        });


    renderDimensionCheckboxes(
        config.dimensions
    );


    updateDimensionWarning();

    renderPPCChart();

}


/* =========================================================
   8. DIMENSION CHECKBOXES
   ========================================================= */

function renderDimensionCheckboxes(
    allDimensions
) {

    const selectorBox =
        document.getElementById(
            "dimension-selector-box"
        );

    if (!selectorBox) {
        return;
    }


    selectorBox.innerHTML = "";


    /*
     * Add heading.
     */

    const heading =
        document.createElement("div");

    heading.className =
        "dimension-selector-heading";

    heading.textContent =
        "Choose Dimensions";

    selectorBox.appendChild(
        heading
    );


    allDimensions.forEach(
        dimension => {

            const label =
                document.createElement(
                    "label"
                );

            label.className =
                "check-item";


            const input =
                document.createElement(
                    "input"
                );

            input.type =
                "checkbox";

            input.value =
                dimension;

            input.checked =
                State.selectedDimensions.includes(
                    dimension
                );


            const text =
                document.createElement(
                    "span"
                );

            text.textContent =
                dimension;


            label.appendChild(
                input
            );

            label.appendChild(
                text
            );


            input.addEventListener(
                "change",
                function () {

                    const value =
                        this.value;


                    if (this.checked) {

                        if (
                            !State.selectedDimensions.includes(
                                value
                            )
                        ) {

                            State.selectedDimensions.push(
                                value
                            );

                        }

                    } else {

                        State.selectedDimensions =
                            State.selectedDimensions.filter(
                                dimensionName =>
                                    dimensionName !== value
                            );


                        /*
                         * If pivot was removed,
                         * select another active dimension.
                         */

                        if (
                            State.activePivotAxis ===
                            value
                        ) {

                            State.activePivotAxis =
                                State.selectedDimensions[
                                    State.selectedDimensions.length - 1
                                ] || null;

                        }

                    }


                    /*
                     * Always update warning safely.
                     */

                    updateDimensionWarning();


                    /*
                     * Only render if enough dimensions.
                     */

                    if (
                        State.selectedDimensions.length >= 3
                    ) {

                        renderPPCChart();

                    } else {

                        clearChart();

                    }

                }
            );


            selectorBox.appendChild(
                label
            );

        }
    );

}


/* =========================================================
   9. DIMENSION WARNING
   ========================================================= */

function updateDimensionWarning() {

    const warning =
        document.getElementById(
            "dimension-warning"
        );

    if (!warning) {
        return;
    }


    const tooFew =
        State.selectedDimensions.length < 3;


    warning.classList.toggle(
        "hidden",
        !tooFew
    );


    if (tooFew) {

        warning.textContent =
            `Select ${
                3 - State.selectedDimensions.length
            } more dimension${
                3 - State.selectedDimensions.length === 1
                    ? ""
                    : "s"
            } to visualize.`;

    }

}


/* =========================================================
   10. CLEAR CHART
   ========================================================= */

function clearChart() {

    const canvas =
        document.getElementById(
            "parallel-chart-canvas"
        );

    if (canvas) {

        canvas.innerHTML = "";

    }

}


/* =========================================================
   11. MAIN PPC RENDERER
   ========================================================= */

function renderPPCChart() {

    const canvas =
        document.getElementById(
            "parallel-chart-canvas"
        );


    if (!canvas) {
        return;
    }


    canvas.innerHTML = "";


    /*
     * Validate D3.
     */

    if (
        typeof window.d3 ===
        "undefined"
    ) {

        canvas.innerHTML =
            `<div class="chart-error">
                D3.js is not loaded.
                Please include D3 before app.js.
            </div>`;

        console.error(
            "PPC Error: D3.js is not loaded."
        );

        return;
    }


    /*
     * Need at least three dimensions.
     */

    if (
        State.selectedDimensions.length < 3
    ) {

        return;
    }


    /*
     * Need data.
     */

    if (
        !State.rawRecords ||
        !State.rawRecords.length
    ) {

        canvas.innerHTML =
            `<div class="chart-error">
                No records available for this dataset.
            </div>`;

        return;
    }


    const canvasWidth =
        canvas.clientWidth || 900;

    const canvasHeight =
        canvas.clientHeight || 520;


    const padding = {

        top: 75,

        right: 70,

        bottom: 45,

        left: 70

    };


    const svg =
        d3.select(canvas)
            .append("svg")
            .attr(
                "width",
                "100%"
            )
            .attr(
                "height",
                canvasHeight
            )
            .attr(
                "viewBox",
                `0 0 ${canvasWidth} ${canvasHeight}`
            )
            .attr(
                "preserveAspectRatio",
                "xMidYMid meet"
            );


    const innerWidth =
        Math.max(
            100,
            canvasWidth -
            padding.left -
            padding.right
        );


    const innerHeight =
        Math.max(
            100,
            canvasHeight -
            padding.top -
            padding.bottom
        );


    const mainGroup =
        svg.append("g")
            .attr(
                "transform",
                `translate(
                    ${padding.left},
                    ${padding.top}
                )`
            );


    /*
     * Horizontal dimension scale.
     */

    const xScale =
        d3.scalePoint()
            .domain(
                State.selectedDimensions
            )
            .range([
                0,
                innerWidth
            ]);


    /*
     * Unique categories.
     */

    const uniqueValuesMap = {};


    State.selectedDimensions.forEach(
        dimension => {

            uniqueValuesMap[
                dimension
            ] =
                Array.from(
                    new Set(
                        State.rawRecords
                            .map(
                                record =>
                                    record[
                                        dimension
                                    ]
                            )
                            .filter(
                                value =>
                                    value !==
                                    undefined &&
                                    value !== null
                            )
                    )
                ).sort();

        }
    );


    /*
     * Pivot categories.
     */

    const pivotCategories =
        uniqueValuesMap[
            State.activePivotAxis
        ] || [];


    const colorManager =
        d3.scaleOrdinal()
            .domain(
                pivotCategories
            )
            .range(
                d3.schemeTableau10
            );


    const pillarThickness =
        34;


    const structuralScales = {};


    /* =====================================================
       12. DRAW DIMENSION PILLARS
       ===================================================== */

    State.selectedDimensions.forEach(
        dimension => {

            const frequencies = {};


            uniqueValuesMap[
                dimension
            ].forEach(
                value => {

                    frequencies[
                        value
                    ] = 0;

                }
            );


            State.rawRecords.forEach(
                record => {

                    const value =
                        record[
                            dimension
                        ];

                    if (
                        frequencies[
                            value
                        ] !== undefined
                    ) {

                        frequencies[
                            value
                        ]++;

                    }

                }
            );


            const total =
                State.rawRecords.length;


            const values =
                uniqueValuesMap[
                    dimension
                ];


            const gap =
                values.length > 1
                    ? Math.min(
                        10,
                        14 / values.length
                    )
                    : 0;


            const usableHeight =
                Math.max(
                    50,
                    innerHeight -
                    gap *
                    Math.max(
                        0,
                        values.length - 1
                    )
                );


            let currentY = 0;


            const slices = {};


            values.forEach(
                value => {

                    const height =
                        (
                            frequencies[
                                value
                            ] /
                            total
                        ) *
                        usableHeight;


                    slices[
                        value
                    ] = {

                        yStart:
                            currentY,

                        yEnd:
                            currentY +
                            height,

                        size:
                            height

                    };


                    currentY +=
                        height +
                        gap;

                }
            );


            structuralScales[
                dimension
            ] =
                slices;


            const axisGroup =
                mainGroup
                    .append("g")
                    .attr(
                        "class",
                        "axis-column-group"
                    )
                    .attr(
                        "transform",
                        `translate(
                            ${
                                xScale(
                                    dimension
                                ) -
                                pillarThickness / 2
                            },
                            0
                        )`
                    );


            /*
             * Axis header.
             */

            axisGroup
                .append("text")
                .attr(
                    "class",
                    `axis-header-text ${
                        dimension ===
                        State.activePivotAxis
                            ? "pivot-active"
                            : ""
                    }`
                )
                .attr(
                    "x",
                    pillarThickness / 2
                )
                .attr(
                    "y",
                    -28
                )
                .attr(
                    "text-anchor",
                    "middle"
                )
                .style(
                    "cursor",
                    "pointer"
                )
                .text(
                    dimension
                )
                .on(
                    "click",
                    () => {

                        State.activePivotAxis =
                            dimension;

                        renderPPCChart();

                    }
                );


            /*
             * Pivot indicator.
             */

            if (
                dimension ===
                State.activePivotAxis
            ) {

                axisGroup
                    .append("text")
                    .attr(
                        "x",
                        pillarThickness / 2
                    )
                    .attr(
                        "y",
                        -10
                    )
                    .attr(
                        "text-anchor",
                        "middle"
                    )
                    .attr(
                        "font-size",
                        "10px"
                    )
                    .attr(
                        "fill",
                        "#f59e0b"
                    )
                    .text(
                        "PIVOT"
                    );

            }


            /*
             * Category blocks.
             */

            values.forEach(
                value => {

                    const metrics =
                        slices[value];


                    if (
                        !metrics ||
                        metrics.size <= 0
                    ) {

                        return;
                    }


                    /*
                     * Determine color.
                     */

                    let fill;


                    if (
                        State.viewMode ===
                        "standard"
                    ) {

                        fill =
                            colorManager(
                                State.activePivotAxis ===
                                dimension
                                    ? value
                                    : State.activePivotAxis &&
                                      State.rawRecords.find(
                                          record =>
                                              record[
                                                  dimension
                                              ] === value
                                      )?.[
                                          State.activePivotAxis
                                      ]
                            );

                    } else {

                        /*
                         * Paired mode uses the
                         * local dimension category.
                         */

                        fill =
                            colorManager(
                                value
                            );

                    }


                    /*
                     * Fallback if D3 cannot
                     * resolve a category.
                     */

                    if (!fill) {

                        fill =
                            "#24292e";

                    }


                    axisGroup
                        .append("rect")
                        .attr(
                            "x",
                            0
                        )
                        .attr(
                            "y",
                            metrics.yStart
                        )
                        .attr(
                            "width",
                            pillarThickness
                        )
                        .attr(
                            "height",
                            metrics.size
                        )
                        .attr(
                            "fill",
                            fill
                        )
                        .attr(
                            "stroke",
                            "#ffffff"
                        )
                        .attr(
                            "stroke-opacity",
                            0.18
                        )
                        .attr(
                            "rx",
                            4
                        )
                        .on(
                            "mouseover",
                            event => {

                                showTooltip(
                                    event,
                                    `<strong>${escapeHtml(
                                        dimension
                                    )}</strong><br>
                                    ${escapeHtml(
                                        value
                                    )}<br>
                                    ${frequencies[
                                        value
                                    ]} records`
                                );

                            }
                        )
                        .on(
                            "mouseout",
                            hideTooltip
                        );


                    /*
                     * Category labels.
                     */

                    if (
                        metrics.size > 20
                    ) {

                        axisGroup
                            .append("text")
                            .attr(
                                "x",
                                pillarThickness / 2
                            )
                            .attr(
                                "y",
                                metrics.yStart +
                                metrics.size / 2 +
                                4
                            )
                            .attr(
                                "fill",
                                "#ffffff"
                            )
                            .attr(
                                "font-size",
                                "10px"
                            )
                            .attr(
                                "text-anchor",
                                "middle"
                            )
                            .style(
                                "pointer-events",
                                "none"
                            )
                            .text(
                                value
                            );

                    }

                });

        }
    );


    /* =====================================================
       13. DRAW CONNECTIONS
       ===================================================== */

    for (
        let i = 0;
        i <
        State.selectedDimensions.length - 1;
        i++
    ) {

        const leftDimension =
            State.selectedDimensions[i];

        const rightDimension =
            State.selectedDimensions[
                i + 1
            ];


        const aggregates = {};


        State.rawRecords.forEach(
            record => {

                const leftValue =
                    record[
                        leftDimension
                    ];

                const rightValue =
                    record[
                        rightDimension
                    ];

                const pivotValue =
                    record[
                        State.activePivotAxis
                    ];


                /*
                 * Standard Mode:
                 * left + right + pivot
                 *
                 * Paired Mode:
                 * left + right
                 */

                const key =
                    State.viewMode ===
                    "standard"

                        ? [
                            leftValue,
                            rightValue,
                            pivotValue
                        ].join("|||")

                        : [
                            leftValue,
                            rightValue
                        ].join("|||");


                if (
                    !aggregates[key]
                ) {

                    aggregates[key] = {

                        leftVal:
                            leftValue,

                        rightVal:
                            rightValue,

                        pivotVal:
                            pivotValue,

                        volume:
                            0

                    };

                }


                aggregates[key].volume++;

            }
        );


        const leftOffsets = {};

        const rightOffsets = {};


        Object.values(
            aggregates
        ).forEach(
            stream => {

                const leftScale =
                    structuralScales[
                        leftDimension
                    ]?.[
                        stream.leftVal
                    ];


                const rightScale =
                    structuralScales[
                        rightDimension
                    ]?.[
                        stream.rightVal
                    ];


                if (
                    !leftScale ||
                    !rightScale
                ) {

                    return;
                }


                if (
                    leftOffsets[
                        stream.leftVal
                    ] === undefined
                ) {

                    leftOffsets[
                        stream.leftVal
                    ] =
                        leftScale.yStart;

                }


                if (
                    rightOffsets[
                        stream.rightVal
                    ] === undefined
                ) {

                    rightOffsets[
                        stream.rightVal
                    ] =
                        rightScale.yStart;

                }


                const streamThickness =
                    (
                        stream.volume /
                        State.rawRecords.length
                    ) *
                    innerHeight;


                if (
                    streamThickness <= 0
                ) {

                    return;
                }


                const yLeftStart =
                    leftOffsets[
                        stream.leftVal
                    ];


                const yRightStart =
                    rightOffsets[
                        stream.rightVal
                    ];


                leftOffsets[
                    stream.leftVal
                ] +=
                    streamThickness;


                rightOffsets[
                    stream.rightVal
                ] +=
                    streamThickness;


                const xLeft =
                    xScale(
                        leftDimension
                    ) +
                    pillarThickness / 2;


                const xRight =
                    xScale(
                        rightDimension
                    ) -
                    pillarThickness / 2;


                const middleX =
                    (
                        xLeft +
                        xRight
                    ) / 2;


                const path =
                    d3.path();


                path.moveTo(
                    xLeft,
                    yLeftStart
                );


                path.bezierCurveTo(
                    middleX,
                    yLeftStart,
                    middleX,
                    yRightStart,
                    xRight,
                    yRightStart
                );


                path.lineTo(
                    xRight,
                    yRightStart +
                    streamThickness
                );


                path.bezierCurveTo(
                    middleX,
                    yRightStart +
                    streamThickness,
                    middleX,
                    yLeftStart +
                    streamThickness,
                    xLeft,
                    yLeftStart +
                    streamThickness
                );


                path.closePath();


                let ribbonColor;


                if (
                    State.viewMode ===
                    "standard"
                ) {

                    ribbonColor =
                        colorManager(
                            stream.pivotVal
                        );

                } else {

                    ribbonColor =
                        colorManager(
                            stream.leftVal
                        );

                }


                mainGroup
                    .append("path")
                    .attr(
                        "class",
                        "ribbon-link"
                    )
                    .attr(
                        "d",
                        path.toString()
                    )
                    .attr(
                        "fill",
                        ribbonColor
                    )
                    .attr(
                        "fill-opacity",
                        State.viewMode ===
                        "paired"
                            ? 0.55
                            : 0.45
                    )
                    .attr(
                        "stroke",
                        ribbonColor
                    )
                    .attr(
                        "stroke-opacity",
                        0.12
                    )
                    .on(
                        "mouseover",
                        event => {

                            showTooltip(
                                event,
                                `
                                <strong>Flow Path</strong><br>
                                ${escapeHtml(
                                    leftDimension
                                )}
                               :
                                ${escapeHtml(
                                    stream.leftVal
                                )}
                                →
                                ${escapeHtml(
                                    rightDimension
                                )}
                               :
                                ${escapeHtml(
                                    stream.rightVal
                                )}
                                <br><br>
                                <strong>Records:</strong>
                                ${stream.volume}
                                `
                            );

                        }
                    )
                    .on(
                        "mouseout",
                        hideTooltip
                    );

            }
        );

    }


    /*
     * Chart title.
     */

    mainGroup
        .append("text")
        .attr(
            "x",
            innerWidth / 2
        )
        .attr(
            "y",
            -52
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .attr(
            "font-size",
            "18px"
        )
        .attr(
            "font-weight",
            "700"
        )
        .attr(
            "fill",
            "#ffffff"
        )
        .text(
            State.viewMode ===
            "paired"
                ? "Paired Mode"
                : "Standard Mode"
        );

}


/* =========================================================
   14. TOOLTIP
   ========================================================= */

function showTooltip(
    event,
    markup
) {

    const tooltip =
        document.getElementById(
            "chart-tooltip"
        );

    if (!tooltip) {
        return;
    }


    tooltip.innerHTML =
        markup;


    tooltip.classList.remove(
        "hidden"
    );


    tooltip.style.position =
        "fixed";


    tooltip.style.left =
        `${event.clientX + 16}px`;


    tooltip.style.top =
        `${event.clientY + 16}px`;

}


function hideTooltip() {

    const tooltip =
        document.getElementById(
            "chart-tooltip"
        );

    if (tooltip) {

        tooltip.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   15. HTML ESCAPING
   ========================================================= */

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   16. CAPITALIZE
   ========================================================= */

function capitalize(value) {

    if (!value) {
        return "";
    }

    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );

}


/* =========================================================
   17. DEBOUNCE
   ========================================================= */

function debounce(
    callback,
    delay
) {

    let timeoutToken = null;


    return function (...args) {

        clearTimeout(
            timeoutToken
        );


        timeoutToken =
            setTimeout(
                () => {

                    callback.apply(
                        this,
                        args
                    );

                },
                delay
            );

    };

}


/* =========================================================
   18. PUBLIC PPC API
   ========================================================= */

window.PPC = {

    State: State,

    switchDataset:
        switchDataset,

    render:
        renderPPCChart,

    setMode:
        function (mode) {

            if (
                mode !== "standard" &&
                mode !== "paired"
            ) {

                return;

            }

            State.viewMode =
                mode;

            renderPPCChart();

        },

    setPivot:
        function (dimension) {

            if (
                State.selectedDimensions.includes(
                    dimension
                )
            ) {

                State.activePivotAxis =
                    dimension;

                renderPPCChart();

            }

        },

    getDimensions:
        function () {

            return [
                ...State.selectedDimensions
            ];

        }

};


/* =========================================================
   END OF APP.JS
   ========================================================= */

