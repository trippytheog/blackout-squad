"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const header = document.querySelector("#site-header");
    const menuToggle = document.querySelector("#menu-toggle");
    const navigation = document.querySelector("#primary-navigation");
    const navLinks = document.querySelectorAll(".nav-link");
    const contactForm = document.querySelector("#contact-form");
    const messageField = document.querySelector("#message");
    const characterCount = document.querySelector("#character-count");
    const formStatus = document.querySelector("#form-status");
    const currentYear = document.querySelector("#current-year");
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    const updateHeader = () => {
        if (!header) return;
        header.classList.toggle("scrolled", window.scrollY > 20);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    if (menuToggle && navigation) {
        const openMenu = () => {
            navigation.classList.add("is-open");
            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "Close navigation menu");
            body.classList.add("menu-open");
        };
        const closeMenu = ({ returnFocus = false } = {}) => {
            navigation.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
            body.classList.remove("menu-open");

            if (returnFocus) {
                menuToggle.focus();
            }
        };
        menuToggle.addEventListener("click", () => {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                closeMenu();
            });
        });
        const ctaLink = navigation.querySelector(".nav-cta");
        if (ctaLink) {
            ctaLink.addEventListener("click", () => {
                closeMenu();
            });
        }
        document.addEventListener("click", (event) => {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";
            if (
                isOpen &&
                !navigation.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });
        document.addEventListener("keydown", (event) => {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";
            if (event.key === "Escape" && isOpen) {
                closeMenu({ returnFocus: true });
            }
        });
        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                closeMenu();
            }
        });
    }

    const sections = document.querySelectorAll(
        "main section[id]"
    );
    if ("IntersectionObserver" in window && sections.length > 0) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                const visibleSections = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            b.intersectionRatio - a.intersectionRatio
                    );
                if (visibleSections.length === 0) return;
                const activeId = visibleSections[0].target.id;
                navLinks.forEach((link) => {
                    const isActive =
                        link.getAttribute("href") === `#${activeId}`;
                    link.classList.toggle("active", isActive);
                    if (isActive) {
                        link.setAttribute("aria-current", "location");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            },
            {
                root: null,
                rootMargin: "-25% 0px -55% 0px",
                threshold: [0, 0.1, 0.25, 0.5]
            }
        );
        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }

    const revealElements = document.querySelectorAll(".reveal");
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    if (
        !reducedMotion &&
        "IntersectionObserver" in window &&
        revealElements.length > 0
    ) { 
        body.classList.add("js-enabled");
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );
        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    }
    const updateCharacterCount = () => {
        if (!messageField || !characterCount) return;
        const currentLength = messageField.value.length;
        const maximumLength = messageField.maxLength;
        characterCount.textContent =
            `${currentLength} / ${maximumLength}`;
    };
    if (messageField && characterCount) {
        messageField.addEventListener(
            "input",
            updateCharacterCount
        );
        updateCharacterCount();
    }
    if (contactForm && formStatus) {
        contactForm.addEventListener("submit", (event) => {
            const endpoint = contactForm.getAttribute("action")?.trim();
            if (!endpoint || endpoint === "#") {
                event.preventDefault();
                formStatus.textContent =
                    "The contact form is not connected yet. Please configure a form service before sending messages.";
                return;
            }
            formStatus.textContent = "Submitting your message...";
        });
    }
    const images = document.querySelectorAll("img");
    images.forEach((image) => {
        const markUnavailable = () => {
            image.classList.add("image-unavailable");
        };
        image.addEventListener("error", markUnavailable);
        if (image.complete && image.naturalWidth === 0) {
            markUnavailable();
        }
    });
});
