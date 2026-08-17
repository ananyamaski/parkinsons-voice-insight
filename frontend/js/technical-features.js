/* =========================================================
   TECHNICAL FEATURES PAGE
========================================================= */


/* =========================================================
   LOAD STORED FEATURES
========================================================= */

const storedFeatures =
    localStorage.getItem(
        "voiceAnalysisFeatures"
    );


/* =========================================================
   CHECK DATA
========================================================= */

if (!storedFeatures) {

    alert(
        "No voice analysis data found. Please analyze a voice sample first."
    );

    window.location.href =
        "analysis.html";

}


/* =========================================================
   CONVERT DATA
========================================================= */

const features =
    JSON.parse(
        storedFeatures
    );


/* =========================================================
   FEATURE DISPLAY NAMES
========================================================= */

const featureDisplayNames = {

    jitter_local:
        "Jitter (Local)",

    jitter_local_absolute:
        "Jitter (Local, Absolute)",

    jitter_rap:
        "Jitter (RAP)",

    jitter_ppq5:
        "Jitter (PPQ5)",

    jitter_ddp:
        "Jitter (DDP)",


    shimmer_local:
        "Shimmer (Local)",

    shimmer_local_db:
        "Shimmer (Local, dB)",

    shimmer_apq3:
        "Shimmer (APQ3)",

    shimmer_apq5:
        "Shimmer (APQ5)",

    shimmer_apq11:
        "Shimmer (APQ11)",

    shimmer_dda:
        "Shimmer (DDA)",


    ac:
        "Mean Autocorrelation",

    nth:
        "Noise-to-Harmonics Ratio",

    htn:
        "Harmonics-to-Noise Ratio",


    median_pitch:
        "Median Pitch",

    mean_pitch:
        "Mean Pitch",

    pitch_std:
        "Pitch Standard Deviation",

    minimum_pitch:
        "Minimum Pitch",

    maximum_pitch:
        "Maximum Pitch",


    number_of_pulses:
        "Number of Pulses",

    number_of_periods:
        "Number of Periods",

    mean_period:
        "Mean Period",

    period_std:
        "Period Standard Deviation",


    fraction_unvoiced:
        "Fraction Unvoiced",

    number_of_voice_breaks:
        "Number of Voice Breaks",

    degree_of_voice_breaks:
        "Degree of Voice Breaks"

};


/* =========================================================
   DISPLAY 26 FEATURES
========================================================= */

const featureGrid =
    document.getElementById(
        "technicalFeaturesGrid"
    );


let featureNumber = 1;


Object.entries(
    features
).forEach(
    function ([name, value]) {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "technical-feature-card";


        /* NUMBER */

        const number =
            document.createElement(
                "div"
            );


        number.className =
            "feature-number";


        number.textContent =
            String(
                featureNumber
            ).padStart(
                2,
                "0"
            );


        /* FEATURE NAME */

        const label =
            document.createElement(
                "span"
            );


        label.textContent =
            featureDisplayNames[name] ||
            name;


        /* FEATURE VALUE */

        const valueElement =
            document.createElement(
                "strong"
            );


        if (
            typeof value === "number"
        ) {

            valueElement.textContent =
                value.toFixed(6);

        } else {

            valueElement.textContent =
                value;

        }


        /* ADD CONTENT */

        card.appendChild(
            number
        );

        card.appendChild(
            label
        );

        card.appendChild(
            valueElement
        );


        featureGrid.appendChild(
            card
        );


        featureNumber++;

    }
);


/* =========================================================
   FEATURE COUNT
========================================================= */

const featureCount =
    document.getElementById(
        "featureCount"
    );


if (featureCount) {

    featureCount.textContent =
        Object.keys(
            features
        ).length;

}


/* =========================================================
   LOAD ANALYSIS RESULT
========================================================= */

const storedResult =
    localStorage.getItem(
        "voiceAnalysisResult"
    );


if (storedResult) {

    const result =
        JSON.parse(
            storedResult
        );


    const sampleName =
        document.getElementById(
            "technicalSampleName"
        );


    const analysisDate =
        document.getElementById(
            "technicalAnalysisDate"
        );


    if (sampleName) {

        sampleName.textContent =
            result.fileName ||
            "Voice Sample";

    }


    if (analysisDate) {

        analysisDate.textContent =
            result.date ||
            new Date().toLocaleString();

    }

}


/* =========================================================
   BACK TO VOICE PARAMETERS
========================================================= */

function goBackToParameters() {

    window.location.href =
        "voice-details.html";

}


const backButton =
    document.getElementById(
        "backToParametersBtn"
    );


if (backButton) {

    backButton.addEventListener(
        "click",
        goBackToParameters
    );

}


const bottomBackButton =
    document.getElementById(
        "backToParametersBtnBottom"
    );


if (bottomBackButton) {

    bottomBackButton.addEventListener(
        "click",
        goBackToParameters
    );

}


/* =========================================================
   PDF BUTTON
========================================================= */

const pdfButton =
    document.getElementById(
        "downloadTechnicalPdfBtn"
    );


if (pdfButton) {

    pdfButton.addEventListener(
        "click",
        function () {

            alert(
                "PDF report generation will be added next."
            );

        }
    );

}