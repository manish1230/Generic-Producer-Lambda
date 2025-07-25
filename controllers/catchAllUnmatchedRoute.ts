import { Request, Response } from 'express';

export const catchAllController=async (req :Request,res :Response)=>{

    res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
};

