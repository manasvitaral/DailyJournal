<?php
// ===== START SESSION =====
session_start();

// ===== HEADERS =====
header("Content-Type: application/json");

// ===== DATABASE CONNECTION =====
$conn = new mysqli("localhost", "root", "", "daily_journal");

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit;
}

// ===== GET ACTION =====
$action = $_GET['action'] ?? "";

// ================= SIGNUP =================
if ($action === "signup") {

    $name = trim($_POST['name'] ?? "");
    $email = trim($_POST['email'] ?? "");
    $password = $_POST['password'] ?? "";

    // ===== VALIDATION =====
    if (!$name || !$email || !$password) {
        echo json_encode([
            "success" => false,
            "message" => "All fields are required"
        ]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid email format"
        ]);
        exit;
    }

    if (strlen($password) < 8) {
        echo json_encode([
            "success" => false,
            "message" => "Password must be at least 8 characters"
        ]);
        exit;
    }

    // ===== CHECK EMAIL EXISTS =====
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo json_encode([
            "success" => false,
            "message" => "Email already registered"
        ]);
        exit;
    }

    // ===== PASSWORD HASH =====
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // ===== INSERT USER (ONLY BASIC FIELDS) =====
    $stmt = $conn->prepare("
        INSERT INTO users (name, email, password) 
        VALUES (?, ?, ?)
    ");

    $stmt->bind_param("sss", $name, $email, $hashedPassword);

    if ($stmt->execute()) {

        $userId = $stmt->insert_id;

        // ===== CREATE DEFAULT USER SETTINGS =====
        $settingsStmt = $conn->prepare("
            INSERT INTO user_settings (user_id) VALUES (?)
        ");
        $settingsStmt->bind_param("i", $userId);
        $settingsStmt->execute();

        // ===== CREATE STREAK RECORD =====
        $streakStmt = $conn->prepare("
            INSERT INTO streaks (user_id) VALUES (?)
        ");
        $streakStmt->bind_param("i", $userId);
        $streakStmt->execute();

        echo json_encode([
            "success" => true,
            "message" => "Signup successful"
        ]);

    } else {
        echo json_encode([
            "success" => false,
            "message" => "Signup failed"
        ]);
    }

    exit;
}
//

// ================= LOGIN =================
if ($action === "login") {

    $data = json_decode(file_get_contents("php://input"), true);

    $email = trim($data['email'] ?? "");
    $password = $data['password'] ?? "";

    // ===== VALIDATION =====
    if (!$email || !$password) {
        echo json_encode([
            "success" => false,
            "message" => "Email and password required"
        ]);
        exit;
    }

    // ===== GET USER =====
    $stmt = $conn->prepare("
        SELECT id, name, password FROM users WHERE email = ?
    ");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
        exit;
    }

    $user = $result->fetch_assoc();

    // ===== VERIFY PASSWORD =====
    if (password_verify($password, $user['password'])) {

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];

        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "user" => [
                "id" => $user['id'],
                "name" => $user['name']
            ]
        ]);

    } else {
        echo json_encode([
            "success" => false,
            "message" => "Incorrect password"
        ]);
    }

    exit;
}
//

