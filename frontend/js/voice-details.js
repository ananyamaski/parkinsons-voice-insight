/* =========================================================
   CURRENT USER
========================================================= */

const currentUserEmail =
    localStorage.getItem("user_email");


/* =========================================================
   LOGIN CHECK
========================================================= */

if (!currentUserEmail) {

    alert(
        "Please login to continue."
    );

    window.location.href =
        "login.html";

}


/* =========================================================
   USER-SPECIFIC STORAGE KEYS
========================================================= */

const historyKey =
    "voiceAnalysisHistory_" +
    currentUserEmail;


const featuresKey =
    "voiceAnalysisFeatures_" +
    currentUserEmail;


const resultKey =
    "voiceAnalysisResult_" +
    currentUserEmail;


/* =========================================================
   LOAD CURRENT USER'S ANALYSIS
========================================================= */

const storedFeatures =
    localStorage.getItem(
        featuresKey
    );


const storedResult =
    localStorage.getItem(
        resultKey
    );


/* =========================================================
   CHECK DATA
   ========================================================= */

if (!storedFeatures || !storedResult) {

    alert(
        "No voice analysis data found. Please analyze a voice sample first."
    );

    window.location.href =
        "analysis.html";

}


/* =========================================================
   LOAD DATA
   ========================================================= */

const features =
    JSON.parse(storedFeatures);

const result =
    JSON.parse(storedResult);


/* =========================================================
   SAVE ANALYSIS TO HISTORY
========================================================= */




let analysisHistory =
    JSON.parse(
        localStorage.getItem(historyKey)
    ) || [];

/*
 * Create a unique ID for this analysis.
 * Using the analysis date + filename prevents
 * the same analysis from being added repeatedly
 * when the result page is refreshed.
 */

const historyId =
    result.date +
    "_" +
    result.fileName;


/*
 * Check whether this analysis is already saved.
 */

const alreadyExists =
    analysisHistory.some(
        function (record) {
            return record.id === historyId;
        }
    );


/*
 * Save only if it is a new analysis.
 */

if (!alreadyExists) {

    const historyRecord = {

        id: historyId,

        fileName:
            result.fileName,

        date:
            result.date,

        assessment:
            result.assessment,

        features:
            features

    };

    analysisHistory.unshift(
        historyRecord
    );


    localStorage.setItem(
        historyKey,
        JSON.stringify(
            analysisHistory
        )
    );

}


/* =========================================================
   RESULT INFORMATION
   ========================================================= */

document.getElementById(
    "assessmentText"
).textContent =
    result.assessment;





/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */

/*
 * Converts a value into a percentage only for
 * visual representation.
 *
 * This is NOT a medical percentage.
 */

function visualPercentage(
    value,
    min,
    max
) {

    if (
        value === undefined ||
        value === null ||
        isNaN(value)
    ) {

        return 0;

    }

    let percentage =
        (
            (value - min) /
            (max - min)
        ) * 100;

    percentage =
        Math.max(
            0,
            Math.min(
                100,
                percentage
            )
        );

    return percentage;
}

/* =========================================================
   GET FEATURE VALUES
   ========================================================= */

const jitter =
    Number(
        features.jitter_local
    );


const shimmer =
    Number(
        features.shimmer_local
    );


const meanPitch =
    Number(
        features.mean_pitch
    );


const voiceBreaks =
    Number(
        features.number_of_voice_breaks
    );


const unvoiced =
    Number(
        features.fraction_unvoiced
    );


/* =========================================================
   DISPLAY ACTUAL VALUES
   ========================================================= */

document.getElementById(
    "jitterValue"
).textContent =
    jitter.toFixed(6);


document.getElementById(
    "shimmerValue"
).textContent =
    shimmer.toFixed(6);


document.getElementById(
    "pitchValue"
).textContent =
    meanPitch.toFixed(2) +
    " Hz";


document.getElementById(
    "voiceBreakValue"
).textContent =
    voiceBreaks.toFixed(0);


let unvoicedPercentage = unvoiced;

if (unvoiced <= 1) {
    unvoicedPercentage = unvoiced * 100;
}

unvoicedPercentage =
    Math.max(
        0,
        Math.min(
            100,
            unvoicedPercentage
        )
    );

document.getElementById(
    "unvoicedValue"
).textContent =
    unvoicedPercentage.toFixed(2) +
    "%";

/* =========================================================
   VISUAL BARS
========================================================= */

