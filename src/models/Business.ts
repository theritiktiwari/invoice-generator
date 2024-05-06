import mongoose, { Schema } from 'mongoose';
import { PaymentInterface, BusinessInterface, AddressSchema } from '@/models/index';

const PaymentSchema: Schema<PaymentInterface> = new Schema({
    accountNumber: {
        type: String,
    },
    ifscCode: {
        type: String,
    },
    bankName: {
        type: String,
    },
    upiId: {
        type: String,
    }
}, { _id: false });

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
    },
    businessEmail: {
        type: String,
    },
    businessWebsite: {
        type: String,
    },
    businessGST: {
        type: String,
    },
    businessPAN: {
        type: String,
    },
    businessSignature: {
        type: String,
        required: true
    },
    businessAddress: AddressSchema,
    paymentDetails: PaymentSchema
}, { timestamps: true });

const BusinessModel = (mongoose.models.Business as mongoose.Model<BusinessInterface>) || mongoose.model<BusinessInterface>('Business', BusinessSchema);

export default BusinessModel;