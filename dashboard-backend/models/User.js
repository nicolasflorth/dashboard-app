import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	gender: { type: String, enum: ['male', 'female'], required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	image: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	refreshToken: { type: String }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

const User = mongoose.model('User', userSchema);
export default User;