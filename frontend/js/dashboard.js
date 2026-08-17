/* =========================================================
   DASHBOARD AUTHENTICATION
========================================================= */

const accessToken =
    localStorage.getItem("access_token");

if (!accessToken) {

    window.location.href =
        "login.html";

}


const userName =
    localStorage.getItem("user_name");


const welcomeUser =
    document.getElementById(
        "welcomeUser"
    );


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


/* =========================================================
   WELCOME USER
========================================================= */

if (userName) {

    welcomeUser.textContent =
        userName;

} else {

    welcomeUser.textContent =
        "";

}

/* =========================================================
   LOGOUT
========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "user_name"
            );

            localStorage.removeItem(
                "user_email"
            );

            window.location.href =
                "login.html";

        }
    );

}


/* =========================================================
   START ANALYSIS
========================================================= */

const startAnalysisBtn =
    document.getElementById(
        "startAnalysisBtn"
    );


if (startAnalysisBtn) {

    startAnalysisBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "analysis.html";

        }
    );

}


/* =========================================================
   VIEW HISTORY
========================================================= */

const viewHistoryBtn =
    document.getElementById(
        "viewHistoryBtn"
    );


if (viewHistoryBtn) {

    viewHistoryBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "history.html";

        }
    );

}


/* =========================================================
   VIEW REPORTS
========================================================= */

const viewReportsBtn =
    document.getElementById(
        "viewReportsBtn"
    );


if (viewReportsBtn) {

    viewReportsBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "history.html";

        }
    );

}


/* =========================================================
   DASHBOARD STATISTICS
========================================================= */

/* =========================================================
   USER-SPECIFIC DASHBOARD HISTORY
========================================================= */

const currentUserEmail =
    localStorage.getItem("user_email");


const historyKey = 
    currentUserEmail
        ? "voiceAnalysisHistory_" +
          currentUserEmail
        : null;


let historyData = [];


if (historyKey) {

    try {

        historyData =
            JSON.parse(
                localStorage.getItem(
                    historyKey
                )
            ) || [];

    } catch (error) {

        console.error(
            "Unable to read analysis history:",
            error
        );

        historyData = [];

    }

}




/* =========================================================
   TOTAL ANALYSES
========================================================= */

const totalAnalyses =
    document.getElementById(
        "totalAnalyses"
    );


if (totalAnalyses) {

    totalAnalyses.textContent =
        historyData.length;

}


/* =========================================================
   LATEST ANALYSIS
========================================================= */

if (historyData.length > 0) {

    /*
       The history page stores newer analyses
       as they are created.
    */

    const latest =
        historyData[
            historyData.length - 1
        ];


    /* ---------------------------------------------
       LATEST RESULT
    --------------------------------------------- */

    const latestResult =
        document.getElementById(
            "latestResult"
        );


    if (latestResult) {

        let assessment =
            latest.assessment ||
            "Analysis Completed";


        /*
           Convert existing wording into
           a shorter dashboard label.
        */

        if (
            assessment
                .toLowerCase()
                .includes("lower")
        ) {

            latestResult.textContent =
                "Lower Risk";

        } else if (
            assessment
                .toLowerCase()
                .includes("higher")
        ) {

            latestResult.textContent =
                "Higher Risk";

        } else {

            latestResult.textContent =
                assessment;

        }

    }


    /* ---------------------------------------------
       LATEST DATE
    --------------------------------------------- */

    const latestDate =
        document.getElementById(
            "latestDate"
        );


    if (latestDate) {

        latestDate.textContent =
            latest.date || "—";

    }


    /* ---------------------------------------------
       LATEST SAMPLE
    --------------------------------------------- */

    const latestSample =
        document.getElementById(
            "latestSample"
        );


    if (latestSample) {

        latestSample.textContent =
            latest.fileName ||
            "Recorded Voice";

    }

}

else {

    const latestResult =
        document.getElementById("latestResult");

    const latestDate =
        document.getElementById("latestDate");

    const latestSample =
        document.getElementById("latestSample");


    if (latestResult) {
        latestResult.textContent = "Not analyzed yet";
    }

    if (latestDate) {
        latestDate.textContent = "Start your first analysis";
    }

    if (latestSample) {
        latestSample.textContent = "No recording yet";
    }

}