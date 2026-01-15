document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".timeline-item");

    items.forEach((item, index) => {
        item.style.opacity = "0";
        item.style.transform = "translateY(20px)";
        setTimeout(() => {
            item.style.transition = "0.6s";
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
        }, index * 150);
    });
});
