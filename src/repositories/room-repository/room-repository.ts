import { prisma } from "@/config";

async function getRoomById(roomId: number) {
    return prisma.room.findFirst({
        where: { 
            id: roomId,
        },
    });
};

export default {
    getRoomById,
}