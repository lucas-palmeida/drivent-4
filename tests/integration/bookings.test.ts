import app, { init } from "@/app";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createEnrollmentWithAddress, createHotel, createRoomWithHotelId, createRoomWithZeroCapacity, createTicket, createTicketType, createTicketTypeRemote, createTicketTypeWithHotel, createTicketTypeWithoutHotel, createUser } from "../factories";
import * as jwt from "jsonwebtoken";
import { TicketStatus } from "@prisma/client";
import { createBooking } from "../factories/bookings-factory";
import { prisma } from "@/config";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 200 and booking data', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);
            const booking = await createBooking(user.id, room.id);
            
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
        
            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
                id: booking.id,
                Room: {
                    id: room.id,
                    name: room.name,
                    capacity: room.capacity,
                    hotelId: room.hotelId,
                    createdAt: room.createdAt.toISOString(),
                    updatedAt: room.updatedAt.toISOString(),
                },
            });
        });

        it('should respond with status 404 when user doesnt have a booking', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
        
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
    });
});

describe('POST /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/booking');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 200 and booking id', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);

            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
                bookingId: expect.any(Number),
            });
        });

        it('should insert a new booking in the database', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);

            const beforeCount = await prisma.booking.count();

            await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      
            const afterCount = await prisma.booking.count();
      
            expect(beforeCount).toEqual(0);
            expect(afterCount).toEqual(1);
        });

        it('should respond with status 403 when ticket type is remote', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 403 when ticket type doesnt includes hotel', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithoutHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 403 when ticket doesnt have been paid', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
      
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 404 when room doesnt exist', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 403 when room is already full', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoomWithZeroCapacity(hotel.id);

            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });
    });
});

describe('PUT /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.put('/booking');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.put('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.put('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 200 and booking id', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);
            const updateRoom = await createRoomWithHotelId(hotel.id);
            const booking = await createBooking(user.id, room.id);

            const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({ roomId: updateRoom.id });

            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
                bookingId: expect.any(Number),
            });
        });

        it('should respond with status 403 when user doesnt have a booking yet', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });

            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 404 when room doesnt exist', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);
            const booking = await createBooking(user.id, room.id);

            const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({ roomId: 1 });

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 403 when room is already full', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);
            const booking = await createBooking(user.id, room.id);
            const updateRoom = await createRoomWithZeroCapacity(hotel.id);

            const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({ roomId: updateRoom.id });

            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });
    });
});