// ================= FUTURE: UPDATE PROFILE =================
// (You’ll use this later when you build profile tab)
/*
if ($action === "updateProfile") {

    if (!isset($_SESSION['user_id'])) {
        echo json_encode([
            "success" => false,
            "message" => "Unauthorized"
        ]);
        exit;
    }

    $userId = $_SESSION['user_id'];

    $dob = $_POST['dob'] ?? null;
    $gender = $_POST['gender'] ?? null;

    // ===== PROFILE PIC =====
    $profilePicPath = null;

    if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === 0) {

        $allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

        if (!in_array($_FILES['profile_pic']['type'], $allowedTypes)) {
            echo json_encode([
                "success" => false,
                "message" => "Invalid image type"
            ]);
            exit;
        }

        if ($_FILES['profile_pic']['size'] > 2 * 1024 * 1024) {
            echo json_encode([
                "success" => false,
                "message" => "Image must be less than 2MB"
            ]);
            exit;
        }

        $uploadDir = "uploads/profile/";

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $fileName = "user_" . $userId . "_" . time() . ".jpg";
        $targetFile = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES["profile_pic"]["tmp_name"], $targetFile)) {
            $profilePicPath = $targetFile;
        }
    }

    // ===== UPDATE QUERY =====
    if ($profilePicPath) {
        $stmt = $conn->prepare("
            UPDATE users SET dob = ?, gender = ?, profile_pic = ? WHERE id = ?
        ");
        $stmt->bind_param("sssi", $dob, $gender, $profilePicPath, $userId);
    } else {
        $stmt = $conn->prepare("
            UPDATE users SET dob = ?, gender = ? WHERE id = ?
        ");
        $stmt->bind_param("ssi", $dob, $gender, $userId);
    }

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Profile updated"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Update failed"
        ]);
    }

    exit;
}
*/
if ($action === "updateProfile") {

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["success" => false, "message" => "Unauthorized"]);
        exit;
    }

    $userId = $_SESSION['user_id'];

    $name = $_POST['name'] ?? "";
    $email = $_POST['email'] ?? "";
    $dob = $_POST['dob'] ?? null;
    $gender = $_POST['gender'] ?? null;

    $currentPassword = $_POST['current_password'] ?? "";
    $newPassword = $_POST['new_password'] ?? "";

    // ===== EMAIL CHECK =====
    $check = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
    $check->bind_param("si", $email, $userId);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Email already in use"]);
        exit;
    }

    // ===== PASSWORD CHANGE =====
    $passwordQuery = "";
    $params = [];
    $types = "";

    if ($currentPassword && $newPassword) {

        $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $user = $stmt->get_result()->fetch_assoc();

        if (!password_verify($currentPassword, $user['password'])) {
            echo json_encode(["success" => false, "message" => "Current password incorrect"]);
            exit;
        }

        $hashed = password_hash($newPassword, PASSWORD_DEFAULT);
        $passwordQuery = ", password = ?";
        $params[] = $hashed;
        $types .= "s";
    }

    // ===== PROFILE PIC =====
    $profilePicPath = null;

    if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === 0) {

        $uploadDir = "uploads/profile/";
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        $fileName = "user_" . $userId . "_" . time() . ".jpg";
        $target = $uploadDir . $fileName;

        move_uploaded_file($_FILES["profile_pic"]["tmp_name"], $target);
        $profilePicPath = $target;
    }

    // ===== FINAL QUERY =====
    $query = "UPDATE users SET name=?, email=?, dob=?, gender=?";

    $typesFinal = "ssss";
    $paramsFinal = [$name, $email, $dob, $gender];

    if ($profilePicPath) {
        $query .= ", profile_pic=?";
        $typesFinal .= "s";
        $paramsFinal[] = $profilePicPath;
    }

    if ($passwordQuery) {
        $query .= $passwordQuery;
        $typesFinal .= $types;
        $paramsFinal = array_merge($paramsFinal, $params);
    }

    $query .= " WHERE id=?";
    $typesFinal .= "i";
    $paramsFinal[] = $userId;

    $stmt = $conn->prepare($query);
    $stmt->bind_param($typesFinal, ...$paramsFinal);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Profile updated"]);
    } else {
        echo json_encode(["success" => false, "message" => "Update failed"]);
        exit;
    }

    exit;
}

// ================= DASHBOARD =================

