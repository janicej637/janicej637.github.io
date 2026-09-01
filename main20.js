/* =========================================================
   main20.js - Routine Coach
   =========================================================

   Designed specifically for the supplied index20.html.

   Features:
   - Add chore
   - Chore name text box
   - Chore duration text box
   - Add sub-chore
   - Sub-chore name and duration boxes
   - Remove chores
   - Remove sub-chores
   - Save routines
   - Edit routines
   - Delete routines
   - Morning / Noon / Night / Daily / Weekly /
     Monthly / Annual schedules
   - Routine filtering
   - Start routine
   - Pause / Resume
   - Stop
   - Automatic chore/sub-chore progression
   - Countdown timer
   - Coach voice
   - Warning announcement
   - Light-show mode
   - LocalStorage persistence

   ========================================================= */

"use strict";


/* =========================================================
   STORAGE
   ========================================================= */

const STORAGE_KEY = "routineCoach_index20_v3";


/* =========================================================
   APPLICATION STATE
   ========================================================= */

const state = {

    routines: [],

    editingId: null,

    builderChores: [],

    activeRoutine: null,

    choreIndex: 0,

    subChoreIndex: 0,

    remainingSeconds: 0,

    totalSeconds: 0,

    timerId: null,

    running: false,

    paused: false,

    lightShow: false,

    audioEnabled: true,

    warningTriggered: false,

    currentFilter: "all"

};


/* =========================================================
   HTML ELEMENT REFERENCES
   ========================================================= */

const $ = id => document.getElementById(id);

const el = {

    lightshow:
        $("lightshow"),

    lightshowToggle:
        $("lightshow-toggle"),

    newRoutine:
        $("new-routine"),

    deleteRoutine:
        $("delete-routine"),

    routineList:
        $("routine-list"),

    filters:
        [...document.querySelectorAll(".filter")],

    form:
        $("routine-form"),

    editorTitle:
        $("editor-title"),

    routineName:
        $("routine-name"),

    routinePeriod:
        $("routine-period"),

    addChore:
        $("add-chore"),

    choreEditor:
        $("chore-editor"),

    resetEditor:
        $("reset-editor"),

    activeRoutineName:
        $("active-routine-name"),

    activeSubchore:
        $("active-subchore"),

    timer:
        $("timer"),

    timerProgress:
        $("timer-progress"),

    coachMessage:
        $("coach-message"),

    currentChore:
        $("current-chore"),

    currentIndex:
        $("current-index"),

    startRoutine:
        $("start-routine"),

    pauseRoutine:
        $("pause-routine"),

    stopRoutine:
        $("stop-routine")

};


/* =========================================================
   UTILITY FUNCTIONS
   ========================================================= */

function makeId(prefix) {

    return (
        prefix +
        "-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );

}


function clean(value) {

    return String(value ?? "").trim();

}


function minutesToSeconds(minutes) {

    const value = Number(minutes);

    return Math.max(
        1,
        Math.round(
            (value || 0) * 60
        )
    );

}


function formatTime(seconds) {

    seconds = Math.max(
        0,
        Math.floor(seconds)
    );

    const hours =
        Math.floor(seconds / 3600);

    const minutes =
        Math.floor(
            (seconds % 3600) / 60
        );

    const secs =
        seconds % 60;


    if (hours > 0) {

        return (
            String(hours).padStart(2, "0") +
            ":" +
            String(minutes).padStart(2, "0") +
            ":" +
            String(secs).padStart(2, "0")
        );

    }


    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(secs).padStart(2, "0")
    );

}


function durationText(seconds) {

    seconds = Math.max(
        0,
        Math.floor(seconds)
    );

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        seconds % 60;


    if (minutes > 0 && secs > 0) {

        return (
            `${minutes} minute` +
            `${minutes === 1 ? "" : "s"} and ` +
            `${secs} second` +
            `${secs === 1 ? "" : "s"}`
        );

    }


    if (minutes > 0) {

        return (
            `${minutes} minute` +
            `${minutes === 1 ? "" : "s"}`
        );

    }


    return (
        `${secs} second` +
        `${secs === 1 ? "" : "s"}`
    );

}


/* =========================================================
   OBJECT CREATION
   ========================================================= */

function createSubChore(
    name = "",
    minutes = 1
) {

    return {

        id: makeId("sub"),

        name: clean(name),

        minutes:
            Math.max(
                0.1,
                Number(minutes) || 1
            )

    };

}


function createChore(
    name = "",
    minutes = 10
) {

    return {

        id: makeId("chore"),

        name: clean(name),

        minutes:
            Math.max(
                0.1,
                Number(minutes) || 10
            ),

        subChores: []

    };

}


function createRoutine(
    name,
    period,
    chores
) {

    return {

        id: makeId("routine"),

        name: clean(name),

        period:
            period || "daily",

        chores:
            chores || []

    };

}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function saveStorage() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                state.routines
            )
        );

    } catch (error) {

        console.warn(
            "Unable to save routines:",
            error
        );

    }

}


function loadStorage() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    STORAGE_KEY
                ) || "[]"
            );


        state.routines =
            Array.isArray(saved)
                ? saved
                : [];

    } catch (error) {

        console.warn(
            "Unable to load routines:",
            error
        );

        state.routines = [];

    }


    normalizeRoutines();

}


