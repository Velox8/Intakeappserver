const express = require('express');
const https = require('https');
const http = require('http');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(
	cors({
		origin: 'https://https://host491364.xce.pl',
		methods: ['GET', 'POST'], // Dozwolone metody
		allowedHeaders: ['Content-Type', 'Authorization'], // Dozwolone nagłówki
	})
);
app.post('/pobierz-slowa', (req, res) => {
  const words = req.body.words || [];
  const postData = JSON.stringify({ words });
  const reactAppURL = 'https://host491364.xce.pl/pobierz-slowa'; // Adres Twojej aplikacji React

  const params = new URLSearchParams();
  params.append('data', postData);

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(params.toString())
    }
  };

  const request = https.request(reactAppURL, options, response => {
    let responseData = '';

    response.on('data', chunk => {
      responseData += chunk;
    });

    response.on('end', () => {
      console.log('Odpowiedź z aplikacji React:', responseData);
      res.status(200).json({
        success: true,
        message: 'Odebrane słowa z serwera i wysłane do aplikacji React'
      });
    });
  });

  request.on('error', error => {
    console.error('Błąd podczas wysyłania słów do aplikacji React:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd podczas wysyłania słów do aplikacji React'
    });
  });

  request.write(params.toString());
  request.end();
});

const PORT = 5000;

https.createServer(app).listen(PORT, () => {
  console.log(`Serwer Express działa na porcie ${PORT}`);
});