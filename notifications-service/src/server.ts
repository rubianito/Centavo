import app from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4003;

app.listen(PORT, () => {
  console.log(`[notifications-service] Servidor corriendo en http://localhost:${PORT}`);
  console.log(`[notifications-service] Health check: http://localhost:${PORT}/health`);
});
