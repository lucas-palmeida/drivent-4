import { Router } from "express";
import { getBooking } from "@/controllers/bookings-controller";
import { authenticateToken } from "@/middlewares";

const bookingsRouter = Router();

bookingsRouter
    .all('/*', authenticateToken)
    .get('/', getBooking);

export { bookingsRouter };