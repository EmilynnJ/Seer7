import { Router } from "express";
import healthRoutes from "./health.routes";

const router = Router();

router.use("/health", healthRoutes);

// Future phase routers will be mounted here:
// router.use("/auth", authRoutes);
// router.use("/readers", readerRoutes);
// router.use("/readings", readingRoutes);
// router.use("/scheduled-readings", scheduledReadingRoutes);
// router.use("/bookings", bookingRoutes);
// router.use("/streams", streamRoutes);
// router.use("/payments", paymentRoutes);
// router.use("/wallet", walletRoutes);
// router.use("/products", productRoutes);
// router.use("/orders", orderRoutes);
// router.use("/forum", forumRoutes);
// router.use("/webhooks", webhookRoutes);

export default router;
