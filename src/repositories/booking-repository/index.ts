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
    return prisma.booking.findMany({
        where: { roomId },
    });
};

async function createBooking(userId: number, roomId: number) {
    return prisma.booking.create({
        data: { userId, roomId },
    });
};

export default { 
    getBooking,
    getBookingsByRoomId,
    createBooking,
};