// ================= SIGNUP =================
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // ===== VALIDATION =====
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      alert("Password must contain an uppercase letter");
      return;
    }

    if (!/[0-9]/.test(password)) {
      alert("Password must contain a number");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      const response = await fetch("backend.php?action=signup", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        alert("Account created successfully!");
        window.location.href = "login.html";
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Server error. Try again later.");
    }
  });
}
// ================= SIGNUP =================

// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch("backend.php?action=login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (data.success) {
        //alert("Login successful!");
        window.location.href = "dashboard.html";
      } else {
        alert(data.message);
      }

    } catch (error) {
      alert("Server error. Try again later.");
      console.error(error);
    }
  });
}
// ================= LOGIN =================

// ================= DASHBOARD =================

// =============== NAVIGATION ===============

const avatar = document.getElementById("navProfilePic");
const dropdown = document.getElementById("dropdownMenu");

// Toggle dropdown
if (avatar) {
  avatar.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("show");
  });
}

// Close when clicking outside
document.addEventListener("click", () => {
  dropdown?.classList.remove("show");
});

// Prevent closing when clicking inside dropdown
dropdown?.addEventListener("click", (e) => {
  e.stopPropagation();
});

// Profile navigation
function goToProfile() {
  window.location.href = "profile.html";
}

// =============== NAVIGATION ===============

// Load user info
async function loadUser() {
  try {
    const response = await fetch("backend.php?action=getUser");
    const data = await response.json();

    const profilePic = document.getElementById("navProfilePic");
    
    if (data.user.profile_pic) {
      profilePic.src = window.location.origin + "/DAILY_JOURNAL/" + data.user.profile_pic;
    } else {
      profilePic.src = "https://via.placeholder.com/40";
    }

    if (!data.success) {
      window.location.href = "login.html";
      return;
    }

    
    document.getElementById("userName").innerText = data.user.name;
    /*document.getElementById("streakText").innerText =
      "🔥 Current streak: " + data.streak.current_streak + " days";*/
    /* 🔥 STREAK (replace emoji with image) */
    document.getElementById("streakText").innerHTML =
    `<img src="logo_img/streaks.png" class="icon streak-icon">
    Current streak: ${data.streak.current_streak} days`;
    
    // GREETING 
    const hour = new Date().getHours();
    let greeting = "Welcome";

    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";
    else greeting = "Good Evening";

    /*document.getElementById("greetingText").innerText = greeting + ", " + data.user.name + " 👋";*/
    /* Replace emoji with image */
    document.getElementById("greetingText").innerHTML =
    `${greeting}, ${data.user.name}
    <img src="logo_img/welcome.png" class="icon greeting-icon">`;

  } catch (error) {
    console.error(error);
  }
}

// ================= PROFILE =================

// Load profile data
async function loadProfile() {
  try {
    const res = await fetch("backend.php?action=getUser");
    const data = await res.json();

    if (!data.success) {
      window.location.href = "login.html";
      return;
    }

    const user = data.user;

    document.getElementById("userName").innerText = user.name;

    document.getElementById("name").value = user.name || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("dob").value = user.dob || "";
    document.getElementById("gender").value = user.gender || "";

    if (user.profile_pic) {
      document.getElementById("profilePreview").src = user.profile_pic;
    }

  } catch (err) {
    console.error(err);
  }
}

// Preview image before upload
const profilePicInput = document.getElementById("profilePic");

if (profilePicInput) {
  profilePicInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      document.getElementById("profilePreview").src = URL.createObjectURL(file);
    }
  });
}

// Update profile
const profileForm = document.getElementById("profileForm");

if (profileForm) {
  profileForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", document.getElementById("name").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("dob", document.getElementById("dob").value);
    formData.append("gender", document.getElementById("gender").value);

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;

    if (currentPassword && newPassword) {
      formData.append("current_password", currentPassword);
      formData.append("new_password", newPassword);
    }

    const fileInput = document.getElementById("profilePic");
    if (fileInput.files[0]) {
      formData.append("profile_pic", fileInput.files[0]);
    }

    try {
      const res = await fetch("backend.php?action=updateProfile", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        alert("Profile updated!");
        window.location.href = "dashboard.html";
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
    }
  });
}

// Run only on profile page
if (document.getElementById("profileForm")) {
  loadProfile();
}

// ================= PROFILE =================

// ================= ENTRIES =================

