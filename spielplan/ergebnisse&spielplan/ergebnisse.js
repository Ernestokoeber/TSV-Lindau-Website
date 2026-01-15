// spielplan.js
// Alle Spiele, an denen TSV Lindau beteiligt ist (Herren, 2025/26)

const games = [
    {
        date: "2025-10-18",
        time: "18:00",
        home: "DJK Kaufbeuren 2",
        away: "TSV Lindau",
        score: "71 : 45"
    },
    {
        date: "2025-11-08",
        time: "15:30",
        home: "TSV Sonthofen 2",
        away: "TSV Lindau",
        score: "58 : 62"
    },
    {
        date: "2025-11-15",
        time: "17:00",
        home: "TSV Lindau",
        away: "TV Isny",
        score: "66 : 59"
    },
    {
        date: "2025-11-23",
        time: "17:00",
        home: "TSV Lindau",
        away: "VFL Buchloe 2",
        score: ""              // noch nicht gespielt
    },
    {
        date: "2025-11-30",
        time: "15:30",
        home: "TSV Ottobeuren 2",
        away: "TSV Lindau",
        score: ""
    },
    {
        date: "2025-12-07",
        time: "17:00",
        home: "TSV Lindau",
        away: "BG Illertal 3",
        score: ""
    },
    {
        date: "2026-01-11",
        time: "17:00",
        home: "TSV Lindau",
        away: "DJK Kaufbeuren 2",
        score: ""
    },
    {
        date: "2026-01-25",
        time: "17:00",
        home: "TSV Lindau",
        away: "TSV Sonthofen 2",
        score: ""
    },
    {
        date: "2026-02-01",
        time: "17:00",
        home: "TV Isny",
        away: "TSV Lindau",
        score: ""
    },
    {
        date: "2026-02-08",
        time: "14:30",
        home: "VFL Buchloe 2",
        away: "TSV Lindau",
        score: ""
    },
    {
        date: "2026-02-22",
        time: "17:00",
        home: "TSV Lindau",
        away: "TSV Ottobeuren 2",
        score: ""
    },
    {
        date: "2026-03-21",
        time: "16:30",
        home: "BG Illertal 3",
        away: "TSV Lindau",
        score: ""
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.getElementById("schedule-body");
    const teamFilterInput = document.getElementById("teamFilter");
    const futureOnlyCheckbox = document.getElementById("futureOnly");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    function formatDateGerman(isoDateStr) {
        const d = new Date(isoDateStr);
        if (isNaN(d)) return isoDateStr;
        return d.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }

    function renderSchedule() {
        const filterText = (teamFilterInput.value || "").trim().toLowerCase();
        const futureOnly = futureOnlyCheckbox.checked;

        const sortedGames = [...games].sort((a, b) => {
            const aDateTime = new Date(`${a.date}T${a.time || "00:00"}`);
            const bDateTime = new Date(`${b.date}T${b.time || "00:00"}`);
            return aDateTime - bDateTime;
        });

        // nächstes Spiel (erstes Datum >= heute)
        let nextGameIndex = -1;
        for (let i = 0; i < sortedGames.length; i++) {
            const gameDate = new Date(`${sortedGames[i].date}T${sortedGames[i].time || "00:00"}`);
            if (gameDate >= today) {
                nextGameIndex = i;
                break;
            }
        }

        tbody.innerHTML = "";

        sortedGames.forEach((game, index) => {
            const gameDate = new Date(`${game.date}T${game.time || "00:00"}`);
            const isPast = gameDate < today;

            const matchesFilter =
                !filterText ||
                game.home.toLowerCase().includes(filterText) ||
                game.away.toLowerCase().includes(filterText);

            if (futureOnly && isPast) return;
            if (!matchesFilter) return;

            const tr = document.createElement("tr");
            tr.classList.add("schedule-row");
            if (isPast) tr.classList.add("past");
            if (index === nextGameIndex) tr.classList.add("next-game");

            tr.innerHTML = `
                <td>${formatDateGerman(game.date)}</td>
                <td>${game.time || "-"}</td>
                <td>${game.home}</td>
                <td>${game.away}</td>
                <td>${game.score || ""}</td>
            `;

            tbody.appendChild(tr);
        });

        if (!tbody.hasChildNodes()) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5">Keine Spiele gefunden.</td>
                </tr>
            `;
        }
    }

    teamFilterInput.addEventListener("input", renderSchedule);
    futureOnlyCheckbox.addEventListener("change", renderSchedule);

    renderSchedule();

    const yearSpan = document.getElementById("currentYear");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
