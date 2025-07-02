import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumbs.module.scss'
import { capitalize } from '@/utils/capitalise';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  return (
    <nav className={styles.breadcrumb} aria-label="breadcrumb">
      <Link to="/">Home</Link>&gt;
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return (
          <span key={index}>
            {isLast ? (
              <span>{capitalize(decodeURIComponent(value))}</span>
            ) : (
              <>
                <Link to={to}>{capitalize(decodeURIComponent(value))}</Link>
                &gt;
              </>
            )}
          </span>
        );
      })}
    </nav>
  );
}