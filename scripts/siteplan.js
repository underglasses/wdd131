// script.js

// ---- Data (objects, arrays) ----
const places = [
  { id: "p1", name: "Malecón 2000", category: "culture", rating: 4.7, img: "images/item1.jpg", desc: "Iconic riverside boardwalk with gardens and monuments." },
  { id: "p2", name: "Parque Histórico", category: "park", rating: 4.5, img: "images/item2.jpg", desc: "Nature, culture, and historic architecture blended." },
  { id: "p3", name: "La Cevichería X", category: "food", rating: 4.6, img: "images/item3.jpg", desc: "Fresh seafood and classic coastal flavors." },
  { id: "p4", name: "Cerro Santa Ana", category: "culture", rating: 4.4, img: "images/item2.jpg", desc: "Colorful hill with steps, views, and lighthouse." },
  { id: "p5", name: "Parque Samanes", category: "park", rating: 4.3, img: "images/item1.jpg", desc: "Expansive green space for sports and leisure." },
];

// ---- localStorage helpers ----
const storage = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};

const FAVORITES_KEY = "cx_favorites";
const THEME_KEY = "cx_theme";
const NEWSLETTER_KEY = "cx_newsletter_subs";
const CONTACT_KEY = "cx_contact_submissions";

// ---- Initialization ----
document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initNavToggle();
  initTheme();
  initNewsletter();
  initContact();
  initExplorePage();
});

// ---- Common UI ----
function initYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.getAttribute("data-open") === "true";
    nav.setAttribute("data-open", String(!open));
    toggle.setAttribute("aria-expanded", String(!open));
  });
}

function initTheme() {
  const saved = storage.get(THEME_KEY, "light");
  document.body.classList.toggle("dark", saved === "dark");

  const toggleBtn = document.getElementById("themeToggle");
  if (!toggleBtn) return;

  toggleBtn.setAttribute("aria-pressed", saved === "dark" ? "true" : "false");
  toggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    storage.set(THEME_KEY, isDark ? "dark" : "light");
    toggleBtn.setAttribute("aria-pressed", isDark ? "true" : "false");
  });
}

// ---- Forms ----
function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;

  const emailInput = document.getElementById("email");
  const messageEl = document.getElementById("newsletterMessage");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    // Conditional branching
    if (!email || !email.includes("@")) {
      messageEl.textContent = "Please enter a valid email address.";
      messageEl.style.color = "crimson";
      return;
    }

    const subs = storage.get(NEWSLETTER_KEY, []);
    // Prevent duplicate subscription
    const exists = subs.some(s => s.toLowerCase() === email.toLowerCase());
    if (exists) {
      messageEl.textContent = "You are already subscribed. Thanks!";
      messageEl.style.color = "orange";
    } else {
      subs.push(email);
      storage.set(NEWSLETTER_KEY, subs);
      messageEl.textContent = `Subscribed successfully: ${email}`;
      messageEl.style.color = "green";
      form.reset();
    }
  });
}

function initContact() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const message = document.getElementById("contactMessage");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      placeName: form.placeName.value.trim(),
      category: form.category?.value || form.contactCategory?.value || "",
      message: form.message.value.trim(),
      date: new Date().toISOString()
    };

    // Basic validation branching
    const requiredFields = ["name", "email", "placeName", "category", "message"];
    const missing = requiredFields.filter(f => !payload[f]);
    if (missing.length) {
      message.textContent = `Please complete: ${missing.join(", ")}`;
      message.style.color = "crimson";
      return;
    }

    const submissions = storage.get(CONTACT_KEY, []);
    submissions.push(payload);
    storage.set(CONTACT_KEY, submissions);

    message.textContent = `Thanks, ${payload.name}! Your recommendation for "${payload.placeName}" was received.`;
    message.style.color = "green";
    form.reset();
  });
}

// ---- Explore page dynamic rendering ----
function initExplorePage() {
  const grid = document.getElementById("cardGrid");
  if (!grid) return;

  const favList = document.getElementById("favoritesList");
  const emptyState = document.getElementById("emptyState");
  const categorySel = document.getElementById("category");
  const sortSel = document.getElementById("sort");
  const queryInput = document.getElementById("query");

  // Start with favorites from storage
  let favorites = storage.get(FAVORITES_KEY, []);

  function renderFavorites() {
    favList.innerHTML = "";
    if (!favorites.length) {
      favList.innerHTML = "<li>No favorites yet.</li>";
      return;
    }
    favorites.forEach(id => {
      const place = places.find(p => p.id === id);
      if (!place) return;
      const li = document.createElement("li");
      li.textContent = `${place.name} (${place.category}, ★${place.rating})`;
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        favorites = favorites.filter(f => f !== place.id);
        storage.set(FAVORITES_KEY, favorites);
        renderFavorites();
        renderCards(); // Update buttons
      });
      li.appendChild(removeBtn);
      favList.appendChild(li);
    });
  }

  function getFilteredSortedData() {
    const category = categorySel.value;
    const sort = sortSel.value;
    const q = queryInput.value.trim().toLowerCase();

    // Filter (arrays + methods)
    let data = places
      .filter(p => category === "all" ? true : p.category === category)
      .filter(p => q ? (p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)) : true);

    // Sort
    if (sort === "rating-desc") data.sort((a, b) => b.rating - a.rating);
    if (sort === "rating-asc") data.sort((a, b) => a.rating - b.rating);
    if (sort === "name-asc") data.sort((a, b) => a.name.localeCompare(b.name));

    return data;
  }

  function renderCards() {
    const data = getFilteredSortedData();
    grid.innerHTML = "";

    // Conditional empty state
    if (data.length === 0) {
      emptyState.hidden = false;
      return;
    } else {
      emptyState.hidden = true;
    }

    // Template literals to render cards
    data.forEach(p => {
      const isFav = favorites.includes(p.id);
      const card = document.createElement("article");
      card.className = "card";
      card.setAttribute("role", "listitem");

      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="card-body">
          <h3 class="card-title">${p.name}</h3>
          <p class="card-meta">${p.category} • ★${p.rating}</p>
          <p>${p.desc}</p>
          <div class="card-actions">
            <button type="button" data-action="fav" aria-pressed="${isFav}">${isFav ? "Unfavorite" : "Favorite"}</button>
            <button type="button" data-action="details">Details</button>
          </div>
        </div>
      `;

      // Event listeners (DOM interaction)
      card.querySelector('[data-action="fav"]').addEventListener("click", (e) => {
        const pressed = e.currentTarget.getAttribute("aria-pressed") === "true";
        if (pressed) {
          favorites = favorites.filter(id => id !== p.id);
        } else {
          favorites.push(p.id);
        }
        storage.set(FAVORITES_KEY, favorites);
        renderFavorites();
        renderCards(); // Rerender to update button label/state
      });

      card.querySelector('[data-action="details"]').addEventListener("click", () => {
        alert(`Details:\n${p.name}\nCategory: ${p.category}\nRating: ${p.rating}\n\n${p.desc}`);
      });

      grid.appendChild(card);
    });
  }

  // Events
  categorySel.addEventListener("change", renderCards);
  sortSel.addEventListener("change", renderCards);
  queryInput.addEventListener("input", renderCards);

  renderFavorites();
  renderCards();
}
