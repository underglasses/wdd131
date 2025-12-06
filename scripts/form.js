document.addEventListener("DOMContentLoaded", () => {

    // ---------------------
    // PRODUCT ARRAY
    // ---------------------
    const products = [
        { id: 1, name: "EcoFlow Solar Generator" },
        { id: 2, name: "SmartHome Thermostat X2" },
        { id: 3, name: "AquaPure Water Filter" },
        { id: 4, name: "HomeGuard Security Camera" },
        { id: 5, name: "Lumina LED Light Strip" }
    ];

    // ---------------------
    // POPULATE PRODUCT SELECT on form.html
    // ---------------------
    const productSelect = document.getElementById("product");

    if (productSelect) {
        products.forEach(prod => {
            let option = document.createElement("option");
            option.value = prod.name;      // required: product NAME as value
            option.textContent = prod.name;
            productSelect.appendChild(option);
        });
    }

    // ---------------------
    // REVIEW.HTML PAGE HANDLING
    // ---------------------
    if (window.location.pathname.includes("review.html")) {

        const params = new URLSearchParams(window.location.search);

        document.getElementById("confirmProduct").textContent = params.get("product");
        document.getElementById("confirmRating").textContent = params.get("rating");
        document.getElementById("confirmDate").textContent = params.get("installDate");

        const features = params.getAll("features");
        document.getElementById("confirmFeatures").textContent =
            features.length ? features.join(", ") : "None";

        document.getElementById("confirmReview").textContent =
            params.get("reviewText") || "No written review";

        document.getElementById("confirmName").textContent =
            params.get("username") || "Anonymous";

        // REVIEW COUNTER
        let count = Number(localStorage.getItem("reviewCount") || 0);
        count++;
        localStorage.setItem("reviewCount", count);

        document.getElementById("reviewCount").textContent = count;
    }

    // ---------------------
    // FOOTER YEAR + LAST MODIFIED
    // ---------------------
    const yearEl = document.getElementById("year");
    const dateEl = document.getElementById("date");

    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    if (dateEl) {
        dateEl.textContent = document.lastModified;
    }

});
