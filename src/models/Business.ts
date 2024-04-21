import mongoose, { Schema } from 'mongoose';
import { MailInterface, PaymentInterface, BusinessInterface, AddressSchema } from '@/models/index';

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
}, { _id: false });

const MailSchema: Schema<MailInterface> = new Schema({
    userEmail: {
        type: String,
        required: true
    },
    userPassword: {
        type: String,
        required: true
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
    paymentDetails: PaymentSchema,
    mailCredentials: MailSchema
});

const BusinessModel = (mongoose.models.Business as mongoose.Model<BusinessInterface>) || mongoose.model<BusinessInterface>('Business', BusinessSchema);

export default BusinessModel;