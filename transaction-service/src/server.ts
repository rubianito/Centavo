import app from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.listen(PORT, () => {
  console.log(`[transaction-service] Servidor corriendo en http://localhost:${PORT}`);
  console.log(`[transaction-service] Health check: http://localhost:${PORT}/health`);
});
