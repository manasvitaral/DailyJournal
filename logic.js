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

// Load user info
async function loadUser() {
  try {
    const response = await fetch("backend.php?action=getUser");
    const data = await response.json();

    if (!data.success) {
      window.location.href = "login.html";
      return;
    }

    document.getElementById("userName").innerText = data.user.name;
    document.getElementById("streakText").innerText =
      "🔥 Current streak: " + data.streak.current_streak + " days";
    
    // GREETING 
    const hour = new Date().getHours();
    let greeting = "Welcome";

    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";
    else greeting = "Good Evening";

    document.getElementById("greetingText").innerText = greeting + ", " + data.user.name + " 👋";

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

    const formData = new FormData();

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

    //const data = await res.json();
    const text = await res.text();
console.log("RAW RESPONSE:", text);

const data = JSON.parse(text);

    if (data.success) {
      alert("Entry saved!");
    } else {
      alert("Error saving entry");
    }
  });
}

// ================= SAVE ENTRY =================

// ================= ENTRIES =================

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
