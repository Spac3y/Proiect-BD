from dotenv import load_dotenv
from flask import Flask, request, jsonify, session, render_template
from flask_cors import CORS
import pymysql
import pymysql.cursors
pymysql.install_as_MySQLdb()
import os

load_dotenv()

app = Flask(__name__)
app.config['MYSQL_HOST']     = os.getenv('MYSQL_HOST')
app.config['MYSQL_PORT']     = os.getenv('MYSQL_PORT')
app.config['MYSQL_USER']     = os.getenv('MYSQL_USER')
app.config['MYSQL_DB']       = os.getenv('MYSQL_DB')
app.config['SECRET_KEY']     = os.getenv('SECRET_KEY')

CORS(app, supports_credentials=True)
db_config = {
	'host':     os.getenv('MYSQL_HOST', 'localhost'),
	'port':     int(os.getenv('MYSQL_PORT', 3306)),
	'user':     os.getenv('MYSQL_USER', 'root'),
	'password': os.getenv('MYSQL_PASSWORD', ''),
	'database': os.getenv('MYSQL_DB', 'magazin_rochii'),
	'cursorclass': pymysql.cursors.DictCursor
}

def db():
	conn = pymysql.connect(**db_config)
	return conn

# serve frontend files
@app.route('/')
def index():
	return render_template('index.html');

@app.route('/shop')
def shop():
	return render_template('shop.html')

@app.route('/contact')
def contact():
	return render_template('contact.html')

@app.route('/admin')
def admin():
	return render_template('admin.html')


@app.route('/api/produse')
def get_produse():
	conn = db()
	with conn.cursor() as cur:
		cur.execute("""
			SELECT p.id_produs, p.nume, p.pret, p.stoc, p.marime, p.descriere, p.imagine_url, c.nume_categorie
			FROM Produse p LEFT JOIN Categorii c ON p.id_categorie = c.id_categorie
		""")
		rows = cur.fetchall()
	conn.close()
	return jsonify(rows)

@app.route('/api/produs/<int:id>')
def get_produs(id):
	conn = db()
	with conn.cursor() as cur:
		cur.execute("""
			SELECT p.*, c.nume_categorie
			FROM Produse p LEFT JOIN Categorii c ON p.id_categorie = c.id_categorie
			WHERE p.id_produs = %s
		""", (id,))
		row = cur.fetchone()
	conn.close()
	return jsonify(row) if row else (jsonify({'error': 'Not found'}), 404)

@app.route('/api/comanda', methods=['POST'])
def post_comanda():
	d = request.get_json()
	nume, telefon, adresa = d.get('nume','').strip(), d.get('telefon','').strip(), d.get('adresa','').strip()
	id_produs, cantitate  = d.get('id_produs'), int(d.get('cantitate', 1))

	if not all([nume, telefon, adresa, id_produs]):
		return jsonify({'error': 'All fields required'}), 400

	conn = db()
	with conn.cursor() as cur:
		cur.execute("SELECT pret, stoc FROM Produse WHERE id_produs=%s", (id_produs,))
		p = cur.fetchone()
		if not p or cantitate < 1 or cantitate > p['stoc']:
			cur.close()
			return jsonify({'error': 'Invalid quantity or product'}), 400

		total = float(p['pret']) * cantitate
		cur.execute("INSERT INTO Clienti (nume, telefon, adresa) VALUES (%s,%s,%s)", (nume, telefon, adresa))
		id_client = cur.lastrowid
		cur.execute("INSERT INTO Comenzi (id_client, total) VALUES (%s,%s)", (id_client, total))
		id_comanda = cur.lastrowid
		cur.execute("INSERT INTO Detalii_Comanda (id_comanda,id_produs,id_client,cantitate,pret_unitar) VALUES (%s,%s,%s,%s,%s)",
					(id_comanda, id_produs, id_client, cantitate, p['pret']))
		cur.execute("UPDATE Produse SET stoc=stoc-%s WHERE id_produs=%s", (cantitate, id_produs))
		conn.commit()
	conn.close()
	return jsonify({'success': True, 'id_comanda': id_comanda, 'total': total})

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
	d = request.get_json()
	conn = db()
	check = False
	with conn.cursor() as cur:
		cur.execute("SELECT * FROM Admini WHERE username=%s AND parola=%s", (d.get('username'), d.get('parola')))
		admin = cur.fetchone()
		if admin: check = True
	conn.close()
	if check:
		session['admin'] = d['username']
		return jsonify({'success': True, 'username': d['username']})
	return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/admin/logout', methods=['POST'])
def admin_logout():
	session.clear()
	return jsonify({'success': True})

@app.route('/api/admin/comenzi')
def admin_comenzi():
	if not session.get('admin'):
		return jsonify({'error': 'Unauthorized'}), 401
	conn = db()
	with conn.cursor() as cur:
		cur.execute("""
			SELECT co.id_comanda, co.data_comanda, co.status, co.total,
				cl.nume AS client_nume, cl.telefon, cl.adresa,
				p.nume AS produs_nume, d.cantitate, d.pret_unitar
			FROM Comenzi co
			JOIN Clienti cl ON co.id_client=cl.id_client
			JOIN Detalii_Comanda d ON d.id_comanda=co.id_comanda
			JOIN Produse p ON p.id_produs=d.id_produs
			ORDER BY co.data_comanda DESC
		""")
		rows = cur.fetchall()
	conn.close()
	for r in rows:
		r['data_comanda'] = r['data_comanda'].strftime('%d.%m.%Y %H:%M')
	return jsonify(rows)

if __name__ == '__main__':
	app.run(debug=True, port=5111)
