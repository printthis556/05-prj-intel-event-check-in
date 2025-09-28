// Display all checked-in attendee names in a styled card
function loadAllAttendeeNames() {
  let attendees = [];
  if (localStorage.getItem("attendeeList")) {
    attendees = JSON.parse(localStorage.getItem("attendeeList"));
  }
  let displayDiv = document.getElementById("allAttendeesDisplay");
  if (!displayDiv) {
    displayDiv = document.createElement("div");
    displayDiv.id = "allAttendeesDisplay";
    displayDiv.className = "attendee-names-card";
    // Insert after team stats if possible
    const teamStats = document.querySelector(".team-stats");
    if (teamStats && teamStats.parentNode) {
      teamStats.parentNode.insertBefore(displayDiv, teamStats.nextSibling);
    } else {
      document.body.appendChild(displayDiv);
    }
  }
  displayDiv.innerHTML =
    '<h3 class="attendee-names-title">Checked-In Attendees</h3>';
  if (attendees.length === 0) {
    displayDiv.innerHTML +=
      '<div class="no-attendees">No attendees have checked in yet.</div>';
    return;
  }
  const ul = document.createElement("ul");
  ul.className = "attendee-names-list";
  for (let i = 0; i < attendees.length; i++) {
    const li = document.createElement("li");
    li.className = "attendee-names-item";
    li.textContent = `${attendees[i].name} (${attendees[i].teamName})`;
    ul.appendChild(li);
  }
  displayDiv.appendChild(ul);
}

//get all needed DOM `elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// track attendance
let count = 0;
const maxCount = 50; // maximum number of attendees

// Load counts from localStorage
if (localStorage.getItem("attendanceCount")) {
  count = parseInt(localStorage.getItem("attendanceCount"));
}

// Load team counts from localStorage
function loadTeamCounts() {
  const teamSelect = document.getElementById("teamSelect");
  if (!teamSelect) return;
  for (let i = 0; i < teamSelect.options.length; i++) {
    const teamValue = teamSelect.options[i].value;
    const saved = localStorage.getItem("teamCount_" + teamValue);
    if (saved !== null) {
      const teamCounter = document.getElementById(teamValue + "Count");
      if (teamCounter) {
        teamCounter.textContent = saved;
      }
    }
  }
}

// On page load, update attendee count and team counts
window.addEventListener("DOMContentLoaded", function () {
  const attendeeCountSpan = document.getElementById("attendeeCount");
  if (attendeeCountSpan) {
    attendeeCountSpan.textContent = count;
  }
  loadTeamCounts();
  loadAllAttendeeNames();
});

// handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // prevent default form submission

  // get input values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, team, teamName); // log values to console (or handle as needed)

  // increment count
  count++;
  console.log("Total Check-Ins: ", count);

  // update attendee count span
  const attendeeCountSpan = document.getElementById("attendeeCount");
  if (attendeeCountSpan) {
    attendeeCountSpan.textContent = count;
  }
  // Save total count to localStorage
  localStorage.setItem("attendanceCount", count);

  // Check if goal reached
  if (count === maxCount) {
    // Find the winning team
    let maxTeam = null;
    let maxTeamCount = -1;
    for (let i = 0; i < teamSelect.options.length; i++) {
      const t = teamSelect.options[i].value;
      const teamCounter = document.getElementById(t + "Count");
      if (teamCounter) {
        const val = parseInt(teamCounter.textContent);
        if (val > maxTeamCount) {
          maxTeamCount = val;
          maxTeam = teamSelect.options[i].text;
        }
      }
    }
    // Show celebration message
    let celebrationDiv = document.getElementById("celebrationMessage");
    if (!celebrationDiv) {
      celebrationDiv = document.createElement("div");
      celebrationDiv.id = "celebrationMessage";
      celebrationDiv.style.margin = "2em auto 1em auto";
      celebrationDiv.style.padding = "1em";
      celebrationDiv.style.background = "#e8f4fc";
      celebrationDiv.style.color = "#003c71";
      celebrationDiv.style.fontSize = "1.5em";
      celebrationDiv.style.fontWeight = "bold";
      celebrationDiv.style.borderRadius = "12px";
      celebrationDiv.style.textAlign = "center";
      form.parentNode.insertBefore(celebrationDiv, form);
    }
    celebrationDiv.textContent = `🎊 Check-in goal reached! Congratulations to the winning team: ${maxTeam}! 🏆`;
  }

  // update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log(`Progress: ${percentage}`);
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    progressBar.style.width = percentage;
  }

  // update the team counter
  const teamCounter = document.getElementById(team + "Count");
  const newTeamCount = parseInt(teamCounter.textContent) + 1;
  teamCounter.textContent = newTeamCount;
  // Save team count to localStorage
  localStorage.setItem("teamCount_" + team, newTeamCount);

  // simple welcome message
  const message = `🥳 Welcome ${name} from ${teamName}! 🎉`;

  // display the greeting message on the page
  let greetingDiv = document.getElementById("greetingMessage");
  if (!greetingDiv) {
    greetingDiv = document.createElement("div");
    greetingDiv.id = "greetingMessage";
    greetingDiv.style.marginTop = "1em";
    greetingDiv.style.fontSize = "1.2em";
    greetingDiv.style.fontWeight = "bold";
    form.parentNode.insertBefore(greetingDiv, form.nextSibling);
  }
  greetingDiv.textContent = message;

  // Save attendee to localStorage
  let attendees = [];
  if (localStorage.getItem("attendeeList")) {
    attendees = JSON.parse(localStorage.getItem("attendeeList"));
  }
  attendees.push({ name: name, team: team, teamName: teamName });
  localStorage.setItem("attendeeList", JSON.stringify(attendees));

  // Update attendee names display
  loadAllAttendeeNames();

  // reset form
  form.reset();
});
