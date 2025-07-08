import { useEffect } from 'react';
import styles from './Popup.module.scss'
import { motion, AnimatePresence } from 'framer-motion';

type PopupProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        }

        document.addEventListener('keydown', handleEscape);

        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.popupOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleOverlayClick}>
                    <motion.div
                        className={styles.popupContent}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <button className={styles.close} onClick={onClose}>Close</button>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Popup;