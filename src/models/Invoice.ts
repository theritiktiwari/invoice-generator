import mongoose, { Schema } from 'mongoose';
import { ItemInterface, InvoiceInterface, AddressSchema } from "@/models/index";

const ItemSchema: Schema<ItemInterface> = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, { _id: false });

export const InvoiceSchema: Schema<InvoiceInterface> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    businessId: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    billingAddress: AddressSchema,
    invoiceNumber: {
        type: String,
        required: true
    },
    invoiceDate: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    paymentMode: {
        type: String,
        enum: ['UPI', 'NET_BANKING', 'COD'],
        required: true
    },
    productDetails: [ItemSchema]
}, { timestamps: true });

const InvoiceModel = (mongoose.models.Invoice as mongoose.Model<InvoiceInterface>) || mongoose.model<InvoiceInterface>('Invoice', InvoiceSchema);

export default InvoiceModel;