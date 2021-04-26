import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const isAuth: RequestHandler<{}, any, any, {}> = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send({message:'Not authenticated'})
  }

  const token = authHeader?.split(" ")[1];
  if (!token) {
    res.status(401).send({message:'Not authenticated'})
  }

  try {
    const payload: any = jwt.verify(token || "", process.env.ACCESS_TOKEN_SECRET);
    req.userId = payload.userId;
    next();
    return;
  } catch {}

  res.status(401).send({message:'Not authenticated'})
};
