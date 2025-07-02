import styles from './Footer.module.scss'
import ThemeToggle from '@/shared/components/ThemeToggle/ThemeToggle';

const Footer = () => {

    return (
        <footer className={styles.footer}>
            <ThemeToggle />
            <div>&copy; Nicolae Florescu</div>
        </footer>
    )
}

export default Footer;