import faker from '@faker-js/faker';
import { Enrollment, TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';

export async function createTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: faker.datatype.boolean(),
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}

export async function createTicketTypeRemote() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: true,
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicketTypeWithHotel() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
    },
  });
}

export async function createTicketTypeWithoutHotel() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: false,
    },
  });
}

export function buildTicketTypeInput() {
  return {
    id: faker.datatype.number({min: 0, max: 99}),
    name: faker.name.findName(),
    price: faker.datatype.number(),
    isRemote: false,
    includesHotel: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export function buildTicketTypeInputRemote() {
  return {
    id: faker.datatype.number({min: 0, max: 99}),
    name: faker.name.findName(),
    price: faker.datatype.number(),
    isRemote: true,
    includesHotel: faker.datatype.boolean(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export function buildTicketTypeInputWithoutHotel() {
  return {
    id: faker.datatype.number({min: 0, max: 99}),
    name: faker.name.findName(),
    price: faker.datatype.number(),
    isRemote: false,
    includesHotel: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export function buildTicketInputPaid(ticketType: TicketType, enrollmentId: number) {
  return {
    id: faker.datatype.number({min: 0, max: 99}),
    ticketTypeId: ticketType.id,
    enrollmentId,
    status: TicketStatus.PAID,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export function buildTicketInputReserved(enrollmentId: number, ticketTypeId: number) {
  return {
    id: faker.datatype.number({min: 0, max: 99}),
    ticketTypeId,
    enrollmentId,
    status: TicketStatus.RESERVED,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};