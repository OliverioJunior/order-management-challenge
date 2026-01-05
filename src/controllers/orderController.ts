import { OrderService } from "../services/orderService";

export class OrderController {
    constructor(
        private orderService: OrderService
    ) { }
}
