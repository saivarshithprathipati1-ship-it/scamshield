function getBackendUrl() {
    const customUrl = localStorage.getItem("scamBackendUrl");
    if (customUrl) {
        return customUrl;
    }
    // Detect Capacitor / Android native environment
    if (window.Capacitor || navigator.userAgent.includes("Android")) {
        return "http://10.0.2.2:8000/check";
    }
    return "http://127.0.0.1:8000/check";
}

async function checkScam() {

    console.log("Check button clicked!");

    const message = document.getElementById("message").value;
    const result = document.getElementById("result");

    // Check empty message
    if (message.trim() === "") {
        result.innerHTML = "Please enter a message.";
        return;
    }

    // Show loading message
    result.innerHTML = "🔍 Checking message...";

    try {

        const backendUrl = getBackendUrl();
        console.log("Connecting to backend:", backendUrl);

        const response = await fetch(
            backendUrl,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );

        // Check backend response
        if (!response.ok) {
            throw new Error(
                "Backend returned an error: " + response.status
            );
        }

        // Convert response to JSON
        const data = await response.json();
        saveToHistory(message, data);
        updateDashboard();
        console.log("Backend response:", data);

        // -----------------------------
        // Detected Words
        // -----------------------------

        let detectedWords = "None";

        if (
            data.detected_words &&
            data.detected_words.length > 0
        ) {
            detectedWords = data.detected_words.join(", ");
        }

        // -----------------------------
        // Determine status class
        // -----------------------------

        let statusClass = "safe";

        if (data.result === "Scam") {
            statusClass = "scam";
        }
        else if (data.result === "Suspicious") {
            statusClass = "suspicious";
        }

        // -----------------------------
        // Links
        // -----------------------------

        let linksHTML = "No links detected";

        if (
            data.links &&
            data.links.length > 0
        ) {
            linksHTML = data.links
                .map(link => `<div>${link}</div>`)
                .join("");
        }

        // -----------------------------
        // Reasons
        // -----------------------------

        let reasonsHTML = "No suspicious reasons detected.";

        if (
            data.reasons &&
            data.reasons.length > 0
        ) {
            reasonsHTML = data.reasons
                .map(reason =>
                    `<div class="reason">• ${reason}</div>`
                )
                .join("");
        }

        // -----------------------------
        // Display result
        // -----------------------------

        result.innerHTML = `

            <div class="result-card">

                <div class="result-title ${statusClass}">
                    🛡️ ${data.result}
                </div>

                <div class="risk-score">
                    Risk Score: ${data.risk_score}%
                </div>

                <div class="category">
                    <strong>Category:</strong>
                    ${data.category}
                </div>

                <div class="risk-bar">

                    <div
                        class="risk-fill ${statusClass}"
                        style="width: ${data.risk_score}%">
                    </div>

                </div>

                <div class="section">

                    <h3>🔍 Detected Words</h3>

                    <p>
                        ${detectedWords}
                    </p>

                </div>

                <div class="section">

                    <h3>🔗 Links Detected</h3>

                    <p>
                        ${linksHTML}
                    </p>

                </div>

                <div class="section">

                    <h3>⚠️ Why is this suspicious?</h3>

                    ${reasonsHTML}

                </div>

            </div>

        `;

    }
    catch (error) {

        console.error("Error:", error);

        result.innerHTML = `
            <div class="error">
                ❌ Unable to check the message.
                <br>
                Make sure the backend server is running.
            </div>
        `;
    }
}function saveToHistory(message, data) {

    let history = JSON.parse(
        localStorage.getItem("scamHistory")
    ) || [];


    const scan = {

        message: message,

        result: data.result,

        risk_score: data.risk_score,

        category: data.category,

        date: new Date().toLocaleString()

    };


    history.unshift(scan);


    // Keep only the latest 10 scans

    if (history.length > 10) {

        history = history.slice(0, 10);

    }


    localStorage.setItem(
        "scamHistory",
        JSON.stringify(history)
    );

}function displayHistory() {

    const historyContainer =
        document.getElementById("history");


    let history = JSON.parse(
        localStorage.getItem("scamHistory")
    ) || [];


    if (history.length === 0) {

        historyContainer.innerHTML =
            "<p>No scans yet.</p>";

        return;
    }


    historyContainer.innerHTML = history
        .map(scan => `

            <div class="history-card">

                <h3>
                    ${scan.result}
                </h3>

                <p>
                    <strong>Risk:</strong>
                    ${scan.risk_score}%
                </p>

                <p>
                    <strong>Category:</strong>
                    ${scan.category}
                </p>

                <p>
                    ${scan.message}
                </p>

                <small>
                    ${scan.date}
                </small>

            </div>

        `)
        .join("");

}function clearHistory() {

    localStorage.removeItem("scamHistory");

    displayHistory();
 
}
displayHistory();
function upadateDashboard() {

    let history = JSON.parse(
        localStorage.getItem("scamHistory")
    ) || [];


    const totalScans = history.length;


    const scamCount = history.filter(
        scan => scan.result === "Scam"
    ).length;


    const safeCount = history.filter(
        scan => scan.result === "Safe"
    ).length;


    let averageRisk = 0;

    if (totalScans > 0) {

        const totalRisk = history.reduce(
            (sum, scan) => sum + Number(scan.risk_score),
            0
        );

        averageRisk =
            Math.round(totalRisk / totalScans);
    }


    document.getElementById("totalScans").textContent =
        totalScans;

    document.getElementById("scamCount").textContent =
        scamCount;

    document.getElementById("safeCount").textContent =
        safeCount;

    document.getElementById("averageRisk").textContent =
        averageRisk + "%";
}
displayHistory();
updateDashboard();
function updateDashboard() {

    let history = JSON.parse(
        localStorage.getItem("scamHistory")
    ) || [];


    // Total number of scans
    const totalScans = history.length;


    // Count scams
    const scamCount = history.filter(
        scan => scan.result === "Scam"
    ).length;


    // Count safe messages
    const safeCount = history.filter(
        scan => scan.result === "Safe"
    ).length;


    // Calculate average risk
    let averageRisk = 0;

    if (totalScans > 0) {

        const totalRisk = history.reduce(
            (sum, scan) => sum + Number(scan.risk_score),
            0
        );

        averageRisk =
            Math.round(totalRisk / totalScans);
    }


    // Display values
    document.getElementById("totalScans").textContent =
        totalScans;

    document.getElementById("scamCount").textContent =
        scamCount;

    document.getElementById("safeCount").textContent =
        safeCount;

    document.getElementById("averageRisk").textContent =
        averageRisk + "%";
}