// =============== CALENDAR ENTRIES ================

let currentDate = new Date();
let entriesData = [];

/*
const moodEmojiMap = {
  "😄 happy": "😄",
  "😐 neutral": "😐",
  "😔 sad": "😔",
  "😠 angry": "😠",
  "😴 tired": "😴",
  "happy": "😄",
  "neutral": "😐",
  "sad": "😔",
  "angry": "😠",
  "tired": "😴"
};
*/

const moodIconMap = {
  happy: "logo_img/happy.png",
  neutral: "logo_img/neutral.png",
  sad: "logo_img/sad.png",
  angry: "logo_img/angry.png",
  tired: "logo_img/tired.png"
};

const moodColorMap = {
  happy: "#d4edda",
  neutral: "#f8f9fa",
  sad: "#f8d7da",
  angry: "#f5c6cb",
  tired: "#e2e3e5"
};

// Fetch entries once
async function loadCalendarEntries() {
  const res = await fetch("backend.php?action=getEntries");
  const data = await res.json();

  if (data.success) {
    entriesData = data.entries;
  }

  renderCalendar();
}

function renderCalendar() {
  const grid = document.getElementById("calendarGrid");
  const monthText = document.getElementById("calendarMonth");

  if (!grid || !monthText) return;

  grid.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const today = new Date().toISOString().split("T")[0];

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  monthText.innerText = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  // Empty spaces
  for (let i = 0; i < firstDay; i++) {
    grid.innerHTML += `<div></div>`;
  }

  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    let classList = "calendar-day";

    // Today
    if (dateStr === today) classList += " today";

    // Future date
    if (dateStr > today) classList += " future";

    // Has entry
    /*
    if (entriesData.some(e => e.entry_date === dateStr)) {
      classList += " has-entry";
    }
    
    grid.innerHTML += `
      <div class="${classList}" onclick="openEntry('${dateStr}')">
        ${day}
      </div>
    `;

    */
    
    /*
    const entry = entriesData.find(e => e.entry_date === dateStr);
    let emoji = "";
    if (entry) {
      classList += " has-entry";
      if (entry.mood && moodEmojiMap[entry.mood]) {
        emoji = `<div class="mood-emoji">${moodEmojiMap[entry.mood]}</div>`;
      }
    }

    grid.innerHTML += `
      <div class="${classList}" onclick="openEntry('${dateStr}')">
        <div>${day}</div>
        ${emoji}
      </div>
    `;

    if (entry && entry.mood) {
      const moodKey = entry.mood.toLowerCase().trim();
      if (moodColorMap[moodKey]) {
        style = `style="background:${moodColorMap[moodKey]}"`;
      }
    }*/

    const entry = entriesData.find(e => e.entry_date === dateStr);
    
    let emoji = "";
    let style = "";

    if (entry) {
      classList += " has-entry";
      
      if (entry.mood) {
        const moodKey = entry.mood.toLowerCase().trim();

        // Emoji
        /*
        if (moodEmojiMap[moodKey]) {
          emoji = `<div class="mood-emoji">${moodEmojiMap[moodKey]}</div>`;
        }
        */
        if (moodIconMap[moodKey]) {
          emoji = `
          <div class="mood-icon-wrapper">
          <img src="${moodIconMap[moodKey]}" class="mood-icon">
          </div>
          `;
        }

        // Background color
        if (moodColorMap[moodKey]) {
          style = `style="background:${moodColorMap[moodKey]}"`;
        }
      }
    }
    
    grid.innerHTML += `
      <div class="${classList}" ${style} onclick="openEntry('${dateStr}')">
        <div>${day}</div>
        ${emoji}
      </div>
    `;
  }
}

// Navigation
document.getElementById("prevMonth")?.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById("nextMonth")?.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// Open entry
function openEntry(date) {
  window.location.href = `entry.html?date=${date}`;
}

// Run only on dashboard
if (document.getElementById("calendarGrid")) {
  loadCalendarEntries();
}

// @@@@@@@@@@@@@@@@@@@@@@@
function getSelectedDate() {
  const params = new URLSearchParams(window.location.search);
  return params.get("date") || new Date().toISOString().split("T")[0];
}

function openSelectedDate() {
  const date = document.getElementById("calendarInput").value;

  if (!date) {
    alert("Please select a date");
    return;
  }

  window.location.href = `entry.html?date=${date}`;
}

