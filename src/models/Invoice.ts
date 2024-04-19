import mongoose, { Schema } from 'mongoose';
import { ProductInterface, InvoiceInterface, AddressSchema } from "@/models/index";

const ProductSchema: Schema<ProductInterface> = new Schema({
    item: {
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
});

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
    shippingAddress: AddressSchema,
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
    taxRate: {
        type: Number
    },
    taxType: {
        type: String
    },
    discount: {
        type: Number
    },
    paymentMode: {
        type: String,
        required: true
    },
    productDetails: [ProductSchema]
}, { timestamps: true });

const InvoiceModel = (mongoose.models.Invoice as mongoose.Model<InvoiceInterface>) || mongoose.model<InvoiceInterface>('Invoice', InvoiceSchema);

export default InvoiceModel;