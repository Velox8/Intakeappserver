const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: 'https://aesthetic-croquembouche-fd6e15.netlify.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.post('/pobierz-slowa', async (req, res) => {
  const words = req.body.words || [];
  const postData = { words };

  try {
    const response = await axios.post('https://intake-app-server-production.up.railway.app/pobierz-slowa', postData);
    console.log('Odpowiedź z aplikacji zewnętrznej:', response.data);
    res.status(200).json({
      success: true,
      message: 'Odebrane słowa z serwera i wysłane do aplikacji React',
      responseData: response.data // Odpowiedź z aplikacji zewnętrznej
    });
  } catch (error) {
    console.error('Błąd podczas wysyłania słów do aplikacji zewnętrznej:', error);
    res.status(500).json({
      success: false,
      message: 'Błąd podczas wysyłania słów do aplikacji zewnętrznej',
      error: error.message // Informacja o błędzie
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serwer Express działa na porcie ${PORT}`);
});
