import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.scss';
import { useAppSelector } from '@/app/hooks';

const Navbar = () => {

    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    return (
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
                <li>
                    <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        Home
                    </NavLink>
                </li>
                {
                    isAuthenticated &&
                    <>
                        <li>
                            <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                                Dashboard
                            </NavLink>
                        </li>
                    </>
                }
                {
                    !isAuthenticated &&
                    <li className={styles.navItem}>
                        <NavLink to="/login" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                            Login
                        </NavLink>
                    </li>
                }
            </ul>
        </nav>
    );
};

export default Navbar;
