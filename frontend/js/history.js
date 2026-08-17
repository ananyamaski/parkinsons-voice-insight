/* =========================================================
   ANALYSIS HISTORY
========================================================= */

/* =========================================================
   USER-SPECIFIC ANALYSIS HISTORY
========================================================= */

const currentUserEmail =
    localStorage.getItem("user_email");


/* =========================================================
   LOGIN CHECK
========================================================= */

if (!currentUserEmail) {

    alert(
        "Please login to view your analysis history."
    );

    window.location.href =
        "login.html";

}


/* =========================================================
   HISTORY KEY
========================================================= */

const historyKey =
    "voiceAnalysisHistory_" +
    currentUserEmail;


const historyGrid =
    document.getElementById(
        "historyGrid"
    );


const emptyHistory =
    document.getElementById(
        "emptyHistory"
    );


let historyData =
    JSON.parse(
        localStorage.getItem(historyKey)
    ) || [];





/* =========================================================
   DISPLAY HISTORY
========================================================= */

function displayHistory(records) {

    historyGrid.innerHTML = "";

    if (records.length === 0) {

        emptyHistory.style.display = "block";

        return;

    }

    emptyHistory.style.display = "none";


    records.forEach(function (record, index) {

        const card =
            document.createElement("article");

        card.className =
            "history-card";

       /* =========================================================
   RANDOM PROFESSIONAL PASTEL COLOR
========================================================= */

const pastelColors = [

    {
        bg: "#F5FAFF",
        border: "#CFE3FF",
        accent: "#3B82F6",
        accentDark: "#1D4ED8",
        badge: "#E0EEFF"
    },

    {
        bg: "#F5FCF7",
        border: "#CDEED6",
        accent: "#22A65A",
        accentDark: "#15803D",
        badge: "#DDF5E5"
    },

    {
        bg: "#FFFAF3",
        border: "#F8DFC0",
        accent: "#F59E0B",
        accentDark: "#B45309",
        badge: "#FFF0D7"
    },

    {
        bg: "#FFF7FA",
        border: "#F6D5E1",
        accent: "#EC4899",
        accentDark: "#BE185D",
        badge: "#FCE4ED"
    },

    {
        bg: "#F8F6FF",
        border: "#DDD5F5",
        accent: "#8B5CF6",
        accentDark: "#6D28D9",
        badge: "#EDE9FE"
    }

];

const randomColor =
    pastelColors[
        Math.floor(
            Math.random() *
            pastelColors.length
        )
    ];


card.style.setProperty(
    "--history-bg",
    randomColor.bg
);

card.style.setProperty(
    "--history-border",
    randomColor.border
);

card.style.setProperty(
    "--history-accent",
    randomColor.accent
);

card.style.setProperty(
    "--history-accent-dark",
    randomColor.accentDark
);

card.style.setProperty(
    "--history-badge-bg",
    randomColor.badge
);


        /* ---------------------------------------------
           DATE
        --------------------------------------------- */

        const date =
            document.createElement("div");

        date.className =
            "history-card-date";

        date.textContent =
            record.date || "Analysis date";


        /* ---------------------------------------------
           SAMPLE NAME
        --------------------------------------------- */

        const sample =
            document.createElement("h3");

        sample.className =
            "history-card-title";

        sample.textContent =
            record.fileName || "Recorded Voice";


        /* ---------------------------------------------
           RESULT
        --------------------------------------------- */

        const result =
            document.createElement("div");

        result.className =
            "history-card-result";

        result.textContent =
            record.assessment || "Analysis completed";


        /* ---------------------------------------------
           GRAPH
        --------------------------------------------- */

        const graph =
            document.createElement("div");

        graph.className =
            "history-mini-graph";

        graph.innerHTML = `
            <svg
                viewBox="0 0 120 75"
                preserveAspectRatio="none"
            >
                <polyline
                    points="5,55 25,45 45,52 65,25 85,38 115,18"
                    fill="none"
                    stroke="${randomColor.accent}"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        `;


        /* ---------------------------------------------
           BUTTONS
        --------------------------------------------- */

        const actions =
            document.createElement("div");

        actions.className =
            "history-card-actions";


        const viewButton =
            document.createElement("button");

        viewButton.className =
            "history-view-button";

        viewButton.textContent =
            "View Details";


        viewButton.addEventListener(
            "click",
            function () {

                localStorage.setItem(
                    "selectedHistoryId",
                    record.id
                );

                localStorage.setItem(
                    "voiceAnalysisFeatures",
                    JSON.stringify(record.features)
                );

                localStorage.setItem(
                    "voiceAnalysisResult",
                    JSON.stringify({
                        fileName: record.fileName,
                        date: record.date,
                        assessment: record.assessment
                    })
                );
                window.location.href =
                    "voice-details.html";

            }
        );


        const downloadButton =
            document.createElement("button");

        downloadButton.className =
            "history-download-button";

        downloadButton.textContent =
            "Download PDF";


       downloadButton.addEventListener(
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
           PDF HEADER
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
            30,
            30,
            30
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

        pdf.text(
            "Sample:",
            20,
            50
        );

        pdf.text(
            record.fileName || "Recorded Voice",
            60,
            50
        );


        pdf.text(
            "Date:",
            20,
            60
        );

        pdf.text(
            record.date || "N/A",
            60,
            60
        );


        pdf.text(
            "Assessment:",
            20,
            70
        );

        pdf.text(
            record.assessment || "Analysis completed",
            60,
            70
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
            "Voice Parameters",
            20,
            90
        );


        pdf.setFontSize(11);

        pdf.setTextColor(
            30,
            30,
            30
        );


        const features =
            record.features || {};


        let y = 105;


        pdf.text(
            "Jitter (Local): " +
            Number(
                features.jitter_local || 0
            ).toFixed(6),
            25,
            y
        );


        y += 10;


        pdf.text(
            "Shimmer (Local): " +
            Number(
                features.shimmer_local || 0
            ).toFixed(6),
            25,
            y
        );


        y += 10;


        pdf.text(
            "Mean Pitch: " +
            Number(
                features.mean_pitch || 0
            ).toFixed(2) +
            " Hz",
            25,
            y
        );


        y += 10;


        pdf.text(
            "Number of Voice Breaks: " +
            Number(
                features.number_of_voice_breaks || 0
            ).toFixed(0),
            25,
            y
        );


        y += 10;


        let unvoiced =
            Number(
                features.fraction_unvoiced || 0
            );


        if (unvoiced <= 1) {

            unvoiced =
                unvoiced * 100;

        }


        pdf.text(
            "Fraction Unvoiced: " +
            unvoiced.toFixed(2) +
            "%",
            25,
            y
        );


        /* =================================================
           DISCLAIMER
        ================================================= */

        y += 25;


        pdf.setFontSize(9);

        pdf.setTextColor(
            100,
            100,
            100
        );


        pdf.text(
            "This report is generated from the voice analysis",
            20,
            y
        );

        pdf.text(
            "data and is intended for informational purposes only.",
            20,
            y + 6
        );


        /* =================================================
           SAVE PDF
        ================================================= */

        pdf.save(
            "Parkinsons_Voice_Analysis_Report.pdf"
        );

    }
);


        actions.appendChild(
            viewButton
        );

        actions.appendChild(
            downloadButton
        );


        /* ---------------------------------------------
           BUILD CARD
        --------------------------------------------- */

        card.appendChild(
            date
        );

        card.appendChild(
            sample
        );

        card.appendChild(
            result
        );

        card.appendChild(
            graph
        );

        card.appendChild(
            actions
        );


        historyGrid.appendChild(
            card
        );

    });

}


/* =========================================================
   FILTER
========================================================= */

const historyFilter =
    document.getElementById(
        "historyFilter"
    );


if (historyFilter) {

    historyFilter.addEventListener(
        "change",
        function () {

            const selected =
                historyFilter.value;


            if (selected === "all") {

                displayHistory(
                    historyData
                );

                return;

            }


            const filtered =
                historyData.filter(
                    function (record) {

                        const assessment =
                            (
                                record.assessment ||
                                ""
                            ).toLowerCase();


                        if (
                            selected === "lower"
                        ) {

                            return (
                                assessment.includes(
                                    "lower"
                                ) ||
                                assessment.includes(
                                    "low"
                                )
                            );

                        }


                        if (
                            selected === "higher"
                        ) {

                            return (
                                assessment.includes(
                                    "higher"
                                ) ||
                                assessment.includes(
                                    "high"
                                )
                            );

                        }


                        return true;

                    }
                );


            displayHistory(
                filtered
            );

        }
    );

}


/* =========================================================
   INITIAL DISPLAY
========================================================= */

displayHistory(
    historyData
);