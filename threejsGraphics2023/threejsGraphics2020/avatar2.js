import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// 1. Global Application State Object
const state = {
    camera: null,
    scene: null,
    renderer: null,
    controls: null,
    gui: null,
    clock: new THREE.Clock(),
    figure: null,
    floor: null,
    discoFloor: null,
    discoBall: null,
    
    // Core parameters bound to UI configuration
    config: {
        Hair_Out: 60,
        Hair_Up: 10,
        Nose: 8,
        Eyes: 31,
        Mouth: 2,
        Ears: 35,
        Move_Arms: 0,
        Move_Legs: -50,
        Body_Color: '#f05628',
        Limbs_Color: '#cf461c',
        Hair_Color: '#1b1212',
        Eye_Color: '#704912',
        Animation: 'Stop',
        Location_X: 0,
        Location_Y: 0,
        Location_Z: 0
    },

    // Materials dictionary
    materials: {
        body: new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0.1 }),
        limbs: new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0.1 }),
        hair: new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0.0 }),
        eye: new THREE.MeshStandardMaterial({ roughness: 0.1, metalness: 0.1 }),
        white: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }),
        mouthBase: new THREE.MeshStandardMaterial({ color: 0x5c2c16, roughness: 0.8 }),
        floor: new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 })
    }
};

// 2. Helper Utilities
const degToRad = (degrees, denominator = 180) => degrees * (Math.PI / denominator);
const getRandomColor = () => new THREE.Color().setHSL(Math.random(), 0.9, 0.5);

// 3. Figure Object Model Component
class Figure extends THREE.Group {
    constructor() {
        super();
        this.arms = [];
        this.legs = [];
        
        this.buildCharacter();
        state.scene.add(this);
    }

    updateFromConfig() {
        // Sync positional constraints safely
        this.position.set(state.config.Location_X, state.config.Location_Y, state.config.Location_Z);
        
        // Sync Material Hex Profiles Dynamically
        state.materials.body.color.set(state.config.Body_Color);
        state.materials.limbs.color.set(state.config.Limbs_Color);
        state.materials.hair.color.set(state.config.Hair_Color);
        state.materials.eye.color.set(state.config.Eye_Color);

        // Complete a clean structural regeneration pass safely
        this.clear();
        this.arms = [];
        this.legs = [];
        this.buildCharacter();
    }

    buildCharacter() {
        this.createBody();
        this.createHead();
    }

    createBody() {
        const bodyGroup = new THREE.Group();
        
        const mainGeo = new THREE.SphereGeometry(0.75, 32, 32);
        const limbGeo = new THREE.BoxGeometry(0.45, 0.75, 0.55);
        
        const bodyMain = new THREE.Mesh(mainGeo, state.materials.body);
        const leftHip = new THREE.Mesh(limbGeo, state.materials.body);
        const rightHip = new THREE.Mesh(limbGeo, state.materials.body);
        
        bodyMain.position.y = -1.1;
        leftHip.position.set(-0.27, -1.7, -0.04);
        rightHip.position.set(0.27, -1.7, -0.04);
        
        bodyGroup.add(bodyMain, leftHip, rightHip);
        this.add(bodyGroup);
        
        this.createLegs(bodyGroup);
        this.createArms(bodyGroup);
    }