// ================= GET USER =================
if ($action === "getUser") {

    if (!isset($_SESSION['user_id'])) {
        echo json_encode([
            "success" => false,
            "message" => "Not logged in"
        ]);
        exit;
    }

    $userId = $_SESSION['user_id'];

    // GET USER INFO
    $stmt = $conn->prepare("SELECT name, email, dob, gender, profile_pic FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    // GET STREAK
    $stmt2 = $conn->prepare("
        SELECT current_streak FROM streaks WHERE user_id = ?
    ");
    $stmt2->bind_param("i", $userId);
    $stmt2->execute();
    $streak = $stmt2->get_result()->fetch_assoc();

    echo json_encode([
        "success" => true,
        "user" => $user,
        "streak" => $streak
    ]);

    exit;
}

// ================= ENTRIES ==================

// ================= SAVE ENTRY =================
/*
if ($action === "saveEntry") {

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["success" => false]);
        exit;
    }

    $userId = $_SESSION['user_id'];
    /* $date = date("Y-m-d"); */
    /*
    $date = $_POST['entry_date'] ?? date("Y-m-d");

    if (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $date)) {
    echo json_encode(["success" => false, "message" => "Invalid date"]);
    exit;
    }

    // 🌙 Sleep
    $wake_time = $_POST['wake_time'] ?? null;
    $sleep_duration = $_POST['sleep_duration'] ?? null;
    $sleep_quality = $_POST['sleep_quality'] ?? null;

    // 😊 Mood
    $mood = $_POST['mood'] ?? null;
    $rating = $_POST['rating'] ?? null;

    // 💧 Health
    $water_intake = $_POST['water_intake'] ?? 0;

    // 🍽️ Meals
    $breakfast = $_POST['breakfast'] ?? 0;
    $breakfast_rating = $_POST['breakfast_rating'] ?? null;
    $breakfast_note = $_POST['breakfast_note'] ?? null;

    $lunch = $_POST['lunch'] ?? 0;
    $lunch_rating = $_POST['lunch_rating'] ?? null;
    $lunch_note = $_POST['lunch_note'] ?? null;

    $dinner = $_POST['dinner'] ?? 0;
    $dinner_rating = $_POST['dinner_rating'] ?? null;
    $dinner_note = $_POST['dinner_note'] ?? null;

    // 🏃 Exercise
    $exercise_duration = $_POST['exercise_duration'] ?? null;
    $exercise_type = $_POST['exercise_type'] ?? null;

    // 🎯 Activities
    $activities = $_POST['activities'] ?? null;
    $custom_activity = $_POST['custom_activity'] ?? null;

    // 🙏 Gratitude
    $gratitude1 = $_POST['gratitude1'] ?? null;
    $gratitude2 = $_POST['gratitude2'] ?? null;
    $gratitude3 = $_POST['gratitude3'] ?? null;

    // ✍️ Journal
    $journal_text = $_POST['journal_text'] ?? null;
    $daily_prompt = $_POST['daily_prompt'] ?? null;

    // 🖼️ Image
    $imagePath = null;

    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {

        $uploadDir = "uploads/entries/";
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        $fileName = "entry_" . $userId . "_" . time() . ".jpg";
        $target = $uploadDir . $fileName;

        move_uploaded_file($_FILES["image"]["tmp_name"], $target);
        $imagePath = $target;
    }

    // CHECK EXISTING ENTRY
    $check = $conn->prepare("
        SELECT id, image_path FROM entries 
        WHERE user_id=? AND entry_date=?
    ");
    $check->bind_param("is", $userId, $date);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows > 0) {

        $existing = $result->fetch_assoc();

        if (!$imagePath) {
            $imagePath = $existing['image_path'];
        }

        //UPDATE
        $stmt = $conn->prepare("UPDATE entries SET wake_time=?, sleep_duration=?, sleep_quality=?,
        mood=?, rating=?, water_intake=?, breakfast=?, breakfast_rating=?, breakfast_note=?,lunch=?, 
        lunch_rating=?, lunch_note=?, dinner=?, dinner_rating=?, dinner_note=?, exercise_duration=?, 
        exercise_type=?, activities=?, custom_activity=?, gratitude1=?, gratitude2=?, gratitude3=?,
        journal_text=?, daily_prompt=?, image_path=? WHERE user_id=? AND entry_date=?");
        
        $stmt->bind_param("sdisiiiisssiiissssisssssssi",
        $wake_time, $sleep_duration, $sleep_quality, $mood, $rating, $water_intake, $breakfast,
        $breakfast_rating, $breakfast_note, $lunch, $lunch_rating, $lunch_note, $dinner, $dinner_rating,
        $dinner_note, $exercise_duration, $exercise_type, $activities, $custom_activity, $gratitude1,
        $gratitude2, $gratitude3, $journal_text, $daily_prompt, $imagePath, $userId, $date);
        
        } else {

        // INSERT
        $stmt = $conn->prepare("INSERT INTO entries (user_id, entry_date, wake_time, sleep_duration, 
        sleep_quality, mood, rating, water_intake, breakfast, breakfast_rating, breakfast_note, lunch, 
        lunch_rating, lunch_note, dinner, dinner_rating, dinner_note, exercise_duration, exercise_type, 
        activities, custom_activity, gratitude1, gratitude2, gratitude3, journal_text, daily_prompt,
        image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->bind_param("issdisiiisssiiissssisssssss",
        $userId, $date, $wake_time, $sleep_duration, $sleep_quality, $mood, $rating, $water_intake, 
        $breakfast, $breakfast_rating, $breakfast_note, $lunch, $lunch_rating, $lunch_note, $dinner,
        $dinner_rating, $dinner_note, $exercise_duration, $exercise_type, $activities, $custom_activity,
        $gratitude1, $gratitude2, $gratitude3, $journal_text, $daily_prompt, $imagePath);}
        
        
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode([
            "success" => false,
            "error" => $stmt->error
        ]);
    }

    exit; 
                    }    
*/

if ($action === "saveEntry") {

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["success" => false, "message" => "Unauthorized"]);
        exit;
    }

    $userId = $_SESSION['user_id'];
    $date = $_POST['entry_date'] ?? date("Y-m-d");

    // Validate date
    if (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $date)) {
        echo json_encode(["success" => false, "message" => "Invalid date"]);
        exit;
    }

    // ===== SAFE INPUTS =====
    function val($key, $default = null) {
        return isset($_POST[$key]) && $_POST[$key] !== "" ? $_POST[$key] : $default;
    }

    $wake_time = val("wake_time");
    $sleep_duration = val("sleep_duration");
    $sleep_quality = val("sleep_quality");

    $mood = val("mood");
    $rating = val("rating");

    $water_intake = val("water_intake", 0);

    $breakfast = val("breakfast", 0);
    $breakfast_rating = val("breakfast_rating");
    $breakfast_note = val("breakfast_note");

    $lunch = val("lunch", 0);
    $lunch_rating = val("lunch_rating");
    $lunch_note = val("lunch_note");

    $dinner = val("dinner", 0);
    $dinner_rating = val("dinner_rating");
    $dinner_note = val("dinner_note");

    $exercise_duration = val("exercise_duration");
    $exercise_type = val("exercise_type");

    $activities = val("activities");
    $custom_activity = val("custom_activity");

    $gratitude1 = val("gratitude1");
    $gratitude2 = val("gratitude2");
    $gratitude3 = val("gratitude3");

    $journal_text = val("journal_text");
    $daily_prompt = val("daily_prompt");

    // ===== IMAGE HANDLING =====
    $imagePath = null;

    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {

        $uploadDir = "uploads/entries/";
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        $fileName = "entry_" . $userId . "_" . time() . ".jpg";
        $target = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target)) {
            $imagePath = $target;
        }
    }

    // ===== KEEP OLD IMAGE IF NOT UPDATED =====
    if (!$imagePath) {
        $stmt = $conn->prepare("SELECT image_path FROM entries WHERE user_id=? AND entry_date=?");
        $stmt->bind_param("is", $userId, $date);
        $stmt->execute();
        $res = $stmt->get_result()->fetch_assoc();
        $imagePath = $res['image_path'] ?? null;
    }

    // ===== UPSERT QUERY =====
    $stmt = $conn->prepare("INSERT INTO entries (user_id, entry_date, wake_time, sleep_duration, 
    sleep_quality, mood, rating, water_intake, breakfast, breakfast_rating, breakfast_note, lunch, 
    lunch_rating, lunch_note, dinner, dinner_rating, dinner_note, exercise_duration, exercise_type,
    activities, custom_activity, gratitude1, gratitude2, gratitude3, journal_text, daily_prompt,
    image_path ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
    wake_time=VALUES(wake_time), sleep_duration=VALUES(sleep_duration), sleep_quality=VALUES(sleep_quality),
    mood=VALUES(mood), rating=VALUES(rating), water_intake=VALUES(water_intake), breakfast=VALUES(breakfast),
    breakfast_rating=VALUES(breakfast_rating), breakfast_note=VALUES(breakfast_note), lunch=VALUES(lunch),
    lunch_rating=VALUES(lunch_rating), lunch_note=VALUES(lunch_note), dinner=VALUES(dinner),
    dinner_rating=VALUES(dinner_rating), dinner_note=VALUES(dinner_note), exercise_duration=VALUES(exercise_duration),
    exercise_type=VALUES(exercise_type), activities=VALUES(activities), custom_activity=VALUES(custom_activity),
    gratitude1=VALUES(gratitude1), gratitude2=VALUES(gratitude2), gratitude3=VALUES(gratitude3),
    journal_text=VALUES(journal_text),daily_prompt=VALUES(daily_prompt), image_path=VALUES(image_path)");

    $stmt->bind_param("issssssiiisssiiissssissssss",
    $userId, $date, $wake_time, $sleep_duration, $sleep_quality, $mood, $rating, $water_intake, $breakfast,
    $breakfast_rating, $breakfast_note, $lunch, $lunch_rating, $lunch_note, $dinner, $dinner_rating, 
    $dinner_note, $exercise_duration, $exercise_type, $activities, $custom_activity, $gratitude1,
    $gratitude2, $gratitude3, $journal_text, $daily_prompt, $imagePath );

    if ($stmt->execute()) {
        // ===== UPDATE STREAK =====
        updateStreak($conn, $userId, $date);

        echo json_encode(["success" => true]);
    } else {
        echo json_encode([
            "success" => false,
            "error" => $stmt->error
        ]);
    }

    exit;
}

