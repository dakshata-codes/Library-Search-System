document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const resultDiv = document.getElementById("result");

  const suggestionBox = document.createElement("div");
  suggestionBox.id = "suggestionBox";
  suggestionBox.style.position = "absolute";
  suggestionBox.style.background = "#fff";
  suggestionBox.style.border = "1px solid #ccc";
  suggestionBox.style.width = "80%";
  suggestionBox.style.marginLeft = "40px";
  suggestionBox.style.borderRadius = "8px";
  suggestionBox.style.zIndex = "999";
  suggestionBox.style.display = "none";
  document.body.appendChild(suggestionBox);

  // Live suggestions (Trie)
  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (!query) {
      suggestionBox.style.display = "none";
      return;
    }
    const res = await fetch(`http://localhost:3000/suggest?prefix=${encodeURIComponent(query)}`);
    const suggestions = await res.json();

    if (suggestions.length === 0) {
      suggestionBox.style.display = "none";
      return;
    }

    suggestionBox.innerHTML = suggestions
      .map(s => `<div class="suggestion-item">${s}</div>`)
      .join("");
    suggestionBox.style.display = "block";

    // Add click event to suggestions
    document.querySelectorAll(".suggestion-item").forEach(item => {
      item.style.padding = "8px 10px";
      item.style.cursor = "pointer";
      item.addEventListener("mouseover", () => item.style.background = "#f1f1f1");
      item.addEventListener("mouseout", () => item.style.background = "#fff");
      item.addEventListener("click", () => {
        searchInput.value = item.textContent;
        suggestionBox.style.display = "none";
        searchBook();
      });
    });
  });

  // Book search
  searchBtn.addEventListener("click", searchBook);

  function searchBook() {
    const input = searchInput.value.trim();
    if (!input) {
      resultDiv.innerText = "⚠️ Please enter Book ID, Title, or Author Name!";
      resultDiv.className = "error";
      return;
    }

    const start = performance.now();
    fetch(`http://localhost:3000/search?query=${encodeURIComponent(input)}`)
      .then(response => response.json())
      .then(data => {
        const end = performance.now();
        if (data.length > 0) {
          resultDiv.className = "success";
          resultDiv.innerHTML =
            "<b>✅ Book(s) Found:</b><br><br>" +
            data.map(book =>
              `<b>${book.title}</b><br>Author: ${book.author}<br>ID: ${book.book_id}<br>Year: ${book.year}<br><br>`
            ).join('') +
            `<span class='result-time'>⏱ Search Time: ${(end - start).toFixed(4)} ms</span>`;
        } else {
          resultDiv.className = "error";
          resultDiv.innerText = `❌ No book found for "${input}"\n⏱ Time: ${(end - start).toFixed(4)} ms`;
        }
      })
      .catch(() => {
        resultDiv.className = "error";
        resultDiv.innerText = "⚠️ Error fetching data from server.";
      });
  }
});