    createHead() {
        this.head = new THREE.Group();
        this.head.position.y = 0;
        
        const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), state.materials.body);
        this.head.add(headMesh);
        
        this.createEyes();
        this.createNose();
        this.createMouth();
        this.createHair();
        this.createEars();
        
        this.add(this.head);
    }

    createEyes() {
        const eyeRadius = state.config.Eyes / 100;
        const geoEye = new THREE.SphereGeometry(0.10, 16, 16);
        const geoPupil = new THREE.SphereGeometry(0.04, 16, 16);
        const geoBrow = new THREE.BoxGeometry(0.18, 0.06, 0.10);

        [-1, 1].forEach((side) => {
            const eye = new THREE.Mesh(geoEye, state.materials.white);
            eye.position.set(0.16 * side, 0.15, eyeRadius);
            
            const pupil = new THREE.Mesh(geoPupil, state.materials.eye);
            pupil.position.set(0.18 * side, 0.16, eyeRadius + 0.08);
            
            const brow = new THREE.Mesh(geoBrow, state.materials.hair);
            brow.position.set(0.18 * side, 0.28, 0.34);
            
            this.head.add(eye, pupil, brow);
        });
    }

    createNose() {
        const nose = new THREE.Mesh(new THREE.SphereGeometry(state.config.Nose / 100, 16, 16), state.materials.body);
        nose.position.set(0, 0.05, 0.42);
        this.head.add(nose);
    }

    createMouth() {
        const size = state.config.Mouth / 100;
        const outerMouth = new THREE.Mesh(new THREE.BoxGeometry(size + 0.2, size + 0.02, size + 0.02), state.materials.mouthBase);
        const innerTeeth = new THREE.Mesh(new THREE.BoxGeometry(size + 0.1, size / 2, size), state.materials.white);
        
        outerMouth.position.set(0, -0.10, 0.50);
        innerTeeth.position.set(0, -0.10, 0.52);
        
        this.head.add(outerMouth, innerTeeth);
    }

    createHair() {
        const backHair = new THREE.Mesh(new THREE.SphereGeometry(state.config.Hair_Out / 100, 32, 32), state.materials.hair);
        backHair.position.set(0, state.config.Hair_Up / 100, -0.30);
        
        const bangs = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.20, 0.02), state.materials.hair);
        bangs.position.set(0, -0.20, 0.40);
        
        this.head.add(backHair, bangs);
    }

    createEars() {
        const radius = state.config.Ears / 100;
        const earGeo = new THREE.SphereGeometry(0.15, 16, 16);
        
        [-1, 1].forEach((side) => {
            const ear = new THREE.Mesh(earGeo, state.materials.body);
            ear.position.set(radius * side, 0, 0.0025);
            this.head.add(ear);
        });
    }

    createArms(parentBody) {
        const h = 0.85;
        const geoArm = new THREE.BoxGeometry(0.25, h, 0.25);
        const geoShoulder = new THREE.SphereGeometry(0.25, 16, 16);
        const geoHand = new THREE.BoxGeometry(0.4, 0.3, 0.1);

        [-1, 1].forEach((side) => {
            const armGroup = new THREE.Group();
            
            const arm = new THREE.Mesh(geoArm, state.materials.limbs);
            const shoulder = new THREE.Mesh(geoShoulder, state.materials.limbs);
            const hand = new THREE.Mesh(geoHand, state.materials.limbs);
            
            arm.position.y = h * -0.5;
            shoulder.position.y = h * -0.1;
            hand.position.y = h * -1.3;
            
            armGroup.add(arm, shoulder, hand);
            armGroup.position.set(side * 0.8, -0.9, 0);
            
            parentBody.add(armGroup);
            this.arms.push(armGroup);
        });
        this.animateArms();
    }

    createLegs(parentBody) {
        const h = 0.85;
        const geoLeg = new THREE.BoxGeometry(0.25, h, 0.25);
        const geoFoot = new THREE.BoxGeometry(0.4, 0.2, 0.5);

        [-1, 1].forEach((side) => {
            const legGroup = new THREE.Group();
            
            const lowerLeg = new THREE.Mesh(geoLeg, state.materials.limbs);
            const foot = new THREE.Mesh(geoFoot, state.materials.limbs);
            
            lowerLeg.position.y = h * -3.52;
            foot.position.set(0, h * -4.3, 0.18);
            
            legGroup.add(lowerLeg, foot);
            legGroup.position.set(side * 0.3, -0.05, 0);
            
            parentBody.add(legGroup);
            this.legs.push(legGroup);
        });

        // Rigid Thigh Plates
        const thighL = new THREE.Mesh(geoLeg, state.materials.limbs);
        const thighR = new THREE.Mesh(geoLeg, state.materials.limbs);
        thighL.position.set(0.28, (h / 1.5) * -3.5, 0);
        thighR.position.set(-0.28, (h / 1.5) * -3.5, 0);
        parentBody.add(thighL, thighR);

        this.animateLegs();
    }

    animateArms() {
        this.arms.forEach((arm, idx) => {
            const inversion = idx % 2 === 0 ? 1 : -1;
            arm.rotation.z = degToRad(state.config.Move_Arms * inversion);
        });
    }

    animateLegs() {
        this.legs.forEach((leg, idx) => {
            const inversion = idx % 2 === 0 ? 1 : -1;
            leg.rotation.x = degToRad(state.config.Move_Legs * inversion, 3000);
        });
    }
}

