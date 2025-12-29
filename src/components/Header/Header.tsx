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
  const {user, logout, userLoading, userError } = useAppContext();

  const location = useLocation();

  // const userOptions = users?.map(user => ({ label: user.name, value: user.id })) ?? [];

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
        {userLoading && <span>Loading user...</span>}
        {userError && <span>Error loading user</span>}
        {user && (
          <Dropdown
            options={[ { label: user.name, value: user.id }, { label: 'logout', value: '' } ]}
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
        {headerLinks.map(headerLink => {
          const isCurrentPage = activePage!.value === headerLink.value;
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
