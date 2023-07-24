import { prisma } from "@/config";

async function getRoomById(id: number) {
    return prisma.room.findFirst({
        where: { id },
    });
};

export default {
    getRoomById,
}