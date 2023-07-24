import { Router } from "express";
import { createBooking, getBooking } from "@/controllers/bookings-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { bookingSchema } from "@/schemas/bookings-schemas";

const bookingsRouter = Router();

bookingsRouter
    .all('/*', authenticateToken)
    .get('/', getBooking)
    .post('/', validateBody(bookingSchema), createBooking);

export { bookingsRouter };