import cors from "cors";
import express, { type Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env, isProduction } from "./config";
import { errorHandler, notFoundHandler } from "./middleware/error";
import { apiRateLimiter } from "./middleware/rateLimit";
import routes from "./routes";

export function createApp(): Application {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
      credentials: true,
    }),
  );
  app.use(morgan(isProduction ? "combined" : "dev"));

  // Stripe webhooks require the raw body for signature verification and are
  // mounted with express.raw() at the route level (added in the Stripe phase),
  // so the JSON body parser must NOT be applied globally before that route.
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", apiRateLimiter, routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
