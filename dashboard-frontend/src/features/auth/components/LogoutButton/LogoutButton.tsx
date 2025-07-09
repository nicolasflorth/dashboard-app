import { useDispatch } from "react-redux";
import { useMutation } from '@tanstack/react-query';
import { logout } from "@/features/auth/authSlice";
import styles from '@/features/auth/styles/LogoutButton.module.scss';
import { api } from "@/api/users";
import { useTranslation } from "react-i18next";

const LogoutButton = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { mutate: logoutUser, isPending } = useMutation({
        mutationFn: api.logout,
        onSuccess: () => {
            dispatch(logout()); // clear redux state
        },
        onError: (error) => {
            console.error("Logout failed:", error);
        }
    })

    return (
        <button
            className={styles.logoutButton}
            onClick={() => logoutUser()}
            disabled={isPending}
            data-testid="logout-button"
        >
            {isPending ? t("loggingOut") : t("logout")}
        </button>
    );
}

export default LogoutButton;