/*
 * These percentages are ONLY for visual display.
 * They do NOT represent disease risk or probability.
 */


// Jitter: 0 - 0.02
const jitterWidth =
    visualPercentage(
        jitter,
        0,
        0.02
    );


// Shimmer: 0 - 0.20
const shimmerWidth =
    visualPercentage(
        shimmer,
        0,
        0.20
    );


// Mean Pitch: 75 - 300 Hz
const pitchWidth =
    visualPercentage(
        meanPitch,
        75,
        300
    );


// Voice Breaks: 0 - 50
const voiceBreakWidth =
    visualPercentage(
        voiceBreaks,
        0,
        50
    );


// Unvoiced Frames: 0 - 100%
const unvoicedWidth =
    unvoiced <= 1
        ? unvoiced * 100
        : unvoiced;


// Apply widths to progress bars

document.getElementById(
    "jitterBar"
).style.width =
    jitterWidth + "%";


document.getElementById(
    "shimmerBar"
).style.width =
    shimmerWidth + "%";


document.getElementById(
    "pitchBar"
).style.width =
    pitchWidth + "%";


document.getElementById(
    "voiceBreakBar"
).style.width =
    voiceBreakWidth + "%";


document.getElementById(
    "unvoicedBar"
).style.width =
    Math.max(
        0,
        Math.min(
            100,
            unvoicedWidth
        )
    ) + "%";

/* =========================================================
   COLORFUL LINE GRAPH
========================================================= */

/*
 * These values are normalized ONLY for visual comparison.
 * They are NOT medical percentages or risk scores.
 */

const chartValues = [
    jitterWidth,
    shimmerWidth,
    pitchWidth,
    voiceBreakWidth,
    unvoicedWidth
];

const parameterColors = [
    "#3B82F6",  // Jitter - Blue
    "#F59E0B",  // Shimmer - Orange
    "#22C55E",  // Mean Pitch - Green
    "#8B5CF6",  // Voice Breaks - Purple
    "#EC4899"   // Unvoiced Frames - Pink
];

const chartCanvas =
    document.getElementById(
        "voiceChart"
    );


if (
    typeof Chart !== "undefined" &&
    chartCanvas
) {

    new Chart(
        chartCanvas,
        {

            type: "line",

            data: {

                labels: [
                    "Jitter",
                    "Shimmer",
                    "Mean Pitch",
                    "Voice Breaks",
                    "Unvoiced Frames"
                ],

                datasets: [

                    {
                        label:
                            "Voice Parameter Profile",

                        data:
                            chartValues,

                        borderWidth:
                            3,

                        pointRadius:
                            6,

                        pointHoverRadius:
                            8,

                        pointBackgroundColor:
                            parameterColors,

                        pointBorderColor:
                            "#ffffff",

                        pointBorderWidth:
                            2,

                        borderColor:
                            "#3B82F6",

                        tension:
                            0.4,

                        fill:
                            false,

                        segment: {

                            borderColor:
                                function(context) {

                                    return parameterColors[
                                        context.p0DataIndex
                                    ];

                                }

                        }

                    }

                ]

            },

            options: {

                responsive:
                    true,

                maintainAspectRatio:
                    false,

                interaction: {

                    intersect:
                        false,

                    mode:
                        "index"

                },

                scales: {

                    y: {

                        beginAtZero:
                            true,

                        max:
                            100,

                        title: {

                            display:
                                true,

                            text:
                                "Relative Value"

                        },

                        grid: {

                            color:
                                "rgba(0, 0, 0, 0.08)"

                        }

                    },

                    x: {

                        grid: {

                            display:
                                false

                        }

                    }

                },

                plugins: {

                    legend: {

                        display:
                            true,

                        position:
                            "top",

                        labels: {

                            usePointStyle:
                                true,

                            padding:
                                14

                        }

                    },

                    tooltip: {

                        callbacks: {

                            label:
                                function(context) {

                                    return (
                                        context.label +
                                        ": " +
                                        context.parsed.y.toFixed(1)
                                    );

                                }

                        }

                    }

                }

            }

        }
    );

}

/* =========================================================
   ANALYZE ANOTHER SAMPLE
   ========================================================= */

const newAnalysisBtn =
    document.getElementById("newAnalysisBtn");

if (newAnalysisBtn) {

    newAnalysisBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                featuresKey
            );

            localStorage.removeItem(
                resultKey
            );

            window.location.href =
                "analysis.html";

        }
    );

}


