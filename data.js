// Load checked-in people from localStorage or initialize empty array
const checkedInPeople =
  JSON.parse(localStorage.getItem("checkedInPeople")) || [];
const max_count = 50;

// Function to save checked-in people to localStorage
function saveToLocalStorage() {
  localStorage.setItem("checkedInPeople", JSON.stringify(checkedInPeople));
}
