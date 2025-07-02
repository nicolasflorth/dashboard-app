import styles from './LoginPage.module.scss';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import { login } from '@/features/auth/authSlice';


const schema = z.object({
	email: z.string().email("Invalid email address").nonempty("Email is required"),
	password: z.string().min(6, "Password must be at least 6 characters long").nonempty("Password is required"),
});

type FormFields = z.infer<typeof schema>;

function LoginPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting }
	} = useForm<FormFields>({
		defaultValues: {
			email: "test@",
			password: ""
		},
		resolver: zodResolver(schema),
	});

	const loginUser = async () => {
		// Simulate a login request
		try {
			const response = await fetch('https://dummyjson.com/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					username: 'emilys',
					password: 'emilyspass',
					expiresInMins: 30,
				}),
			});

			if (!response.ok) {
				throw new Error(`Login failed with status ${response.status}`);
			}

			const data = await response.json();
			console.log(data);
			return data;
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		}
	}

	const onSubmit: SubmitHandler<FormFields> = async (data) => {
		console.log(data);
		try {
			const loginResult = await loginUser();
			Cookies.set("token", loginResult.token, { expires: 1 });
			dispatch(login({ user: loginResult.user, token: loginResult.token }));
			navigate('/dashboard');
			throw new Error("Email already taken");
		} catch (error) {
			setError("root", {
				message: "Login failed. Please try again.",
			});
		}
	}

	const onError = (errors: any) => {
		console.log("Form validation errors:", errors);
	};

	return (
		<main className={styles.loginForm}>
			<h1>Login</h1>
			<form onSubmit={handleSubmit(onSubmit, onError)}>
				<input {...register("email")} type="text" placeholder="Email" />
				{errors.email && <span className={styles.error}>{errors.email.message}</span>}
				<input {...register("password")} type="password" placeholder="Password" />
				{errors.password && <span className={styles.error}>{errors.password.message}</span>}
				<button disabled={isSubmitting} type="submit">{isSubmitting ? "Loading..." : "Submit"}</button>
				{errors.root && <span className={styles.error}>{errors.root.message}</span>}
			</form>
		</main>
	);
}

export default LoginPage;
