// Get DOM Elements
const form = document.getElementById("checkInForm");
const attendeeInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const clearAllBtn = document.getElementById("clearAllBtn");
const celebrationOverlay = document.getElementById("celebrationOverlay");
const closeCelebrationBtn = document.getElementById("closeCelebration");

// Initialize UI with existing data on page load
initializeUI();

// Handle form submission
form.addEventListener("submit", handleSubmit);

// Handle celebration popup close
closeCelebrationBtn.addEventListener("click", closeCelebration);

function handleSubmit(e) {
  e.preventDefault();
  // Get necessary values
  const attendeeName = attendeeInput.value;
  const team = teamSelect.value;

  // Add to checkedInPeople array
  checkedInPeople.push({ name: attendeeName, team });

  // Save to localStorage
  saveToLocalStorage();

  // Update UI
  updateUI();

  // Check if we've reached the limit and show celebration
  if (checkedInPeople.length === max_count) {
    showCelebration();
  }

  // Reset form
  form.reset();
}
// Initialize UI with existing localStorage data
function initializeUI() {
  updateUI();
}

// Update all UI elements based on current checkedInPeople data
function updateUI() {
  // Update progress bar
  const percentage = Math.round((checkedInPeople.length / max_count) * 100);
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = `${percentage}%`;

  // Update attendance tracker
  const attendanceTracker = document.getElementById("attendeeCount");
  attendanceTracker.textContent = checkedInPeople.length;

  // Update team counters and lists
  const teams = ["water", "zero", "power"];
  const teamCounts = {};

  teams.forEach((team) => {
    const teamMembers = checkedInPeople.filter(
      (person) => person.team === team
    );

    teamCounts[team] = teamMembers.length;

    // Update team counter
    const teamCounter = document.getElementById(`${team}Count`);
    if (teamCounter) {
      teamCounter.textContent = teamMembers.length;
    }

    // Update team list
    const teamList = document.getElementById(`${team}List`);
    if (teamList) {
      teamList.innerHTML = teamMembers
        .map((person) => `<li>${person.name}</li>`)
        .join("");
    }
  });

  // Highlight winning team if at max capacity
  if (checkedInPeople.length === max_count) {
    highlightWinningTeam(teamCounts);
  }
}

// Show celebration popup when attendance limit is reached
function showCelebration() {
  const teams = ["water", "zero", "power"];
  const teamCounts = {};

  teams.forEach((team) => {
    const teamMembers = checkedInPeople.filter(
      (person) => person.team === team
    );
    teamCounts[team] = teamMembers.length;
  });

  // Find the winning team(s)
  const maxCount = Math.max(...Object.values(teamCounts));
  const winningTeams = Object.entries(teamCounts)
    .filter(([team, count]) => count === maxCount)
    .map(([team]) => team);

  // Create winning team announcement
  const winningTeamElement = document.getElementById("winningTeamAnnouncement");
  const teamNames = {
    water: "🌊 Team Water Wise",
    zero: "🌿 Team Net Zero",
    power: "⚡ Team Renewables",
  };

  let announcement;
  if (winningTeams.length === 1) {
    announcement = `🏆 ${
      teamNames[winningTeams[0]]
    } wins with ${maxCount} members!`;
  } else if (winningTeams.length === 2) {
    announcement = `🏆 It's a tie between ${teamNames[winningTeams[0]]} and ${
      teamNames[winningTeams[1]]
    } with ${maxCount} members each!`;
  } else {
    announcement = `🏆 It's a three-way tie! All teams have ${maxCount} members each!`;
  }

  winningTeamElement.textContent = announcement;

  // Highlight winning team cards
  highlightWinningTeam(teamCounts);

  // Show the celebration popup
  celebrationOverlay.classList.remove("hidden");
}

// Highlight the winning team(s)
function highlightWinningTeam(teamCounts) {
  const maxCount = Math.max(...Object.values(teamCounts));
  const teams = ["water", "zero", "power"];

  teams.forEach((team) => {
    const teamCard = document.querySelector(`.team-card.${team}`);
    if (teamCard) {
      if (teamCounts[team] === maxCount && maxCount > 0) {
        teamCard.classList.add("winner");
      } else {
        teamCard.classList.remove("winner");
      }
    }
  });
}

// Close celebration popup
function closeCelebration() {
  celebrationOverlay.classList.add("hidden");
}
