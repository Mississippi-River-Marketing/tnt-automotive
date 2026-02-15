// v2: scroll animations + mobile nav + active section highlight + footer year

document.addEventListener("DOMContentLoaded", () => {
  // footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // mobile menu toggle
  const burger = document.querySelector(".nav__burger");
  const mobile = document.querySelector(".nav__mobile");

  function setMobile(open) {
    if (!burger || !mobile) return;
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    mobile.style.display = open ? "block" : "none";
    mobile.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (burger && mobile) {
    setMobile(false);

    burger.addEventListener("click", () => {
      const open = burger.getAttribute("aria-expanded") !== "true";
      setMobile(open);
    });

    // close menu on link click
    mobile.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => setMobile(false));
    });

    // close on ESC
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMobile(false);
    });
  }

  // scroll reveal animations
  const items = Array.from(document.querySelectorAll(".animate"));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    items.forEach(el => el.classList.add("in"));
  } else {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.getAttribute("data-delay") || "0", 10);
        el.style.transitionDelay = `${Math.min(Math.max(delay, 0), 300)}ms`;
        el.classList.add("in");
        obs.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

    items.forEach(el => obs.observe(el));
  }

  // optional: highlight active nav link
  const sections = ["services", "why", "area", "contact"]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const navLinks = Array.from(document.querySelectorAll(".nav__links a"));
  if (sections.length && navLinks.length) {
    const secObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(a => {
          const active = a.getAttribute("href") === `#${id}`;
          a.style.opacity = active ? "1" : ".85";
          a.style.textDecoration = active ? "underline" : "none";
        });
      });
    }, { threshold: 0.35 });

    sections.forEach(s => secObs.observe(s));
  }
});
