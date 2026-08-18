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

const featuresKey =
    "voiceAnalysisFeatures_" +
    currentUserEmail;


const resultKey =
    "voiceAnalysisResult_" +
    currentUserEmail;



const audioFile = document.getElementById("audioFile");

const startRecordBtn =
    document.getElementById("startRecordBtn");

const stopRecordBtn =
    document.getElementById("stopRecordBtn");

const recordingStatus =
    document.getElementById("recordingStatus");

const recordingTimer =
    document.getElementById("recordingTimer");

const audioPreviewSection =
    document.getElementById("audioPreviewSection");

const audioPreview =
    document.getElementById("audioPreview");

const selectedFileName =
    document.getElementById("selectedFileName");

const removeFileBtn =
    document.getElementById("removeFileBtn");

const analyzeBtn =
    document.getElementById("analyzeBtn");

const analysisProcessing =
    document.getElementById("analysisProcessing");

const analysisResult =
    document.getElementById("analysisResult");

const resultAssessment =
    document.getElementById("resultAssessment");

const resultDescription =
    document.getElementById("resultDescription");

const resultFileName =
    document.getElementById("resultFileName");

const resultDate =
    document.getElementById("resultDate");

const newAnalysisBtn =
    document.getElementById("newAnalysisBtn");


let mediaRecorder = null;
let audioChunks = [];
let recordedAudioBlob = null;
let timerInterval = null;
let recordingSeconds = 0;


/* =========================================================
   REAL-TIME VOICE VISUALIZER
========================================================= */

let audioContext = null;
let analyser = null;
let microphoneSource = null;
let animationFrame = null;

const waveformBars =
    document.querySelectorAll(".waveform span");


/* =========================================================
   START VOICE VISUALIZER
========================================================= */

function startVoiceVisualizer(stream) {

    try {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

        analyser =
            audioContext.createAnalyser();

        analyser.fftSize = 256;

        analyser.smoothingTimeConstant = 0.75;

        microphoneSource =
            audioContext.createMediaStreamSource(stream);

        microphoneSource.connect(analyser);


        const dataArray =
            new Uint8Array(
                analyser.frequencyBinCount
            );


        function updateWaveform() {

            if (!analyser) {
                return;
            }


            analyser.getByteFrequencyData(
                dataArray
            );


            waveformBars.forEach(
                function (bar, index) {

                    const dataIndex =
                        Math.floor(
                            index *
                            dataArray.length /
                            waveformBars.length
                        );


                    const value =
                        dataArray[dataIndex];


                    /*
                     * Convert microphone volume
                     * into a bar height.
                     */

                    const height =
                        Math.max(
                            5,
                            (value / 255) * 70
                        );


                    bar.style.height =
                        height + "px";

                }
            );


            animationFrame =
                requestAnimationFrame(
                    updateWaveform
                );
        }


        updateWaveform();

    } catch (error) {

        console.error(
            "Voice visualizer error:",
            error
        );

    }
}


/* =========================================================
   STOP VOICE VISUALIZER
========================================================= */

function stopVoiceVisualizer() {

    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;
    }


    if (microphoneSource) {

        microphoneSource.disconnect();

        microphoneSource = null;
    }


    if (audioContext) {

        audioContext.close();

        audioContext = null;
    }


    analyser = null;


    /*
     * Return waveform to a calm state.
     */

    waveformBars.forEach(
        function (bar) {

            bar.style.height =
                "8px";

        }
    );
}


/* =========================================================
   FILE UPLOAD
   ========================================================= */

audioFile.addEventListener("change", function () {

    const file = audioFile.files[0];

    if (!file) {
        return;
    }

    recordedAudioBlob = file;

    showAudioPreview(
        file,
        file.name
    );
});


/* =========================================================
   START RECORDING
   ========================================================= */

startRecordBtn.addEventListener(
    "click",
    async function () {

        try {

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    audio: true
                });

            startVoiceVisualizer(stream);

            audioChunks = [];

            mediaRecorder =
                new MediaRecorder(stream);

            mediaRecorder.addEventListener(
                "dataavailable",
                function (event) {

                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }

                }
            );


            mediaRecorder.addEventListener(
                "stop",
                async function () {

                    try {

                        /*
                         * Browser recording is normally WebM.
                         * We convert it to WAV before sending
                         * it to the backend.
                         */

                        const webmBlob =
                            new Blob(
                                audioChunks,
                                {
                                    type: "audio/webm"
                                }
                            );


                        recordedAudioBlob =
                            await convertToWav(
                                webmBlob
                            );


                        const audioURL =
                            URL.createObjectURL(
                                recordedAudioBlob
                            );


                        audioPreview.src =
                            audioURL;


                        selectedFileName.textContent =
                            "Recorded voice sample (WAV)";


                        audioPreviewSection.style.display =
                            "block";


                        analyzeBtn.disabled =
                            false;


                    } catch (error) {

                        console.error(
                            "Audio conversion error:",
                            error
                        );

                        alert(
                            "Unable to process the recorded audio. Please try recording again."
                        );

                    }

                    stopVoiceVisualizer();

                    stream.getTracks().forEach(
                        track => track.stop()
                    );

                }
            );


            mediaRecorder.start();


            startRecordBtn.disabled =
                true;

            stopRecordBtn.disabled =
                false;


            recordingStatus.style.display =
                "flex";


            recordingSeconds = 0;

            recordingTimer.textContent =
                "00:00";


            timerInterval =
                setInterval(
                    updateTimer,
                    1000
                );


        } catch (error) {

            console.error(
                "Microphone error:",
                error
            );

            alert(
                "Unable to access your microphone. Please allow microphone permission and try again."
            );

        }

    }
);


