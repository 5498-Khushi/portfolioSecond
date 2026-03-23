from flask import Flask, jsonify, render_template, request
from flask_mysqldb import MySQL
import os

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'mysql.railway.internal'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'ErhrLqbGSaPOxBCRDyKHwbtUaLgudnfm'
app.config['MYSQL_DB'] = 'railway'
app.config['MYSQL_PORT'] = 3306

mysql = MySQL(app)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/certifications")
def get_certifications():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM certifications")
    rows = cur.fetchall()

    result = []
    for r in rows:
        result.append({
            "id": r[0],
            "name": r[1],
            "platform": r[2],
            "image": r[3]
        })

    return jsonify(result)

@app.route('/api/contact', methods=['POST'])
def save_contact():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not name or not email or not message:
            return jsonify({'success': False, 'error': 'All fields required'})

        cur = mysql.connection.cursor()
        cur.execute(
            "INSERT INTO contact_messages (name,email,message) VALUES (%s,%s,%s)",
            (name,email,message)
        )
        mysql.connection.commit()
        cur.close()

        return jsonify({'success': True})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})
