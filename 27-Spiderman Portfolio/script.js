const menuBtn = document.querySelector("#menuBtn");
const navLinksBox = document.querySelector("#navLinks");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section");

menuBtn.addEventListener("click", () => {
  navLinksBox.classList.toggle("show");
});

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinksBox.classList.remove("show");
  });
});

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const top = section.offsetTop - 140;

    if (window.scrollY >= top) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

function updateSkillBars() {
  const rows = document.querySelectorAll(".skill-row");

  rows.forEach(row => {
    let level = row.dataset.level;

    if (!level) {
      const text = row.querySelector("strong")?.textContent || "0";
      level = text.replace("%", "").trim();
    }

    level = Number(level);

    if (Number.isNaN(level)) level = 0;
    if (level < 0) level = 0;
    if (level > 100) level = 100;

    const fill = row.querySelector(".meter span");
    const percent = row.querySelector("strong");

    if (fill) fill.style.width = level + "%";
    if (percent) percent.textContent = level + "%";
  });
}

updateSkillBars();

// If you change data-level dynamically through JS, this keeps bars synced.
const observer = new MutationObserver(updateSkillBars);
document.querySelectorAll(".skill-row").forEach(row => {
  observer.observe(row, {
    attributes: true,
    attributeFilter: ["data-level"],
    childList: true,
    subtree: true
  });
});
