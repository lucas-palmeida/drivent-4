import { prisma } from "@/config";

async function getBooking(userId: number) {
    return prisma.booking.findFirst({
        where: { userId },
        include: {
            Room: true,
        },
    });
};

async function getBookingsByRoomId(roomId: number) {
    return prisma.booking.count();
};

async function createBooking(userId: number, roomId: number) {
    return prisma.booking.create({
        data: { userId, roomId },
    });
};

async function updateBooking(bookingId: number, roomId: number) {
    return prisma.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            roomId,
        },
    });
};

export default { 
    getBooking,
    getBookingsByRoomId,
    createBooking,
    updateBooking,
};