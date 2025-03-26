import express from "express";
import cors from "cors";

const middleware = (app) => {
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(express.json());
};

export default middleware;