/* =========================================================
   DOWNLOAD PDF — PLACEHOLDER
   ========================================================= */

/*
 * We will implement the actual PDF
 * generation after the graphical analysis
 * is tested successfully.
 */

/* =========================================================
   DOWNLOAD PDF REPORT
========================================================= */

const downloadPdfBtn =
    document.getElementById("downloadTopPdfBtn");

if (downloadPdfBtn) {

    downloadPdfBtn.addEventListener(
        "click",
        function () {

            if (
                typeof window.jspdf === "undefined"
            ) {

                alert(
                    "PDF library could not be loaded."
                );

                return;
            }


            const {
                jsPDF
            } = window.jspdf;


            const pdf =
                new jsPDF();


            /* =================================================
               HEADER
            ================================================= */

            pdf.setFontSize(20);

            pdf.setTextColor(
                30,
                64,
                175
            );

            pdf.text(
                "Parkinson's Voice Insight",
                20,
                25
            );


            pdf.setFontSize(14);

            pdf.setTextColor(
                40,
                40,
                40
            );

            pdf.text(
                "Voice Analysis Report",
                20,
                35
            );


            /* =================================================
               ANALYSIS INFORMATION
            ================================================= */

            pdf.setFontSize(11);

            pdf.setTextColor(
                40,
                40,
                40
            );

            pdf.text(
                "Voice Sample:",
                20,
                52
            );

            pdf.text(
                result.fileName || "Recorded Voice",
                65,
                52
            );


            pdf.text(
                "Analysis Date:",
                20,
                62
            );

            pdf.text(
                result.date || "N/A",
                65,
                62
            );


            pdf.text(
                "Assessment:",
                20,
                72
            );

            pdf.text(
                result.assessment || "Analysis completed",
                65,
                72
            );


            /* =================================================
               VOICE PARAMETERS
            ================================================= */

            pdf.setFontSize(14);

            pdf.setTextColor(
                30,
                64,
                175
            );

            pdf.text(
                "Key Voice Parameters",
                20,
                92
            );


            pdf.setFontSize(11);

            pdf.setTextColor(
                40,
                40,
                40
            );


            let y =
                108;


            pdf.text(
                "Jitter (Local): " +
                jitter.toFixed(6),
                25,
                y
            );


            y += 10;


            pdf.text(
                "Shimmer (Local): " +
                shimmer.toFixed(6),
                25,
                y
            );


            y += 10;


            pdf.text(
                "Mean Pitch: " +
                meanPitch.toFixed(2) +
                " Hz",
                25,
                y
            );


            y += 10;


            pdf.text(
                "Voice Breaks: " +
                voiceBreaks.toFixed(0),
                25,
                y
            );


            y += 10;


            pdf.text(
                "Unvoiced Frames: " +
                unvoicedPercentage.toFixed(2) +
                "%",
                25,
                y
            );


            /* =================================================
               INFORMATION
            ================================================= */

            y += 25;


            pdf.setFontSize(12);

            pdf.setTextColor(
                30,
                64,
                175
            );

            pdf.text(
                "Important",
                20,
                y
            );


            y += 10;


            pdf.setFontSize(9);

            pdf.setTextColor(
                90,
                90,
                90
            );

            pdf.text(
                "These values represent characteristics",
                20,
                y
            );

            pdf.text(
                "extracted from the submitted voice sample.",
                20,
                y + 6
            );

            pdf.text(
                "They are used as part of the overall analysis.",
                20,
                y + 12
            );


            /* =================================================
               DISCLAIMER
            ================================================= */

            y += 30;


            pdf.setFontSize(9);

            pdf.setTextColor(
                100,
                100,
                100
            );

            pdf.text(
                "This assessment is intended for screening",
                20,
                y
            );

            pdf.text(
                "and research purposes only. It is not a",
                20,
                y + 6
            );

            pdf.text(
                "medical diagnosis.",
                20,
                y + 12
            );


            /* =================================================
               SAVE
            ================================================= */

            pdf.save(
                "Parkinsons_Voice_Analysis_Report.pdf"
            );

        }
    );

}

/* =========================================================
   TECHNICAL FEATURES BUTTON
========================================================= */

const technicalFeaturesButton =
    document.getElementById(
        "technicalFeaturesBtn"
    );

if (technicalFeaturesButton) {

    technicalFeaturesButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "technical-features.html";

        }
    );

}