// 4. Runtime Animation Orchestration engine
class AnimationEngine {
    static tick() {
        const delta = state.clock.getDelta();
        const time = state.clock.getElapsedTime();

        if (state.controls) state.controls.update();

        // Handle animation switch paths securely
        switch (state.config.Animation) {
            case 'Walking':
                this.playWalk(time);
                break;
            case 'Talking':
                this.playTalk(time);
                break;
            case 'Dancing':
                this.playDance(time);
                break;
            case 'Disco':
                this.playDisco(time, delta);
                break;
            default:
                // Stop / Idle State
                break;
        }

        state.renderer.render(state.scene, state.camera);
    }

    static playWalk(time) {
        state.config.Move_Legs = Math.sin(time * 8) * 40;
        state.figure.updateFromConfig();

        // Advanced Translation Tracking Mechanics
        if (state.config.Location_X >= -5 && state.config.Location_Z < 6) {
            state.figure.rotation.y = Math.PI / -2;
            state.config.Location_X -= 0.05;
            state.config.Location_Z -= 0.02;
        } else {
            state.figure.rotation.y = 0;
            state.config.Location_X += 0.05;
            state.config.Location_Z += 0.02;
            if (state.config.Location_X > 5) state.config.Location_X = -5;
        }
    }

    static playTalk(time) {
        state.config.Location_Z = 6.9;
        state.config.Location_Y = 1.7;
        state.config.Mouth = 5 + Math.sin(time * 15) * 4;
        state.config.Eyes = 31 + Math.floor(Math.random() * 4);
        state.figure.updateFromConfig();
    }

    static playDance(time) {
        state.config.Move_Legs = Math.sin(time * 10) * 30;
        state.config.Move_Arms = 90 + Math.cos(time * 10) * 40;
        state.config.Location_Z = Math.sin(time * 2) * 2;
        
        if (Math.floor(time * 2) % 2 === 0) {
            state.materials.floor.color.set(getRandomColor());
        }
        state.figure.updateFromConfig();
    }

    static playDisco(time, delta) {
        // Safe Lifecycle Management of Dynamic System Props
        if (!state.discoFloor) {
            state.discoFloor = this.generateDiscoCarpet();
            state.scene.add(state.discoFloor);
            
            const ballGeo = new THREE.SphereGeometry(0.95, 32, 32);
            state.discoBall = new THREE.Mesh(ballGeo, new THREE.MeshStandardMaterial({ roughness: 0.1, metalness: 0.9 }));
            state.discoBall.position.set(0, 3, 0);
            state.scene.add(state.discoBall);
        }

        // Cycle Entity Colors Safely
        state.materials.limbs.color.set(getRandomColor());
        state.materials.hair.color.set(getRandomColor());
        state.materials.body.color.set(getRandomColor());
        state.materials.floor.color.set(getRandomColor());

        if (state.discoBall) {
            state.discoBall.rotation.y += delta * 2;
            state.discoBall.material.color.set(getRandomColor());
        }

        // Walk translation vectors
        state.figure.rotation.y += delta * 3;
        state.config.Location_X = Math.sin(time) * 4;
        state.config.Location_Z = Math.cos(time) * 4;
        state.figure.updateFromConfig();
    }

    static generateDiscoCarpet() {
        const group = new THREE.Group();
        for (let i = 0; i < 30; i++) {
            const size = Math.random() * 2 + 1;
            const geo = new THREE.BoxGeometry(size, 0.1, size);
            const mat = new THREE.MeshStandardMaterial({
                color: getRandomColor(),
                transparent: true,
                opacity: 0.8
            });
            const block = new THREE.Mesh(geo, mat);
            block.position.set((Math.random() - 0.5) * 12, -4.55, (Math.random() - 0.5) * 12);
            group.add(block);
        }
        return group;
    }

    static cleanupDiscoEffects() {
        if (state.discoFloor) {
            state.scene.remove(state.discoFloor);
            state.discoFloor = null;
        }
        if (state.discoBall) {
            state.scene.remove(state.discoBall);
            state.discoBall = null;
        }
        state.materials.floor.color.set(0x333333);
    }
}

