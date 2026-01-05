import { model, Schema, type Document } from "mongoose";

export enum OrderState {
    CREATED = "CREATED",
    ANALYSIS = "ANALYSIS",
    COMPLETED = "COMPLETED"
}

export enum OrderStatus {
    ACTIVE = 'ACTIVE',
    DELETED = 'DELETED',
}

export enum ServiceStatus {
    PENDING = 'PENDING',
    DONE = 'DONE',
}

export interface IService {
    name: string;
    value: number;
    status: ServiceStatus;
}

export interface IOrder {
    lab: string;
    patient: string;
    customer: string;
    state: OrderState;
    status: OrderStatus;
    services: IService[];
}

export interface IOrderDocument extends IOrder, Document {
    createdAt: Date;
    updatedAt: Date;
}

const serviceSchema = new Schema<IService>({
    name: {
        type: String,
        required: [true, "Service name is required"]
    },
    value: {
        type: Number,
        required: [true, "Service value is required"]
    },
    status: {
        type: String,
        enum: Object.values(ServiceStatus),
        default: ServiceStatus.PENDING
    }
},
    { _id: false })

const orderSchema = new Schema<IOrderDocument>({
    lab: {
        type: String,
        required: [true, "Lab name is required"],
        trim: true
    },
    patient: {
        type: String,
        required: [true, "Patient name is required"],
        trim: true
    },
    customer: {
        type: String,
        required: [true, "Customer name is required"],
        trim: true
    },
    state: {
        type: String,
        enum: Object.values(OrderState),
        default: OrderState.CREATED
    },
    status: {
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.ACTIVE
    },
    services: {
        type: [serviceSchema],
        required: [true, "Services are required"],
        validate: {
            validator: function (service: IService[]) {
                return service && service.length > 0
            },
            message: "Order must have al least one service"
        }
    }
},
    { timestamps: true })

orderSchema.pre("save", function () {
    const totalValue = this.services.reduce((sum, service) => sum + service.value, 0);
    if (totalValue <= 0) {
        throw new Error("Order total value must be greater than zero");
    }

})

export const Order = model<IOrderDocument>("Order", orderSchema);
