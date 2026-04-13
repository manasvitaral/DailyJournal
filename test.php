<?php
$conn = new mysqli("localhost", "root", "", "daily_journal");
if ($conn->connect_error) {
    die("Failed: " . $conn->connect_error);
}
echo "Connected successfully!";