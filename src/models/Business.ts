import mongoose, { Schema } from 'mongoose';
import { AddressSchema, PaymentInterface, BusinessInterface } from '@/models/index';

const PaymentSchema: Schema<PaymentInterface> = new Schema({
    accountNumber: {
        type: String,
        required: true
    },
    ifscCode: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    upiId: {
        type: String,
        required: true
    }
});

export const BusinessSchema: Schema<BusinessInterface> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    businessName: {
        type: String,
        required: true
    },
    businessLogo: {
        type: String,
        required: true
    },
    businessEmail: {
        type: String,
        required: true
    },
    businessWebsite: {
        type: String,
        required: true
    },
    businessGST: {
        type: String,
        required: true
    },
    businessPAN: {
        type: String,
        required: true
    },
    businessSignature: {
        type: String,
        required: true
    },
    businessAddress: AddressSchema,
    paymentDetails: PaymentSchema
});

const BusinessModel = (mongoose.models.Business as mongoose.Model<BusinessInterface>) || mongoose.model<BusinessInterface>('Business', BusinessSchema);

export default BusinessModel;