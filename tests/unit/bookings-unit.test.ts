import bookingRepository from "@/repositories/booking-repository";
import bookingService from "@/services/bookings-service";
import { Booking, Room, Ticket, TicketType, User } from "@prisma/client";
import { buildBookingRepoReturn, buildBookingServReturn, buildCreateBookingReturn } from "../factories/bookings-factory";
import { BookingParams } from "@/protocols";
import { notFoundError } from "@/errors";
import { buildTicketInputPaid, buildTicketTypeInput, buildUserInput } from "../factories";
import { buildRoomInput } from "../factories/rooms-factory";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";

describe('Bookings Service Unit Tests', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    describe('get booking', () => {
        it('should return booking data', async () => {
            const mockBooking: Booking & { Room: Room } = buildBookingRepoReturn();
            const mockBookingReturn: BookingParams = buildBookingServReturn(mockBooking);
            jest.spyOn(bookingRepository, "getBooking").mockResolvedValueOnce(mockBooking);

            const booking = await bookingService.getBooking(1);
            expect(booking).toEqual(mockBookingReturn);
        });

        it('should return notFoundError when booking is not found', async () => {
            jest.spyOn(bookingRepository, "getBooking").mockResolvedValueOnce(null);

            const promise = bookingService.getBooking(1);
            
            expect(promise).rejects.toEqual(notFoundError());
        });
    });

    // describe('post booking', () => {
    //     it('should create a booking and return its data', async () => {
    //         const mockTicketType: TicketType = buildTicketTypeInput();
    //         const mockTicket: Ticket & { TicketType: TicketType } = buildTicketInputPaid(mockTicketType, 1);

    //         jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockResolvedValueOnce(mockTicket);
    //     });
    // });
});