document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  searchBtn.addEventListener("click", searchBook);
});

function searchBook() {
  const input = document.getElementById("searchInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (!input) {
    resultDiv.style.color = "red";
    resultDiv.innerText = "⚠️ Please enter Book ID, Title, or Author Name!";
    return;
  }

  const start = performance.now();

  fetch(`http://localhost:3000/search?query=${encodeURIComponent(input)}`)
    .then(response => response.json())
    .then(data => {
      const end = performance.now();
      if (data.length > 0) {
        resultDiv.style.color = "#2e7d32";
        resultDiv.innerHTML = "<b>✅ Book(s) Found:</b><br><br>" +
          data.map(book => 
            `📘 <b>${book.title}</b><br>
             👤 Author: ${book.author}<br>
             🆔 ID: ${book.book_id}<br>
             📅 Year: ${book.year}<br><br>`
          ).join('') +
          `⏱ Search Time: ${(end - start).toFixed(4)} ms`;
      } else {
        resultDiv.style.color = "red";
        resultDiv.innerText = `❌ No book found matching "${input}"\n⏱ Time: ${(end - start).toFixed(4)} ms`;
      }
    })
    .catch(() => {
      resultDiv.style.color = "red";
      resultDiv.innerText = "⚠️ Error fetching data from server.";
    });
}
