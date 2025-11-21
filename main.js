function animateCounter(el) {
  const target = parseFloat(el.getAttribute("data-target"));
  const duration = 2000;
  const increment = target / (duration / 16);
  const isDecimal = target % 1 !== 0;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;

    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    if (isDecimal) {
      el.textContent = current.toFixed(1);
    } else {
      el.textContent = Math.floor(current).toLocaleString("id-ID");
    }
  }, 16);
}

function animateAllCounters() {
  const counters = document.querySelectorAll(".stat-number");
  counters.forEach((counter, index) => {
    setTimeout(() => {
      animateCounter(counter);
    }, index * 200);
  });
}

// Animasi otomatis saat halaman dimuat
window.addEventListener("load", () => {
  setTimeout(animateAllCounters, 500);
});

// Animasi saat scroll (Intersection Observer)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target.querySelector(".stat-number");
        if (counter && counter.textContent === "0") {
          animateCounter(counter);
        }
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".stat-card").forEach((card) => {
  observer.observe(card);
});
