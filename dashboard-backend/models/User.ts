import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
	_id: Types.ObjectId;
	username: string;
	email: string;
	password: string;
	gender?: 'male' | 'female';
	firstName: string;
	lastName: string;
	image?: string;
	createdAt: Date;
	refreshToken?: string;
	activated: boolean;
}

const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	gender: { type: String, enum: ['male', 'female'], required: false },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	image: { type: String, required: false },
	roles: { type: [String], default: ['user'] },
	createdAt: { type: Date, default: Date.now },
	refreshToken: { type: String },
	activated: { type: Boolean, default: false },
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;