const CONFIG = {
  // Troque pela data e hora exatas em que vocês começaram a namorar.
  startDate: "2025-06-29T00:00:00-03:00",
  photos: [
    ["assets/f1.png", ".hero__photo"],
    ["assets/f2.png", ".memory:nth-of-type(1) .memory__photo"],
    ["assets/f3.png", ".memory:nth-of-type(2) .memory__photo"],
    ["assets/f4.png", ".memory:nth-of-type(3) .memory__photo"]
  ]
};

const body = document.body;
const intro = document.querySelector("#intro");
const openButton = document.querySelector("#openButton");
const main = document.querySelector("#mainContent");
const nav = document.querySelector("#nav");
const soundButton = document.querySelector("#soundButton");
const envelope = document.querySelector("#envelope");
const letterHint = document.querySelector("#letterHint");

body.classList.add("is-locked");

openButton.addEventListener("click", () => {
  intro.classList.add("is-open");
  main.classList.add("is-visible");
  main.setAttribute("aria-hidden", "false");
  body.classList.remove("is-locked");
  createPetals(14);
});

window.addEventListener("scroll", () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 40);
  updateTimeline();
}, { passive: true });

document.addEventListener("pointermove", (event) => {
  const glow = document.querySelector(".cursor-glow");
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      return;
    }

    entry.target.classList.remove("is-visible");
    const leftThroughTop = entry.boundingClientRect.top < 0;
    entry.target.classList.toggle("is-above", leftThroughTop);
    entry.target.classList.toggle("is-below", !leftThroughTop);
  });
}, {
  threshold: 0,
  rootMargin: "-5% 0px -5% 0px"
});

document
  .querySelectorAll(".memory__photo, .reason-card, .letter__envelope, .love-button")
  .forEach((item) => item.classList.add("scroll-reveal"));

document
  .querySelectorAll(".reveal, .gallery-reveal, .scroll-reveal")
  .forEach((item) => observer.observe(item));

function updateCounter() {
  const elapsed = Math.max(0, Date.now() - new Date(CONFIG.startDate).getTime());
  const days = Math.floor(elapsed / 86400000);
  const hours = Math.floor((elapsed / 3600000) % 24);
  const minutes = Math.floor((elapsed / 60000) % 60);
  const seconds = Math.floor((elapsed / 1000) % 60);

  document.querySelector("#days").textContent = days;
  document.querySelector("#hours").textContent = String(hours).padStart(2, "0");
  document.querySelector("#minutes").textContent = String(minutes).padStart(2, "0");
  document.querySelector("#seconds").textContent = String(seconds).padStart(2, "0");
}
updateCounter();
setInterval(updateCounter, 1000);

soundButton.addEventListener("click", () => {
  document.querySelector("#nossa-musica").scrollIntoView({ behavior: "smooth" });
});

window.onSpotifyIframeApiReady = (IFrameAPI) => {
  const embedElement = document.querySelector("#spotify-embed");
  const vinyl = document.querySelector(".our-song__vinyl");
  if (!embedElement || !vinyl) return;

  const options = {
    width: "100%",
    height: 152,
    uri: "spotify:track:0M3KZMohe0XeBl4kRuL9to",
    theme: "dark"
  };

  IFrameAPI.createController(embedElement, options, (controller) => {
    controller.addListener("playback_update", (event) => {
      const state = event.data;
      const isPlaying = state && !state.isPaused && !state.isBuffering;
      vinyl.classList.toggle("is-playing", Boolean(isPlaying));
      soundButton.classList.toggle("is-playing", Boolean(isPlaying));
      soundButton.setAttribute("aria-label", isPlaying ? "Música tocando" : "Ir para nossa música");
    });
  });
};

