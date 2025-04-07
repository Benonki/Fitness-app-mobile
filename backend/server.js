const app = require('./app');
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});