// ==UserScript==
// @name        Add item search for RealmEye offers page
// @namespace   Violentmonkey Scripts
// @match       https://www.realmeye.com/edit-offers-by/*
// @grant       none
// @version     1.0.0
// @author      gkp1
// @updateURL    https://raw.githubusercontent.com/gkp1/rotmg_realmeye_search/refs/heads/main/reyesearch.user.js
// @downloadURL  https://raw.githubusercontent.com/gkp1/rotmg_realmeye_search/refs/heads/main/reyesearch.user.js
// @description 06/03/2025, 23:15:03
// ==/UserScript==

(function () {
  const modal = document.querySelector("#item-selector > div > div > div");

  const searchContainer = document.createElement("div");
  searchContainer.className = "item-search-container";
  searchContainer.innerHTML = `
        <input type="text"
               class="item-search-input"
               placeholder="Search items..."
               aria-label="Search items">
        <div class="search-clear-btn" hidden aria-label="Clear search">×</div>
    `;

  const style = document.createElement("style");
  style.textContent = `
        .item-search-container {
            position: relative;
            padding: 12px;
            border-bottom: 1px solid #eee;
        }

        .item-search-input {
            width: 100%;
            padding: 8px 32px 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 14px;
        }

        .search-clear-btn {
            position: absolute;
            right: 24px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            font-size: 20px;
            color: #999;
            padding: 0 8px;
        }

        .search-clear-btn:hover {
            color: #666;
        }

        .item-wrapper[hidden] {
            display: none !important;
        }
    `;

  document.head.appendChild(style);
  modal.insertBefore(searchContainer, modal.firstChild);

  const searchInput = searchContainer.querySelector(".item-search-input");
  const clearButton = searchContainer.querySelector(".search-clear-btn");
  const items = Array.from(modal.querySelectorAll(".item-wrapper"));

  const debounce = (func, delay = 300) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const filterItems = (searchTerm) => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    items.forEach((item) => {
      const title = item.getAttribute("title").toLowerCase();
      let isVisible = false;

      if (!normalizedSearch) {
        isVisible = true;
      } else {
        const searchWords = normalizedSearch.split(/\s+/);
        const titleWords = title.split(/\s+/);

        isVisible = searchWords.every((searchWord) => title.includes(searchWord) || titleWords.some((titleWord) => titleWord.startsWith(searchWord)));
      }

      item.hidden = !isVisible;
    });

    clearButton.hidden = normalizedSearch === "";
  };

  const handleSearch = debounce((e) => {
    filterItems(e.target.value);
  });

  const clearSearch = () => {
    searchInput.value = "";
    filterItems("");
    searchInput.focus();
  };

  searchInput.addEventListener("input", handleSearch);
  clearButton.addEventListener("click", clearSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") clearSearch();
  });

  filterItems("");
})();
