import { Schema, Document } from "mongoose";

// Common Interfaces
export interface FullNameInterface extends Document {
    firstName: string;
    lastName?: string;
}

export interface AddressInterface extends Document {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    pincode: string;
}

export interface PaymentInterface extends Document {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    upiId: string;
}

export interface ItemInterface extends Document {
    name: string;
    price: number;
    quantity: number;
}

export interface MailInterface extends Document {
    userEmail: string;
    userPassword: string;
}

export interface BusinessInterface extends Document {
    userId: Schema.Types.ObjectId;
    businessName: string;
    businessLogo?: string; // cloudinary url
    businessEmail?: string;
    businessWebsite?: string;
    businessAddress: AddressInterface;
    businessGST?: string;
    businessPAN?: string;
    businessSignature: string; // cloudinary url
    paymentDetails: PaymentInterface;
    mailCredentials?: MailInterface;
}

export interface UserInterface extends Document {
    fullName: FullNameInterface;
    email: string;
    password: string;
    role: string;
    isVerified: boolean;
    verifyCode: string;
    verifiedCodeExpiry: Date;
    businessDetails: BusinessInterface[];
}

export interface InvoiceInterface extends Document {
    userId: Schema.Types.ObjectId;
    businessId: Schema.Types.ObjectId;
    billingAddress: AddressInterface;
    shippingAddress?: AddressInterface;
    invoiceNumber: string;
    invoiceDate: string;
    currency: string;
    taxRate?: number;
    taxType?: string;
    discount?: number;
    paymentMode: string;
    productDetails: ItemInterface[];
}

// Common Schemas
export const AddressSchema: Schema<AddressInterface> = new Schema({
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String,
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    }
}, { _id: false });