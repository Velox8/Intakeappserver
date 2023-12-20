const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json()); // Parsowanie danych jako JSON
app.use(helmet()); // Dodanie zabezpieczeń Helmet

app.use(
	cors({
		origin: 'https://c011ftp.cloudclusters.net:61906',
		methods: ['GET', 'POST'], // Dozwolone metody
		allowedHeaders: ['Content-Type', 'Authorization'], // Dozwolone nagłówki
	})
);
app.options('/addTask', cors());
const db = new sqlite3.Database('products.db', (err) => {
	if (err) {
		console.error(err.message);
	} else {
		console.log('Connected to the SQLite database.');
	}
});
const dbTasks = new sqlite3.Database('tasks.db', (err) => {
	if (err) {
		console.error(err.message);
		throw err;
	}
	console.log('Connected to the tasks database.');
});
// const dbTasks = new sqlite3.Database('tasks.db', (err) => {
// 	if (err) {
// 		console.error(err.message);
// 	} else {
// 		console.log('Connected to the tasks SQLite database.');

// 		dbTasks.run(
// 			`CREATE TABLE IF NOT EXISTS tasks (
//           id INTEGER PRIMARY KEY,
//           name TEXT,
//           category TEXT,
//           date TEXT,
//           grams TEXT,
//           calories TEXT,
//           proteins INTEGER,
//           productWholeCalories INTEGER
//       )`,
// 			(createErr) => {
// 				if (createErr) {
// 					console.error(createErr.message);
// 				} else {
// 					console.log('Table tasks created successfully.');
// 				}
// 			}
// 		);
// 	}
// });
// app.post('/addTask', (req, res) => {
// 	const tasksToAdd = req.body;

// 	const tasksPromises = tasksToAdd.map((taskToAdd) => {
// 		return new Promise((resolve, reject) => {
// 			const {
// 				name,
// 				category,
// 				date,
// 				grams,
// 				calories,
// 				proteins,
// 				productWholeCalories,
// 			} = taskToAdd;

// 			// Sprawdzenie czy wszystkie wymagane pola są uzupełnione
// 			if (
// 				!name ||
// 				!category ||
// 				!date ||
// 				!grams ||
// 				!calories ||
// 				!proteins ||
// 				!productWholeCalories
// 			) {
// 				console.error('Missing required fields for task:', taskToAdd);
// 				return reject({ error: 'Missing required fields' });
// 			}

// 			const sql = `INSERT INTO tasks (name, category, date, grams, calories, proteins, productWholeCalories) VALUES (?, ?, ?, ?, ?, ?, ?)`;
// 			const values = [
// 				name,
// 				category,
// 				date,
// 				grams,
// 				calories,
// 				proteins,
// 				productWholeCalories,
// 			];

// 			dbTasks.run(sql, values, function (err) {
// 				if (err) {
// 					console.error('Error adding task to the database:', err.message);
// 					return reject({ error: 'Error adding task to the database' });
// 				}

// 				console.log('Task added to the database:', taskToAdd);
// 				resolve();
// 			});
// 		});
// 	});

// 	Promise.all(tasksPromises)
// 		.then(() => {
// 			res.json({ success: 'All tasks added successfully' });
// 		})
// 		.catch((error) => {
// 			res.status(500).json(error);
// 		});
// });
// app.post('/addTask', (req, res) => {
// 	const tasksToAdd = req.body;

// 	// Iteracja przez tablicę otrzymanych zadań
// 	tasksToAdd.forEach((taskToAdd) => {
// 		const {
// 			name,
// 			category,
// 			date,
// 			grams,
// 			calories,
// 			proteins,
// 			productWholeCalories,
// 		} = taskToAdd;

// 		// Sprawdzenie czy wszystkie wymagane pola są uzupełnione
// 		if (
// 			!name ||
// 			!category ||
// 			!date ||
// 			!grams ||
// 			!calories ||
// 			!proteins ||
// 			!productWholeCalories
// 		) {
// 			console.error('Missing required fields for task:', taskToAdd);
// 			return res.status(400).json({ error: 'Missing required fields' });
// 		}