async function loadEntryByDate() {
  /* const date = getSelectedDate(); */
  const date = getSelectedDate();

  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  /*document.getElementById("entryTitle").innerText = `Entry for ${date} ✍️`;*/
  document.getElementById("entryTitle").innerHTML = `
  <span>Entry for ${formattedDate}</span>
  <img src="logo_img/writing.png" class="icon title-icon">
`;

  const res = await fetch("backend.php?action=getEntries");
  const data = await res.json();

  if (!data.success) return;

  const entry = data.entries.find(e => e.entry_date === date);
  /* if (!entry) return; */
  if (!entry) {
    console.log("No entry found for this date");
    return;
  }

  // OPTIONAL: fetch full entry
  const fullRes = await fetch(`backend.php?action=getEntry&id=${entry.id}`);
  const fullData = await fullRes.json();

  const e = fullData.entry;
  
  // Sleep
  document.getElementById("wake_time").value = e.wake_time || "";
  document.getElementById("sleep_duration").value = e.sleep_duration || "";
  document.getElementById("sleep_quality").value = e.sleep_quality || "";

  // Mood
  document.getElementById("mood").value = e.mood || "";
  document.getElementById("rating").value = e.rating || "";

  // Health
  document.getElementById("water_intake").value = e.water_intake || "";

  // Meals
  document.getElementById("breakfast").checked = e.breakfast == 1;
  document.getElementById("breakfast_rating").value = e.breakfast_rating || "";
  document.getElementById("breakfast_note").value = e.breakfast_note || "";

  document.getElementById("lunch").checked = e.lunch == 1;
  document.getElementById("lunch_rating").value = e.lunch_rating || "";
  document.getElementById("lunch_note").value = e.lunch_note || "";

  document.getElementById("dinner").checked = e.dinner == 1;
  document.getElementById("dinner_rating").value = e.dinner_rating || "";
  document.getElementById("dinner_note").value = e.dinner_note || "";

  // Exercise
  document.getElementById("exercise_duration").value = e.exercise_duration || "";
  document.getElementById("exercise_type").value = e.exercise_type || "";

  // Activities
  if (e.activities) {
    const arr = JSON.parse(e.activities);
    document.querySelectorAll(".activity-group input").forEach(cb => {
      cb.checked = arr.includes(cb.value);
    });
  }

  document.getElementById("custom_activity").value = e.custom_activity || "";

  // Gratitude
  document.getElementById("gratitude1").value = e.gratitude1 || "";
  document.getElementById("gratitude2").value = e.gratitude2 || "";
  document.getElementById("gratitude3").value = e.gratitude3 || "";

  // Journal
  document.getElementById("journal_text").value = e.journal_text || "";
  document.getElementById("daily_prompt").value = e.daily_prompt || "";

  if (e.image_path) {
    const preview = document.getElementById("imagePreview");
    preview.src = e.image_path;
    preview.style.display = "block";
  }
}

if (document.getElementById("saveEntryBtn")) {
  loadEntryByDate();
}

// =============== CALENDAR ENTRIES ================

// ================= MEAL TOGGLES =================

function setupMealToggle(checkboxId, fieldsId) {
  const checkbox = document.getElementById(checkboxId);
  const fields = document.getElementById(fieldsId);

  if (!checkbox || !fields) return;

  const inputs = fields.querySelectorAll("input");

  function updateState() {
    if (checkbox.checked) {
      fields.classList.add("active");

      inputs.forEach(input => {
        input.disabled = false;
      });

    } else {
      fields.classList.remove("active");

      inputs.forEach(input => {
        input.disabled = true;
        input.value = ""; // reset values
      });
    }
  }

  // Initial state (on page load)
  updateState();

  // On change
  checkbox.addEventListener("change", updateState);
}

// Apply for all meals
setupMealToggle("breakfast", "breakfast_fields");
setupMealToggle("lunch", "lunch_fields");
setupMealToggle("dinner", "dinner_fields");

// ================= MEAL TOGGLES =================

// ================= SAVE ENTRY =================

// ✅ IMAGE PREVIEW (ADD THIS HERE — top or bottom, anywhere outside submit)
const imageInput = document.getElementById("image");

if (imageInput) {
  imageInput.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
      const preview = document.getElementById("imagePreview");
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    }
  });
}

const saveBtn = document.getElementById("saveEntryBtn");

