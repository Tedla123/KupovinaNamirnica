const categories = {
  "Voće": ["Jabuka", "Kruška", "Grožđe", "Šljiva", "Naranča", "Grejp", "Limun", "Kiwi", "Banana", "Ananas", "Orah", "Lješnjak"],
  "Povrće": ["Rajčica", "Paprika babura", "Paprika rog", "Krumpir", "Crveni luk", "Češnjak", "Mrkva", "Celer", "Grah", "Poriluk", "Cikla", "Krastavac"],
  "Mliječni proizvodi": ["Mlijeko svježe", "Mlijeko trajno", "Tekući jogurt", "Voćni jogurt", "Kislo vrhnje", "ABC sir", "Mozzarela", "Sirni namaz", "Kružni sir", "Jaja", "Maslac", "Margarin", "Vrhnje za kuhanje", "mascarpone", "monte", "kinder čokolada", "Puding"],
  "Prilozi i začini": ["Šećer", "Sol", "Papar", "Vegeta", "Kocke za juhu", "vanil šećer", "prašak za pecivo", "Crvena paprika", "Ocat jabučni", "Ocat alkoholni", "Ulje", "Brašno meko", "Brašno oštro", "Griz", "Palenta", "Mrvice", "Riža", "Kava", "Mlinci", "Tjestenina šarafi", "Spageti", "Ribanac"],
  "Ostalo": ["Kore za študlu", "čaj šumsko voće", "čaj kamilica", "Čaj Twinings", "Pašteta", "hrenovke", "ZG VRECICE", "Poli salama", "Kuglice za juhu", "Pahuljice", "Čokolino"],
  "Smrznuto": ["Štrukle", "Riblji štapići", "Oslić smrznuti", "Špinat", "Kedle", "Svježe pile", "Mljeveno meso"],
  "Kiselo i konzerva": ["Ajvar", "Cikla", "Pelati", "Masline"],
  "Piće": ["Cedevita", "Coca Cola", "Pivo"],
  "Kozmetika": ["WC papir", "Tablete za mašinu", "Omekšivač Lenor", "Detergent za veš Persil", "Papirnati ručnici"]
};

const selectedItems = {};
let savedLists = [];

function createCategorySection(container, itemsByCategory, onlySelected = false, keepExpanded = false) {
  const expandedCategories = [];
  if (keepExpanded) {
    container.querySelectorAll(".category.active h3").forEach(h => {
      expandedCategories.push(h.textContent.trim());
    });
  }

  container.innerHTML = "";

  for (let [category, items] of Object.entries(itemsByCategory)) {
    const catItems = onlySelected ? items.filter(item => selectedItems[item]) : items;
    if (onlySelected && catItems.length === 0) continue;

    const catDiv = document.createElement("div");
    catDiv.className = "category";

    const catHeader = document.createElement("h3");
    catHeader.textContent = category;
    catHeader.onclick = () => {
      document.querySelectorAll(".category").forEach(c => c !== catDiv && c.classList.remove("active"));
      catDiv.classList.toggle("active");
    };
    catDiv.appendChild(catHeader);

    const itemDiv = document.createElement("div");
    itemDiv.className = "items";

    catItems.forEach(item => {
      const btn = document.createElement("button");
      btn.textContent = onlySelected ? `${item} - ${selectedItems[item]}` : item;
      if (selectedItems[item]) {
        btn.classList.add("selected-item");
      }
      if (onlySelected) {
        btn.classList.add("shopping-item");
      }

      btn.onclick = () => {
        if (onlySelected) {
          if (selectedItems[item] > 1) {
            selectedItems[item]--;
          } else {
            delete selectedItems[item];
            btn.classList.remove("selected-item");
          }
          renderSelectedItems();
          createCategorySection(container, itemsByCategory, true, true);
        } else {
          selectedItems[item] = (selectedItems[item] || 0) + 1;
          btn.classList.add("selected-item");
          renderSelectedItems();
        }
      };

      itemDiv.appendChild(btn);
    });

    catDiv.appendChild(itemDiv);
    container.appendChild(catDiv);

    if (expandedCategories.includes(category) || onlySelected) {
      catDiv.classList.add("active");
    }
  }
}


function renderSelectedItems() {
  const container = document.getElementById("selectedCategoriesView");
  if (!container) return;

  createCategorySection(container, categories, true, false);

  container.querySelectorAll(".category").forEach(cat => {
    cat.classList.add("active");
  });

  // Ukloni zelenu klasu sa svih koji više nisu odabrani
  document.querySelectorAll("#categoriesContainer button").forEach(btn => {
    const name = btn.textContent.trim();
    if (!selectedItems[name]) {
      btn.classList.remove("selected-item");
    }
  });
}

