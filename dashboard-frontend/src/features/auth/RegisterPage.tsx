import styles from './styles/RegisterPage.module.scss';
import { useMemo, useEffect } from 'react';
import { useAppSelector } from '@/app/hooks';
import { useAppDispatch } from '@/app/hooks';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { useSnackbar } from 'notistack';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { api } from '@/api/users';


interface RegisterResponse {
	message: string;
}

interface RegisterInput {
	email: string;
	username: string;
	password: string;
	firstName: string;
	lastName: string;
}

const createRegisterSchema = (t: TFunction) =>
	z.object({
		username: z.string().nonempty(t("fieldRequired")).min(2, t("invalidFieldLength", { min: 2 })),
		email: z.string().nonempty(t("emailRequired")).email(t("invalidEmail")),
		password: z.string().nonempty(t("passwordRequired")).min(6, t("invalidPassword", { min: 6 })),
		firstName: z.string().nonempty(t("fieldRequired")).min(2, t("invalidFieldLength", { min: 2 })),
		lastName: z.string().nonempty(t("fieldRequired")).min(2, t("invalidFieldLength", { min: 2 })),
		gender: z.string().optional(),
	});

function RegisterPage() {
	const { t, i18n } = useTranslation();
  	const { enqueueSnackbar } = useSnackbar();

	const schema = useMemo(() => createRegisterSchema(t), [i18n.language]);
	type RegisterFormFields = z.infer<typeof schema>;

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
	} = useForm<RegisterFormFields>({
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: zodResolver(schema),
	});

	const registerMutation: UseMutationResult<RegisterResponse, any, RegisterInput> = useMutation({
		mutationFn: (formData: RegisterFormFields) => api.register(formData),
		onSuccess: (data) => {
			enqueueSnackbar(data.message || "Check your email to confirm your account!", { variant: 'success' });
			navigate('/login');
		},
		onError: (error) => {
			enqueueSnackbar(error.response?.data.message || "Something went wrong", { variant: 'error' });
		}
	});

	const onSubmit: SubmitHandler<RegisterFormFields> = (formData) => {
		console.log(formData);
		registerMutation.mutate(formData);
	};

	const onError = (errors: any) => {
		console.log("Form validation errors:", errors);
	};

	return (
		<main className={styles.registerForm}>
			<h1>{t("register")}</h1>
			<form onSubmit={handleSubmit(onSubmit, onError)}>
				<input {...register("email")} type="text" placeholder={t("email")} />
				{errors.email && <span className={styles.error}>{errors.email.message}</span>}

				<input {...register("username")} type="text" placeholder={t("username")} />
				{errors.username && <span className={styles.error}>{errors.username.message}</span>}

				<input {...register("password")} type="password" placeholder={t("password")} />
				{errors.password && <span className={styles.error}>{errors.password.message}</span>}

				<input {...register("firstName")} type="text" placeholder={t("firstName")} />
				{errors.firstName && <span className={styles.error}>{errors.firstName.message}</span>}

				<input {...register("lastName")} type="text" placeholder={t("lastName")} />
				{errors.lastName && <span className={styles.error}>{errors.lastName.message}</span>}

				<button disabled={registerMutation.status === "pending"} type="submit">
					{registerMutation.status === "pending" ? t("loading") : t("submit")}
				</button>
				{errors.root && <span className={styles.error}>{errors.root.message}</span>}
			</form>
		</main>
	);
}

export default RegisterPage;
