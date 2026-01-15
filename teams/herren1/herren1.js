// =======================
// Mobile Navigation
// =======================

const navToggle = document.getElementById("navToggle");
const mainNav   = document.getElementById("mainNav");

if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
        const list = mainNav.querySelector("ul");
        if (list) {
            list.classList.toggle("show");
        }
    });
}

// =======================
//  KADER-FILTER & SORTIERUNG
// =======================

const positionFilter = document.getElementById("positionFilter");
const rosterTable    = document.getElementById("rosterTable");

// Sortier-Status: column = "position" | "number" | "year" | "player"
let currentSort = { column: "position", direction: "asc" };

if (rosterTable) {
    const tbody = rosterTable.querySelector("tbody");
    const rows  = Array.from(tbody.querySelectorAll("tr"));

    // Original-Reihenfolge für stabile Sortierung speichern
    rows.forEach((row, index) => {
        row.dataset.originalIndex = String(index);
    });

    // ========= Hilfsfunktionen =========

    const positionRank = {
        "PG": 1,
        "SG": 2,
        "SF": 3,
        "PF": 4,
        "C":  5
    };

    function getPrimaryPosition(row) {
        // Spalte 2 = Position
        const text = row.children[2].textContent.trim();
        const primary = text.split("/")[0].trim();
        return primary;
    }

    function getPositionSortValue(row) {
        const primary = getPrimaryPosition(row);
        return positionRank[primary] || 99;
    }

    function parseNumberCell(text) {
        const trimmed = text.trim();
        const num = parseInt(trimmed, 10);
        if (Number.isNaN(num)) {
            return null; // "?" oder leer
        }
        return num;
    }

    function getNumberValue(row) {
        // Spalte 0 = #
        const text = row.children[0].textContent;
        return parseNumberCell(text);
    }

    function getYearValue(row) {
        // Spalte 3 = Jahrgang
        const text = row.children[3].textContent;
        return parseNumberCell(text);
    }

    // Spieler-Nachname extrahieren (Spalte 1)
    function getPlayerLastName(row) {
        const full  = row.children[1].textContent.trim();
        const parts = full.split(/\s+/);
        const last  = parts[parts.length - 1] || "";
        return last.toLowerCase();
    }

    function compareRows(a, b) {
        // 1) Sortiermodus "position" (Standard)
        if (currentSort.column === "position") {
            const posA = getPositionSortValue(a);
            const posB = getPositionSortValue(b);

            if (posA !== posB) {
                return posA - posB;
            }
            // gleiche Position -> ursprüngliche Reihenfolge
            return Number(a.dataset.originalIndex) - Number(b.dataset.originalIndex);
        }

        // 2) Sortiermodus "number"
        if (currentSort.column === "number") {
            const numA = getNumberValue(a);
            const numB = getNumberValue(b);

            const unknownA = numA === null ? 1 : 0;
            const unknownB = numB === null ? 1 : 0;

            // Fragezeichen immer nach unten
            if (unknownA !== unknownB) {
                return unknownA - unknownB; // 0 vor 1
            }

            if (numA === null && numB === null) {
                // beide ?, fallback Position
                return getPositionSortValue(a) - getPositionSortValue(b);
            }

            if (currentSort.direction === "asc") {
                return numA - numB;
            } else {
                return numB - numA;
            }
        }

        // 3) Sortiermodus "year"
        if (currentSort.column === "year") {
            const yearA = getYearValue(a);
            const yearB = getYearValue(b);

            const unknownA = yearA === null ? 1 : 0;
            const unknownB = yearB === null ? 1 : 0;

            // unbekannte Jahrgänge nach unten
            if (unknownA !== unknownB) {
                return unknownA - unknownB;
            }

            if (yearA === null && yearB === null) {
                // beide unbekannt -> nach Position
                return getPositionSortValue(a) - getPositionSortValue(b);
            }

            if (currentSort.direction === "asc") {
                // ältester (kleinste Zahl) zuerst
                return yearA - yearB;
            } else {
                // jüngster (größte Zahl) zuerst
                return yearB - yearA;
            }
        }

        // 4) Sortiermodus "player" (Nachname)
        if (currentSort.column === "player") {
            const lastA = getPlayerLastName(a);
            const lastB = getPlayerLastName(b);

            if (lastA === lastB) {
                // gleicher Nachname: fallback Position
                return getPositionSortValue(a) - getPositionSortValue(b);
            }

            if (currentSort.direction === "asc") {
                return lastA.localeCompare(lastB, "de");
            } else {
                return lastB.localeCompare(lastA, "de");
            }
        }

        return 0;
    }

    function applySort() {
        const currentRows = Array.from(tbody.querySelectorAll("tr"));
        currentRows.sort(compareRows);
        currentRows.forEach(row => tbody.appendChild(row));
    }

    function applyPositionFilter() {
        if (!positionFilter) return;

        const value   = positionFilter.value;
        const allRows = tbody.querySelectorAll("tr");

        allRows.forEach(row => {
            const pos = row.getAttribute("data-position");
            if (value === "all" || value === pos) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    // =======================
    // Sort-Header-Indikatoren
    // =======================

    const thNumber = rosterTable.querySelector("thead th.sortable-number");
    const thYear   = rosterTable.querySelector("thead th.sortable-year");
    const thPlayer = rosterTable.querySelector("thead th.sortable-player");

    const headerMap = {
        number: thNumber,
        year:   thYear,
        player: thPlayer
    };

    function updateSortHeaderClasses() {
        // alle Sort-Header zurücksetzen
        Object.values(headerMap).forEach(th => {
            if (!th) return;
            th.classList.remove("is-sorted-asc", "is-sorted-desc");
        });

        // bei Sortierung nach Position keine Icons anzeigen
        if (currentSort.column === "position") return;

        const activeTh = headerMap[currentSort.column];
        if (!activeTh) return;

        if (currentSort.direction === "asc") {
            activeTh.classList.add("is-sorted-asc");
        } else if (currentSort.direction === "desc") {
            activeTh.classList.add("is-sorted-desc");
        }
    }

    // ========= Event-Handler =========

    // Positions-Filter (Dropdown)
    if (positionFilter) {
        positionFilter.addEventListener("change", () => {
            applyPositionFilter();
        });
    }

    // Klick auf Spaltenköpfe – Nummer
    if (thNumber) {
        thNumber.style.cursor = "pointer";
        thNumber.addEventListener("click", () => {
            if (currentSort.column !== "number") {
                currentSort = { column: "number", direction: "asc" }; // 1. Klick: aufsteigend
            } else if (currentSort.direction === "asc") {
                currentSort.direction = "desc"; // 2. Klick: absteigend
            } else {
                currentSort = { column: "position", direction: "asc" }; // 3. Klick: zurück zu Position
            }

            applySort();
            applyPositionFilter();
            updateSortHeaderClasses();
        });
    }

    // Klick auf Spaltenköpfe – Jahrgang
    if (thYear) {
        thYear.style.cursor = "pointer";
        thYear.addEventListener("click", () => {
            if (currentSort.column !== "year") {
                currentSort = { column: "year", direction: "asc" }; // 1. Klick: ältester -> jüngster
            } else if (currentSort.direction === "asc") {
                currentSort.direction = "desc"; // 2. Klick: jüngster -> ältester
            } else {
                currentSort = { column: "position", direction: "asc" }; // 3. Klick: zurück zu Position
            }

            applySort();
            applyPositionFilter();
            updateSortHeaderClasses();
        });
    }

    // Klick auf Spaltenköpfe – Spieler (Nachname)
    if (thPlayer) {
        thPlayer.style.cursor = "pointer";
        thPlayer.addEventListener("click", () => {
            if (currentSort.column !== "player") {
                currentSort = { column: "player", direction: "asc" }; // 1. Klick: A-Z
            } else if (currentSort.direction === "asc") {
                currentSort.direction = "desc"; // 2. Klick: Z-A
            } else {
                currentSort = { column: "position", direction: "asc" }; // 3. Klick: zurück zur Position
            }

            applySort();
            applyPositionFilter();
            updateSortHeaderClasses();
        });
    }

    // Initial: nach Position sortieren & Filter anwenden (keine Icons)
    currentSort = { column: "position", direction: "asc" };
    applySort();
    applyPositionFilter();
    updateSortHeaderClasses();
}
