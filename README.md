# DailyJournal


# 📔 Daily Journal

A comprehensive daily journaling web application that helps users track their mood, sleep, meals, exercise, and overall well-being. Built with HTML, CSS, JavaScript, and PHP with MySQL database.

## ✨ Features

### 🔐 Authentication
- User registration with password validation (minimum 8 characters, uppercase & number required)
- Secure login with password hashing
- Session management
- Password reset via OTP (with email support)

### 📊 Dashboard
- Personalized greeting based on time of day
- Streak tracking (consecutive journal entries)
- Interactive calendar view showing journal entries by date
- Mood-based color coding and emoji indicators on calendar

### ✍️ Journal Entry
- Sleep tracking (wake time, duration, quality)
- Mood selection with emojis
- Daily rating (1-10)
- Water intake tracking
- Meal logging with ratings and notes (Breakfast, Lunch, Dinner)
- Exercise duration and type
- Activity checkboxes (Movie, Reading, Travel, Social) + custom activity
- Gratitude section (3 things)
- Journal text and daily prompt
- Image upload for entries

### 👤 Profile Management
- Update personal information (name, email, DOB, gender)
- Profile picture upload
- Change password with current password verification

### 📈 Insights & Analytics
- Mood distribution chart (doughnut)
- Sleep duration trend line chart
- Sleep quality trend (1-5 scale)
- Mood vs Sleep correlation bar chart
- Mood vs Meals per day correlation

### 🔄 Additional Features
- Logout functionality
- Responsive design for mobile and tablet
- Blur background effects on auth pages
- Modern, clean UI with custom color scheme

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: PHP 
- **Database**: MySQL
- **Charts**: Chart.js
- **Icons**: Emojis and Images

## 📁 Database Schema

## 📂 Project Structure

daily-journal/
├── backend.php          # Main backend API handler
├── logic.js             # Frontend JavaScript logic
├── style.css            # Stylesheet
├── index.html           # Landing page
├── login.html           # Login page
├── signup.html          # Registration page
├── dashboard.html       # User dashboard
├── entry.html           # Journal entry form
├── profile.html         # Profile management
├── insights.html        # Analytics and charts
├── forgot-password.html # Password reset request
├── uploads/
│   ├── profile/         # Profile pictures
│   └── entries/         # Entry images
└── logo_img/            # Background images and Logos

## 🚀 Installation

1. Clone the repository

git clone https://github.com/yourusername/daily-journal.git

2. Move to your web server directory

- XAMPP: htdocs/
- WAMP: www/
- MAMP: htdocs/

3. Import the database

- Open phpMyAdmin
- Create a database named daily_journal
- Run the SQL schema queries

4. Configure database connection

- Edit backend.php
- Update database credentials if needed:

$conn = new mysqli("localhost", "root", "", "daily_journal");

5. Set up directories

- Create uploads/profile/ and uploads/entries/ folders
- Set proper write permissions (755 or 777)

6. Configure email (for OTP)

- Update mail configuration in backend.php (sendOTP action)
- For local testing, OTP will appear in console/browser

7. Access the application

Open browser and navigate to http://localhost/daily-journal/

## 📱 Usage

- Create an account - Sign up with name, email, and password
- Login - Access your dashboard
- Write entries - Click on any calendar date to write/edit journal
- Track progress - View insights to analyze patterns
- Update profile - Add photo and personal details
- Reset password - Use forgot password with OTP

## 🔒 Security Features

- Password hashing using password_hash() and password_verify()
- Prepared statements to prevent SQL injection
- Session-based authentication
- OTP expiration (5 minutes validity)
- File upload validation (image types, size limits)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920x1080 and above)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667 and above)

## 🎨 Color Scheme

- Main Background: #F2EEEC
- Card Background: #EBE3E0
- Section Background: #E6D7C8
- Accent Color: #D5B2A7
- Border Color: #CEC6C2
- Primary Text: #5E514A
- Secondary Text: #A38F85

## 📄 License

This project is open source and available under the MIT License.
