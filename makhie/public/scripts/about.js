// JavaScript for fade-in animations and scrolling to the bottom on load
document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    });

    document.querySelectorAll(".fade-in").forEach((section) => {
        observer.observe(section);
    });

    // Scroll to the bottom of the page after content loads
    window.scrollTo(0, document.body.scrollHeight);

    // Stop jiggle animation after 2 seconds
    setTimeout(() => {
        document.querySelector(".contribute-btn").style.animation = "slide-in 1s ease forwards";
    }, 2000);
});