// ================== STREAKS ==================

function updateStreak($conn, $userId, $entryDate) {

    // Get last streak data
    $stmt = $conn->prepare("
        SELECT current_streak, last_entry_date 
        FROM streaks 
        WHERE user_id = ?
    ");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    $currentStreak = $result['current_streak'] ?? 0;
    $lastDate = $result['last_entry_date'] ?? null;

    // Convert dates
    $today = new DateTime($entryDate);

    if ($lastDate) {
        $last = new DateTime($lastDate);
        $diff = $last->diff($today)->days;

        if ($entryDate === $lastDate) {
            // Same day → do nothing (important!)
            return;
        }

        if ($diff === 1) {
            // Continue streak
            $currentStreak++;
        } elseif ($diff > 1) {
            // Missed days → reset
            $currentStreak = 1;
        }
    } else {
        // First ever entry
        $currentStreak = 1;
    }

    // Update DB
    $stmt = $conn->prepare("
        UPDATE streaks 
        SET current_streak = ?, last_entry_date = ?
        WHERE user_id = ?
    ");
    $stmt->bind_param("isi", $currentStreak, $entryDate, $userId);
    $stmt->execute();
}

// ================== STREAKS ==================

// ================= SAVE ENTRY =================

// ================= GET ALL ENTRIES =================

if ($action === "getEntries") {

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["success" => false]);
        exit;
    }

    $userId = $_SESSION['user_id'];

    $stmt = $conn->prepare("
        SELECT 
            id,
            entry_date,
            mood,
            rating,
            water_intake
        FROM entries
        WHERE user_id=?
        ORDER BY entry_date DESC
    ");

    $stmt->bind_param("i", $userId);
    $stmt->execute();

    $result = $stmt->get_result();
    $entries = [];

    while ($row = $result->fetch_assoc()) {
        $entries[] = $row;
    }

    echo json_encode([
        "success" => true,
        "entries" => $entries
    ]);
    exit;
}

// ================= GET ALL ENTRIES =================

// ================= GET SINGLE ENTRY =================

if ($action === "getEntry") {

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["success" => false]);
        exit;
    }

    $userId = $_SESSION['user_id'];
    $id = $_GET['id'] ?? 0;

    $stmt = $conn->prepare("
        SELECT * FROM entries 
        WHERE id=? AND user_id=?
    ");

    $stmt->bind_param("ii", $id, $userId);
    $stmt->execute();

    $entry = $stmt->get_result()->fetch_assoc();

    echo json_encode([
        "success" => true,
        "entry" => $entry
    ]);
    exit;
}

