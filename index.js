const dotenv = require("dotenv");
dotenv.config();

const mysql = require("mysql2");
const cors = require("cors");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const https = require("https");
const httpProxy = require("http-proxy");

// Ustawienie CORS dla całej aplikacji

app.use(cors({
  origin: ["https://sprightly-tulumba-2baacf.netlify.app"], // Specyfikowanie dozwolonych originów
}));

// Obsługa zapytań OPTIONS dla konkretnego endpointu
app.options("/register", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*"); // Dozwolone wszystkie originy
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.send();
});

app.options("/odbierzDane", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*"); // Dozwolone wszystkie originy
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.send();
});

// Obsługa proxy dla zewnętrznego zasobu
app.use("/proxy", (req, res) => {
  const url = "https://intake-app-server-production.up.railway.app" + req.url;
  req.pipe(request(url)).pipe(res);
});

app.post("/odbierzDane", (req, res) => {
  const receivedData = req.body.data; // Odebranie danych z zapytania
  console.log("Otrzymane dane:", receivedData);

  // Tutaj możesz przetwarzać dane i wykonywać odpowiednie działania

  const responseMessage = "Dane odebrane pomyślnie"; // Odpowiedź do frontendu
  res.status(200).json({ message: responseMessage });
});
// const proxy = httpProxy.createProxyServer();
// app.options('/register', (req, res) => {
// 	res.header('Access-Control-Allow-Origin', 'https://sprightly-tulumba-2baacf.netlify.app');
// 	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
// 	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
// 	res.send(); // Odpowiedź pusta dla zapytań OPTIONS
//   });
// app.use(cors({
//   origin: 'https://sprightly-tulumba-2baacf.netlify.app',
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'application/json'],

//   credentials: true,
// }));

// app.use('/test', (req, res) => {
//   proxy.web(req, res, { target: 'https://sprightly-tulumba-2baacf.netlify.app' });
// });
// app.get('/test', (req, res) => {
// 	const testUrl = 'https://sprightly-tulumba-2baacf.netlify.app';
  
// 	https.get(testUrl, (response) => {
// 	  let data = '';
  
// 	  response.on('data', (chunk) => {
// 		data += chunk;
// 	  });
  
// 	  response.on('end', () => {
// 		console.log('Odpowiedź z serwera testUrl:', data);
// 		res.send(data); // Odeślij odpowiedź do klienta Express
// 	  });
// 	}).on('error', (error) => {
// 	  console.error('Błąd podczas połączenia z testUrl:', error);
// 	  res.status(500).send('Błąd podczas pobierania danych'); // Odeślij błąd do klienta Express
// 	});
//   });
// app.use(
// 	'/proxy',
// 	createProxyMiddleware({
// 		target: 'https://sprightly-tulumba-2baacf.netlify.app',
// 		changeOrigin: true,
// 		pathRewrite: {
// 			'^/proxy': '',
// 		},
// 		secure: false, // Jeśli adres docelowy używa HTTPS
// 	})
// );

// Endpoint '/test' w twojej aplikacji serwerowej

// app.use((req, res, next) => {
// 	res.header('Access-Control-Allow-Origin', 'https://nodejsclusters-158150-0.cloudclusters.net');
// 	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
// 	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
// 	res.header('Access-Control-Allow-Credentials', 'true');
// 	next();
//   });
// const db = mysql.createConnection({
// 	host: 'mysql-157993-0.cloudclusters.net',
// 	port: 10039,
// 	user: 'admin',
// 	password: 'AgLEorrf',
// 	database: 'products',
// });
// const db = mysql.createConnection({
// 	host: 'host491364.hostido.net.pl',
// 	// port: 21,
// 	user: 'host491364_products',
// 	password: 'Panpascal69',
// 	database: 'host491364_products',
// });
const db = mysql.createConnection({
	host: 'viaduct.proxy.rlwy.net',
	port: 47341,
	user: 'root',
	password: '4G2BdHHBfC3B214AcBb4cCC4hdD66h1C',
	database: 'railway',
});
db.connect((err) => {
	if (err) {
	  console.error('Błąd podczas nawiązywania połączenia z bazą danych:', err);
	  return;
	}
	console.log('Połączono z bazą danych MySQL!');
  
	const setGlobalQuery = 'SET GLOBAL host_cache_size=0';
	db.query(setGlobalQuery, (err, results) => {
	  if (err) {
		console.error('Błąd podczas wykonywania polecenia SET GLOBAL:', err);
		return;
	  }
  
	  console.log('Pomyślnie wykonano polecenie SET GLOBAL host_cache_size=0');
	});
  });