function normalizeRoutines() {

    state.routines.forEach(
        routine => {

            routine.id ||=
                makeId("routine");

            routine.name =
                clean(
                    routine.name
                ) ||
                "Unnamed Routine";


            routine.period =
                clean(
                    routine.period ||
                    routine.type
                ).toLowerCase() ||
                "daily";


            if (
                !Array.isArray(
                    routine.chores
                )
            ) {

                routine.chores = [];

            }


            routine.chores.forEach(
                chore => {

                    chore.id ||=
                        makeId("chore");

                    chore.name =
                        clean(
                            chore.name
                        ) ||
                        "Chore";

                    chore.minutes =
                        Math.max(
                            0.1,
                            Number(
                                chore.minutes
                            ) || 1
                        );


                    if (
                        !Array.isArray(
                            chore.subChores
                        )
                    ) {

                        chore.subChores = [];

                    }


                    chore.subChores.forEach(
                        sub => {

                            sub.id ||=
                                makeId("sub");

                            sub.name =
                                clean(
                                    sub.name
                                ) ||
                                "Sub-Chore";

                            sub.minutes =
                                Math.max(
                                    0.1,
                                    Number(
                                        sub.minutes
                                    ) || 1
                                );

                        }
                    );

                }
            );

        }
    );

}


/* =========================================================
   COACH
   ========================================================= */

function setCoach(
    message,
    announce = false
) {

    if (!el.coachMessage) {
        return;
    }


    const paragraph =
        el.coachMessage.querySelector(
            "p"
        );


    if (paragraph) {

        paragraph.textContent =
            message;

    } else {

        el.coachMessage.textContent =
            message;

    }


    if (announce) {

        speak(message);

    }

}


function speak(message) {

    if (
        !state.audioEnabled ||
        state.lightShow ||
        !(
            "speechSynthesis"
            in window
        )
    ) {

        return;

    }


    try {

        window.speechSynthesis.cancel();


        const utterance =
            new SpeechSynthesisUtterance(
                message
            );


        utterance.rate = 0.95;

        utterance.pitch = 1;


        window.speechSynthesis.speak(
            utterance
        );

    } catch (error) {

        console.warn(
            "Speech error:",
            error
        );

    }

}


function vibrate(pattern) {

    if (!state.lightShow) {
        return;
    }


    if (
        "vibrate"
        in navigator
    ) {

        try {

            navigator.vibrate(
                pattern
            );

        } catch (error) {

            console.warn(
                "Vibration error:",
                error
            );

        }

    }

}


/* =========================================================
   LIGHT SHOW
   ========================================================= */

function setLight(color) {

    document.body.classList.remove(
        "lightshow-green",
        "lightshow-yellow",
        "lightshow-red"
    );


    if (!state.lightShow) {
        return;
    }


    document.body.classList.add(
        "lightshow-" + color
    );

}


function toggleLightShow() {

    state.lightShow =
        !state.lightShow;


    if (state.lightShow) {

        state.audioEnabled = false;


        if (el.lightshowToggle) {

            el.lightshowToggle.textContent =
                "💡 Light Show: ON";

        }


        if (
            "speechSynthesis"
            in window
        ) {

            window.speechSynthesis.cancel();

        }


        setLight("green");

        vibrate([
            100,
            80,
            100
        ]);


        setCoach(
            "Light Show Mode is ON. Audio is disabled."
        );

    } else {

        state.audioEnabled = true;


        document.body.classList.remove(
            "lightshow-green",
            "lightshow-yellow",
            "lightshow-red"
        );


        if (el.lightshowToggle) {

            el.lightshowToggle.textContent =
                "💡 Light Show: OFF";

        }


        setCoach(
            "Light Show Mode is OFF. Audio is ON."
        );

    }

}


/* =========================================================
   RESET ROUTINE BUILDER
   ========================================================= */

function resetEditor() {

    stopTimerInterval();


    state.editingId = null;

    state.builderChores = [];


    if (el.routineName) {

        el.routineName.value = "";

    }


    if (el.routinePeriod) {

        el.routinePeriod.value =
            "morning";

    }


    if (el.editorTitle) {

        el.editorTitle.textContent =
            "Create your first routine";

    }


    if (el.deleteRoutine) {

        el.deleteRoutine.classList.add(
            "hidden"
        );

    }


    renderBuilder();

}


/* =========================================================
   ADD CHORE
   ========================================================= */

/*
   THIS IS THE IMPORTANT FIX.

   The HTML does NOT contain chore-name or
   chore-minutes inputs.

   The HTML contains:

       <div id="chore-editor"></div>

   Therefore this function creates a chore
   object and renderBuilder() creates the
   actual text boxes.
*/

function addChore() {

    const newChore =
        createChore(
            "",
            10
        );


    state.builderChores.push(
        newChore
    );


    renderBuilder();


    setCoach(
        "Chore added. Enter the chore name and duration."
    );


    /*
       Automatically put the cursor into
       the newly created chore name box.
    */

    const inputs =
        el.choreEditor?.querySelectorAll(
            ".chore-name-input"
        );


    if (
        inputs &&
        inputs.length
    ) {

        const lastInput =
            inputs[
                inputs.length - 1
            ];


        lastInput.focus();

    }

}


