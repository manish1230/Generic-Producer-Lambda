import { Request, Response } from 'express';
import axios from 'axios';
import { OrderValidator } from '../services/validate';
import { OrderTransformer } from '../services/transform';
import { logger } from '../utils/logger';

export const publishHandler = async (req: Request, res: Response) => {
  try {
    const record = req.body;
    OrderValidator.validate(record);
    const transformed = OrderTransformer.transform(record);

     const webhookPath = (req as any).webhookPath;
       
    await axios.post(webhookPath, transformed, {
      headers: { 'Content-Type': 'application/json' }
    });

    res.status(200).json({ message: 'Published successfully' });
  } catch (err: any) {
    logger.error(` Publish error: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
};
