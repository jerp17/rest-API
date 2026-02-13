const app = document.getElementById("app");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const pageText = document.getElementById("page");

let users = [];       // original data
let filtered = [];    // filtered data
let currentPage = 1;
const perPage = 3;

async function fetchUsers() {
  try {
    app.innerHTML = "<p>Loading...</p>";

    const res = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!res.ok) {
      throw new Error("API Error");
    }

    users = await res.json();
    filtered = users;

    render();
  } catch (error) {
    app.innerHTML = "<p style='color:red;'>Failed to load data</p>";
    console.error(error);
  }
}
function render() {
  app.innerHTML = "";

  // Pagination logic
  const start = (currentPage - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  if (paginated.length === 0) {
    app.innerHTML = "<p>No users found</p>";
    return;
  }

  paginated.forEach(user => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${user.name}</h3>
      <p>${user.email}</p>
      <p>${user.company.name}</p>
    `;

    app.appendChild(div);
  });

  pageText.innerText = `Page ${currentPage}`;
}
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  filtered = users.filter(user =>
    user.name.toLowerCase().includes(value)
  );

  currentPage = 1;
  render();
});
sortSelect.addEventListener("change", () => {
  const value = sortSelect.value;

  if (value === "asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (value === "desc") {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  }

  render();
});
document.getElementById("next").addEventListener("click", () => {
  if (currentPage * perPage < filtered.length) {
    currentPage++;
    render();
  }
});

document.getElementById("prev").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    render();
  }
});
fetchUsers();