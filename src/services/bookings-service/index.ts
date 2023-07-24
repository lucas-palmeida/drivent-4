import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import { Booking } from "@prisma/client";

async function getBooking(userId: number): Promise<Booking> {
    const booking = await bookingRepository.getBooking(userId);
    
    if(!booking) throw notFoundError();

    return booking;
};

const bookingService = {
    getBooking,
};

export default bookingService;