/* =========================================================
   ADD SUB-CHORE
   ========================================================= */

function addSubChore(
    choreId
) {

    const chore =
        state.builderChores.find(
            item =>
                item.id === choreId
        );


    if (!chore) {
        return;
    }


    chore.subChores.push(
        createSubChore(
            "",
            1
        )
    );


    renderBuilder();


    /*
       Focus the newly-created
       sub-chore name input.
    */

    const choreBox =
        el.choreEditor?.querySelector(
            `[data-chore-id="${choreId}"]`
        );


    if (choreBox) {

        const inputs =
            choreBox.querySelectorAll(
                ".sub-name-input"
            );


        if (inputs.length) {

            inputs[
                inputs.length - 1
            ].focus();

        }

    }

}


/* =========================================================
   REMOVE CHORE
   ========================================================= */

function removeChore(
    choreId
) {

    state.builderChores =
        state.builderChores.filter(
            chore =>
                chore.id !== choreId
        );


    renderBuilder();

}


/* =========================================================
   REMOVE SUB-CHORE
   ========================================================= */

function removeSubChore(
    choreId,
    subId
) {

    const chore =
        state.builderChores.find(
            item =>
                item.id === choreId
        );


    if (!chore) {
        return;
    }


    chore.subChores =
        chore.subChores.filter(
            sub =>
                sub.id !== subId
        );


    renderBuilder();

}


/* =========================================================
   RENDER BUILDER
   ========================================================= */

function renderBuilder() {

    if (!el.choreEditor) {

        console.error(
            "ERROR: #chore-editor was not found."
        );

        return;

    }


    el.choreEditor.innerHTML = "";


    /*
       Nothing has been added yet.
    */

    if (
        state.builderChores.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "empty";


        empty.innerHTML =
            "No chores yet.<br>" +
            "Click ＋ Add chore to build your routine.";


        el.choreEditor.appendChild(
            empty
        );


        return;

    }


    /*
       Create each chore.
    */

    state.builderChores.forEach(
        (chore, choreIndex) => {

            const choreBox =
                document.createElement(
                    "div"
                );


            choreBox.className =
                "builder-chore";


            choreBox.dataset.choreId =
                chore.id;


            /*
               CHORE HEADER
            */

            const header =
                document.createElement(
                    "div"
                );


            header.className =
                "builder-chore-heading";


            const title =
                document.createElement(
                    "strong"
                );


            title.textContent =
                `Chore ${choreIndex + 1}`;


            const removeButton =
                document.createElement(
                    "button"
                );


            removeButton.type =
                "button";


            removeButton.className =
                "danger ghost";


            removeButton.textContent =
                "Remove";


            removeButton.addEventListener(
                "click",
                function () {

                    removeChore(
                        chore.id
                    );

                }
            );


            header.append(
                title,
                removeButton
            );


            /*
               CHORE FIELDS
            */

            const fields =
                document.createElement(
                    "div"
                );


            fields.className =
                "form-grid";


            /*
               CHORE NAME
            */

            const nameLabel =
                document.createElement(
                    "label"
                );


            nameLabel.textContent =
                "Chore name";


            const nameInput =
                document.createElement(
                    "input"
                );


            nameInput.type =
                "text";


            nameInput.className =
                "chore-name-input";


            nameInput.placeholder =
                "Enter chore name";


            nameInput.value =
                chore.name;


            nameInput.maxLength =
                100;


            nameInput.autocomplete =
                "off";


            nameInput.addEventListener(
                "input",
                function (event) {

                    chore.name =
                        event.target.value;

                }
            );


            nameLabel.appendChild(
                nameInput
            );


            /*
               CHORE DURATION
            */

            const durationLabel =
                document.createElement(
                    "label"
                );


            durationLabel.textContent =
                "Duration (minutes)";


            const durationInput =
                document.createElement(
                    "input"
                );


            durationInput.type =
                "number";


            durationInput.className =
                "chore-minutes-input";


            durationInput.min =
                "0.1";


            durationInput.step =
                "0.1";


            durationInput.value =
                chore.minutes;


            durationInput.addEventListener(
                "input",
                function (event) {

                    const value =
                        Number(
                            event.target.value
                        );


                    chore.minutes =
                        Math.max(
                            0.1,
                            value || 0.1
                        );

                }
            );


            durationLabel.appendChild(
                durationInput
            );


            fields.append(
                nameLabel,
                durationLabel
            );


            /*
               SUB-CHORE HEADER
            */

            const subHeader =
                document.createElement(
                    "div"
                );


            subHeader.className =
                "subheading";


            const subTitle =
                document.createElement(
                    "strong"
                );


            subTitle.textContent =
                "Sub-chores";


            const addSubButton =
                document.createElement(
                    "button"
                );


            addSubButton.type =
                "button";


            addSubButton.className =
                "small-btn";


            addSubButton.textContent =
                "＋ Add sub-chore";


            addSubButton.addEventListener(
                "click",
                function () {

                    addSubChore(
                        chore.id
                    );

                }
            );


            subHeader.append(
                subTitle,
                addSubButton
            );


            /*
               SUB-CHORE LIST
            */

            const subList =
                document.createElement(
                    "div"
                );


            subList.className =
                "builder-subchores";


            /*
               No sub-chores yet.
            */

            if (
                chore.subChores.length ===
                0
            ) {

                const noSub =
                    document.createElement(
                        "p"
                    );


                noSub.className =
                    "muted";


                noSub.textContent =
                    "No sub-chores. " +
                    "The chore will use its full duration.";


                subList.appendChild(
                    noSub
                );

            } else {


                /*
                   Create every sub-chore.
                */

                chore.subChores.forEach(
                    (sub, subIndex) => {

                        const subRow =
                            document.createElement(
                                "div"
                            );


                        subRow.className =
                            "builder-subchore";


                        /*
                           SUB-CHORE NAME
                        */

                        const subName =
                            document.createElement(
                                "input"
                            );


                        subName.type =
                            "text";


                        subName.className =
                            "sub-name-input";


                        subName.placeholder =
                            `Sub-chore ${subIndex + 1}`;


                        subName.value =
                            sub.name;


                        subName.maxLength =
                            100;


                        subName.autocomplete =
                            "off";


                        subName.addEventListener(
                            "input",
                            function (event) {

                                sub.name =
                                    event.target.value;

                            }
                        );


                        /*
                           SUB-CHORE DURATION
                        */

                        const subMinutes =
                            document.createElement(
                                "input"
                            );


                        subMinutes.type =
                            "number";


                        subMinutes.className =
                            "sub-minutes-input";


                        subMinutes.min =
                            "0.1";


                        subMinutes.step =
                            "0.1";


                        subMinutes.value =
                            sub.minutes;


                        subMinutes.addEventListener(
                            "input",
                            function (event) {

                                const value =
                                    Number(
                                        event.target.value
                                    );


                                sub.minutes =
                                    Math.max(
                                        0.1,
                                        value || 0.1
                                    );

                            }
                        );


                        /*
                           REMOVE SUB-CHORE
                        */

                        const removeSub =
                            document.createElement(
                                "button"
                            );


                        removeSub.type =
                            "button";


                        removeSub.className =
                            "danger ghost";


                        removeSub.textContent =
                            "×";


                        removeSub.title =
                            "Remove sub-chore";


                        removeSub.addEventListener(
                            "click",
                            function () {

                                removeSubChore(
                                    chore.id,
                                    sub.id
                                );

                            }
                        );


                        subRow.append(
                            subName,
                            subMinutes,
                            removeSub
                        );


                        subList.appendChild(
                            subRow
                        );

                    }
                );

            }


            /*
               Put everything together.
            */

            choreBox.append(
                header,
                fields,
                subHeader,
                subList
            );


            el.choreEditor.appendChild(
                choreBox
            );

        }
    );

}


