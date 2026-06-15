# DailyJournal


# 📔 Daily Journal

A comprehensive daily journaling web application that helps users track their mood, sleep, meals, exercise, and overall well-being. Built with HTML, CSS, JavaScript, and PHP with MySQL database.

## ✨ Features

### Landing Page

**Landing Page**
<img width="1333" height="529" alt="image" src="https://github.com/user-attachments/assets/ce29934a-0ff3-42d8-b73f-cc5cdafb4989" />
<img width="1331" height="467" alt="image" src="https://github.com/user-attachments/assets/d6bf3669-de1a-47d8-a0f4-120f163c2250" />

### 🔐 Authentication
- User registration with password validation (minimum 8 characters, uppercase & number required)
- Secure login with password hashing
- Session management

**Login Page**
<img width="1365" height="599" alt="image" src="https://github.com/user-attachments/assets/a9166ca5-a5cf-49f7-9cb3-d6d8175e3804" />

**Signup Page**
<img width="1365" height="600" alt="image" src="https://github.com/user-attachments/assets/8f16d2fd-78b6-4b9e-9c31-e6a6905c15f7" />

### 📊 Dashboard
- Personalized greeting based on time of day
- Streak tracking (consecutive journal entries)
- Interactive calendar view showing journal entries by date
- Mood-based color coding and emoji indicators on calendar

**Dashboard**
<img width="1344" height="637" alt="image" src="https://github.com/user-attachments/assets/28babe0b-68a2-4507-b937-40a0fb02c845" />
<img width="1339" height="634" alt="image" src="https://github.com/user-attachments/assets/8fdf12f2-fcbd-40be-b52d-9fcd62b42722" />

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

**Journal Entry**
<img width="1339" height="636" alt="image" src="https://github.com/user-attachments/assets/71a6eef2-f022-4256-8f51-0ee04fa3bd5f" />
<img width="1333" height="634" alt="image" src="https://github.com/user-attachments/assets/c05cece1-13f2-4e25-a84a-3d7e163f3072" />
<img width="1335" height="633" alt="image" src="https://github.com/user-attachments/assets/68791531-45b2-4561-a50c-a54358ab6f7a" />
<img width="1337" height="338" alt="image" src="https://github.com/user-attachments/assets/73bb1482-9dce-4f3b-9e30-69a8d4d73e2f" />

### 👤 Profile Management
- Update personal information (name, email, DOB, gender)
- Profile picture upload
- Change password with current password verification

**Profile**
<img width="1338" height="632" alt="image" src="https://github.com/user-attachments/assets/6905c7e5-fa36-4c0b-82b5-2ce27134cc0a" />
<img width="1344" height="393" alt="image" src="https://github.com/user-attachments/assets/b6e173e4-7a6d-4e0d-9b84-ccefc0c79d2a" />

### 📈 Insights & Analytics
- Mood distribution chart (doughnut)
- Sleep duration trend line chart
- Sleep quality trend (1-5 scale)
- Mood vs Sleep correlation bar chart
- Mood vs Meals per day correlation

**Insights**
<img width="1335" height="610" alt="image" src="https://github.com/user-attachments/assets/c656a0fc-f848-4f93-87b0-fafc61bd5114" />
<img width="1330" height="603" alt="image" src="https://github.com/user-attachments/assets/1c81d0b0-253b-4174-9c37-fa8c981f31b0" />

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

```
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
```

## 🚀 Installation

1. Clone the repository

git clone https://github.com/manasvitaral/DailyJournal.git

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