// app.get('/test', async (req, res) => {
// 	try {
// 		const testUrl = 'https://maksymalnytrener.pl/';
// 		const response = await fetch(testUrl);
// 		const data = await response.text();
// 		console.log('Odpowiedź z serwera:', data);
// 		res.send('Odpowiedź na zapytanie GET na /test');
// 	} catch (error) {
// 		console.error('Błąd podczas połączenia:', error);
// 		res.status(500).send('Błąd podczas pobierania danych');
// 	}
// });

// const testUrl = 'https://maksymalnytrener.pl/';

// https
// 	.get(testUrl, (response) => {
// 		let data = '';
// 		response.on('data', (chunk) => {
// 			data += chunk;
// 		});

// 		response.on('end', () => {
// 			console.log('Odpowiedź z serwera:', data);
// 		});
// 	})
// 	.on('error', (error) => {
// 		console.error('Błąd podczas połączenia:', error);
// 	});

// const url = 'https://maksymalnytrener.pl';

// https
// 	.get(url, (response) => {
// 		let data = '';
// 		response.on('data', (chunk) => {
// 			data += chunk;
// 		});

// 		response.on('end', () => {
// 			console.log('Odpowiedź z serwera:', data);
// 		});
// 	})
// 	.on('error', (error) => {
// 		console.error('Błąd podczas połączenia:', error);
// 	});

app.get('/getProducts/:username', (req, res) => {
	const username = req.params.username;
	const userToken = req.headers.authorization.split(' ')[1];

	try {
		const decoded = jwt.verify(userToken, secretKey);
		console.log('Decoded token:', decoded);

		if (decoded.username !== username) {
			console.log('Authorization failed or mismatched username.');
			return res.status(401).json({ message: 'Unauthorized' });
		}

		console.log('Username from URL:', username);
		console.log('User token from headers:', req.headers.authorization);

		db.query(
			'SELECT * FROM products WHERE username = ?',
			[username],
			(err, rows) => {
				if (err) {
					console.error(err.message);
					res.status(500).send('Error fetching productLibrary from database');
				} else {
					console.log('ProductLibrary fetched:', rows);
					res.status(200).json(rows);
				}
			}
		);
	} catch (error) {
		console.error('Token verification error:', error);
		res.status(401).json({ message: 'Unauthorized' });
	}
});

app.options('/addProduct', cors());

app.post('/addProduct', (req, res) => {
	const { username, name, category, calories, proteins } = req.body;

	if (!name || !category || !calories || !proteins) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	const sql = `INSERT INTO products (username, name, category, calories, proteins) VALUES (?, ?, ?, ?, ?)`;
	db.query(
		sql,
		[username, name, category, calories, proteins],
		(err, result) => {
			if (err) {
				console.error(err.message);
				return res.status(500).send('Error adding product to the database');
			}
			res.status(200).send('Product added to the database');
		}
	);
});

// Pozostała część kodu bez zmian

db.connect((err) => {
	if (err) {
		console.error('Błąd połączenia z bazą danych', err);
	} else {
		console.log('Połączenie z bazą danych MySQL udane!');
	}
});

const PORT = 5000;
app.listen(PORT, () => {
	console.log(`Serwer działa na porcie ${PORT}`);
});

