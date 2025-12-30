import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAppContext } from 'contexts/app/AppContext';
import { Themes, useTheme } from 'contexts/ThemeContext';

import Dropdown from 'components/Dropdown/Dropdown';
import { ButtonVariants } from 'components/Button/Button';
import { MoonIcon } from 'icons/MoonIcon';
import { SunIcon } from 'icons/SunIcon';

import styles from './Header.module.scss';

const Header: FC = () => {
  const { theme, toggleTheme } = useTheme();
  const {user, logout } = useAppContext();

  const location = useLocation();

  const headerLinks = [
    { label: 'Dashboard', value: '/dashboard'},
    { label: 'Accounts', value: '/accounts' },
    { label: 'Categories', value: '/categories' },
    { label: 'Importers', value: '/importers' },
  ];
  
  const activePage = headerLinks.find(headerLink => 
    location.pathname.startsWith(headerLink.value)
  );

  // TODO - replace select-style dropdown with proper menu
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        {user && (
          <Dropdown
            options={[ { label: user.name, value: user.id }, { label: 'Log Out', value: '' } ]}
            value={user.id}
            onChange={id => {
              if (!id) {
                logout();
              }
            }}
            buttonStyleVariant={ButtonVariants.GHOST}
            suppressArrow
            className={styles.userDropdown}
          />
        )}
      </div>
      <div className={styles.navLinks}>
        {user && headerLinks.map(headerLink => {
          const isCurrentPage = activePage?.value === headerLink.value;
          const linkStyle = [styles.navLink, isCurrentPage ? styles.active : ''].filter(Boolean).join(' ');

          return <Link key={headerLink.value} className={linkStyle} to={headerLink.value}>
            {headerLink.label}
          </Link>
        })}
      </div>
      <div className={styles.headerRight}>
        <span className={styles.themeToggleIcon} title={`Switch to ${theme === Themes.LIGHT ? 'Dark' : 'Light'} theme`} onClick={toggleTheme}>
          {theme === Themes.LIGHT ? <MoonIcon /> : <SunIcon />}
        </span>
      </div>
    </div>
  );
};

export default Header;
