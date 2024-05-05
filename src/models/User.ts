import mongoose, { Schema } from 'mongoose';
import { FullNameInterface, UserInterface } from "@/models/index";
import { BusinessSchema } from "@/models/Business";

const FullNameSchema: Schema<FullNameInterface> = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    }
}, { _id: false });

const UserSchema: Schema<UserInterface> = new Schema({
    fullName: FullNameSchema,
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyCode: {
        type: String,
        required: [true, 'Verification code is required']
    },
    verifiedCodeExpiry: {
        type: Date,
        required: [true, 'Verification code expiry is required']
    },
    businessDetails: [{
        type: Schema.Types.ObjectId,
        ref: 'Business',
        default: []
    }],
}, { timestamps: true });

const UserModel = (mongoose.models.User as mongoose.Model<UserInterface>) || mongoose.model<UserInterface>('User', UserSchema);

export default UserModel;