// 		// Kod dodawania pojedynczego zadania do bazy danych SQLite
// 		const sql = `INSERT INTO tasks (name, category, date, grams, calories, proteins, productWholeCalories) VALUES (?, ?, ?, ?, ?, ?, ?)`;
// 		const values = [
// 			name,
// 			category,
// 			date,
// 			grams,
// 			calories,
// 			proteins,
// 			productWholeCalories,
// 		];

// 		dbTasks.run(sql, values, function (err) {
// 			if (err) {
// 				console.error('Error adding task to the database:', err.message);
// 				return res
// 					.status(500)
// 					.json({ error: 'Error adding task to the database' });
// 			}

// 			console.log('Task added to the database:', taskToAdd);
// 		});
// 	});

// 	res
// 		.status(200)
// 		.json({ message: 'Tasks added successfully', tasks: tasksToAdd });
// });

// app.get('/getProducts', (req, res) => {
// 	db.all('SELECT * FROM products', (err, rows) => {
// 		if (err) {
// 			console.error(err.message);
// 			res.status(500).send('Error fetching products from database');
// 		} else {
// 			res.status(200).json(rows);
// 		}
// 	});
// });
// app.get('/getProducts', (req, res) => {
// 	const userToken = req.headers.authorization.split(' ')[1];
// 	try {
// 	  const decoded = jwt.verify(userToken, secretKey);
// 	  const username = decoded.username;

// 	  db.get('SELECT productLibrary FROM users WHERE username = ?', [username], (err, row) => {
// 		if (err) {
// 		  console.error(err.message);
// 		  res.status(500).send('Error fetching productLibrary from database');
// 		} else {
// 		  res.status(200).json(row.productLibrary); // Zwróć productLibrary związane z użytkownikiem
// 		}
// 	  });
// 	} catch (error) {
// 	  console.error('Token verification error:', error);
// 	  res.status(401).json({ message: 'Unauthorized' });
// 	}
//   });
// app.get('/getProducts/:username', (req, res) => {
//     const username = req.params.username;
//     const userToken = req.headers.authorization.split(' ')[1]; // Pobierz token z nagłówka

//     try {
//         const decoded = jwt.verify(userToken, secretKey);
//         console.log('Decoded token:', decoded); // Loguj dekodowany token

//         if (decoded.username !== username) {
//             console.log('Authorization failed or mismatched username.');
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         console.log('Username from URL:', username);
//         console.log('User token from headers:', req.headers.authorization);

//         db.get(
//             'SELECT * FROM products WHERE username = ?',
//             [username],
//             (err, rows) => {
//                 if (err) {
//                     console.error(err.message);
//                     res.status(500).send('Error fetching productLibrary from database');
//                 } else {
//                     console.log('ProductLibrary fetched:', rows); // Logowanie pobranego productLibrary
//                     res.status(200).json(rows); // Zwróć productLibrary związane z konkretnym użytkownikiem
//                 }
//             }
//         );
//     } catch (error) {
//         console.error('Token verification error:', error);
//         res.status(401).json({ message: 'Unauthorized' });
//     }
// });

app.get('/getProducts/:username', (req, res) => {
    const username = req.params.username;
    const userToken = req.headers.authorization.split(' ')[1]; // Pobierz token z nagłówka

    try {
        const decoded = jwt.verify(userToken, secretKey);
        console.log('Decoded token:', decoded); // Loguj dekodowany token

        if (decoded.username !== username) {
            console.log('Authorization failed or mismatched username.');
            return res.status(401).json({ message: 'Unauthorized' });
        }

        console.log('Username from URL:', username);
        console.log('User token from headers:', req.headers.authorization);

        db.all(
            'SELECT * FROM products WHERE username = ?',
            [username],
            (err, rows) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Error fetching productLibrary from database');
                } else {
                    console.log('ProductLibrary fetched:', rows); // Logowanie pobranego productLibrary
                    res.status(200).json(rows); // Zwróć productLibrary związane z konkretnym użytkownikiem
                }
            }
        );
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
});
app.options('/addProduct', cors()); // Obsługa OPTIONS dla ścieżki /addProduct

