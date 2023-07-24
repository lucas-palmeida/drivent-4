import { notFoundError } from "@/errors";
import { forbiddenError } from "@/errors/forbidden-error";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import roomRepository from "@/repositories/room-repository/room-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { Booking, TicketStatus } from "@prisma/client";

async function getBooking(userId: number): Promise<Booking> {
    const booking = await bookingRepository.getBooking(userId);
    
    if(!booking) throw notFoundError();

    return booking;
};

async function createBooking(userId: number, roomId: number) {
    await verifyTicketByUserId(userId);
    await verifyRoomAndCapacity(roomId);

    const booking = await bookingRepository.createBooking(userId, roomId);

    return booking;
};

async function updateBooking(userId: number, roomId: number, bookingId: number) {
    const verifyBooking = await bookingRepository.getBooking(userId);
    if(!verifyBooking) throw forbiddenError("User doesn't have a booking yet.");

    await verifyTicketByUserId(userId);
    await verifyRoomAndCapacity(roomId);

    const booking = await bookingRepository.updateBooking(bookingId, roomId);

    return booking;
}

async function verifyTicketByUserId(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if(!ticket) throw notFoundError();

    const { isRemote, includesHotel } = ticket.TicketType;
    if(isRemote || !includesHotel || ticket.status !== TicketStatus.PAID) throw forbiddenError("Verify your ticket data.");
};

async function verifyRoomAndCapacity(roomId: number) {
    const room = await roomRepository.getRoomById(roomId);
    if(!room) throw notFoundError();

    const bookings = await bookingRepository.getBookingsByRoomId(roomId);
    if(bookings.length === room.capacity) throw forbiddenError("The room is already full.");
};

const bookingService = {
    getBooking,
    createBooking,
    updateBooking,
};

export default bookingService;