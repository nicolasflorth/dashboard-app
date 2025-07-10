import styles from '@/features/auth/styles/LoginPage.module.scss';
import { useMemo, useEffect } from 'react';
import { useAppSelector } from '@/app/hooks';
import { useAppDispatch } from '@/app/hooks';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/features/auth/authSlice';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { api } from '@/api/users';
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

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

const createLoginSchema = (t: TFunction) =>
	z.object({
		email: z.string().nonempty(t("emailRequired")).email(t("invalidEmail")),
		password: z
			.string()
			.nonempty(t("passwordRequired"))
			.min(6, t("invalidPassword", { min: 6 })),
	});


function LoginPage() {
	const { t, i18n } = useTranslation();

	const schema = useMemo(() => createLoginSchema(t), [i18n.language]);
	type FormFields = z.infer<typeof schema>;

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const user = useAppSelector((state) => state.auth.user);

	if (user) {
		console.log(user.roles);
	}

	const {
		register,
		handleSubmit,
		setError,
		reset,
		formState: { errors, isSubmitting }
	} = useForm<FormFields>({
		defaultValues: {
			email: '',
			password: '',
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
				message: error?.response?.data?.message || error.message || t("login") + ' ' + t("failed") + ' ' + t("tryAgain"),
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

	useEffect(() => {
	if (Object.keys(errors).length > 0) {
		// clear errors when language changes
		reset(undefined, { keepValues: true });
	}
	}, [i18n.language]);

	return (
		<main className={styles.loginForm}>
			<div>
				<h1>{t("login")}</h1>
				<form onSubmit={handleSubmit(onSubmit, onError)}>
					<input {...register("email")} type="text" placeholder={t("email")} />
					{errors.email && <span className={styles.error}>{errors.email.message}</span>}
					<input {...register("password")} type="password" placeholder={t("password")} />
					{errors.password && <span className={styles.error}>{errors.password.message}</span>}
					<button disabled={loginMutation.status === "pending"} type="submit">
						{loginMutation.status === "pending" ? t("loading") : t("submit")}
					</button>
					{errors.root && <span className={styles.error}>{errors.root.message}</span>}
				</form>
			</div>
		</main>
	);
}

export default LoginPage;
