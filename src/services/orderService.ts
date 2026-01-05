import { Order, OrderState, OrderStatus, type IOrderDocument } from "../models/Order";
import type { CreateOrderInput, GetOrdersQuery } from "../validators/orderValidator";

export class OrderService {
    private static readonly STATE_TRANSITIONS: Record<OrderState, OrderState | null> = {
        [OrderState.CREATED]: OrderState.ANALYSIS,
        [OrderState.ANALYSIS]: OrderState.COMPLETED,
        [OrderState.COMPLETED]: null,
    };

    /**
     * Create a new Order
     */
    async createOrder(orderData: CreateOrderInput): Promise<IOrderDocument> {
        const order = await Order.create(orderData)
        return order
    }

    /**
     * Get orders with pagination and optional state filter
     */
    async getOrders(query: GetOrdersQuery): Promise<{ orders: IOrderDocument[]; total: number; page: number; totalPages: number }> {
        const { page, limit, state } = query
        const skip = (page - 1) * limit
        const filter: { status: string, state?: OrderState } = { status: OrderStatus.ACTIVE }
        if (state) {
            filter.state = state
        }
        const [orders, total] = await Promise.all([
            Order.find(filter).skip(skip).limit(limit),
            Order.countDocuments(filter)
        ])
        return {
            orders,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        }
    }

    /*
    * Get order by ID
    */

    async getOrderById(id: string): Promise<IOrderDocument | null> {
        return Order.findById(id)
    }

    /*
    * Advance order state to next state
    * Follows strict sequence: CREATED -> ANALYSIS -> COMPLETED
    */
    async advanceOrderState(id: string): Promise<IOrderDocument | null> {
        const order = await Order.findById(id)
        if (!order) {
            throw new Error("Order not found")
        }
        if (order.status !== OrderStatus.ACTIVE) {
            throw new Error("Order is not active")
        }
        const currentState = order.state;
        const nextState = OrderService.STATE_TRANSITIONS[currentState]
        if (!nextState) {
            throw new Error("Invalid state transition")
        }
        if (nextState === null) {
            throw new Error(`Order is already in final state: ${currentState}`);
        }

        order.state = nextState;
        await order.save();

        return order;
    }

    /*
    * Validate if a state transition is valid 
    */

    static isValidTransition(currentState: OrderState, targetState: OrderState): boolean {
        return this.STATE_TRANSITIONS[currentState] === targetState
    }

    /*
     * Get next valid state for a given state 
     */
    static getNextValidState(currentState: OrderState): OrderState | null {
        return this.STATE_TRANSITIONS[currentState]
    }
}