/* =========================================================
   STOP RECORDING
   ========================================================= */

stopRecordBtn.addEventListener(
    "click",
    function () {

        if (
            mediaRecorder &&
            mediaRecorder.state !== "inactive"
        ) {

            mediaRecorder.stop();

        }


        startRecordBtn.disabled =
            false;

        stopRecordBtn.disabled =
            true;


        recordingStatus.style.display =
            "none";


        clearInterval(
            timerInterval
        );

    }
);


/* =========================================================
   RECORDING TIMER
   ========================================================= */

function updateTimer() {

    recordingSeconds++;


    const minutes =
        Math.floor(
            recordingSeconds / 60
        );


    const seconds =
        recordingSeconds % 60;


    recordingTimer.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");

}


/* =========================================================
   AUDIO PREVIEW
   ========================================================= */

function showAudioPreview(
    file,
    fileName
) {

    const audioURL =
        URL.createObjectURL(file);


    audioPreview.src =
        audioURL;


    selectedFileName.textContent =
        fileName;


    audioPreviewSection.style.display =
        "block";


    analyzeBtn.disabled =
        false;

}


/* =========================================================
   CONVERT WEBM → WAV
   ========================================================= */

async function convertToWav(
    webmBlob
) {

    const arrayBuffer =
        await webmBlob.arrayBuffer();


    const audioContext =
        new AudioContext();


    const audioBuffer =
        await audioContext.decodeAudioData(
            arrayBuffer
        );


    const numberOfChannels =
        audioBuffer.numberOfChannels;


    const sampleRate =
        audioBuffer.sampleRate;


    const length =
        audioBuffer.length;


    /*
     * Convert stereo/multi-channel audio
     * into a single mono channel.
     */

    const monoData =
        new Float32Array(length);


    for (
        let channel = 0;
        channel < numberOfChannels;
        channel++
    ) {

        const channelData =
            audioBuffer.getChannelData(
                channel
            );


        for (
            let i = 0;
            i < length;
            i++
        ) {

            monoData[i] +=
                channelData[i] /
                numberOfChannels;

        }

    }


    const wavBuffer =
        encodeWav(
            monoData,
            sampleRate
        );


    await audioContext.close();


    return new Blob(
        [wavBuffer],
        {
            type: "audio/wav"
        }
    );

}


/* =========================================================
   ENCODE WAV
   ========================================================= */

function encodeWav(
    samples,
    sampleRate
) {

    const buffer =
        new ArrayBuffer(
            44 + samples.length * 2
        );


    const view =
        new DataView(buffer);


    writeString(
        view,
        0,
        "RIFF"
    );


    view.setUint32(
        4,
        36 + samples.length * 2,
        true
    );


    writeString(
        view,
        8,
        "WAVE"
    );


    writeString(
        view,
        12,
        "fmt "
    );


    view.setUint32(
        16,
        16,
        true
    );


    view.setUint16(
        20,
        1,
        true
    );


    view.setUint16(
        22,
        1,
        true
    );


    view.setUint32(
        24,
        sampleRate,
        true
    );


    view.setUint32(
        28,
        sampleRate * 2,
        true
    );


    view.setUint16(
        32,
        2,
        true
    );


    view.setUint16(
        34,
        16,
        true
    );


    writeString(
        view,
        36,
        "data"
    );


    view.setUint32(
        40,
        samples.length * 2,
        true
    );


    let offset = 44;


    for (
        let i = 0;
        i < samples.length;
        i++
    ) {

        let sample =
            Math.max(
                -1,
                Math.min(
                    1,
                    samples[i]
                )
            );


        sample =
            sample < 0
                ? sample * 0x8000
                : sample * 0x7FFF;


        view.setInt16(
            offset,
            sample,
            true
        );


        offset += 2;

    }


    return buffer;

}


/* =========================================================
   WRITE STRING
   ========================================================= */

