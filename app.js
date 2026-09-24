
/*
===========================================================
 PIVOTING PARALLEL CHARTS
 index26 - 3D Visualization Engine
===========================================================

 Keeps index26 features:
   • Titanic
   • Mushrooms
   • Covid
   • Survey
   • Standard Mode
   • Paired Mode
   • Dimension selection
   • Pivot selection

 Adds index25-style visualization:
   • Three.js 3D categorical bars
   • Pivot colors
   • Axis labels
   • 3D rotation
   • Zoom
   • Axis dragging / reordering
   • Click axis to pivot
   • Tooltip
   • Dimension summary
   • Camera reset
   • Axis reset
===========================================================
*/

"use strict";


/* =========================================================
   APPLICATION STATE
========================================================= */

const State = {

    activeDataset: "titanic",

    viewMode: "standard",

    selectedDimensions: [],

    activePivotAxis: null,

    rawRecords: [],

    axisOrder: [],

    scene: null,

    camera: null,

    renderer: null,

    controls: null,

    axisObjects: [],

    animationId: null,

    raycaster: null,

    mouse: null,

    draggingAxis: null,

    dragStartX: 0,

    originalAxisX: 0,

    cameraHome: null

};


/* =========================================================
   DATASETS
========================================================= */

const DatasetConfig = {

    titanic: {

        dimensions: [
            "Class",
            "Sex",
            "Age",
            "Survived"
        ],

        generate() {

            const records = [];

            for (let i = 0; i < 400; i++) {

                records.push({

                    Class:
                        Math.random() > .4
                            ? "Third"
                            : Math.random() > .5
                                ? "Second"
                                : "First",

                    Sex:
                        Math.random() > .52
                            ? "Male"
                            : "Female",

                    Age:
                        Math.random() > .2
                            ? "Adult"
                            : "Child",

                    Survived:
                        Math.random() > .6
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

        generate() {

            const records = [];

            for (let i = 0; i < 350; i++) {

                records.push({

                    CapShape:
                        Math.random() > .5
                            ? "Convex"
                            : "Flat",

                    CapColor:
                        Math.random() > .6
                            ? "Brown"
                            : Math.random() > .4
                                ? "Gray"
                                : "Red",

                    Odor:
                        Math.random() > .7
                            ? "Pungent"
                            : "Almond",

                    Edibility:
                        Math.random() > .45
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

        generate() {

            const records = [];

            for (let i = 0; i < 500; i++) {

                records.push({

                    AgeGroup:
                        Math.random() > .6
                            ? "Elderly"
                            : Math.random() > .3
                                ? "Adult"
                                : "Youth",

                    RiskFactors:
                        Math.random() > .4
                            ? "Present"
                            : "None",

                    Hospitalization:
                        Math.random() > .7
                            ? "ICU"
                            : "Ward",

                    Outcome:
                        Math.random() > .85
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

        generate() {

            const records = [];

            for (let i = 0; i < 300; i++) {

                records.push({

                    Education:
                        Math.random() > .5
                            ? "Degree"
                            : "HighSchool",

                    Income:
                        Math.random() > .7
                            ? "High"
                            : Math.random() > .4
                                ? "Medium"
                                : "Low",

                    Satisfaction:
                        Math.random() > .4
                            ? "Satisfied"
                            : "Unsatisfied",

                    Employment:
                        Math.random() > .2
                            ? "Employed"
                            : "Unemployed"

                });

            }

            return records;
        }
    }

};


/* =========================================================
   THREE.JS LOADER
========================================================= */

function loadThree() {

    return new Promise((resolve, reject) => {

        if (window.THREE) {

            resolve();

            return;
        }


        const script =
            document.createElement("script");

        script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

        script.onload =
            resolve;

        script.onerror =
            reject;

        document.head.appendChild(script);

    });

}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        createInterface();

        initDatasetTabs();

        initModeControls();

        initDimensionControls();

        initChartButtons();


        try {

            await loadThree();

            switchDataset(
                "titanic"
            );

        } catch (error) {

            console.error(
                "Three.js failed to load.",
                error
            );

            showChartMessage(
                "Three.js could not be loaded."
            );

        }

    }
);


/* =========================================================
   CREATE MISSING INTERFACE
========================================================= */

function createInterface() {

    let chart =
        document.getElementById(
            "parallel-chart-canvas"
        );


    if (!chart) {

        chart =
            document.createElement(
                "div"
            );

        chart.id =
            "parallel-chart-canvas";

        document.body.appendChild(
            chart
        );

    }


    chart.style.width =
        "100%";

    chart.style.height =
        "650px";

    chart.style.minHeight =
        "500px";

    chart.style.position =
        "relative";

    chart.style.overflow =
        "hidden";


    let warning =
        document.getElementById(
            "dimension-warning"
        );


    if (!warning) {

        warning =
            document.createElement(
                "div"
            );

        warning.id =
            "dimension-warning";

        chart.parentNode.insertBefore(
            warning,
            chart
        );

    }


    let selector =
        document.getElementById(
            "dimension-selector-box"
        );


    if (!selector) {

        selector =
            document.createElement(
                "div"
            );

        selector.id =
            "dimension-selector-box";

        chart.parentNode.insertBefore(
            selector,
            chart
        );

    }


    /*
     * Status information
     */

    let status =
        document.getElementById(
            "ppc-status"
        );


    if (!status) {

        status =
            document.createElement(
                "div"
            );

        status.id =
            "ppc-status";

        chart.parentNode.insertBefore(
            status,
            chart
        );

    }

}


/* =========================================================
   DATASET TABS
========================================================= */

function initDatasetTabs() {

    document
        .querySelectorAll(
            ".tab-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".tab-btn"
                        )
                        .forEach(
                            b =>
                                b.classList.remove(
                                    "active"
                                )
                        );

                    button.classList.add(
                        "active"
                    );


                    switchDataset(
                        button.dataset.dataset
                    );

                }
            );

        });

}


/* =========================================================
   MODE CONTROLS
========================================================= */

function initModeControls() {

    document
        .querySelectorAll(
            'input[name="viewMode"]'
        )
        .forEach(radio => {

            radio.addEventListener(
                "change",
                () => {

                    if (!radio.checked) {
                        return;
                    }

                    State.viewMode =
                        radio.value ===
                        "paired"
                            ? "paired"
                            : "standard";

                    render3D();

                }
            );

        });

}


/* =========================================================
   DIMENSION CONTROLS
========================================================= */

function initDimensionControls() {

    /*
     * Delegated listener.
     *
     * This also works when the checkboxes are
     * recreated after switching datasets.
     */

    document.addEventListener(
        "change",
        event => {

            if (
                !event.target.matches(
                    "#dimension-selector-box input[type='checkbox']"
                )
            ) {

                return;
            }


            const dimension =
                event.target.value;


            if (
                event.target.checked
            ) {

                if (
                    !State.selectedDimensions.includes(
                        dimension
                    )
                ) {

                    State.selectedDimensions.push(
                        dimension
                    );

                }

            } else {

                State.selectedDimensions =
                    State.selectedDimensions.filter(
                        d =>
                            d !== dimension
                    );


                if (
                    State.activePivotAxis ===
                    dimension
                ) {

                    State.activePivotAxis =
                        State.selectedDimensions[
                            State.selectedDimensions.length - 1
                        ] || null;

                }

            }


            State.axisOrder =
                State.selectedDimensions.slice();


            updateWarning();

            render3D();

        }
    );

}


/* =========================================================
   CHART BUTTONS
========================================================= */

function initChartButtons() {

    document.addEventListener(
        "click",
        event => {

            const id =
                event.target.id;


            if (
                id ===
                "reset-axis-order"
            ) {

                resetAxisOrder();

            }


            if (
                id ===
                "reset-camera"
            ) {

                resetCamera();

            }


            if (
                id ===
                "first-axis-pivot"
            ) {

                if (
                    State.axisOrder.length
                ) {

                    State.activePivotAxis =
                        State.axisOrder[0];

                    render3D();

                }

            }

        }
    );

}


/* =========================================================
   DATASET SWITCH
========================================================= */

function switchDataset(
    datasetName
) {

    const config =
        DatasetConfig[
            datasetName
        ];


    if (!config) {
        return;
    }


    State.activeDataset =
        datasetName;


    State.rawRecords =
        config.generate();


    State.selectedDimensions =
        config.dimensions.slice();


    State.axisOrder =
        config.dimensions.slice();


    State.activePivotAxis =
        State.axisOrder[
            State.axisOrder.length - 1
        ];


    updateDatasetTitle();

    renderDimensionControls();

    updateWarning();

    render3D();

}


/* =========================================================
   DIMENSION UI
========================================================= */

function renderDimensionControls() {

    const box =
        document.getElementById(
            "dimension-selector-box"
        );


    if (!box) {
        return;
    }


    box.innerHTML = "";


    const title =
        document.createElement(
            "div"
        );

    title.innerHTML =
        "<strong>Control Dimensions</strong>";

    box.appendChild(
        title
    );


    State.axisOrder.forEach(
        dimension => {

            const label =
                document.createElement(
                    "label"
                );


            label.style.display =
                "inline-flex";

            label.style.alignItems =
                "center";

            label.style.gap =
                "6px";

            label.style.margin =
                "6px";

            label.style.cursor =
                "pointer";


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


            const span =
                document.createElement(
                    "span"
                );

            span.textContent =
                dimension;


            label.appendChild(
                input
            );

            label.appendChild(
                span
            );


            box.appendChild(
                label
            );

        }
    );

}


/* =========================================================
   WARNING
========================================================= */

function updateWarning() {

    const warning =
        document.getElementById(
            "dimension-warning"
        );


    if (!warning) {
        return;
    }


    const count =
        State.selectedDimensions.length;


    if (count < 3) {

        warning.textContent =
            `Select ${
                3 - count
            } more dimension${
                3 - count === 1
                    ? ""
                    : "s"
            } to visualize.`;

        warning.style.display =
            "block";

    } else {

        warning.style.display =
            "none";

    }

}


/* =========================================================
   TITLE
========================================================= */

function updateDatasetTitle() {

    const title =
        document.getElementById(
            "active-dataset-title"
        );


    if (!title) {
        return;
    }


    title.textContent =
        capitalize(
            State.activeDataset
        );

}


/* =========================================================
   RENDER 3D
========================================================= */

function render3D() {

    if (
        !window.THREE
    ) {

        return;
    }


    if (
        State.selectedDimensions.length < 3
    ) {

        destroyScene();

        showChartMessage(
            "Select 3 or more dimensions to visualize."
        );

        updateStatus();

        return;
    }


    createScene();

    drawChart();

    updateStatus();

}


/* =========================================================
   CREATE THREE.JS SCENE
========================================================= */

function createScene() {

    const container =
        document.getElementById(
            "parallel-chart-canvas"
        );


    if (!container) {
        return;
    }


    destroyScene();


    State.scene =
        new THREE.Scene();


    State.scene.background =
        new THREE.Color(
            0x07111f
        );


    const width =
        container.clientWidth ||
        900;

    const height =
        container.clientHeight ||
        650;


    State.camera =
        new THREE.PerspectiveCamera(
            45,
            width / height,
            0.1,
            3000
        );


    State.camera.position.set(
        0,
        420,
        850
    );


    State.camera.lookAt(
        0,
        120,
        0
    );


    State.renderer =
        new THREE.WebGLRenderer({
            antialias: true
        });


    State.renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    State.renderer.setSize(
        width,
        height
    );


    container.appendChild(
        State.renderer.domElement
    );


    /*
     * Lights
     */

    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            0.75
        );

    State.scene.add(
        ambient
    );


    const light =
        new THREE.DirectionalLight(
            0xffffff,
            1.0
        );

    light.position.set(
        200,
        500,
        400
    );

    State.scene.add(
        light
    );


    /*
     * Grid
     */

    const grid =
        new THREE.GridHelper(
            1200,
            24,
            0x31506e,
            0x1a2b3e
        );

    grid.position.y =
        0;

    State.scene.add(
        grid
    );


    /*
     * Mouse controls.
     */

    setupMouseControls();


    State.cameraHome = {
        x: 0,
        y: 420,
        z: 850
    };


    animate();

}


/* =========================================================
   DRAW 3D PPC
========================================================= */

function drawChart() {

    State.axisObjects = [];


    const dimensions =
        State.axisOrder.filter(
            dimension =>
                State.selectedDimensions.includes(
                    dimension
                )
        );


    if (
        dimensions.length < 3
    ) {

        return;
    }


    const axisSpacing =
        260;


    const startX =
        -(
            dimensions.length - 1
        ) *
        axisSpacing /
        2;


    dimensions.forEach(
        (dimension, index) => {

            const x =
                startX +
                index *
                axisSpacing;


            const axisGroup =
                new THREE.Group();


            axisGroup.position.x =
                x;


            axisGroup.userData = {

                dimension,

                index

            };


            State.scene.add(
                axisGroup
            );


            drawAxis(
                axisGroup,
                dimension
            );


            State.axisObjects.push(
                axisGroup
            );

        }
    );


    /*
     * Draw connecting flows.
     */

    for (
        let i = 0;
        i < dimensions.length - 1;
        i++
    ) {

        drawConnections(
            dimensions[i],
            dimensions[i + 1],
            State.axisObjects[i],
            State.axisObjects[i + 1]
        );

    }

}


/* =========================================================
   DRAW AXIS
========================================================= */

function drawAxis(
    group,
    dimension
) {

    const values =
        getValues(
            dimension
        );


    const frequencies =
        getFrequencies(
            dimension,
            values
        );


    const total =
        State.rawRecords.length;


    const height =
        360;


    const width =
        55;


    const gap =
        7;


    const available =
        height -
        gap *
        Math.max(
            0,
            values.length - 1
        );


    let y =
        0;


    const pivot =
        dimension ===
        State.activePivotAxis;


    values.forEach(
        value => {

            const proportion =
                frequencies[value] /
                total;


            const segmentHeight =
                Math.max(
                    10,
                    proportion *
                    available
                );


            const geometry =
                new THREE.BoxGeometry(
                    width,
                    segmentHeight,
                    width
                );


            const color =
                getCategoryColor(
                    value,
                    dimension
                );


            const material =
                new THREE.MeshStandardMaterial({

                    color,

                    transparent:
                        true,

                    opacity:
                        pivot
                            ? 1
                            : 0.85,

                    roughness:
                        0.55,

                    metalness:
                        0.08

                });


            const mesh =
                new THREE.Mesh(
                    geometry,
                    material
                );


            mesh.position.y =
                y +
                segmentHeight /
                2 +
                15;


            mesh.userData = {

                dimension,

                category:
                    value,

                count:
                    frequencies[value]

            };


            group.add(
                mesh
            );


            /*
             * Category label.
             */

            addTextSprite(
                group,
                String(value),
                width + 20,
                mesh.position.y,
                pivot
                    ? "#ffffff"
                    : "#b7c7d8"
            );


            y +=
                segmentHeight +
                gap;

        }
    );


    /*
     * Axis floor.
     */

    const axisGeometry =
        new THREE.BoxGeometry(
            5,
            height + 30,
            5
        );


    const axisMaterial =
        new THREE.MeshBasicMaterial({
            color:
                pivot
                    ? 0xf59e0b
                    : 0x6b8aa8
        });


    const axisLine =
        new THREE.Mesh(
            axisGeometry,
            axisMaterial
        );


    axisLine.position.y =
        height / 2;


    group.add(
        axisLine
    );


    /*
     * Dimension label.
     */

    addTextSprite(
        group,
        pivot
            ? `★ ${dimension}`
            : dimension,
        0,
        height + 45,
        pivot
            ? "#f59e0b"
            : "#ffffff",
        true
    );

}


/* =========================================================
   DRAW CONNECTIONS
========================================================= */

function drawConnections(
    leftDimension,
    rightDimension,
    leftAxis,
    rightAxis
) {

    const aggregates = {};


    State.rawRecords.forEach(
        record => {

            const left =
                record[
                    leftDimension
                ];

            const right =
                record[
                    rightDimension
                ];


            const pivot =
                record[
                    State.activePivotAxis
                ];


            const key =
                State.viewMode ===
                "standard"

                    ? `${left}|||${right}|||${pivot}`

                    : `${left}|||${right}`;


            if (
                !aggregates[key]
            ) {

                aggregates[key] = {

                    left,

                    right,

                    pivot,

                    count: 0

                };

            }


            aggregates[key].count++;

        }
    );


    const leftValues =
        getValues(
            leftDimension
        );


    const rightValues =
        getValues(
            rightDimension
        );


    const leftY =
        calculateCenters(
            leftDimension,
            leftValues
        );


    const rightY =
        calculateCenters(
            rightDimension,
            rightValues
        );


    Object.values(
        aggregates
    ).forEach(
        stream => {

            const y1 =
                leftY[
                    stream.left
                ];


            const y2 =
                rightY[
                    stream.right
                ];


            if (
                y1 === undefined ||
                y2 === undefined
            ) {

                return;
            }


            const curve =
                new THREE.CatmullRomCurve3([
                    new THREE.Vector3(
                        leftAxis.position.x,
                        y1,
                        0
                    ),

                    new THREE.Vector3(
                        (
                            leftAxis.position.x +
                            rightAxis.position.x
                        ) / 2,
                        (
                            y1 + y2
                        ) / 2,
                        45
                    ),

                    new THREE.Vector3(
                        rightAxis.position.x,
                        y2,
                        0
                    )
                ]);


            const points =
                curve.getPoints(
                    24
                );


            const geometry =
                new THREE.BufferGeometry()
                    .setFromPoints(
                        points
                    );


            const color =
                State.viewMode ===
                "standard"

                    ? getCategoryColor(
                        stream.pivot,
                        State.activePivotAxis
                    )

                    : getCategoryColor(
                        stream.left,
                        leftDimension
                    );


            const material =
                new THREE.LineBasicMaterial({

                    color,

                    transparent:
                        true,

                    opacity:
                        State.viewMode ===
                        "paired"
                            ? 0.48
                            : 0.35

                });


            const line =
                new THREE.Line(
                    geometry,
                    material
                );


            line.userData = {

                left:
                    stream.left,

                right:
                    stream.right,

                count:
                    stream.count

            };


            State.scene.add(
                line
            );

        }
    );

}


/* =========================================================
   CATEGORY HELPERS
========================================================= */

function getValues(
    dimension
) {

    return [
        ...new Set(
            State.rawRecords.map(
                record =>
                    record[
                        dimension
                    ]
            )
        )
    ];

}


function getFrequencies(
    dimension,
    values
) {

    const result = {};


    values.forEach(
        value => {

            result[value] =
                0;

        }
    );


    State.rawRecords.forEach(
        record => {

            if (
                result[
                    record[dimension]
                ] !== undefined
            ) {

                result[
                    record[dimension]
                ]++;

            }

        }
    );


    return result;

}


function calculateCenters(
    dimension,
    values
) {

    const frequencies =
        getFrequencies(
            dimension,
            values
        );


    const result = {};


    let y = 25;


    const height = 360;

    const gap = 7;

    const usable =
        height -
        gap *
        Math.max(
            0,
            values.length - 1
        );


    values.forEach(
        value => {

            const h =
                Math.max(
                    10,
                    (
                        frequencies[value] /
                        State.rawRecords.length
                    ) *
                    usable
                );


            result[value] =
                y +
                h / 2;


            y +=
                h +
                gap;

        }
    );


    return result;

}


/* =========================================================
   COLORS
========================================================= */

const CategoryColors = [

    0x38bdf8,

    0xf59e0b,

    0x22c55e,

    0xf43f5e,

    0xa78bfa,

    0x14b8a6,

    0xfb7185,

    0xfacc15,

    0x60a5fa,

    0xc084fc

];


const categoryColorMap =
    new Map();


function getCategoryColor(
    value,
    dimension
) {

    const key =
        `${dimension}:${value}`;


    if (
        !categoryColorMap.has(
            key
        )
    ) {

        categoryColorMap.set(
            key,
            CategoryColors[
                categoryColorMap.size %
                CategoryColors.length
            ]
        );

    }


    return categoryColorMap.get(
        key
    );

}


/* =========================================================
   TEXT SPRITES
========================================================= */

function addTextSprite(
    parent,
    text,
    x,
    y,
    color = "#ffffff",
    large = false
) {

    const canvas =
        document.createElement(
            "canvas"
        );


    const context =
        canvas.getContext(
            "2d"
        );


    const fontSize =
        large
            ? 34
            : 22;


    context.font =
        `700 ${fontSize}px Arial`;


    const width =
        context.measureText(
            text
        ).width +
        24;


    canvas.width =
        width;


    canvas.height =
        fontSize +
        20;


    context.font =
        `700 ${fontSize}px Arial`;


    context.fillStyle =
        color;


    context.textAlign =
        "center";


    context.textBaseline =
        "middle";


    context.fillText(
        text,
        width / 2,
        canvas.height / 2
    );


    const texture =
        new THREE.CanvasTexture(
            canvas
        );


    texture.needsUpdate =
        true;


    const material =
        new THREE.SpriteMaterial({

            map:
                texture,

            transparent:
                true,

            depthWrite:
                false

        });


    const sprite =
        new THREE.Sprite(
            material
        );


    sprite.position.set(
        x,
        y,
        35
    );


    sprite.scale.set(
        width / 3,
        canvas.height / 3,
        1
    );


    parent.add(
        sprite
    );

}


/* =========================================================
   MOUSE / 3D INTERACTION
========================================================= */

function setupMouseControls() {

    const canvas =
        State.renderer.domElement;


    State.raycaster =
        new THREE.Raycaster();


    State.mouse =
        new THREE.Vector2();


    let rotating = false;

    let lastX = 0;

    let lastY = 0;


    canvas.addEventListener(
        "pointerdown",
        event => {

            lastX =
                event.clientX;

            lastY =
                event.clientY;


            State.mouse.x =
                (
                    event.clientX /
                    canvas.clientWidth
                ) *
                2 -
                1;


            State.mouse.y =
                -(
                    event.clientY /
                    canvas.clientHeight
                ) *
                2 +
                1;


            State.raycaster.setFromCamera(
                State.mouse,
                State.camera
            );


            const hits =
                State.raycaster.intersectObjects(
                    State.axisObjects,
                    true
                );


            if (
                hits.length
            ) {

                let object =
                    hits[0].object;


                while (
                    object.parent &&
                    !State.axisObjects.includes(
                        object
                    )
                ) {

                    object =
                        object.parent;

                }


                if (
                    State.axisObjects.includes(
                        object
                    )
                ) {

                    State.draggingAxis =
                        object;

                    State.dragStartX =
                        event.clientX;

                    State.originalAxisX =
                        object.position.x;

                    return;
                }

            }


            rotating = true;

        }
    );


    canvas.addEventListener(
        "pointermove",
        event => {

            const dx =
                event.clientX -
                lastX;


            const dy =
                event.clientY -
                lastY;


            lastX =
                event.clientX;

            lastY =
                event.clientY;


            if (
                State.draggingAxis
            ) {

                State.draggingAxis.position.x =
                    State.originalAxisX +
                    (
                        event.clientX -
                        State.dragStartX
                    ) *
                    1.5;

                return;

            }


            if (rotating) {

                State.scene.rotation.y +=
                    dx * 0.006;

                State.scene.rotation.x +=
                    dy * 0.004;

            }

        }
    );


    canvas.addEventListener(
        "pointerup",
        () => {

            if (
                State.draggingAxis
            ) {

                reorderDraggedAxis();

            }


            State.draggingAxis =
                null;

            rotating =
                false;

        }
    );


    canvas.addEventListener(
        "wheel",
        event => {

            event.preventDefault();


            State.camera.position.z +=
                event.deltaY *
                0.7;


            State.camera.position.z =
                THREE.MathUtils.clamp(
                    State.camera.position.z,
                    350,
                    1500
                );

        },
        {
            passive: false
        }
    );


    canvas.addEventListener(
        "click",
        event => {

            if (
                Math.abs(
                    event.clientX -
                    State.dragStartX
                ) > 8
            ) {

                return;

            }


            State.mouse.x =
                (
                    event.clientX /
                    canvas.clientWidth
                ) *
                2 -
                1;


            State.mouse.y =
                -(
                    event.clientY /
                    canvas.clientHeight
                ) *
                2 +
                1;


            State.raycaster.setFromCamera(
                State.mouse,
                State.camera
            );


            const hits =
                State.raycaster.intersectObjects(
                    State.axisObjects,
                    true
                );


            if (
                hits.length
            ) {

                let axis =
                    hits[0].object;


                while (
                    axis.parent &&
                    !State.axisObjects.includes(
                        axis
                    )
                ) {

                    axis =
                        axis.parent;

                }


                if (
                    axis.userData &&
                    axis.userData.dimension
                ) {

                    State.activePivotAxis =
                        axis.userData.dimension;

                    render3D();

                }

            }

        }
    );

}


/* =========================================================
   AXIS REORDERING
========================================================= */

function reorderDraggedAxis() {

    const axis =
        State.draggingAxis;


    if (!axis) {
        return;
    }


    const dimension =
        axis.userData.dimension;


    const x =
        axis.position.x;


    let nearestIndex =
        0;


    let nearestDistance =
        Infinity;


    State.axisObjects.forEach(
        (other, index) => {

            if (
                other === axis
            ) {
                return;
            }


            const distance =
                Math.abs(
                    x -
                    other.position.x
                );


            if (
                distance <
                nearestDistance
            ) {

                nearestDistance =
                    distance;

                nearestIndex =
                    index;

            }

        }
    );


    const oldIndex =
        State.axisOrder.indexOf(
            dimension
        );


    if (
        oldIndex === -1
    ) {
        return;
    }


    State.axisOrder.splice(
        oldIndex,
        1
    );


    State.axisOrder.splice(
        nearestIndex,
        0,
        dimension
    );


    render3D();

}


/* =========================================================
   RESET AXIS ORDER
========================================================= */

function resetAxisOrder() {

    State.axisOrder =
        DatasetConfig[
            State.activeDataset
        ].dimensions.slice();


    State.selectedDimensions =
        State.axisOrder.slice();


    State.activePivotAxis =
        State.axisOrder[
            State.axisOrder.length - 1
        ];


    renderDimensionControls();

    render3D();

}


/* =========================================================
   RESET CAMERA
========================================================= */

function resetCamera() {

    if (
        !State.camera ||
        !State.scene
    ) {

        return;
    }


    State.camera.position.set(
        0,
        420,
        850
    );


    State.camera.lookAt(
        0,
        150,
        0
    );


    State.scene.rotation.set(
        0,
        0,
        0
    );

}


/* =========================================================
   ANIMATION
========================================================= */

function animate() {

    State.animationId =
        requestAnimationFrame(
            animate
        );


    if (
        State.renderer &&
        State.scene &&
        State.camera
    ) {

        State.renderer.render(
            State.scene,
            State.camera
        );

    }

}


/* =========================================================
   DESTROY SCENE
========================================================= */

function destroyScene() {

    if (
        State.animationId
    ) {

        cancelAnimationFrame(
            State.animationId
        );

        State.animationId =
            null;

    }


    if (
        State.renderer
    ) {

        State.renderer.dispose();

    }


    const container =
        document.getElementById(
            "parallel-chart-canvas"
        );


    if (container) {

        container.innerHTML =
            "";

    }


    State.scene =
        null;

    State.camera =
        null;

    State.renderer =
        null;

    State.axisObjects =
        [];

}


/* =========================================================
   STATUS
========================================================= */

function updateStatus() {

    const status =
        document.getElementById(
            "ppc-status"
        );


    if (!status) {
        return;
    }


    status.innerHTML = `

        <div>
            <strong>Records:</strong>
            ${State.rawRecords.length}
        </div>

        <div>
            <strong>Dimensions:</strong>
            ${State.selectedDimensions.length}
        </div>

        <div>
            <strong>Pivot:</strong>
            ${escapeHTML(
                State.activePivotAxis ||
                "—"
            )}
        </div>

        <div>
            <strong>Mode:</strong>
            ${
                State.viewMode ===
                "paired"
                    ? "Paired"
                    : "Standard"
            }
        </div>

    `;

}


/* =========================================================
   CHART MESSAGE
========================================================= */

function showChartMessage(
    message
) {

    const container =
        document.getElementById(
            "parallel-chart-canvas"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div style="
            height:100%;
            display:flex;
            align-items:center;
            justify-content:center;
            color:#aabbd0;
            font-size:18px;
            text-align:center;
        ">

            ${escapeHTML(message)}

        </div>

    `;

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

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
   CAPITALIZE
========================================================= */

function capitalize(
    value
) {

    return value
        ? value.charAt(0).toUpperCase() +
          value.slice(1)
        : "";

}


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    debounce(
        () => {

            if (
                State.renderer &&
                State.camera
            ) {

                const container =
                    document.getElementById(
                        "parallel-chart-canvas"
                    );


                const width =
                    container.clientWidth;


                const height =
                    container.clientHeight;


                State.camera.aspect =
                    width / height;


                State.camera.updateProjectionMatrix();


                State.renderer.setSize(
                    width,
                    height
                );

            }

        },
        150
    )
);


/* =========================================================
   DEBOUNCE
========================================================= */

function debounce(
    callback,
    delay
) {

    let timer;

    return function () {

        clearTimeout(
            timer
        );

        timer =
            setTimeout(
                callback,
                delay
            );

    };

}


/* =========================================================
   PUBLIC API
========================================================= */

window.PPC = {

    State,

    switchDataset,

    render:
        render3D,

    setMode(mode) {

        if (
            mode !==
            "standard" &&
            mode !==
            "paired"
        ) {

            return;

        }

        State.viewMode =
            mode;

        render3D();

    },

    setPivot(dimension) {

        if (
            State.selectedDimensions.includes(
                dimension
            )
        ) {

            State.activePivotAxis =
                dimension;

            render3D();

        }

    },

    resetAxisOrder,

    resetCamera

};