/* =========================================================
   GET BUILDER DATA
   ========================================================= */

function getBuilderData() {

    return state.builderChores.map(
        chore => {

            return {

                id:
                    chore.id ||
                    makeId("chore"),

                name:
                    clean(chore.name) ||
                    "Chore",

                minutes:
                    Math.max(
                        0.1,
                        Number(
                            chore.minutes
                        ) || 1
                    ),

                subChores:
                    (
                        chore.subChores ||
                        []
                    ).map(
                        sub => {

                            return {

                                id:
                                    sub.id ||
                                    makeId("sub"),

                                name:
                                    clean(
                                        sub.name
                                    ) ||
                                    "Sub-Chore",

                                minutes:
                                    Math.max(
                                        0.1,
                                        Number(
                                            sub.minutes
                                        ) || 1
                                    )

                            };

                        }
                    )

            };

        }
    );

}


/* =========================================================
   SAVE ROUTINE
   ========================================================= */

function saveRoutine(event) {

    if (event) {

        event.preventDefault();

    }


    const name =
        clean(
            el.routineName?.value
        );


    const period =
        clean(
            el.routinePeriod?.value
        ).toLowerCase();


    if (!name) {

        alert(
            "Enter a routine name."
        );

        el.routineName?.focus();

        return;

    }


    if (
        state.builderChores.length ===
        0
    ) {

        alert(
            "Add at least one chore before saving the routine."
        );

        return;

    }


    /*
       Prevent blank chore names.
    */

    state.builderChores.forEach(
        (chore, index) => {

            if (
                !clean(chore.name)
            ) {

                chore.name =
                    `Chore ${index + 1}`;

            }


            chore.subChores.forEach(
                (sub, subIndex) => {

                    if (
                        !clean(sub.name)
                    ) {

                        sub.name =
                            `Sub-chore ${subIndex + 1}`;

                    }

                }
            );

        }
    );


    const chores =
        getBuilderData();


    /*
       EDIT EXISTING ROUTINE
    */

    if (state.editingId) {

        const existing =
            state.routines.find(
                routine =>
                    routine.id ===
                    state.editingId
            );


        if (existing) {

            existing.name =
                name;

            existing.period =
                period ||
                "daily";

            existing.chores =
                chores;


            setCoach(
                `${name} has been updated!`,
                true
            );

        }

    } else {


        /*
           CREATE NEW ROUTINE
        */

        const routine =
            createRoutine(
                name,
                period || "daily",
                chores
            );


        state.routines.push(
            routine
        );


        setCoach(
            `${name} saved. Ready when you are!`,
            true
        );

    }


    saveStorage();

    renderRoutines();

    resetEditor();

}


