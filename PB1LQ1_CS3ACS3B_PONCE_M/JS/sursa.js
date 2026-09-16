document.addEventListener("DOMContentLoaded", function () {

    // Get the Submit button
    const btnSubmit = document.getElementById("btnSubmit");

    // Get output containers
    const output1024 = document.getElementById("output1024");
    const output3072 = document.getElementById("output3072");

    // Run the RSA process when the button is clicked
    btnSubmit.addEventListener("click", function () {

        // Get values from the enrollment form
        const fullname = document.getElementById("fullname").value;
        const dob = document.getElementById("dob").value;
        const year = document.getElementById("year").value;
        const gender = document.getElementById("gender").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Check if required fields are completed
        if (
            fullname === "" ||
            dob === "" ||
            year === "" ||
            username === "" ||
            password === ""
        ) {
            alert("Please complete all required fields.");
            return;
        }

        // Store the enrollment data as one string
        const rawData =
            "Full Name: " + fullname +
            " | Date of Birth: " + dob +
            " | Year Level: " + year +
            " | Gender: " + gender +
            " | Username: " + username +
            " | Password: " + password;

        // Display a processing message
        output1024.innerHTML = "<p>Generating 1024-bit RSA keys...</p>";
        output3072.innerHTML = "<p>Generating 3072-bit RSA keys...</p>";

        // Process 1024-bit RSA
        setTimeout(function () {
            processRSA(1024, rawData, output1024);
        }, 100);

        // Process 3072-bit RSA
        setTimeout(function () {
            processRSA(3072, rawData, output3072);
        }, 200);
    });


    /* =====================================================
       FUNCTION: processRSA
       Generates keys, encrypts data, and decrypts data
       ===================================================== */

    function processRSA(bits, data, outputElement) {

        try {

            // Create JSEncrypt object
            const crypt = new JSEncrypt({
                default_key_size: bits
            });

            // Generate RSA public and private keys
            crypt.getKey();

            // Get the generated keys
            const publicKey = crypt.getPublicKey();
            const privateKey = crypt.getPrivateKey();

            // Set the public key for encryption
            crypt.setPublicKey(publicKey);

            // Encrypt the enrollment data
            const encryptedData = crypt.encrypt(data);

            // Check if encryption was successful
            if (!encryptedData) {
                throw new Error(
                    "Encryption failed. The data may be too large for this RSA key size."
                );
            }

            // Set the private key for decryption
            crypt.setPrivateKey(privateKey);

            // Decrypt the encrypted data
            const decryptedData = crypt.decrypt(encryptedData);

            // Check if decryption was successful
            if (!decryptedData) {
                throw new Error("Decryption failed.");
            }

            // Display the results
            outputElement.innerHTML = `
                <div class="card">
                    <div class="result-head">
                        <h3>${bits}-bit RSA</h3>
                        <span class="key-tag">${bits} BIT</span>
                    </div>

                    <div class="output">

                        <h3>Original Data</h3>
                        <textarea readonly>${escapeHTML(data)}</textarea>

                        <h3>Public Key</h3>
                        <textarea readonly>${escapeHTML(publicKey)}</textarea>

                        <h3>Private Key</h3>
                        <textarea readonly>${escapeHTML(privateKey)}</textarea>

                        <h3>Encrypted Data</h3>
                        <textarea readonly>${escapeHTML(encryptedData)}</textarea>

                        <h3>Decrypted Data</h3>
                        <textarea readonly>${escapeHTML(decryptedData)}</textarea>

                    </div>
                </div>
            `;

        } catch (error) {

            // Display an error message
            outputElement.innerHTML = `
                <div class="card">
                    <h3>${bits}-bit RSA</h3>
                    <p style="color: red;">
                        Error: ${escapeHTML(error.message)}
                    </p>
                </div>
            `;

            console.error(bits + "-bit RSA Error:", error);
        }
    }


    /* =====================================================
       FUNCTION: escapeHTML
       Prevents special characters from breaking the HTML
       ===================================================== */

    function escapeHTML(text) {

        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

});