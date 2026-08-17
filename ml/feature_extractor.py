import re
import parselmouth
from parselmouth.praat import call


# =========================================================
# FEATURE NAMES
# =========================================================

FEATURE_NAMES = [
    "jitter_local",
    "jitter_local_absolute",
    "jitter_rap",
    "jitter_ppq5",
    "jitter_ddp",

    "shimmer_local",
    "shimmer_local_db",
    "shimmer_apq3",
    "shimmer_apq5",
    "shimmer_apq11",
    "shimmer_dda",

    "ac",
    "nth",
    "htn",

    "median_pitch",
    "mean_pitch",
    "pitch_std",
    "minimum_pitch",
    "maximum_pitch",

    "number_of_pulses",
    "number_of_periods",
    "mean_period",
    "period_std",

    "fraction_unvoiced",
    "number_of_voice_breaks",
    "degree_of_voice_breaks"
]


# =========================================================
# HELPER
# =========================================================

def extract_number(pattern, report):
    """
    Find the first numeric value after a label.
    """

    match = re.search(
        pattern,
        report,
        re.IGNORECASE
    )

    if not match:
        raise ValueError(
            f"Could not extract feature using pattern: {pattern}"
        )

    return float(match.group(1))


# =========================================================
# MAIN FEATURE EXTRACTION
# =========================================================

def extract_features(audio_path):

    print(
        f"Analyzing audio: {audio_path}"
    )

    # -----------------------------------------------------
    # LOAD AUDIO
    # -----------------------------------------------------

    sound = parselmouth.Sound(
        audio_path
    )

    # -----------------------------------------------------
    # CREATE PITCH
    # -----------------------------------------------------

    pitch = call(
        sound,
        "To Pitch",
        0.0,
        75,
        600
    )

    # -----------------------------------------------------
    # CREATE POINT PROCESS
    # -----------------------------------------------------

    pulses = call(
        [sound, pitch],
        "To PointProcess (cc)"
    )

    # -----------------------------------------------------
    # PRAAT VOICE REPORT
    # -----------------------------------------------------

    report = call(
        [sound, pitch, pulses],
        "Voice report",
        0.0,
        0.0,
        75,
        600,
        1.3,
        1.6,
        0.03,
        0.45
    )

    # -----------------------------------------------------
    # JITTER
    # -----------------------------------------------------

    jitter_local = extract_number(
        r"Jitter \(local\):\s*([0-9.eE+-]+)",
        report
    )

    jitter_local_absolute = extract_number(
        r"Jitter \(local, absolute\):\s*([0-9.eE+-]+)",
        report
    )

    jitter_rap = extract_number(
        r"Jitter \(rap\):\s*([0-9.eE+-]+)",
        report
    )

    jitter_ppq5 = extract_number(
        r"Jitter \(ppq5\):\s*([0-9.eE+-]+)",
        report
    )

    jitter_ddp = extract_number(
        r"Jitter \(ddp\):\s*([0-9.eE+-]+)",
        report
    )

    # -----------------------------------------------------
    # SHIMMER
    # -----------------------------------------------------

    shimmer_local = extract_number(
        r"Shimmer \(local\):\s*([0-9.eE+-]+)",
        report
    )

    shimmer_local_db = extract_number(
        r"Shimmer \(local, dB\):\s*([0-9.eE+-]+)",
        report
    )

    shimmer_apq3 = extract_number(
        r"Shimmer \(apq3\):\s*([0-9.eE+-]+)",
        report
    )

    shimmer_apq5 = extract_number(
        r"Shimmer \(apq5\):\s*([0-9.eE+-]+)",
        report
    )

    shimmer_apq11 = extract_number(
        r"Shimmer \(apq11\):\s*([0-9.eE+-]+)",
        report
    )

    shimmer_dda = extract_number(
        r"Shimmer \(dda\):\s*([0-9.eE+-]+)",
        report
    )

    # -----------------------------------------------------
    # HARMONICITY
    # -----------------------------------------------------

    ac = extract_number(
        r"Mean autocorrelation:\s*([0-9.eE+-]+)",
        report
    )

    nth = extract_number(
        r"Mean noise-to-harmonics ratio:\s*([0-9.eE+-]+)",
        report
    )

    htn = extract_number(
        r"Mean harmonics-to-noise ratio:\s*([0-9.eE+-]+)",
        report
    )

    # -----------------------------------------------------
    # PITCH
    # -----------------------------------------------------

    median_pitch = extract_number(
        r"Median pitch:\s*([0-9.eE+-]+)",
        report
    )

    mean_pitch = extract_number(
        r"Mean pitch:\s*([0-9.eE+-]+)",
        report
    )

    pitch_std = extract_number(
        r"Standard deviation:\s*([0-9.eE+-]+)",
        report
    )

    minimum_pitch = extract_number(
        r"Minimum pitch:\s*([0-9.eE+-]+)",
        report
    )

    maximum_pitch = extract_number(
        r"Maximum pitch:\s*([0-9.eE+-]+)",
        report
    )

    # -----------------------------------------------------
    # PULSES
    # -----------------------------------------------------

    number_of_pulses = extract_number(
        r"Number of pulses:\s*([0-9.eE+-]+)",
        report
    )

    number_of_periods = extract_number(
        r"Number of periods:\s*([0-9.eE+-]+)",
        report
    )

    mean_period = extract_number(
        r"Mean period:\s*([0-9.eE+-]+)",
        report
    )

    period_std = extract_number(
        r"Standard deviation of period:\s*([0-9.eE+-]+)",
        report
    )

    # -----------------------------------------------------
    # VOICING
    # -----------------------------------------------------

    fraction_unvoiced = extract_number(
        r"Fraction of locally unvoiced frames:\s*([0-9.eE+-]+)",
        report
    )

    number_of_voice_breaks = extract_number(
        r"Number of voice breaks:\s*([0-9.eE+-]+)",
        report
    )

    degree_of_voice_breaks = extract_number(
        r"Degree of voice breaks:\s*([0-9.eE+-]+)",
        report
    )

    # -----------------------------------------------------
    # CREATE FEATURE LIST
    # -----------------------------------------------------

    features = [
        jitter_local,
        jitter_local_absolute,
        jitter_rap,
        jitter_ppq5,
        jitter_ddp,

        shimmer_local,
        shimmer_local_db,
        shimmer_apq3,
        shimmer_apq5,
        shimmer_apq11,
        shimmer_dda,

        ac,
        nth,
        htn,

        median_pitch,
        mean_pitch,
        pitch_std,
        minimum_pitch,
        maximum_pitch,

        number_of_pulses,
        number_of_periods,
        mean_period,
        period_std,

        fraction_unvoiced,
        number_of_voice_breaks,
        degree_of_voice_breaks
    ]

    # -----------------------------------------------------
    # VALIDATE
    # -----------------------------------------------------

    if len(features) != 26:
        raise ValueError(
            f"Expected 26 features, got {len(features)}"
        )

    return features


# =========================================================
# TEST FUNCTION
# =========================================================

if __name__ == "__main__":

    print(
        "Feature extractor loaded successfully."
    )

    print(
        f"Expected features: {len(FEATURE_NAMES)}"
    )

    for index, name in enumerate(
        FEATURE_NAMES,
        start=1
    ):
        print(
            f"{index:02d}. {name}"
        )