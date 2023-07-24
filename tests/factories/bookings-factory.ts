import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { Booking, Room } from "@prisma/client";

export async function createBooking(userId: number, roomId: number) {
    return prisma.booking.create({
        data: {
            userId,
            roomId,
        },
    });
};

export function buildBookingRepoReturn() {
    return {
        id: faker.datatype.number({min: 1, max: 99}),
        userId: faker.datatype.number({min: 1, max: 99}),
        roomId: 123,
        Room: {
            id: 123, 
            name: '123', 
            capacity: faker.datatype.number({min: 1, max: 3}), 
            hotelId: faker.datatype.number({min: 1, max: 99}), 
            createdAt: new Date(), 
            updatedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

export function buildCreateBookingReturn(userId: number, room: Room) {
    return {
        id: faker.datatype.number({min: 1, max: 99}),
        userId,
        roomId: room.id,
        Room: room,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

export function buildBookingServReturn(mockBooking: Booking & { Room: Room }) {
    return {
        id: mockBooking.id,
        Room: {
            id: mockBooking.Room.id, 
            name: mockBooking.Room.name, 
            capacity: mockBooking.Room.capacity, 
            hotelId: mockBooking.Room.hotelId, 
            createdAt: mockBooking.Room.createdAt, 
            updatedAt: mockBooking.Room.updatedAt,
        },
    };
};