const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        console.log("Sending login request...");
        console.log("Email:", email);

        const response = await fetch(
            "https://parkinsons-voice-insight-api.onrender.com/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();

        console.log("Login status:", response.status);
        console.log("Backend response:", data);


        /* ==============================
           SUCCESS
        ============================== */

        if (response.ok && data.access_token) {

            localStorage.setItem(
                "access_token",
                data.access_token
            );

            localStorage.setItem(
                "user_name",
                data.name || ""
            );

            localStorage.setItem(
                "user_email",
                data.email || email
            );


            window.location.href =
                "dashboard.html";

            return;
        }


        /* ==============================
           LOGIN FAILED
        ============================== */

        alert(
            data.detail ||
            data.message ||
            "Invalid email or password."
        );


    } catch (error) {

        console.error(
            "Login connection error:",
            error
        );

        alert(
            "Unable to connect to the backend. Please try again."
        );

    }

});