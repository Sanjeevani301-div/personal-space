🌸 Personal Space Diary

A beautifully designed personal diary web application built using Flask, where users can express their thoughts, track moods, and enjoy relaxing mini-games — all wrapped in a dreamy pastel aesthetic.

---

## ✨ Overview

Personal Space is more than just a diary — it's a safe, calming digital space designed with a soft, premium UI. Users can securely write and manage their thoughts, track emotional states, and take breaks with interactive mini-games.

---

## 🏗️ Tech Stack

- **Backend:** Python (Flask)
- **Database:** SQLite
- **Authentication:** Werkzeug Password Hashing
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Fonts:** Google Fonts (Playfair Display, Nunito)

---

## 🎨 UI/UX Features

- 🌈 Pastel gradient aesthetic (pink → lavender → mint)
- 🫧 Glassmorphism UI with blur effects
- ✨ Floating emoji stickers & animated particles
- 💫 Micro-interactions and smooth animations
- 📜 Scroll-snap landing page with section indicators
- 🎀 Custom scrollbar styling

---

## 📄 Pages & Functionalities

### 🏠 Landing Page

- Single scroll layout with 4 sections:
  - Hero section with animated elements
  - Features showcase with glass cards
  - Mini-games preview section
  - Call-to-action section
- Sticky glass header and navigation dots
- Scroll-triggered animations using IntersectionObserver

---

### 🔐 Authentication

- Secure Sign Up & Login system
- Password hashing using Werkzeug
- Flash messages with auto-dismiss animations

---

### 📖 Diary Dashboard

- Two-column layout (Sidebar + Main content)

#### Sidebar includes:
- User avatar
- Entry & word count stats
- Mood emoji picker 😊💖🌙✨🌸🥺
- Daily inspirational quote
- Quick access to mini-games

#### Main Features:
- Create new diary entries
- Emoji toolbar for expressive writing
- Live word & character counter
- Entry cards with:
  - Date & content preview
  - Read More / Show Less toggle
  - Hover-based Edit & Delete options

---

### ✏️ Edit Entry

- Update existing entries
- Live character tracking
- Smooth UI with Save / Cancel options

---

### 🎮 Mini-Games

Accessible from both diary and dedicated games page.

#### ⭐ Star Catcher
- Catch falling stars using keyboard or mouse
- Increasing difficulty over time
- Particle effects and score tracking

#### 🌸 Memory Bloom
- 4×4 card matching game
- Tracks moves and time
- Smooth 3D flip animations

#### 🫧 Bubble Pop
- Pop bubbles within 30 seconds
- Score-based ranking system
- Fun burst animations

---

## 🗄️ Database Schema

### Users Table

| Field    | Type           |
|----------|---------------|
| id       | Integer (PK)  |
| name     | Text          |
| email    | Text (Unique) |
| password | Hashed Text   |

### Entries Table

| Field     | Type          |
|-----------|--------------|
| id        | Integer (PK) |
| user_id   | Integer (FK) |
| content   | Text         |
| timestamp | DateTime     |

---

## 🔧 Flask Routes

| Route        | Method    | Description              |
|--------------|----------|--------------------------|
| `/`          | GET      | Landing page             |
| `/signup`    | GET/POST | Register new user        |
| `/login`     | GET/POST | Login user               |
| `/diary`     | GET/POST | View & add entries       |
| `/edit/<id>` | GET/POST | Edit entry               |
| `/delete/<id>` | POST   | Delete entry             |
| `/games`     | GET      | Mini-games page          |
| `/logout`    | GET      | Logout user              |

---

## 🔒 Security Features

- Password hashing with Werkzeug
- Session-based authentication
- Protected routes for logged-in users only
- Users can access only their own entries

---

## 🚀 How to Run

```bash
# Clone the repository
git clone https://github.com/your-username/personal-space-diary.git

# Navigate to project folder
cd personal-space-diary

# Install dependencies
pip install flask

# Run the app
python app.py
```
🌟 Future Improvements
🌙 Dark mode toggle
☁️ Cloud database integration
🤖 AI-based mood analysis
🔔 Daily reminders & notifications
📄 Export diary entries (PDF)
💖 Inspiration

This project is inspired by the idea of creating a safe, beautiful digital space where users can express themselves freely while enjoying a calming and interactive experience.

👩‍💻 Author

Sanjeevani G. Dhumake
