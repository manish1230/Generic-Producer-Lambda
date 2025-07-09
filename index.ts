import express from 'express';
// import axios from 'axios';
import { healthCheckHandler } from './controllers/healthCheckController';
import { publishHandler } from './controllers/publishController';
import { loadWebhookUrlMiddleware } from './middlewares/loadWebhook';
import { catchAllController } from './controllers/catchAllUnmatchedRoute';

const app = express();
app.use(express.json());

//middleware to load webhook site url
app.use(loadWebhookUrlMiddleware);

//endpoints
app.get('/healthCheck', healthCheckHandler);
app.post('/publish', publishHandler);

// catch all unmatched route
app.use(catchAllController);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});


export default app;