function saveShoppingList() {
  if (Object.keys(selectedItems).length === 0) {
    alert("Popis je prazan!");
    return;
  }

  const savedContainer = document.getElementById("savedShoppingLists");
  const today = new Date();
  const dateStr = today.toLocaleDateString("hr-HR");
  const baseTitle = `${dateStr} Popis za kupovinu`;
  let title = baseTitle;
  let counter = 1;

  while ([...savedContainer.querySelectorAll("h4")].some(h => h.textContent === title)) {
    counter++;
    title = `${baseTitle} (${counter})`;
  }

  savedLists.push({ title, data: { ...selectedItems } });

  const wrapper = document.createElement("div");
  const titleEl = document.createElement("h4");
  titleEl.textContent = title;
  titleEl.onclick = () => {
    listDiv.style.display = listDiv.style.display === "none" ? "block" : "none";
  };
  titleEl.style.cursor = "pointer";
  titleEl.style.color = "#0078d4";

  const listDiv = document.createElement("div");
  listDiv.style.display = "none";
  listDiv.style.marginTop = "10px";

  for (let item in selectedItems) {
    const p = document.createElement("p");
    p.textContent = `• ${item} x ${selectedItems[item]}`;
    listDiv.appendChild(p);
  }

  wrapper.appendChild(titleEl);
  wrapper.appendChild(listDiv);
  wrapper.style.marginBottom = "15px";
  savedContainer.appendChild(wrapper);

  showPopupMessage("Popis spremljen!");
  for (let key in selectedItems) delete selectedItems[key];
  renderSelectedItems();
}

function exportShoppingList() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedItems));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  const date = new Date().toLocaleDateString("hr-HR").replaceAll("/", "-");
  dlAnchor.setAttribute("download", `Popis-${date}.json`);
  dlAnchor.click();
}

function importShoppingList(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      Object.assign(selectedItems, data);
      renderSelectedItems();
      alert("Popis je uvezen!");
    } catch {
      alert("Neispravna datoteka!");
    }
  };
  reader.readAsText(file);
}

function clearShoppingList() {
  if (confirm("Jesi li siguran/na da želiš obrisati cijeli popis?")) {
    for (let key in selectedItems) delete selectedItems[key];
    localStorage.removeItem("selectedShoppingList");
    renderSelectedItems();
    document.getElementById("shoppingItems").innerHTML = "";
    document.getElementById("savedShoppingLists").innerHTML = "";
    alert("Popis obrisan.");
  }
}

function startShopping() {
  const popup = document.getElementById("shoppingPopup");
  const container = document.getElementById("shoppingItems");
  popup.innerHTML = "";
  container.innerHTML = "";

  if (savedLists.length === 0) {
    alert("Nema spremljenih popisa.");
    return;
  }

  popup.style.display = "block";

  const title = document.createElement("h4");
  title.textContent = "Odaberi popis za kupovinu:";
  popup.appendChild(title);

  savedLists.forEach((list) => {
    const btn = document.createElement("button");
    btn.textContent = list.title;
    btn.onclick = () => {
      Object.keys(selectedItems).forEach(k => delete selectedItems[k]);
      Object.assign(selectedItems, list.data);
      popup.style.display = "none";
      renderShoppingItems();
    };
    popup.appendChild(btn);
  });
}

function renderShoppingItems() {
  const container = document.getElementById("shoppingItems");
  container.innerHTML = "";

  for (let [category, items] of Object.entries(categories)) {
    const filteredItems = items.filter(item => selectedItems[item]);
    if (filteredItems.length === 0) continue;

    const catDiv = document.createElement("div");
    catDiv.className = "category active";

    const catHeader = document.createElement("h3");
    catHeader.textContent = category;
    catDiv.appendChild(catHeader);

    const itemDiv = document.createElement("div");
    itemDiv.className = "items";

    filteredItems.forEach(item => {
      const btn = document.createElement("button");
      btn.textContent = `${item} - ${selectedItems[item]}`;
      btn.className = "shopping-item";
      btn.onclick = () => {
        delete selectedItems[item];
        renderShoppingItems();
      };
      itemDiv.appendChild(btn);
    });

    catDiv.appendChild(itemDiv);
    container.appendChild(catDiv);
  }
}

window.onload = function () {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));
      this.classList.add("active");

      const target = this.getAttribute("data-target");
      document.getElementById(target).classList.add("active");

      if (target === "shopping-list") {
        renderSelectedItems();
      }
    });
  });

  createCategorySection(document.getElementById("categoriesContainer"), categories);
};

let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
  const tabs = Array.from(document.querySelectorAll(".tab"));
  const activeTab = tabs.findIndex(tab => tab.classList.contains("active"));

  if (touchEndX < touchStartX - 50 && activeTab < tabs.length - 1) {
    tabs[activeTab + 1].click();
  }
  if (touchEndX > touchStartX + 50 && activeTab > 0) {
    tabs[activeTab - 1].click();
  }
}

document.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener("touchend", e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, false);

function showPopupMessage(msg) {
  const popup = document.getElementById("popupMessage");
  popup.textContent = msg;
  popup.classList.add("show");
  popup.style.display = "block";

  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.style.display = "none", 500);
  }, 2000);
}
