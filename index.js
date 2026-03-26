document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    const slider = document.getElementById('testimonial-slider');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const header = document.querySelector('.nav-container');
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-menu a");

    // 1. Theme Logic
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.className = `${savedTheme}-theme`;

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
            body.className = `${newTheme}-theme`;
            localStorage.setItem('theme', newTheme);
        });
    }

    // 2. Testimonial Slider
    if (slider && nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: slider.offsetWidth, behavior: 'smooth' });
        });
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -slider.offsetWidth, behavior: 'smooth' });
        });
    }

    // 3. Scroll Effects
    window.addEventListener('scroll', () => {
        // Header Shrink
        if (window.scrollY > 100) {
            header.style.maxWidth = "850px";
            header.style.padding = "0.5rem 1.2rem";
        } else {
            header.style.maxWidth = "1000px";
            header.style.padding = "0.7rem 1.5rem";
        }

        // ScrollSpy (Active Nav Links)
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    });

    // 4. WhatsApp Form
    const form = document.getElementById("whatsappForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value.trim();
            const biz = document.getElementById("business").value.trim();
            const msg = document.getElementById("message").value.trim();

            const phone = "2349124270924";
            const text = `*New Project Inquiry* 🚀\n\n*Name:* ${name}\n*Type:* ${biz || 'Not specified'}\n*Message:* ${msg}`;
            
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
            form.reset();
        });
    }
});