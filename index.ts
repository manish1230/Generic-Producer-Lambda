  import express, { Request, Response, NextFunction } from 'express';
  import axios from 'axios';
 ;
  import { OrderValidator } from './services/validate';
  import { OrderTransformer } from './services/transform';

  import { SourceOrderData } from "./models/sourceDataModel";
  import { TargetOrderModel } from "./models/targetDataModel";

  import { WebhookFetcher } from './services/ssmHelper'; 
  // import dotenv from 'dotenv';
  // dotenv.config();

  const app = express();
  app.use(express.json()); 

   let webhookPath="";


   // ✅ Middleware to load webhook URL once and cache it
const loadWebhookUrlMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!webhookPath) {
      webhookPath = await WebhookFetcher.getUrl();
      console.log("✅ Webhook path loaded from SSM:", webhookPath);
    }
    next();
  } catch (err: any) {
    console.error("❌ Failed to load webhookPath from SSM:", err.message);
    res.status(500).json({ error: "Failed to load configuration from SSM" });
  }
};

// ✅ Attach middleware globally
app.use(loadWebhookUrlMiddleware);

  
  // POST route
  app.post('/publish', async (req: Request, res: Response) => {
    try {

      const record = req.body as SourceOrderData;

      //validation
      OrderValidator.validate(record);
      // transformation
      const transformed: TargetOrderModel = OrderTransformer.transform(record);;

      await axios.post(webhookPath, transformed, {
        headers: { 'Content-Type': 'application/json' }
      });

      res.status(200).json({ message: 'Published successfully' });
    } catch (err: any) {
      console.error('Error:', err.message);
      res.status(400).send(err.message);
    }
  });

  // Health check route
  app.get('/healthCheck', async (_req: Request, res: Response) => {
    try {
      // Check connectivity to downstream API
      const pingResponse = await axios.get(webhookPath, {
        timeout: 2000, // Fail fast if downstream is unresponsive
      });

      res.status(200).json({
        status: 'UP',
        service: 'order_producer',
        targetApiReachable: pingResponse.status >= 200 && pingResponse.status < 400,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({
        status: 'DOWN',
        service: 'order_producer',
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    }
  });
  // catch all unmatched route
  app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

  const PORT = 8080;
  app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
  });

  
  export default app;