app.post('/addProduct', (req, res) => {
	const { username, name, category, calories, proteins } = req.body;

	// Walidacja danych wejściowych
	if (!name || !category || !calories || !proteins) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	const sql = `INSERT INTO products (username, name, category, calories, proteins) VALUES (?, ?, ?, ?, ?)`;
	db.run(sql, [username, name, category, calories, proteins], function (err) {
		if (err) {
			console.error(err.message);
			return res.status(500).send('Error adding product to the database');
		}
		res.status(200).send('Product added to the database');
	});
});
// app.post('/addProduct', (req, res) => {
// 	const { name, category, calories, proteins } = req.body;

// 	// Walidacja danych wejściowych
// 	if (!name || !category || !calories || !proteins) {
// 		return res.status(400).json({ error: 'Missing required fields' });
// 	}

// 	const sql = `INSERT INTO products (name, category, calories, proteins) VALUES (?, ?, ?, ?)`;
// 	db.run(sql, [name, category, calories, proteins], function (err) {
// 		if (err) {
// 			console.error(err.message);
// 			return res.status(500).send('Error adding product to the database');
// 		}
// 		res.status(200).send('Product added to the database');
// 	});
// });
// app.get('/getAllTasks', (req, res) => {
// 	dbTasks.all('SELECT * FROM tasks', (err, rows) => {
// 		if (err) {
// 			console.error(err.message);
// 			res.status(500).send('Error fetching tasks from database');
// 		} else {
// 			console.log('Fetched tasks:', rows); // Dodanie logu z pobranymi danymi
// 			res.status(200).json(rows);
// 		}
// 	});
// });
const PORT = 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

// Odczytanie danych z bazy (opcjonalnie)
// db.serialize(() => {
// 	db.each('SELECT * FROM products', (err, row) => {
// 		if (err) {
// 			console.error(err.message);
// 		}
// 		console.log(row); // Wyświetla dane z tabeli products
// 	});
// });

// dbTasks.all('SELECT * FROM tasks', (err, rows) => {
// 	if (err) {
// 		console.error(err.message);
// 	} else {
// 		console.log('Current state of tasks:', rows);
// 		// Tutaj możesz przetwarzać lub wyświetlać dane w innym miejscu w kodzie
// 	}
// });

// app.get('/allTasks', (req, res) => {
// 	dbTasks.all('SELECT * FROM tasks', (err, rows) => {
// 	  if (err) {
// 		console.error(err.message);
// 		res.status(500).send('Error fetching tasks from database');
// 	  } else {
// 		res.status(200).json(rows); // Zwróć wszystkie dane z tabeli tasks
// 	  }
// 	});
// 	function userTokenIsValid(token) {
//         try {
//             const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey);
//             console.log('Decoded token:', decoded); // Console log zdekodowanego tokenu
//             return decoded;
//         } catch (err) {
//             return false;
//         }
//     }
// 	if (!userTokenIsValid(userToken)) {
// 		return res.status(401).json({ message: 'Brak autoryzacji.' });
// 	}
//   });

// app.get('/allTasks/:username', (req, res) => {
// 	const { username } = req.params;
// 	const userToken = req.headers.authorization;

// 	console.log('Username from URL:', username);
// 	console.log('User token from headers:', userToken);

// 	// Funkcja sprawdzająca poprawność tokenu JWT
// 	function userTokenIsValid(token, username) {
// 		try {
// 			const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey);
// 			console.log('Decoded token:', decoded); // Console log zdekodowanego tokenu
// 			console.log('Username from URL:', username); // Console log nazwy użytkownika z URL
// 			console.log('Decoded username from token:', decoded.username); // Console log nazwy użytkownika zdekodowanej z tokenu

// 			if (decoded.username === username) {
// 				return decoded;
// 			} else {
// 				console.log('Authorization failed or mismatched username.');
// 				return false;
// 			}
// 		} catch (err) {
// 			console.error('Error validating token:', err);
// 			return false;
// 		}
// 	}

// 	// Pobierz zadania dla konkretnego użytkownika na podstawie username
// 	const sql = 'SELECT * FROM tasks WHERE username = ?';
// 	db.all(sql, [username], (err, rows) => {
// 	  if (err) {
// 		console.error('Błąd podczas pobierania zadań:', err);
// 		return res.status(500).json({ message: 'Błąd pobierania zadań z bazy danych.' });
// 	  }

