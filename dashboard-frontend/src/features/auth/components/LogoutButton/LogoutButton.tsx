import { useDispatch } from "react-redux";
import { useMutation } from '@tanstack/react-query';
import { logout } from "@/features/auth/authSlice";
import styles from '@/features/auth/styles/LogoutButton.module.scss';
import { api } from "@/api/users";

const LogoutButton = () => {
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
            {isPending ? 'Logging out...' : 'Logout'}
        </button>
    );
}

export default LogoutButton;