if (saveBtn) {
  saveBtn.addEventListener("click", async () => {

    /* const formData = new FormData(); */
    const formData = new FormData();
    formData.append("entry_date", getSelectedDate());

    // 🌙 Sleep
    formData.append("wake_time", document.getElementById("wake_time").value);
    formData.append("sleep_duration", document.getElementById("sleep_duration").value);
    formData.append("sleep_quality", document.getElementById("sleep_quality").value);

    // 😊 Mood
    formData.append("mood", document.getElementById("mood").value);
    formData.append("rating", document.getElementById("rating").value);

    // 💧 Health
    formData.append("water_intake", document.getElementById("water_intake").value);

    // 🍽️ Meals
    formData.append("breakfast", document.getElementById("breakfast").checked ? 1 : 0);
    formData.append("breakfast_rating", document.getElementById("breakfast_rating").value);
    formData.append("breakfast_note", document.getElementById("breakfast_note").value);

    formData.append("lunch", document.getElementById("lunch").checked ? 1 : 0);
    formData.append("lunch_rating", document.getElementById("lunch_rating").value);
    formData.append("lunch_note", document.getElementById("lunch_note").value);

    formData.append("dinner", document.getElementById("dinner").checked ? 1 : 0);
    formData.append("dinner_rating", document.getElementById("dinner_rating").value);
    formData.append("dinner_note", document.getElementById("dinner_note").value);


    // 🏃 Exercise
    formData.append("exercise_duration", document.getElementById("exercise_duration").value);
    formData.append("exercise_type", document.getElementById("exercise_type").value);


    // 🎯 Activities (multi-select)
    const activities = [];
    document.querySelectorAll(".activity-group input:checked")
    .forEach(el => activities.push(el.value));

    formData.append("activities", JSON.stringify(activities));

    formData.append("custom_activity", document.getElementById("custom_activity").value);
    
    // 🙏 Gratitude
    formData.append("gratitude1", document.getElementById("gratitude1").value);
    formData.append("gratitude2", document.getElementById("gratitude2").value);
    formData.append("gratitude3", document.getElementById("gratitude3").value);

    // ✍️ Journal
    formData.append("journal_text", document.getElementById("journal_text").value);
    formData.append("daily_prompt", document.getElementById("daily_prompt").value);

    // 🖼️ Image
    const file = document.getElementById("image").files[0];
    if (file) formData.append("image", file);

    const res = await fetch("backend.php?action=saveEntry", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.success) {
      alert("Entry saved!");
      window.location.href = "dashboard.html";
    } else {
      alert("Error saving entry");
    }
  });
}

// ================= SAVE ENTRY =================

// ================= ENTRIES =================

// ================== INSIGHTS ================

function goToInsights() {
  window.location.href = "insights.html";
}

