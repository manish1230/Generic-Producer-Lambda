import { Request, Response, NextFunction } from 'express';
import { WebhookFetcher } from '../services/ssmHelper';
import { logger } from '../utils/logger';

let webhookPath = "";

export const loadWebhookUrlMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!webhookPath) {
      webhookPath = await WebhookFetcher.getUrl();
      logger.info(`✅ Webhook path loaded from SSM: ${webhookPath}`);
    }
    // Attach to request for downstream routes
    (req as any).webhookPath = webhookPath;
    next();
  } catch (err: any) {
    logger.error(`❌ Failed to load webhookPath from SSM: ${err.message}`);
    res.status(500).json({ error: "Failed to load configuration from SSM" });
  }
};
