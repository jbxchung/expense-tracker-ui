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
  const {users, selectedUser, selectUser, usersLoading, usersError } = useAppContext();

  const location = useLocation();

  const userOptions = users?.map(user => ({ label: user.name, value: user.id })) ?? [];

  const headerLinks = [
    { label: 'Dashboard', value: '/dashboard'},
    { label: 'Accounts', value: '/accounts' },
    { label: 'Categories', value: '/categories' },
    { label: 'Importers', value: '/importers' },
  ];
  
  const activePage = headerLinks.find(headerLink => 
    location.pathname.startsWith(headerLink.value)
  );

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        {usersLoading && <span>Loading users...</span>}
        {usersError && <span>Error loading users</span>}
        {!usersLoading && !usersError && userOptions.length > 0 && (
          <Dropdown
            options={userOptions}
            value={selectedUser?.id}
            onChange={id => {
              const newUser = users.find(u => u.id === id);
              if (newUser) selectUser(newUser);
            }}
            placeholder='Select user'
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