app.get('/allTasks/:username', (req, res) => {
	const username = req.params.username;
	const userToken = req.headers.authorization.split(' ')[1];

	try {
		const decoded = jwt.verify(userToken, secretKey);
		if (decoded.username !== username) {
			console.log('Authorization failed or mismatched username.');
			return res.status(401).json({ message: 'Unauthorized' });
		}

		console.log('Username from URL:', username);
		console.log('User token from headers:', req.headers.authorization);

		db.query(
			'SELECT * FROM tasks WHERE username = ?',
			[username],
			(err, rows) => {
				if (err) {
					console.error(err.message);
					res.status(500).send('Error fetching tasks from database');
				} else {
					console.log('Tasks fetched:', rows);
					res.status(200).json(rows);
				}
			}
		);
	} catch (error) {
		console.error('Token verification error:', error);
		res.status(401).json({ message: 'Unauthorized' });
	}
});

// app.post('/register', (req, res) => {
// 	const { username, password, email } = req.body;

// 	const payload = {
// 		username: username,
// 		email: email,
// 	};
// 	const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

// 	const sql = `INSERT INTO users (username, password, email, token) VALUES (?, ?, ?, ?)`;
// 	db.query(sql, [username, password, email, token], (err, result) => {
// 		if (err) {
// 			console.error('Błąd podczas rejestracji użytkownika:', err);
// 			return res
// 				.status(500)
// 				.json({ message: 'Błąd podczas rejestracji użytkownika.' });
// 		}
// 		console.log('Użytkownik został zarejestrowany:', { username, email });
// 		res
// 			.status(201)
// 			.json({ message: 'Użytkownik został zarejestrowany.', token: token });
// 	});
// });

// app.post('/login', (req, res) => {
// 	const { username, password } = req.body;

// 	const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
// 	db.query(sql, [username, password], (err, results) => {
// 		if (err) {
// 			console.error('Błąd podczas logowania:', err);
// 			return res.status(500).json({ message: 'Błąd logowania.' });
// 		}

// 		if (results.length === 0) {
// 			return res.status(401).json({ message: 'Nieprawidłowe dane logowania.' });
// 		}

// 		const row = results[0];
// 		const payload = {
// 			username: row.username,
// 			email: row.email,
// 		};
// 		const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

// 		const updateTokenQuery = `UPDATE users SET token = ? WHERE id = ?`;
// 		db.query(updateTokenQuery, [token, row.id], (err, result) => {
// 			if (err) {
// 				console.error('Błąd podczas aktualizacji tokenu:', err);
// 				return res.status(500).json({ message: 'Błąd logowania.' });
// 			}

// 			console.log('Użytkownik zalogowany:', {
// 				username: row.username,
// 				email: row.email,
// 			});
// 			res
// 				.status(200)
// 				.json({ message: 'Zalogowano użytkownika.', token: token });
// 		});
// 	});
// });
const crypto = require('crypto');
const { create } = require('domain');

// Generowanie klucza tajnego o długości 64 bajtów
const secretKey = crypto.randomBytes(32).toString('hex');
console.log('Wygenerowany klucz tajny:', secretKey);
const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    token TEXT
  )
`;

const createTasksTableQuery = `
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255),
    name TEXT NOT NULL,
    category TEXT,
    date TEXT,
    grams INTEGER,
    calories INTEGER,
    proteins INTEGER,
    productWholeCalories INTEGER,
	FOREIGN KEY (username) REFERENCES users(username)
  )
`;

const createProductsTableQuery = `
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255),
    name TEXT NOT NULL,
    category TEXT,
    calories INTEGER,
    proteins INTEGER,
	FOREIGN KEY (username) REFERENCES users(username)
  )