// 	  console.log('Tasks retrieved for username:', username);
// 	  // Zwróć zadania użytkownika w postaci JSON
// 	  res.status(200).json(rows);
// 	});
//   });

app.get('/allTasks/:username', (req, res) => {
	const username = req.params.username;
	const userToken = req.headers.authorization.split(' ')[1]; // Pobierz token z nagłówka

	try {
		const decoded = jwt.verify(userToken, secretKey);
		if (decoded.username !== username) {
			console.log('Authorization failed or mismatched username.');
			return res.status(401).json({ message: 'Unauthorized' });
		}

		console.log('Username from URL:', username);
		console.log('User token from headers:', req.headers.authorization);

		db.all(
			'SELECT * FROM tasks WHERE username = ?',
			[username],
			(err, rows) => {
				if (err) {
					console.error(err.message);
					res.status(500).send('Error fetching tasks from database');
				} else {
					console.log('Tasks fetched:', rows); // Logowanie pobranych zadań
					res.status(200).json(rows); // Zwróć wszystkie dane z tabeli tasks przypisane do konkretnego użytkownika
				}
			}
		);
	} catch (error) {
		console.error('Token verification error:', error);
		res.status(401).json({ message: 'Unauthorized' });
	}
});
// app.get('/dates', (req, res) => {
// 	dbTasks.all('SELECT date FROM tasks', (err, rows) => {
// 	  if (err) {
// 		console.error(err.message);
// 		res.status(500).send('Error fetching dates from the database');
// 	  } else {
// 		const dates = rows.map(row => row.date);
// 		console.log(dates); // Dodajemy log do sprawdzenia danych

// 		const uniqueDates = Array.from(new Set(dates)); // Unikalne daty

// 		res.status(200).json({ dates: uniqueDates }); // Zwracamy unikalne daty jako obiekt JSON
// 	  }
// 	});
//   });

// app.get('getProducts', (req, res) => {
// 	dbTasks.all('SELECT * FROM products', (err, rows) => {
// 		if (err) {
// 			console.error(err.message);
// 			res.status(500).send('Error fetching products from the database');
// 		} else {
// 			 // Sprawdź unikalne daty w konsoli

// 			res.status(200).json(rows); // Zwróć unikalne daty jako obiekt JSON
// 		}
// 	});
// });

// const createTasksTableQuery = `
//   CREATE TABLE IF NOT EXISTS tasks (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL,
//     category TEXT,
//     date TEXT,
//     grams INTEGER,
//     calories INTEGER,
//     proteins INTEGER,
//     productWholeCalories INTEGER,
//     FOREIGN KEY (userId) REFERENCES users(id)
//   )
// `;

// // Tworzenie tabeli zadan
// db.run(createTasksTableQuery, (err) => {
// 	if (err) {
// 		console.error('Błąd podczas tworzenia tabeli zadań:', err.message);
// 	} else {
// 		console.log('Tabela "tasks" została utworzona.');
// 	}
// });

// app.post('/addTask', (req, res) => {
// 	const { userId, tasks } = req.body;

// 	// Przykład dodawania zadań z konkretnym userId do bazy danych
// 	tasks.forEach((task) => {
// 		const {
// 			name,
// 			category,
// 			date,
// 			grams,
// 			calories,
// 			proteins,
// 			productWholeCalories,
// 		} = task;

// 		const sql = `INSERT INTO tasks ( name, category, date, grams, calories, proteins, productWholeCalories) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
// 		db.run(
// 			sql,
// 			[name, category, date, grams, calories, proteins, productWholeCalories],
// 			(err) => {
// 				if (err) {
// 					console.error('Błąd podczas dodawania zadania:', err);
// 					return res
// 						.status(500)
// 						.json({ message: 'Błąd podczas dodawania zadania.' });
// 				}
// 				console.log('Zadanie zostało dodane:', { userId, name, date });
// 			}
// 		);
// 	});

// 	res.status(201).json({ message: 'Zadania zostały dodane.' });
// });

// // Pobieranie zadań przypisanych do konkretnego użytkownika
// app.get('/tasks/:userId', (req, res) => {
// 	const { userId } = req.params;