// 5. Environment Initialization Pipeline
function init() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // View Scene Instantiation Context
    state.scene = new THREE.Scene();
    state.scene.background = new THREE.Color(0x0a0e17);

    // Renderer Upgrade Configuration
    state.renderer = new THREE.WebGLRenderer({ antialias: true });
    state.renderer.setSize(width, height);
    state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    state.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    state.renderer.toneMappingExposure = 1.2;
    document.getElementById('container').appendChild(state.renderer.domElement);

    // Camera Context Implementation
    state.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    state.camera.position.set(0, 2, 15);

    state.controls = new OrbitControls(state.camera, state.renderer.domElement);
    state.controls.enableDamping = true;
    state.controls.dampingFactor = 0.05;

    // Upgraded Studio Lighting Strategy
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(10, 20, 10);
    
    const fillLight = new THREE.PointLight(0x6366f1, 1.0, 100);
    fillLight.position.set(-10, 5, -10);

    state.scene.add(ambientLight, dirLight, fillLight);

    // Grid System Floor Array Initialization
    state.floor = new THREE.Mesh(new THREE.BoxGeometry(15, 0.1, 15), state.materials.floor);
    state.floor.position.y = -4.6;
    state.scene.add(state.floor);

    // Spawn Main Model Unit Context
    state.figure = new Figure();
    state.figure.updateFromConfig();

    initGui();

    // Kickoff Modern Render Pipeline Loop Engine
    state.renderer.setAnimationLoop(() => AnimationEngine.tick());

    window.addEventListener('resize', onWindowResize);
}

function initGui() {
    state.gui = new GUI({ title: 'Avatar Controller Engine' });
    
    const structFolder = state.gui.addFolder('Structural Proportions');
    structFolder.add(state.config, 'Hair_Out', 20, 75, 5).onChange(() => state.figure.updateFromConfig());
    structFolder.add(state.config, 'Hair_Up', 10, 55, 5).onChange(() => state.figure.updateFromConfig());
    structFolder.add(state.config, 'Eyes', 31, 35.5, 0.1).onChange(() => state.figure.updateFromConfig());
    structFolder.add(state.config, 'Nose', 8, 16, 0.5).onChange(() => state.figure.updateFromConfig());
    structFolder.add(state.config, 'Mouth', 2, 9, 0.5).onChange(() => state.figure.updateFromConfig());
    structFolder.add(state.config, 'Ears', 35, 55, 0.1).onChange(() => state.figure.updateFromConfig());

    const poseFolder = state.gui.addFolder('Positional Configurations');
    poseFolder.add(state.config, 'Move_Arms', 0, 180, 10).onChange(() => state.figure.updateFromConfig());
    poseFolder.add(state.config, 'Move_Legs', -50, 50, 1).onChange(() => state.figure.updateFromConfig());
    poseFolder.add(state.config, 'Location_X', -6, 6, 0.1).onChange(() => state.figure.updateFromConfig());
    poseFolder.add(state.config, 'Location_Y', -3, 3, 0.1).onChange(() => state.figure.updateFromConfig());
    poseFolder.add(state.config, 'Location_Z', 3, 9, 0.1).onChange(() => state.figure.updateFromConfig());

    const paletteFolder = state.gui.addFolder('Color Swatches');
    paletteFolder.addColor(state.config, 'Hair_Color').onChange(() => state.figure.updateFromConfig());
    paletteFolder.addColor(state.config, 'Eye_Color').onChange(() => state.figure.updateFromConfig());
    paletteFolder.addColor(state.config, 'Body_Color').onChange(() => state.figure.updateFromConfig());
    paletteFolder.addColor(state.config, 'Limbs_Color').onChange(() => state.figure.updateFromConfig());

    state.gui.add(state.config, 'Animation', ['Stop', 'Walking', 'Talking', 'Dancing', 'Disco']).onChange((val) => {
        AnimationEngine.cleanupDiscoEffects();
        if (val === 'Stop') {
            state.config.Location_X = 0;
            state.config.Location_Y = 0;
            state.config.Location_Z = 0;
            state.config.Move_Arms = 0;
            state.config.Move_Legs = -50;
            state.figure.rotation.set(0, 0, 0);
            state.figure.updateFromConfig();
        }
    });
}

function onWindowResize() {
    state.camera.aspect = window.innerWidth / window.innerHeight;
    state.camera.updateProjectionMatrix();
    state.renderer.setSize(window.innerWidth, window.innerHeight);
}

// Execution Entry
init();