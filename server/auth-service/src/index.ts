import express from 'express';

const app = express();
const PORT = 3004;

app.get('/', (req, res) => {
  res.send('Hello from auth-service!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
