import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.scss';
import { useAppSelector } from '@/app/hooks';
import { useTranslation } from "react-i18next";

const Navbar = () => {
    const { t } = useTranslation();

    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    return (
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
                <li>
                    <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        {t("home")}
                    </NavLink>
                </li>
                {
                    isAuthenticated &&
                    <>
                        <li>
                            <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                                {t("dashboard")}
                            </NavLink>
                        </li>
                    </>
                }
                {
                    !isAuthenticated &&
                    <li className={styles.navItem}>
                        <NavLink to="/login" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                            {t("login")}
                        </NavLink>
                    </li>
                }
            </ul>
        </nav>
    );
};

export default Navbar;