// 	const sql = `SELECT * FROM tasks WHERE userId = ?`;
// 	db.all(sql, [userId], (err, rows) => {
// 		if (err) {
// 			console.error('Błąd podczas pobierania zadań:', err.message);
// 			return res
// 				.status(500)
// 				.json({ message: 'Błąd podczas pobierania zadań.' });
// 		}

// 		console.log('Pobrane zadania dla użytkownika o ID:', userId);
// 		res.status(200).json(rows);
// 	});
// });

// const createUserTableQuery = `
//   CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     username TEXT NOT NULL UNIQUE,
//     password TEXT NOT NULL,
//     email TEXT NOT NULL UNIQUE,
//     token TEXT
//   )
// `;

// // Tworzenie tabeli użytkowników
// db.run(createUserTableQuery, (err) => {
// 	if (err) {
// 		console.error('Błąd podczas tworzenia tabeli:', err.message);
// 	} else {
// 		console.log('Tabela "users" została utworzona.');
// 	}
// });

app.post('/register', (req, res) => {
	const { username, password, email } = req.body;

	// Tworzenie tokenu JWT
	const payload = {
		username: username,
		email: email,
		// Dodaj dodatkowe informacje, jeśli są potrzebne w tokenu
	};
	const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

	// Dodanie użytkownika do bazy danych z tokenem
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
			.json({ message: 'Użytkownik został zarejestrowany.', token: token });
	});
});

const crypto = require('crypto');
const { create } = require('domain');

// Generowanie klucza tajnego o długości 64 bajtów
const secretKey = crypto.randomBytes(32).toString('hex');
console.log('Wygenerowany klucz tajny:', secretKey);
app.post('/login', (req, res) => {
	const { username, password } = req.body;

	// Pobranie użytkownika z bazy danych na podstawie nazwy użytkownika i hasła
	const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
	db.get(sql, [username, password], (err, row) => {
		if (err) {
			console.error('Błąd podczas logowania:', err);
			return res.status(500).json({ message: 'Błąd logowania.' });
		}

		if (!row) {
			return res.status(401).json({ message: 'Nieprawidłowe dane logowania.' });
		}

		const payload = {
			username: row.username,
			email: row.email,
			// Dodaj dodatkowe informacje, jeśli są potrzebne w tokenu
		};
		const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

		// Aktualizacja tokenu użytkownika po zalogowaniu
		const updateTokenQuery = `UPDATE users SET token = ? WHERE id = ?`;
		db.run(updateTokenQuery, [token, row.id], (err) => {
			if (err) {
				console.error('Błąd podczas aktualizacji tokenu:', err);
				return res.status(500).json({ message: 'Błąd logowania.' });
			}

			console.log('Użytkownik zalogowany:', {
				username: row.username,
				email: row.email,
			});
			res
				.status(200)
				.json({ message: 'Zalogowano użytkownika.', token: token });
		});
	});
});

// Pobranie informacji o użytkowniku na podstawie tokenu
// app.get('/users', (req, res) => {
//   const { token } = req.headers;

//   const sql = `SELECT id, username, email FROM users WHERE token = ?`;
//   db.get(sql, [token], (err, row) => {
//     if (err) {
//       console.error('Błąd podczas pobierania danych użytkownika:', err.message);
//       return res.status(500).json({ message: 'Błąd podczas pobierania danych użytkownika.' });
//     }

//     if (!row) {
//       return res.status(404).json({ message: 'Użytkownik nieznaleziony.' });
//     }

//     console.log('Informacje o użytkowniku:', { id: row.id, username: row.username, email: row.email });
//     res.status(200).json({ id: row.id, username: row.username, email: row.email });
//   });
// });

// app.get('/tasks/:userId', (req, res) => {
// 	const { userId } = req.params;

// 	const sql = `SELECT * FROM tasks WHERE userId = ?`;
// 	db.all(sql, [userId], (err, rows) => {
// 		if (err) {
// 			console.error('Błąd podczas pobierania zadań:', err.message);
// 			return res
// 				.status(500)
// 				.json({ message: 'Błąd podczas pobierania zadań.' });
// 		}

// 		console.log('Pobrane zadania dla użytkownika o ID:', userId);
// 		res.status(200).json(rows);
// 	});
// });

