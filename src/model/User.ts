import mongoose, {Document, Schema} from "mongoose";


export interface Message extends Document{
    content: string,
    replyEmail: string,
    replyMessage: string,
    replied: boolean,
    createdAt: Date,
    label: string,
    score: number
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },

    replyEmail: {
        type: String,
        match: [/.+\@.+\..+/, "Please enter a valid email"]
    },

    replyMessage: {
        type: String,
    },

    replied: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },

    label: {
        type: String
    },

    score: {
        type: Number
    }
})


export interface User extends Document{
    username: string,
    email: string,
    password: string,
    otpCode: string,
    otpExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    messages: mongoose.Types.DocumentArray<Message>
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "Please enter a valid email"]
    },

    password: {
        type: String,
        required: [true, "Password is required"],
    },
    
    otpCode: {
        type: String,
    },

    otpExpiry: {
        type: Date,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },

    messages: [messageSchema]
})

const userModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", userSchema));
export default userModel;
