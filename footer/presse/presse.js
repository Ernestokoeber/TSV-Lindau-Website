// Smooth Scrolling für interne Navigation
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
        const targetId = link.getAttribute('href');
        if (targetId.length > 1) {
            event.preventDefault();
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                window.scrollTo({
                    top: targetEl.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// "Mehr anzeigen" / "Weniger anzeigen" für Pressemitteilungen
document.querySelectorAll('.press-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.press-item');
        if (!item) return;

        const more = item.querySelector('.press-more');
        if (!more) return;

        const visible = more.style.display === 'block';

        more.style.display = visible ? 'none' : 'block';
        btn.textContent = visible ? 'Mehr anzeigen' : 'Weniger anzeigen';
    });
});

// Suche / Filter für Pressemitteilungen
const searchInput = document.getElementById('press-search');
const pressItems = Array.from(document.querySelectorAll('.press-item'));
const pressCount = document.getElementById('press-count');

function updatePressCount(visibleCount, totalCount) {
    if (!pressCount) return;
    if (visibleCount === totalCount) {
        pressCount.textContent = `${totalCount} Pressemitteilung${totalCount === 1 ? '' : 'en'}`;
    } else {
        pressCount.textContent =
            `${visibleCount} von ${totalCount} Pressemitteilung${totalCount === 1 ? '' : 'en'}`;
    }
}

// Initiale Anzeige
updatePressCount(pressItems.length, pressItems.length);

if (searchInput) {
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        pressItems.forEach(item => {
            const title = (item.dataset.title || '').toLowerCase();
            const tags = (item.dataset.tags || '').toLowerCase();
            const text = item.innerText.toLowerCase();

            const match =
                !query ||
                title.includes(query) ||
                tags.includes(query) ||
                text.includes(query);

            item.style.display = match ? '' : 'none';
            if (match) visibleCount++;
        });

        updatePressCount(visibleCount, pressItems.length);
    });
}
