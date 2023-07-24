import { AuthenticatedRequest } from "@/middlewares";
import { InputBookingBody } from "@/protocols";
import bookingService from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    
    try {
        const booking = await bookingService.getBooking(Number(userId));
        return res.status(httpStatus.OK).send(booking);
    } catch (error) {
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
};

export async function createBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body as InputBookingBody;

    try {
        const booking = await bookingService.createBooking(Number(userId), roomId);
        return res.status(httpStatus.OK).send({ bookingId: booking.id });
    } catch (error) {
        if(error.name === 'ForbiddenError') return res.sendStatus(httpStatus.FORBIDDEN);
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
};

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body as InputBookingBody;
    const { bookingId } = req.params;

    try {
        const booking = await bookingService.updateBooking(userId, roomId, Number(bookingId));
        return res.status(httpStatus.OK).send({ bookingId: booking.id });
    } catch (error) {
        if(error.name === 'ForbiddenError') return res.sendStatus(httpStatus.FORBIDDEN);
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
};