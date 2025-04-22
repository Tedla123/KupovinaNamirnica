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
  
  function createCategorySection(container, itemsByCategory, onlySelected = false) {
    container.innerHTML = "";
    for (let [category, items] of Object.entries(itemsByCategory)) {
      const catItems = onlySelected ? items.filter(item => selectedItems[item]) : items;
      if (onlySelected && catItems.length === 0) continue;
  
      const catDiv = document.createElement("div");
      catDiv.className = "category";
  
      const catHeader = document.createElement("h3");
      catHeader.textContent = category;
      catHeader.onclick = () => catDiv.classList.toggle("active");
      catDiv.appendChild(catHeader);
  
      const itemDiv = document.createElement("div");
      itemDiv.className = "items";
  
      catItems.forEach(item => {
        const btn = document.createElement("button");
        btn.textContent = onlySelected ? `${item} - ${selectedItems[item]}` : item;
        btn.className = onlySelected ? "shopping-item" : "";
        btn.onclick = () => {
          if (onlySelected) {
            btn.remove();
          } else {
            selectedItems[item] = (selectedItems[item] || 0) + 1;
          }
        };
        itemDiv.appendChild(btn);
      });
  
      catDiv.appendChild(itemDiv);
      container.appendChild(catDiv);
    }
  }
  
  function saveShoppingList() {
    localStorage.setItem("selectedShoppingList", JSON.stringify(selectedItems));
    alert("Popis spremljen!");
  }
  
  function startShopping() {
    const saved = JSON.parse(localStorage.getItem("selectedShoppingList")) || {};
    Object.assign(selectedItems, saved);
    const container = document.getElementById("shoppingItems");
    createCategorySection(container, categories, true);
  }
  
  window.onload = function () {
    document.querySelectorAll(".tab").forEach(tab => {
      tab.addEventListener("click", function () {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));
        this.classList.add("active");
        document.getElementById(this.getAttribute("data-target")).classList.add("active");
      });
    });
  
    createCategorySection(document.getElementById("categoriesContainer"), categories);
  };
  