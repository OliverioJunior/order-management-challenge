import z from "zod";
import { OrderState, ServiceStatus } from "../models/Order";

export const serviceSchema = z.object({
    name: z.string().min(1, "Service name is required"),
    value: z.number().nonnegative("Service value cannot be negative"),
    status: z.enum([ServiceStatus.PENDING, ServiceStatus.DONE])
})

export const createrOrderSchema = z.object({
    lab: z.string().min(1, "Lab name is required"),
    patient: z.string().min(1, "Patient name is required"),
    customer: z.string().min(1, "Customer name is required"),
    services: z.array(serviceSchema).min(1, "At least one service is required").refine((services) => {
        return services.every((service) => service.value > 0)
    }, "Order total value must be greater than zero")
})

export const getOrdersQuerySchema = z.object({
    page: z.string().optional().default("1").transform(Number),
    limit: z.string().optional().default("10").transform(Number),
    state: z.enum(OrderState).optional(),
})

export type GetOrdersQuery = z.infer<typeof getOrdersQuerySchema>
export type CreateOrderInput = z.infer<typeof createrOrderSchema>