function updateTimeline() {
  const timeline = document.querySelector(".timeline");
  const progress = document.querySelector("#timelineProgress");
  if (!timeline || !progress) return;
  const rect = timeline.getBoundingClientRect();
  const amount = Math.min(1, Math.max(0, (window.innerHeight * .62 - rect.top) / rect.height));
  progress.style.height = `${amount * 100}%`;
}

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (window.innerWidth < 850) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    const base = card.matches(".hero__photo") ? 2.5 : 0;
    card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) rotateZ(${base}deg)`;
  });
  card.addEventListener("pointerleave", () => { card.style.transform = ""; });
});

document.querySelectorAll(".reason-card").forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("is-loved");
    const rect = card.getBoundingClientRect();
    if (card.classList.contains("is-loved")) burstHearts(rect.left + rect.width * .86, rect.top + rect.height / 2, 6);
  });
});

document.querySelector("#sealButton").addEventListener("click", () => {
  envelope.classList.add("is-open");
  letterHint.textContent = "uma carta para o amor da minha vida";
  createPetals(22);
});

document.querySelector("#loveButton").addEventListener("click", (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
  createPetals(30);
  event.currentTarget.querySelector("span").textContent = "Para sempre nós";
});

function createPetals(amount) {
  const holder = document.querySelector("#petals");
  for (let index = 0; index < amount; index += 1) {
    const petal = document.createElement("i");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.setProperty("--drift", `${(Math.random() - .5) * 240}px`);
    petal.style.animationDuration = `${5 + Math.random() * 5}s`;
    petal.style.animationDelay = `${Math.random() * 2}s`;
    petal.style.transform = `rotate(${Math.random() * 180}deg)`;
    holder.appendChild(petal);
    setTimeout(() => petal.remove(), 12000);
  }
}

function burstHearts(x, y, amount) {
  for (let index = 0; index < amount; index += 1) {
    const heart = document.createElement("span");
    heart.className = "heart-burst";
    heart.textContent = Math.random() > .3 ? "♥" : "✦";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = `${10 + Math.random() * 18}px`;
    heart.style.setProperty("--x", `${(Math.random() - .5) * 360}px`);
    heart.style.setProperty("--y", `${-80 - Math.random() * 280}px`);
    heart.style.setProperty("--r", `${(Math.random() - .5) * 180}deg`);
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1800);
  }
}

function applyPhoto(path, selector) {
  const image = new Image();
  image.onload = () => {
    const element = document.querySelector(selector);
    if (!element) return;
    element.classList.add("has-photo");
    const displayedPhoto = document.createElement("img");
    displayedPhoto.className = "site-photo";
    displayedPhoto.src = path;
    displayedPhoto.alt = "";
    displayedPhoto.setAttribute("aria-hidden", "true");
    element.prepend(displayedPhoto);
    const placeholder = element.querySelector(".photo-placeholder__inner");
    if (placeholder) placeholder.style.display = "none";
  };
  image.src = path;
}
CONFIG.photos.forEach(([path, selector]) => applyPhoto(path, selector));

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxMessage = document.querySelector("#lightboxMessage");

document.querySelectorAll(".gallery-card").forEach((card) => {
  const path = card.dataset.photo;
  applyPhoto(path, `[data-photo="${path}"]`);
  card.addEventListener("click", () => {
    lightbox.classList.add("is-open");
    const image = new Image();
    image.onload = () => {
      lightboxImage.src = path;
      lightboxImage.style.display = "block";
      lightboxMessage.style.display = "none";
    };
    image.onerror = () => {
      lightboxImage.style.display = "none";
      lightboxMessage.style.display = "block";
    };
    image.src = path;
  });
});

const galleryGrid = document.querySelector(".gallery__grid");
const galleryCards = [...document.querySelectorAll(".gallery-card")];

galleryGrid.addEventListener("pointermove", (event) => {
  if (window.innerWidth < 850) return;
  const rect = galleryGrid.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - .5;
  const y = (event.clientY - rect.top) / rect.height - .5;
  galleryCards.forEach((card, index) => {
    const depth = 5 + index * 2.5;
    card.style.translate = `${x * depth}px ${y * depth}px`;
  });
});

galleryGrid.addEventListener("pointerleave", () => {
  galleryCards.forEach((card) => { card.style.translate = "0 0"; });
});

function closeLightbox() {
  lightbox.classList.remove("is-open");
}
document.querySelector("#closeLightbox").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});
