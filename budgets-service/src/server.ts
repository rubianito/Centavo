import app from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4002;

app.listen(PORT, () => {
  console.log(`[budgets-service] Servidor corriendo en http://localhost:${PORT}`);
  console.log(`[budgets-service] Health check: http://localhost:${PORT}/health`);
});