/*
async function loadInsights() {
  try {
    const res = await fetch("backend.php?action=getInsightsData");
    const data = await res.json();

    if (!data.success) return;

    const entries = data.entries;

    const moodCount = {};
    const moodSleep = {};
    const moodFood = {};
    const moodQuality = {};

    let totalSleep = 0;
    let sleepDays = 0;

    entries.forEach(e => {

      const mood = e.mood?.toLowerCase()?.trim();
      if (!mood) return;

      // ===== MOOD COUNT =====
      moodCount[mood] = (moodCount[mood] || 0) + 1;

      // ===== SLEEP =====
      if (e.sleep_duration !== null) {
        const sleep = parseFloat(e.sleep_duration);
        totalSleep += sleep;
        sleepDays++;
      }

      // ===== MOOD vs SLEEP =====
      if (e.sleep_duration !== null) {
        if (!moodSleep[mood]) moodSleep[mood] = [];
        moodSleep[mood].push(parseFloat(e.sleep_duration));
      }

      // ===== MOOD vs FOOD =====
      const meals =
        (e.breakfast == 1) +
        (e.lunch == 1) +
        (e.dinner == 1);

      if (!moodFood[mood]) moodFood[mood] = [];
      moodFood[mood].push(meals);

      // ===== MOOD vs SLEEP QUALITY ⭐ (NEW) =====
      if (e.sleep_quality !== null) {
        if (!moodQuality[mood]) moodQuality[mood] = [];
        moodQuality[mood].push(parseInt(e.sleep_quality));
      }

    });

    // ===== HELPERS =====
    const avg = arr => arr.reduce((a,b)=>a+b,0) / arr.length;

    // ================= CHARTS =================

    // 1. Mood Distribution
    new Chart(document.getElementById("moodChart"), {
      type: "pie",
      data: {
        labels: Object.keys(moodCount),
        datasets: [{
          data: Object.values(moodCount)
        }]
      }
    });

    // 2. Average Sleep
    const avgSleep = sleepDays ? totalSleep / sleepDays : 0;

    new Chart(document.getElementById("sleepChart"), {
      type: "bar",
      data: {
        labels: ["Average Sleep"],
        datasets: [{
          label: "Hours",
          data: [avgSleep]
        }]
      }
    });

    // 3. Mood vs Sleep
    const moodSleepAvg = {};
    for (let m in moodSleep) {
      moodSleepAvg[m] = avg(moodSleep[m]);
    }

    new Chart(document.getElementById("moodSleepChart"), {
      type: "bar",
      data: {
        labels: Object.keys(moodSleepAvg),
        datasets: [{
          label: "Avg Sleep",
          data: Object.values(moodSleepAvg)
        }]
      }
    });

    // 4. Mood vs Food
    const moodFoodAvg = {};
    for (let m in moodFood) {
      moodFoodAvg[m] = avg(moodFood[m]);
    }

    new Chart(document.getElementById("moodFoodChart"), {
      type: "bar",
      data: {
        labels: Object.keys(moodFoodAvg),
        datasets: [{
          label: "Meals per Day",
          data: Object.values(moodFoodAvg)
        }]
      }
    });

    // ⭐ BONUS (high-value chart)
    // 5. Mood vs Sleep Quality
    const moodQualityAvg = {};
    for (let m in moodQuality) {
      moodQualityAvg[m] = avg(moodQuality[m]);
    }

    new Chart(document.getElementById("moodQualityChart"), {
      type: "bar",
      data: {
        labels: Object.keys(moodQualityAvg),
        datasets: [{
          label: "Sleep Quality",
          data: Object.values(moodQualityAvg)
        }]
      }
    });

  } catch (err) {
    console.error(err);
  }
}
*/

async function loadInsights() {
  const res = await fetch("backend.php?action=getInsightsData");
  const data = await res.json();

  if (!data.success) {
    alert("Failed to load insights");
    return;
  }

  const entries = data.entries;

  const moodCount = {};
  const sleepData = [];
  const sleepQualityData = [];
  const moodSleepMap = {};
  const moodFoodMap = {};

  entries.forEach(e => {
    const mood = (e.mood || "unknown").toLowerCase();

    // Mood count
    moodCount[mood] = (moodCount[mood] || 0) + 1;

    // Sleep Duration
    if (e.sleep_duration) {
      sleepData.push({
        x: e.entry_date,
        y: parseFloat(e.sleep_duration)
      });

      if (!moodSleepMap[mood]) moodSleepMap[mood] = [];
      moodSleepMap[mood].push(parseFloat(e.sleep_duration));
    }

    //Sleep Quality
    if (e.sleep_quality) {
      const quality = parseInt(e.sleep_quality);
      
      if (!isNaN(quality)) {
        sleepQualityData.push({
          x: e.entry_date,
          y: quality
        });
      }
    }

    // Food
    const meals =
      (e.breakfast ? 1 : 0) +
      (e.lunch ? 1 : 0) +
      (e.dinner ? 1 : 0);

    if (!moodFoodMap[mood]) moodFoodMap[mood] = [];
    moodFoodMap[mood].push(meals);
  });

  createMoodChart(moodCount);
  createSleepChart(sleepData);
  createSleepQualityChart(sleepQualityData);
  createMoodSleepChart(moodSleepMap);
  createMoodFoodChart(moodFoodMap);
}

function createMoodChart(moodCount) {
  new Chart(document.getElementById("moodChart"), {
    type: "doughnut",
    data: {
      labels: Object.keys(moodCount),
      datasets: [{
        data: Object.values(moodCount)
      }]
    }
  });
}

function createSleepChart(data) {
  new Chart(document.getElementById("sleepChart"), {
    type: "line",
    data: {
      datasets: [{
        label: "Hours Slept",
        data: data
      }]
    },
    options: {
      parsing: {
        xAxisKey: "x",
        yAxisKey: "y"
      }
    }
  });
}

