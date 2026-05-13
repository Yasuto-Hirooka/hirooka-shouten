document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealEls = document.querySelectorAll(".reveal");
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -36px 0px" });
revealEls.forEach((el) => revealObs.observe(el));

const header = document.querySelector("#siteHeader");
const backToTop = document.querySelector("#backToTop");
window.addEventListener("scroll", () => {
  const scrolled = window.scrollY > 16;
  header?.classList.toggle("scrolled", scrolled);
  backToTop?.classList.toggle("visible", window.scrollY > 400);
}, { passive: true });
backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const menuToggle = document.querySelector("#menuToggle");
const mobileNav = document.querySelector("#mobileNav");
menuToggle?.addEventListener("click", () => {
  const open = !mobileNav.classList.contains("open");
  mobileNav.classList.toggle("open", open);
  menuToggle.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
});
mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuToggle?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "メニューを開く");
  });
});

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a[data-nav]");
const navObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { threshold: 0.35 });
sections.forEach((section) => navObs.observe(section));

const recipeForm = document.querySelector("#recipeForm");
recipeForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const endpoint = recipeForm.dataset.endpoint?.trim();
  if (!endpoint) {
    alert("現在は投稿フォームの画面設計段階です。公開前にGAS受付URLを設定して、Googleスプレッドシートへ保存できるよう接続します。");
    return;
  }

  const submitButton = recipeForm.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  const payload = new URLSearchParams(new FormData(recipeForm));

  fetch(endpoint, {
    method: "POST",
    body: payload,
    mode: "no-cors",
  })
    .then(() => {
      alert("投稿を受け付けました。内容を確認後、公開可のものだけ掲載します。");
      recipeForm.reset();
    })
    .catch(() => {
      alert("送信に失敗しました。時間をおいてもう一度お試しください。");
    })
    .finally(() => {
      if (submitButton) submitButton.disabled = false;
    });
});

const imageLightbox = document.querySelector("#imageLightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxCaption = document.querySelector("#lightboxCaption");
const imageLightboxClose = document.querySelector("#imageLightboxClose");

function closeImageLightbox() {
  if (!imageLightbox || !lightboxImage) return;
  imageLightbox.classList.remove("open");
  imageLightbox.setAttribute("aria-hidden", "true");
  lightboxImage.removeAttribute("src");
}

document.querySelectorAll("[data-lightbox-image]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!imageLightbox || !lightboxImage) return;
    event.preventDefault();
    const image = link.querySelector("img");
    lightboxImage.src = link.getAttribute("href") || "";
    lightboxImage.alt = image?.getAttribute("alt") || "";
    if (lightboxCaption) lightboxCaption.textContent = link.dataset.caption || "";
    imageLightbox.classList.add("open");
    imageLightbox.setAttribute("aria-hidden", "false");
  });
});

imageLightboxClose?.addEventListener("click", closeImageLightbox);
imageLightbox?.addEventListener("click", (event) => {
  if (event.target === imageLightbox) closeImageLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeImageLightbox();
});
