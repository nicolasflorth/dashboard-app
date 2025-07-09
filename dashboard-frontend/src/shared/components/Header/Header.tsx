import LogoutButton from "@/features/auth/components/LogoutButton/LogoutButton";
import styles from './Header.module.scss'
import { useSelector } from 'react-redux'
import { RootState } from "@/app/store";
import Navbar from "@/shared/components/Navbar/Navbar";
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import LanguageSelector from '@/shared/components/LanguageSelector/LanguageSelector';

const Header = () => {

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <header className={styles.header}>
            <ErrorBoundary>
                <LanguageSelector />
                <Navbar />
            </ErrorBoundary>
            {isAuthenticated && <LogoutButton />}
        </header>
    )
}

export default Header;