// ================= GET SINGLE ENTRY =================

// ================= DELETE ENTRY =================

if ($action === "deleteEntry") {

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["success" => false]);
        exit;
    }

    $userId = $_SESSION['user_id'];
    $id = $_POST['id'];

    $stmt = $conn->prepare("
        DELETE FROM entries WHERE id=? AND user_id=?
    ");

    $stmt->bind_param("ii", $id, $userId);

    echo json_encode([
        "success" => $stmt->execute()
    ]);
    exit;
}

// ================= DELETE ENTRY =================

// ================= ENTRIES ==================

// ================= GET INSIGHTS DATA =================
if ($action === "getInsightsData") {

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["success" => false]);
        exit;
    }

    $userId = $_SESSION['user_id'];

    $stmt = $conn->prepare("
    SELECT 
        entry_date,
        mood,
        sleep_duration,
        sleep_quality,
        rating,
        breakfast,
        lunch,
        dinner
    FROM entries
    WHERE user_id = ?
    ORDER BY entry_date ASC
");

    $stmt->bind_param("i", $userId);
    $stmt->execute();

    $result = $stmt->get_result();
    $entries = [];

    while ($row = $result->fetch_assoc()) {
        $entries[] = $row;
    }

    echo json_encode([
        "success" => true,
        "entries" => $entries
    ]);
    exit;
}
// ================= GET INSIGHTS DATA =================

// ================= LOGOUT =================
if ($action === "logout") {
    session_destroy();

    echo json_encode([
        "success" => true
    ]);

    exit;
}
// ================= LOGOUT =================

// ===== INVALID REQUEST =====

echo json_encode([
    "success" => false,
    "message" => "Invalid request"
]);
exit;

// ===== INVALID REQUEST =====

// ================= DASHBOARD =================