// const createUserTableQuery = `
//   CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     username TEXT NOT NULL UNIQUE,
//     password TEXT NOT NULL,
//     email TEXT NOT NULL UNIQUE
//   )
// `;

// // Wykonanie zapytania tworzącego tabelę
// db.run(createUserTableQuery, (err) => {
// 	if (err) {
// 		console.error('Błąd podczas tworzenia tabeli:', err.message);
// 	} else {
// 		console.log('Tabela "users" została utworzona.');
// 	}
// });
// app.post('/register', (req, res) => {
//     const { username, password, email } = req.body;

//     // Przykładowe zapytanie SQL do bazy danych SQLite
//     const sql = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
//     db.run(sql, [username, password, email], (err) => {
//         if (err) {
//             console.error('Błąd podczas rejestracji użytkownika:', err); // Dodanie loga błędu
//             return res
//                 .status(500)
//                 .json({ message: 'Błąd podczas rejestracji użytkownika.' });
//         }

//         // Po udanym zapisie użytkownika do bazy danych
//         const payload = {
//             username: username,
//             email: email,
//             // Dodaj dodatkowe informacje, jeśli są potrzebne w tokenu
//         };
//         const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

//         console.log('Użytkownik został zarejestrowany:', { username, email }); // Dodanie loga sukcesu
//         res.status(201).json({ message: 'Użytkownik został zarejestrowany.', token: token });
//     });
// });

// app.get('/users', (req, res) => {
// 	const sql = `SELECT * FROM users`;

// 	db.all(sql, [], (err, rows) => {
// 		if (err) {
// 			console.error('Błąd podczas pobierania użytkowników:', err.message);
// 			res
// 				.status(500)
// 				.json({ message: 'Błąd podczas pobierania użytkowników.' });
// 		} else {
// 			console.log('Pobrani użytkownicy:', rows);
// 			res.status(200).json(rows);
// 		}
// 	});
// });

// app.get('/users', (req, res) => {
// 	const { token } = req.headers; // Pobranie tokenu z nagłówka

// 	// Przykładowe zapytanie SQL do bazy danych SQLite
// 	const sql = `SELECT * FROM users WHERE token = ?`; // Dostosuj zapytanie do swojej bazy danych, gdzie przechowywane są tokeny użytkowników

// 	db.all(sql, [token], (err, rows) => {
// 	  if (err) {
// 		console.error('Błąd podczas pobierania użytkowników:', err.message);
// 		res.status(500).json({ message: 'Błąd podczas pobierania użytkowników.' });
// 	  } else {
// 		console.log('Pobrani użytkownicy:', rows);
// 		res.status(200).json(rows);
// 	  }
// 	});
//   });
// app.post('/login', (req, res) => {
// 	const { username, password } = req.body;

// 	const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
// 	db.get(sql, [username, password], (err, row) => {
// 	  if (err) {
// 		console.error('Błąd podczas logowania:', err.message);
// 		return res.status(500).json({ message: 'Błąd podczas logowania.' });
// 	  }
// 	  if (row) {
// 		console.log('Zalogowany użytkownik:', row);
// 		res.status(200).json({ message: 'Zalogowano pomyślnie.' });
// 	  } else {
// 		res.status(401).json({ message: 'Nieprawidłowa nazwa użytkownika lub hasło.' });
// 	  }
// 	});
//   });
// const db = new sqlite3.Database(':memory:');

// const secretKey = 'your-secret-key'; // Klucz do szyfrowania JWT

// Tworzenie tabeli users
const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    token TEXT
  )
`;

// Tworzenie tabeli tasks
const createTasksTableQuery = `
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username INTEGER,
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
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username INTEGER,
    name TEXT NOT NULL,
    category TEXT,
    calories INTEGER,
    proteins INTEGER,
    
	FOREIGN KEY (username) REFERENCES users(username)

  )
`;

// Tworzenie tabeli users i tasks w bazie danych
db.serialize(() => {
	db.run(createUserTableQuery);
	db.run(createTasksTableQuery);
	db.run(createProductsTableQuery);
});

// Endpoint rejestracji użytkownika
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

	// Twój obecny kod logowania użytkownika...
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