function writeString(
    view,
    offset,
    string
) {

    for (
        let i = 0;
        i < string.length;
        i++
    ) {

        view.setUint8(
            offset + i,
            string.charCodeAt(i)
        );

    }

}


/* =========================================================
   ANALYZE VOICE
   ========================================================= */

analyzeBtn.addEventListener(
    "click",
    async function () {

        if (!recordedAudioBlob) {

            alert(
                "Please record or select an audio file first."
            );

            return;

        }

        analyzeBtn.disabled = true;

        analysisProcessing.style.display = "block";

        analysisProcessing.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        analyzeBtn.disabled =
            true;


        const originalText =
            analyzeBtn.textContent;


        analyzeBtn.textContent =
            "Analyzing Voice...";


        try {

            const formData =
                new FormData();


            /*
             * Send the audio file to FastAPI.
             */

            formData.append(
                "audio",
                recordedAudioBlob,
                "voice_sample.wav"
            );


           const response =
                await fetch(
                    "https://parkinsons-voice-insight-api.onrender.com/analyze",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            const result =
                await response.json();
            /* =====================================================
            SAVE ANALYSIS DATA FOR CURRENT USER
            ===================================================== */

            if (result.features) {

                localStorage.setItem(
                    featuresKey,
                    JSON.stringify(
                        result.features
                    )
                );

            }


            localStorage.setItem(
                resultKey,
                JSON.stringify({

                    prediction:
                        result.prediction,

                    confidence:
                        result.confidence,

                    assessment:
                        result.assessment,

                    fileName:
                        selectedFileName.textContent,

                    date:
                        new Date().toLocaleString()

                })
            );
            if (!response.ok) {

                throw new Error(
                    result.detail ||
                    "Voice analysis failed."
                );

            }


            console.log(
                "Analysis result:",
                result
            );


            /*
             * Temporarily show the result.
             * We'll replace this with a proper
             * professional result section next.
             */
/* =====================================================
   DISPLAY ANALYSIS RESULT
===================================================== */

resultAssessment.textContent =
    result.assessment;

resultFileName.textContent =
    selectedFileName.textContent;

resultDate.textContent =
    new Date().toLocaleString();

if (result.prediction === 1) {

    resultDescription.textContent =
        "The analyzed voice sample shows vocal characteristics associated with a higher risk indicator. Further clinical evaluation may be appropriate.";

} else {

    resultDescription.textContent =
        "The analyzed voice sample shows vocal characteristics associated with a lower risk indicator. This result is intended for screening purposes only.";

}




/* =====================================================
   SHOW RESULT
===================================================== */

analysisResult.style.display =
    "block";

analyzeBtn.style.display = "none";

analysisResult.scrollIntoView({
    behavior: "smooth",
    block: "start"
});

resultDate.textContent =
    new Date().toLocaleString();

if (
    result.prediction === 1
) {

    resultDescription.textContent =
        "The analyzed voice sample shows vocal characteristics associated with a higher risk indicator. Further clinical evaluation may be appropriate.";

} else {

    resultDescription.textContent =
        "The analyzed voice sample shows vocal characteristics associated with a lower risk indicator. This result is intended for screening purposes only.";

}

analysisResult.style.display =
    "block";

analysisResult.scrollIntoView({
    behavior: "smooth",
    block: "start"
});


        } catch (error) {

            console.error(
                "Analysis error:",
                error
            );


            alert(
                "Unable to analyze the voice.\n\n" +
                error.message
            );


        } finally {

    analyzeBtn.disabled =
        false;

    analyzeBtn.textContent =
        originalText;

    analysisProcessing.style.display =
        "none";

}

    }
);


/* =========================================================
   REMOVE AUDIO
   ========================================================= */

removeFileBtn.addEventListener(
    "click",
    function () {

        audioFile.value =
            "";

        recordedAudioBlob =
            null;

        audioPreview.src =
            "";

        selectedFileName.textContent =
            "";

        audioPreviewSection.style.display =
            "none";

        analyzeBtn.disabled =
            true;

    }
);

/* =====================================================
   ANALYZE ANOTHER SAMPLE
===================================================== */

newAnalysisBtn.addEventListener(
    "click",
    function () {

        analyzeBtn.style.display = "block";

        audioFile.value = "";

        recordedAudioBlob = null;

        audioPreview.src = "";

        selectedFileName.textContent = "";

        audioPreviewSection.style.display =
            "none";

        analysisResult.style.display =
            "none";

        analyzeBtn.disabled =
            true;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);

/* =====================================================
   VIEW VOICE PARAMETERS
===================================================== */

const viewParametersBtn =
    document.getElementById("viewParametersBtn");

if (viewParametersBtn) {

    viewParametersBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "voice-details.html";

        }
    );

}