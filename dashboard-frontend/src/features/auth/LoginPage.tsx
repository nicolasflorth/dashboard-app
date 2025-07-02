import styles from '@/features/auth/styles/LoginPage.module.scss';
import { useAppSelector } from '@/app/hooks';
import { useAppDispatch } from '@/app/hooks';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/features/auth/authSlice';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { api } from '@/api/users';

const schema = z.object({
	email: z.string().nonempty("Email is required").email("Invalid email address"),
	password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters long"),
});

interface LoginResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  accessToken: string;
}

interface LoginInput {
  email: string;
  password: string;
  expiresInMins?: number;
}

type FormFields = z.infer<typeof schema>;

function LoginPage() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const user = useAppSelector((state) => state.auth.user);

	if (user) {
		console.log(user.roles);
	}

	const { register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting }
	} = useForm<FormFields>({
		defaultValues: {
			email: "",//test@test.com
			password: ""//emilyspass
		},
		resolver: zodResolver(schema),
	});

	const loginMutation: UseMutationResult<LoginResponse, any, LoginInput> = useMutation({
		mutationFn: (formData: FormFields) => api.login({
			email: formData.email,
			password: formData.password
		}),
		onSuccess: (data) => {
			dispatch(login({
				user: {
					_id: data._id,
					email: data.email,
					roles: data.roles,
				},
				token: data.accessToken,
			}));
			navigate('/dashboard');
		},
		onError: (error: any) => {
			setError("root", {
				message: error?.response?.data?.message || error.message || 'Login failed. Please try again.',
			});
			console.error("Login error:", error?.response?.data?.message || error.message);
		}
	});

	const onSubmit: SubmitHandler<FormFields> = (formData) => {
		console.log(formData);
		loginMutation.mutate(formData);
	};

	const onError = (errors: any) => {
		console.log("Form validation errors:", errors);
	};

	return (
		<main className={styles.loginForm}>
			<div>
				<h1>Login</h1>
				<form onSubmit={handleSubmit(onSubmit, onError)}>
					<input {...register("email")} type="text" placeholder="Email" />
					{errors.email && <span className={styles.error}>{errors.email.message}</span>}
					<input {...register("password")} type="password" placeholder="Password" />
					{errors.password && <span className={styles.error}>{errors.password.message}</span>}
					<button disabled={loginMutation.status === "pending"} type="submit">
						{loginMutation.status === "pending" ? "Loading..." : "Submit"}
					</button>
					{errors.root && <span className={styles.error}>{errors.root.message}</span>}
				</form>
			</div>
		</main>
	);
}

export default LoginPage;