/* =========================================================
   EDIT ROUTINE
   ========================================================= */

function editRoutine(
    routineId
) {

    const routine =
        state.routines.find(
            item =>
                item.id === routineId
        );


    if (!routine) {
        return;
    }


    stopRoutine(false);


    state.editingId =
        routine.id;


    if (el.routineName) {

        el.routineName.value =
            routine.name;

    }


    if (el.routinePeriod) {

        el.routinePeriod.value =
            routine.period ||
            "daily";

    }


    state.builderChores =
        JSON.parse(
            JSON.stringify(
                routine.chores ||
                []
            )
        );


    if (el.editorTitle) {

        el.editorTitle.textContent =
            `Edit ${routine.name}`;

    }


    if (el.deleteRoutine) {

        el.deleteRoutine.classList.remove(
            "hidden"
        );

    }


    renderBuilder();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   DELETE ROUTINE
   ========================================================= */

function deleteRoutineById(
    routineId
) {

    const routine =
        state.routines.find(
            item =>
                item.id === routineId
        );


    if (!routine) {
        return;
    }


    const confirmed =
        window.confirm(
            `Delete "${routine.name}"?`
        );


    if (!confirmed) {
        return;
    }


    if (
        state.activeRoutine?.id ===
        routineId
    ) {

        stopRoutine(false);

    }


    state.routines =
        state.routines.filter(
            item =>
                item.id !== routineId
        );


    saveStorage();


    if (
        state.editingId ===
        routineId
    ) {

        resetEditor();

    }


    renderRoutines();


    setCoach(
        `${routine.name} was deleted.`
    );

}


/* =========================================================
   DELETE CURRENT ROUTINE
   ========================================================= */

function deleteCurrentRoutine() {

    if (!state.editingId) {

        resetEditor();

        return;

    }


    deleteRoutineById(
        state.editingId
    );

}


/* =========================================================
   ROUTINE PERIOD LABEL
   ========================================================= */

function periodLabel(
    period
) {

    const labels = {

        morning: "Morning",

        noon: "Noon",

        night: "Night",

        daily: "Daily",

        weekly: "Weekly",

        monthly: "Monthly",

        annual: "Annual"

    };


    return (
        labels[period] ||
        "Daily"
    );

}


/* =========================================================
   RENDER ROUTINE LIST
   ========================================================= */

function renderRoutines() {

    if (!el.routineList) {
        return;
    }


    el.routineList.innerHTML = "";


    const routines =
        state.routines.filter(
            routine => {

                if (
                    state.currentFilter ===
                    "all"
                ) {

                    return true;

                }


                return (
                    routine.period ===
                    state.currentFilter
                );

            }
        );


    if (
        routines.length ===
        0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "empty";


        empty.innerHTML =
            "No routines found.<br>" +
            "Click ＋ to create a routine.";


        el.routineList.appendChild(
            empty
        );


        return;

    }


    routines.forEach(
        routine => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "routine-item";


            /*
               INFO
            */

            const info =
                document.createElement(
                    "div"
                );


            const title =
                document.createElement(
                    "strong"
                );


            title.textContent =
                routine.name;


            const details =
                document.createElement(
                    "small"
                );


            const count =
                routine.chores.length;


            details.textContent =
                `${periodLabel(routine.period)} • ` +
                `${count} chore` +
                `${count === 1 ? "" : "s"}`;


            info.append(
                title,
                details
            );


            /*
               BUTTONS
            */

            const actions =
                document.createElement(
                    "div"
                );


            actions.className =
                "routine-actions";


            /*
               START
            */

            const start =
                document.createElement(
                    "button"
                );


            start.type =
                "button";


            start.className =
                "primary";


            start.textContent =
                "▶ Start";


            start.addEventListener(
                "click",
                function () {

                    startRoutine(
                        routine.id
                    );

                }
            );


            /*
               EDIT
            */

            const edit =
                document.createElement(
                    "button"
                );


            edit.type =
                "button";


            edit.className =
                "secondary";


            edit.textContent =
                "Edit";


            edit.addEventListener(
                "click",
                function () {

                    editRoutine(
                        routine.id
                    );

                }
            );


            /*
               DELETE
            */

            const remove =
                document.createElement(
                    "button"
                );


            remove.type =
                "button";


            remove.className =
                "danger";


            remove.textContent =
                "Delete";


            remove.addEventListener(
                "click",
                function () {

                    deleteRoutineById(
                        routine.id
                    );

                }
            );


            actions.append(
                start,
                edit,
                remove
            );


            row.append(
                info,
                actions
            );


            el.routineList.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   FILTERS
   ========================================================= */

function setFilter(
    filter
) {

    state.currentFilter =
        filter;


    el.filters.forEach(
        button => {

            button.classList.toggle(
                "active",
                button.dataset.period ===
                    filter
            );

        }
    );


    renderRoutines();

}


/* =========================================================
   TIMER - CURRENT CHORE
   ========================================================= */

function currentChore() {

    if (
        !state.activeRoutine
    ) {

        return null;

    }


    return (
        state.activeRoutine.chores[
            state.choreIndex
        ] ||
        null
    );

}


/* =========================================================
   TIMER - CURRENT SUB-CHORE
   ========================================================= */

function currentSubChore() {

    const chore =
        currentChore();


    if (
        !chore ||
        !Array.isArray(
            chore.subChores
        ) ||
        chore.subChores.length ===
            0
    ) {

        return null;

    }


    return (
        chore.subChores[
            state.subChoreIndex
        ] ||
        null
    );

}


/* =========================================================
   CURRENT TIMER UNIT
   ========================================================= */

function currentUnit() {

    return (
        currentSubChore() ||
        currentChore()
    );

}


/* =========================================================
   TOTAL TIMER UNITS
   ========================================================= */

function totalUnits() {

    if (
        !state.activeRoutine
    ) {

        return 0;

    }


    return state.activeRoutine.chores.reduce(
        (
            total,
            chore
        ) => {

            return (
                total +
                (
                    chore.subChores?.length
                        ? chore.subChores.length
                        : 1
                )
            );

        },
        0
    );

}


/* =========================================================
   COMPLETED UNITS
   ========================================================= */

function completedUnits() {

    if (
        !state.activeRoutine
    ) {

        return 0;

    }


    let completed = 0;


    for (
        let i = 0;
        i < state.choreIndex;
        i++
    ) {

        const chore =
            state.activeRoutine
                .chores[i];


        completed +=
            chore.subChores?.length
                ? chore.subChores.length
                : 1;

    }


    completed +=
        state.subChoreIndex;


    return completed;

}


/* =========================================================
   UPDATE TIMER DISPLAY
   ========================================================= */

function updateDisplay() {

    const routine =
        state.activeRoutine;


    const chore =
        currentChore();


    const sub =
        currentSubChore();


    /*
       Routine name
    */

    if (
        el.activeRoutineName
    ) {

        el.activeRoutineName.textContent =
            routine?.name ||
            "No routine running";

    }


    /*
       Active sub-chore message
    */

    if (
        el.activeSubchore
    ) {

        if (sub) {

            el.activeSubchore.textContent =
                sub.name;

        } else if (chore) {

            el.activeSubchore.textContent =
                "Chore timer";

        } else {

            el.activeSubchore.textContent =
                "Select a routine and press Start.";

        }

    }


    /*
       Current chore
    */

    if (
        el.currentChore
    ) {

        el.currentChore.textContent =
            chore?.name ||
            "—";

    }


    /*
       Current sub-chore number
    */

    if (
        el.currentIndex
    ) {

        if (sub) {

            el.currentIndex.textContent =
                `${state.subChoreIndex + 1} of ${chore.subChores.length}`;

        } else if (chore) {

            el.currentIndex.textContent =
                "Full chore";

        } else {

            el.currentIndex.textContent =
                "—";

        }

    }


    /*
       Timer
    */

    if (
        el.timer
    ) {

        el.timer.textContent =
            formatTime(
                state.remainingSeconds
            );

    }


    updateProgress();

    updateTimerButtons();

}


/* =========================================================
   TIMER PROGRESS BAR
   ========================================================= */

function updateProgress() {

    if (
        !state.activeRoutine ||
        !totalUnits()
    ) {

        if (
            el.timerProgress
        ) {

            el.timerProgress.style.width =
                "0%";

        }

        return;

    }


    const total =
        totalUnits();


    const completed =
        completedUnits();


    let currentProgress =
        0;


    if (
        state.totalSeconds >
        0
    ) {

        currentProgress =
            (
                state.totalSeconds -
                state.remainingSeconds
            ) /
            state.totalSeconds;

    }


    const percentage =
        (
            (
                completed +
                currentProgress
            ) /
            total
        ) *
        100;


    if (
        el.timerProgress
    ) {

        el.timerProgress.style.width =
            Math.min(
                100,
                Math.max(
                    0,
                    percentage
                )
            ) + "%";

    }

}


/* =========================================================
   TIMER BUTTON STATES
   ========================================================= */

function updateTimerButtons() {

    if (
        el.pauseRoutine
    ) {

        el.pauseRoutine.disabled =
            !state.running;


        el.pauseRoutine.textContent =
            state.paused
                ? "▶ Resume"
                : "Ⅱ Pause";

    }


    if (
        el.stopRoutine
    ) {

        el.stopRoutine.disabled =
            !state.running;

    }

}


/* =========================================================
   STOP TIMER INTERVAL
   ========================================================= */

function stopTimerInterval() {

    if (
        state.timerId !== null
    ) {

        clearInterval(
            state.timerId
        );


        state.timerId =
            null;

    }

}


/* =========================================================
   START TIMER INTERVAL
   ========================================================= */

function startTimerInterval() {

    stopTimerInterval();


    state.timerId =
        setInterval(
            function () {

                if (
                    !state.running ||
                    state.paused
                ) {

                    return;

                }


                state.remainingSeconds--;


                updateDisplay();

                checkWarning();


                if (
                    state.remainingSeconds <=
                    0
                ) {

                    finishCurrentUnit();

                }

            },
            1000
        );

}


/* =========================================================
   WARNING
   ========================================================= */

function checkWarning() {

    if (
        state.warningTriggered
    ) {

        return;

    }


    const unit =
        currentUnit();


    if (!unit) {
        return;
    }


    const duration =
        minutesToSeconds(
            unit.minutes
        );


    const warning =
        Math.min(
            300,
            Math.max(
                10,
                Math.floor(
                    duration *
                    0.1667
                )
            )
        );


    if (
        state.remainingSeconds <=
        warning
    ) {

        state.warningTriggered =
            true;


        const message =
            `You're getting close to the end of ${unit.name}. If you need more time, press Pause. Otherwise, the next step will start automatically.`;


        if (
            state.lightShow
        ) {

            setLight(
                "yellow"
            );


            vibrate([
                300,
                100,
                300,
                100,
                300
            ]);

        } else {

            speak(
                message
            );

        }


        setCoach(
            message
        );

    }

}


/* =========================================================
   NEXT POSITION
   ========================================================= */

function nextPosition() {

    const routine =
        state.activeRoutine;


    const chore =
        currentChore();


    if (
        !routine ||
        !chore
    ) {

        return null;

    }


    /*
       Next sub-chore.
    */

    if (
        chore.subChores?.length &&
        state.subChoreIndex + 1 <
            chore.subChores.length
    ) {

        return {

            choreIndex:
                state.choreIndex,

            subChoreIndex:
                state.subChoreIndex + 1

        };

    }


    /*
       Next chore.
    */

    if (
        state.choreIndex + 1 <
        routine.chores.length
    ) {

        return {

            choreIndex:
                state.choreIndex + 1,

            subChoreIndex:
                0

        };

    }


    /*
       Routine finished.
    */

    return null;

}


/* =========================================================
   START ROUTINE
   ========================================================= */

function startRoutine(
    routineId
) {

    const routine =
        state.routines.find(
            item =>
                item.id ===
                routineId
        );


    if (
        !routine ||
        !routine.chores.length
    ) {

        alert(
            "This routine has no chores."
        );

        return;

    }


    stopTimerInterval();


    state.activeRoutine =
        routine;


    state.choreIndex =
        0;


    state.subChoreIndex =
        0;


    state.running =
        true;


    state.paused =
        false;


    state.warningTriggered =
        false;


    beginUnit();


    document
        .querySelector(
            ".player-panel"
        )
        ?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}


/* =========================================================
   BEGIN CURRENT UNIT
   ========================================================= */

function beginUnit() {

    const unit =
        currentUnit();


    if (!unit) {

        completeRoutine();

        return;

    }


    state.totalSeconds =
        minutesToSeconds(
            unit.minutes
        );


    state.remainingSeconds =
        state.totalSeconds;


    state.warningTriggered =
        false;


    updateDisplay();


    const message =
        `${unit.name} starts now. You have ${durationText(state.remainingSeconds)}.`;


    setCoach(
        message,
        !state.lightShow
    );


    if (
        state.lightShow
    ) {

        setLight(
            "green"
        );


        vibrate([
            150,
            80,
            150
        ]);

    }


    startTimerInterval();

}


/* =========================================================
   FINISH CURRENT UNIT
   ========================================================= */

function finishCurrentUnit() {

    stopTimerInterval();


    state.remainingSeconds =
        0;


    updateDisplay();


    const unit =
        currentUnit();


    if (
        state.lightShow
    ) {

        setLight(
            "red"
        );


        vibrate([
            500,
            150,
            500,
            150,
            800
        ]);

    } else {

        speak(
            `${unit?.name || "Chore"} complete!`
        );

    }


    const next =
        nextPosition();


    if (!next) {

        setTimeout(
            completeRoutine,
            700
        );

        return;

    }


    state.choreIndex =
        next.choreIndex;


    state.subChoreIndex =
        next.subChoreIndex;


    setTimeout(
        function () {

            if (
                state.running
            ) {

                beginUnit();

            }

        },
        900
    );

}


/* =========================================================
   COMPLETE ROUTINE
   ========================================================= */

function completeRoutine() {

    stopTimerInterval();


    state.running =
        false;


    state.paused =
        false;


    state.remainingSeconds =
        0;


    updateDisplay();


    const message =
        `${state.activeRoutine?.name || "Routine"} is complete. Excellent work!`;


    if (
        state.lightShow
    ) {

        setLight(
            "red"
        );


        vibrate([
            600,
            150,
            600,
            150,
            1000
        ]);

    } else {

        speak(
            message
        );

    }


    setCoach(
        message
    );

}


/* =========================================================
   PAUSE / RESUME
   ========================================================= */

function togglePause() {

    if (
        !state.running
    ) {

        return;

    }


    /*
       RESUME
    */

    if (
        state.paused
    ) {

        state.paused =
            false;


        if (
            state.lightShow
        ) {

            setLight(
                "green"
            );


            vibrate([
                150,
                80,
                150
            ]);

        } else {

            const message =
                `Resuming ${currentUnit()?.name || "your chore"}. ${durationText(state.remainingSeconds)} remaining.`;


            speak(
                message
            );


            setCoach(
                message
            );

        }


        startTimerInterval();

        updateDisplay();

        return;

    }


    /*
       PAUSE
    */

    state.paused =
        true;


    stopTimerInterval();


    if (
        state.lightShow
    ) {

        setLight(
            "yellow"
        );


        vibrate([
            200,
            100,
            200
        ]);

    } else if (
        "speechSynthesis"
        in window
    ) {

        window.speechSynthesis.cancel();

    }


    setCoach(
        "Timer paused. Press Resume when you're ready."
    );


    updateDisplay();

}


/* =========================================================
   STOP ROUTINE
   ========================================================= */

function stopRoutine(
    announce = true
) {

    stopTimerInterval();


    state.running =
        false;


    state.paused =
        false;


    state.remainingSeconds =
        0;


    document.body.classList.remove(
        "lightshow-green",
        "lightshow-yellow",
        "lightshow-red"
    );


    if (
        "speechSynthesis"
        in window
    ) {

        window.speechSynthesis.cancel();

    }


    if (announce) {

        setCoach(
            "Routine stopped."
        );

    }


    updateDisplay();

}


/* =========================================================
   EVENT BINDING
   ========================================================= */

function bindEvents() {

    /*
       ADD CHORE

       The supplied HTML has:

       <button id="add-chore">
           ＋ Add chore
       </button>

       This directly connects that button.
    */

    if (
        el.addChore
    ) {

        el.addChore.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                addChore();

            }
        );

    } else {

        console.error(
            "ERROR: #add-chore button was not found."
        );

    }


    /*
       SAVE ROUTINE
    */

    if (
        el.form
    ) {

        el.form.addEventListener(
            "submit",
            saveRoutine
        );

    }


    /*
       CLEAR / RESET
    */

    if (
        el.resetEditor
    ) {

        el.resetEditor.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                resetEditor();

            }
        );

    }


    /*
       NEW ROUTINE
    */

    if (
        el.newRoutine
    ) {

        el.newRoutine.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                resetEditor();

                el.routineName?.focus();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /*
       DELETE CURRENT ROUTINE
    */

    if (
        el.deleteRoutine
    ) {

        el.deleteRoutine.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                deleteCurrentRoutine();

            }
        );

    }


    /*
       LIGHT SHOW
    */

    if (
        el.lightshowToggle
    ) {

        el.lightshowToggle.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                toggleLightShow();

            }
        );

    }


    /*
       START ROUTINE
    */

    if (
        el.startRoutine
    ) {

        el.startRoutine.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                if (
                    state.routines.length ===
                    0
                ) {

                    alert(
                        "Create and save a routine first."
                    );

                    return;

                }


                /*
                   Start currently active routine.
                   Otherwise start first routine.
                */

                const routine =
                    state.activeRoutine ||
                    state.routines[0];


                startRoutine(
                    routine.id
                );

            }
        );

    }


    /*
       PAUSE / RESUME
    */

    if (
        el.pauseRoutine
    ) {

        el.pauseRoutine.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                togglePause();

            }
        );

    }


    /*
       STOP
    */

    if (
        el.stopRoutine
    ) {

        el.stopRoutine.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                stopRoutine(
                    true
                );

            }
        );

    }


    /*
       PERIOD FILTERS
    */

    el.filters.forEach(
        button => {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    setFilter(
                        button.dataset.period ||
                        "all"
                    );

                }
            );

        }
    );


    /*
       KEYBOARD CONTROLS
    */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.target.matches(
                    "input, textarea, select, button"
                )
            ) {

                return;

            }


            /*
               SPACE =
               Pause / Resume
            */

            if (
                event.code ===
                    "Space" &&
                state.running
            ) {

                event.preventDefault();

                togglePause();

            }


            /*
               RIGHT ARROW =
               Skip current unit
            */

            if (
                event.code ===
                    "ArrowRight" &&
                state.running
            ) {

                event.preventDefault();

                skipCurrentUnit();

            }

        }
    );

}


/* =========================================================
   SKIP CURRENT UNIT
   ========================================================= */

function skipCurrentUnit() {

    if (
        !state.running
    ) {

        return;

    }


    stopTimerInterval();


    const next =
        nextPosition();


    if (!next) {

        completeRoutine();

        return;

    }


    state.choreIndex =
        next.choreIndex;


    state.subChoreIndex =
        next.subChoreIndex;


    beginUnit();

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function init() {

    console.log(
        "Routine Coach initializing..."
    );


    loadStorage();


    bindEvents();


    renderRoutines();


    renderBuilder();


    updateDisplay();


    if (
        el.lightshowToggle
    ) {

        el.lightshowToggle.textContent =
            "💡 Light Show: OFF";

    }


    console.log(
        "Routine Coach index20 initialized successfully."
    );

}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.ChoreCoach = {

    state,

    addChore,

    addSubChore,

    saveRoutine,

    startRoutine,

    togglePause,

    stopRoutine,

    resetEditor,

    editRoutine,

    deleteRoutineById,

    skipCurrentUnit

};


/* =========================================================
   START APPLICATION
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        init
    );

} else {

    init();

}
