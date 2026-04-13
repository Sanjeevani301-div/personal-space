from flask import Flask, render_template, request, redirect, url_for, session, flash
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'supersecretkey'

# Initialize DB
def init_db():
    conn = sqlite3.connect('diary.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT,
                        email TEXT UNIQUE,
                        password TEXT)''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS entries (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER,
                        content TEXT,
                        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = generate_password_hash(request.form['password'])
        
        try:
            conn = sqlite3.connect('diary.db')
            cursor = conn.cursor()
            cursor.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", 
                           (name, email, password))
            conn.commit()
            conn.close()
            flash("Signup successful! Please log in.", "success")
            return redirect(url_for('login'))
        except:
            flash("Email already exists. Try logging in.", "danger")
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        conn = sqlite3.connect('diary.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email=?", (email,))
        user = cursor.fetchone()
        conn.close()
        
        if user and check_password_hash(user[3], password):
            session['user_id'] = user[0]
            session['user'] = user[1]
            return redirect(url_for('diary'))
        else:
            flash("Invalid email or password", "danger")
    return render_template('login.html')

@app.route('/diary', methods=['GET', 'POST'])
def diary():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    conn = sqlite3.connect('diary.db')
    cursor = conn.cursor()
    
    if request.method == 'POST':
        content = request.form['content']
        cursor.execute("INSERT INTO entries (user_id, content) VALUES (?, ?)", 
                       (session['user_id'], content))
        conn.commit()
    
    cursor.execute("SELECT * FROM entries WHERE user_id=? ORDER BY date DESC", 
                   (session['user_id'],))
    entries = cursor.fetchall()
    conn.close()
    
    return render_template('diary.html', entries=entries, user=session['user'])

@app.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit(id):
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    conn = sqlite3.connect('diary.db')
    cursor = conn.cursor()
    
    if request.method == 'POST':
        content = request.form['content']
        cursor.execute("UPDATE entries SET content=? WHERE id=? AND user_id=?", 
                       (content, id, session['user_id']))
        conn.commit()
        conn.close()
        return redirect(url_for('diary'))
    
    cursor.execute("SELECT content FROM entries WHERE id=? AND user_id=?", (id, session['user_id']))
    entry = cursor.fetchone()
    conn.close()
    
    return render_template('edit.html', entry=entry)

@app.route('/delete/<int:id>', methods=['GET', 'POST'])
def delete(id):
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    conn = sqlite3.connect('diary.db')
    cursor = conn.cursor()
    cursor.execute("DELETE FROM entries WHERE id=? AND user_id=?", (id, session['user_id']))
    conn.commit()
    conn.close()
    
    return redirect(url_for('diary'))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

@app.route('/games')
def games():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('games.html', user=session['user'])

if __name__ == "__main__":
    app.run(debug=True)