`;

db.query(createUserTableQuery, (err, result) => {
	if (err) {
		console.error('Błąd podczas tworzenia tabeli users:', err);
	} else {
		console.log('Tabela users utworzona pomyślnie.');
	}
});

db.query(createTasksTableQuery, (err, result) => {
	if (err) {
		console.error('Błąd podczas tworzenia tabeli tasks:', err);
	} else {
		console.log('Tabela tasks utworzona pomyślnie.');
	}
});

db.query(createProductsTableQuery, (err, result) => {
	if (err) {
		console.error('Błąd podczas tworzenia tabeli products:', err);
	} else {
		console.log('Tabela products utworzona pomyślnie.');
	}
});

app.post('/register', (req, res) => {
	const { username, password, email } = req.body;

	const token = jwt.sign({ username, email }, secretKey, { expiresIn: '1h' });

	const sql = `INSERT INTO users (username, password, email, token) VALUES (?, ?, ?, ?)`;
	db.run(sql, [username, password, email, token], (err) => {
		if (err) {
			console.error('Błąd podczas rejestracji użytkownika:', err);
			return res
				.status(500)
				.json({ message: 'Błąd podczas rejestracji użytkownika.' });
		}
		console.log('Użytkownik został zarejestrowany:', { username, email });
		res
			.status(201)
			.json({ message: 'Użytkownik został zarejestrowany.', token });
	});
	console.log('Received POST request:', req.body); // Logowanie danych żądania
  res.send('Response from server')
});

// Endpoint logowania użytkownika
app.post('/login', (req, res) => {
	const { username, password } = req.body;
	const token = jwt.sign({ username, email: row.email }, secretKey, {
		expiresIn: '1h',
	});

	console.log('Generated token:', token); // Dodaj log tokena

	// Twój obecny kod aktualizacji tokenu...

	console.log('Updated token:', token); // Dodaj log zaktualizowanego tokenu

	const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
	db.get(sql, [username, password], (err, row) => {
		if (err) {
			console.error('Błąd podczas logowania:', err);
			return res.status(500).json({ message: 'Błąd logowania.' });
		}

		if (!row) {
			return res.status(401).json({ message: 'Nieprawidłowe dane logowania.' });
		}

		const token = jwt.sign({ username, email: row.email }, secretKey, {
			expiresIn: '1h',
		});

		const updateTokenQuery = `UPDATE users SET token = ? WHERE id = ?`;
		db.run(updateTokenQuery, [token, row.id], (err) => {
			if (err) {
				console.error('Błąd podczas aktualizacji tokenu:', err);
				return res.status(500).json({ message: 'Błąd logowania.' });
			}
			console.log('Użytkownik zalogowany:', { username, email: row.email });
			res.status(200).json({ message: 'Zalogowano użytkownika.', token });
		});
	});
});

// Endpoint dodawania zadań przez użytkownika
app.post('/addTask', (req, res) => {
	const { tasks } = req.body;
	const userToken = req.headers.authorization;

	console.log('Received user token:', userToken); // Console log otrzymanego tokenu

	// Funkcja sprawdzająca poprawność tokenu JWT
	function userTokenIsValid(token) {
		try {
			const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey);
			console.log('Decoded token:', decoded); // Console log zdekodowanego tokenu
			return decoded;
		} catch (err) {
			return false;
		}
	}
	if (!userTokenIsValid(userToken)) {
		return res.status(401).json({ message: 'Brak autoryzacji.' });
	}

	tasks.forEach((task) => {
		const {
			username,
			name,
			category,
			date,
			grams,
			calories,
			proteins,
			productWholeCalories,
		} = task;

		const sql = `INSERT INTO tasks (username, name, category, date, grams, calories, proteins, productWholeCalories) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
		db.run(
			sql,
			[
				username,
				name,
				category,
				date,
				grams,
				calories,
				proteins,
				productWholeCalories,
			],
			(err) => {
				if (err) {
					console.error('Błąd podczas dodawania zadania:', err);
					return res
						.status(500)
						.json({ message: 'Błąd podczas dodawania zadania.' });
				}
				console.log('Zadanie zostało dodane:', { name, date });
			}
		);
	});

	res.status(201).json({ message: 'Zadania zostały dodane.' });
});
