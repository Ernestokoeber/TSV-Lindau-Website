document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".team-card");
    const searchInput = document.getElementById("teamSearch");
    const footerYear = document.getElementById("footerYear");

    // Jahr im Footer
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // Filter per Button
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const filter = btn.getAttribute("data-filter");

            filterButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            applyFilter(filter, searchInput.value.trim().toLowerCase());
        });
    });

    // Filter per Suchfeld
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const activeButton = document.querySelector(".filter-btn.active");
            const activeFilter = activeButton
                ? activeButton.getAttribute("data-filter")
                : "all";

            applyFilter(activeFilter, searchInput.value.trim().toLowerCase());
        });
    }

    /**
     * Kombinierter Filter:
     * - Kategorie (Herren, Jugend, Ü40, Alle)
     * - Textsuche (z. B. "U16", "Ü40")
     * - Jahrgangssuche (z. B. "2013", "2015", "2013 oder jünger")
     */
    function applyFilter(category, query) {
        // Zahl (Jahrgang) aus der Eingabe extrahieren, z. B. "2013 oder jünger" -> 2013
        const searchYear = parseInt(query.replace(/\D/g, ""), 10);

        cards.forEach((card) => {
            const cardCategory = card.getAttribute("data-category");
            const tags = (card.getAttribute("data-tags") || "").toLowerCase();
            const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
            const league = card
                .querySelector(".team-league")
                ?.textContent.toLowerCase() || "";

            const combinedText = `${tags} ${title} ${league}`;

            let matchesCategory = (category === "all" || cardCategory === category);
            let matchesSearch = false;

            // Wenn ein Jahrgang eingegeben wurde (2013, 2014, 2015 usw.)
            if (!isNaN(searchYear)) {
                const yearFromAttr = card.getAttribute("data-year-from");
                const yearToAttr = card.getAttribute("data-year-to");

                const yearFrom = yearFromAttr ? parseInt(yearFromAttr, 10) : NaN;
                const yearTo = yearToAttr ? parseInt(yearToAttr, 10) : NaN;

                // Nur Karten mit Jahrgangsbereich reagieren auf Zahlensuche
                if (!isNaN(yearFrom) && !isNaN(yearTo)) {
                    // Beispiel U12: 2013–2018 → 2013, 2014, 2015, 2016, 2017, 2018 treffen
                    if (searchYear >= yearFrom && searchYear <= yearTo) {
                        matchesSearch = true;
                    } else {
                        matchesSearch = false;
                    }
                } else {
                    // Herren / Ü40 ohne Jahrgangsdaten werden bei reiner Jahrgangssuche ausgeblendet
                    matchesSearch = false;
                }
            } else {
                // Standard-Textsuche (wenn keine Zahl in der Suche)
                if (!query || combinedText.includes(query)) {
                    matchesSearch = true;
                } else {
                    matchesSearch = false;
                }
            }

            // Sichtbarkeit setzen
            if (matchesCategory && matchesSearch) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    }
});
