import express from "express";
import { resolve } from "path";
const app = express();
app.use(express.static(resolve('./public')));
const path = resolve('./public/html');
app.get('/', (req, res) => {
  res.sendFile(`${path}/getaccount.html`);
});
app.get('/user', (req, res) => {
  res.sendFile(`${path}/getuser.html`);
});
app.get('/withdraw', (req, res) => {
  res.sendFile(`${path}/withdraw.html`);
});
app.get('/transaction', (req, res) => {
  res.sendFile(`${path}/transaction.html`);
});
app.get('/deposit', (req, res) => {
  res.sendFile(`${path}/deposit.html`);
});
app.use((req, res) => {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.send('404 not found');
});
app.listen(3000, () => {
  console.log('listening to port 3000');
});