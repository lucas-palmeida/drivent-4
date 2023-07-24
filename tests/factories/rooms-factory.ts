import faker from "@faker-js/faker";

export function buildRoomInput() {
    return {
        id: faker.datatype.number({min: 0, max: 99}),
        name: "123",
        capacity: faker.datatype.number({min: 1, max: 4}),
        hotelId: faker.datatype.number({min: 1, max: 99}),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};