// ===== Navigation: dark background after scrolling =====
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ===== Mobile menu =====
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  })
);

// ===== Service tabs =====
const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) =>
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.toggle("is-active", t === tab);
      t.setAttribute("aria-selected", t === tab);
    });
    document.querySelectorAll(".price-list").forEach((panel) =>
      panel.classList.toggle("is-active", panel.dataset.panel === tab.dataset.tab)
    );
  })
);

// ===== Fade-in when sections scroll into view =====
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ===== Highlight today's opening hours =====
const today = new Date().getDay();
document.querySelector(`#hours li[data-day="${today}"]`)?.classList.add("is-today");

// ===== Booking form =====
// No past dates in the date picker
const dateInput = document.querySelector('input[name="date"]');
dateInput.min = new Date().toISOString().split("T")[0];

const form = document.getElementById("bookingForm");
const ok = document.getElementById("formOk");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  button.textContent = "Sending…";
  try {
    // On Netlify this saves the request; on your own computer it just shows the message
    await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString(),
    });
  } catch (err) {
    // Ignore errors in the local preview
  }
  form.reset();
  ok.hidden = false;
  button.disabled = false;
  button.textContent = "Request appointment";
});

// ===== Hide the sticky "Book now" button when the form is visible =====
const sticky = document.querySelector(".sticky-book");
new IntersectionObserver(([entry]) => sticky.classList.toggle("is-hidden", entry.isIntersecting), {
  threshold: 0.1,
}).observe(document.getElementById("book"));

// ===== Current year in footer =====
document.getElementById("year").textContent = new Date().getFullYear();