function createSleepQualityChart(data) {
  new Chart(document.getElementById("sleepQualityChart"), {
    type: "line",
    data: {
      datasets: [{
        label: "Sleep Quality (1–5)",
        data: data
      }]
    },
    options: {
      parsing: {
        xAxisKey: "x",
        yAxisKey: "y"
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            callback: val => val + "⭐"
          }
        }
      }
    }
  });
}

function createMoodSleepChart(map) {
  const labels = [];
  const values = [];

  for (let mood in map) {
    const avg =
      map[mood].reduce((a, b) => a + b, 0) / map[mood].length;
    labels.push(mood);
    values.push(avg.toFixed(2));
  }

  new Chart(document.getElementById("moodSleepChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Avg Sleep",
        data: values
      }]
    }
  });
}

function createMoodFoodChart(map) {
  const labels = [];
  const values = [];

  for (let mood in map) {
    const avg =
      map[mood].reduce((a, b) => a + b, 0) / map[mood].length;
    labels.push(mood);
    values.push(avg.toFixed(2));
  }

  new Chart(document.getElementById("moodFoodChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Meals per Day",
        data: values
      }]
    }
  });
}

function goBack() {
  window.location.href = "dashboard.html";
}

if (document.getElementById("moodChart")) {
  loadInsights();
}

// ================== INSIGHTS ================

//  OTP TOGETHER

let userEmail = "";

// ================= SEND OTP =================
const forgotForm = document.getElementById("forgotForm");

if(forgotForm) {
  forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    //userEmail = email;
    localStorage.setItem("resetEmail", email);

    const formData = new FormData();
    formData.append("email", email);

    const res = await fetch("backend.php?action=sendOTP", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    alert(data.message);

    // ✅ DEBUG OTP
    if (data.debug_otp) {
      console.log("OTP:", data.debug_otp);
    }

    if (data.success) {
      // 🔄 Switch UI (no redirect)
      forgotForm.style.display = "none";
      document.getElementById("otpForm").style.display = "block";
    }
  });
}

// ================= VERIFY OTP =================
const otpForm = document.getElementById("otpForm");

if(otpForm){
  otpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    /*
    const otp = document.getElementById("otp").value.trim();
    const password = document.getElementById("password").value;

    const formData = new FormData();
    //formData.append("email", userEmail);
    const email = localStorage.getItem("resetEmail");
    formData.append("email", email);
  
    formData.append("otp", otp);
    formData.append("password", password);
    */

    const otp = document.getElementById("otp").value.trim();
    const password = document.getElementById("password").value;

    const email = localStorage.getItem("resetEmail");

    console.log("EMAIL:", email);
    console.log("OTP:", otp);

    if (!email) {
      alert("Session expired. Please request OTP again.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("otp", otp);
    formData.append("password", password);

    const res = await fetch("backend.php?action=verifyOTP", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    alert(data.message);

    if (data.success) {
      localStorage.removeItem("resetEmail"); // cleanup
      window.location.href = "login.html";
    }
  });
}
// OTP TOGETHER

// ==================== SEND OTP ====================
/*
const forgotForm = document.getElementById("forgotForm");

if (forgotForm) {
  forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;

    const formData = new FormData();
    formData.append("email", email);

    const res = await fetch("backend.php?action=sendOTP", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    alert(data.message);

    // ⭐ For testing
    if (data.debug_otp) {
      console.log("OTP:", data.debug_otp);
    }

    /*
    if (data.success) {
      window.location.href = `verify-otp.html?email=${email}`;
    }
      *
     window.location.href = "verify-otp.html" ;
  });
}

// ==================== SEND OTP ====================

// ===================== VERIFY OTP ==================

const otpForm = document.getElementById("otpForm");

if (otpForm) {

  const params = new URLSearchParams(window.location.search);
  const email = params.get("email");
  document.getElementById("email").value = email;

  otpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const otp = document.getElementById("otp").value;
    const password = document.getElementById("password").value;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("otp", otp);
    formData.append("password", password);

    const res = await fetch("backend.php?action=verifyOTP", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    alert(data.message);

    if (data.success) {
      window.location.href = "login.html";
    }
  });
}
*/
// ===================== VERIFY OTP ==================

// Logout
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await fetch("backend.php?action=logout");
    window.location.href = "login.html";
  });
}

// Run only on dashboard
if (document.getElementById("userName")) {
  loadUser();
}
// ================= DASHBOARD =================
