import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumbs.module.scss'
import { capitalize } from '@/utils/capitalise';
import { useTranslation } from "react-i18next";

export default function Breadcrumbs() {
	const { t } = useTranslation();
	const location = useLocation();
	const pathnames = location.pathname.split('/').filter(Boolean);

	return (
		<nav className={styles.breadcrumb} aria-label="breadcrumb">
			<Link to="/">{t('breadcrumbs.home')}</Link>&gt;
			{pathnames.map((value, index) => {
				const to = `/${pathnames.slice(0, index + 1).join('/')}`;
				const isLast = index === pathnames.length - 1;

				const label = t(`breadcrumbs.${value}`, capitalize(value)); // fallback to capitalized path

				return (
					<span key={index}>
						{isLast ? (
							<span>{label}</span>
						) : (
							<>
								<Link to={to}>{label}</Link>
								&gt;
							</>
						)}
					</span>
				);
			})}
		</nav>
	);
}