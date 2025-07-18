import nodemailer from 'nodemailer';

export const sendConfirmationEmail = async (email: string, token: string) => {
	const transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
		tls: {
			rejectUnauthorized: false, // only affects this mail transport
		},
	});

	const url = `${process.env.BACKEND_URL}/users/auth/confirm/${token}`;

	await transporter.sendMail({
		from: `"Dashboard App" <${process.env.EMAIL_USER}>`,
		to: email,
		subject: 'Confirm your email',
		html: `<p>Please confirm your email by clicking <a href="${url}">${url}</a></p>`,
	});
};
