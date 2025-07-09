import { Request, Response } from 'express';
import axios from 'axios';
import { logger } from '../utils/logger';

export const healthCheckHandler = async (req: Request, res: Response) => {
  try {
    const webhookPath = (req as any).webhookPath;

    const pingResponse = await axios.get(webhookPath, { timeout: 2000 });

    res.status(200).json({
      status: 'UP',
      service: 'order_producer',
      targetApiReachable: pingResponse.status >= 200 && pingResponse.status < 400,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    logger.error(` Health check failed: ${err.message}`);
    res.status(500).json({
      status: 'DOWN',
      service: 'order_producer',
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
};
