import type { FC } from 'react';

import { Themes, useTheme } from 'contexts/themeContext';
import { useUsers } from 'hooks/useUsers';

import { Dropdown } from 'components/Dropdown/Dropdown';
import { ButtonVariants } from 'components/Button/Button';
import { MoonIcon } from 'icons/MoonIcon';
import { SunIcon } from 'icons/SunIcon';

import styles from './Header.module.scss';

const Header: FC = () => {
  const { theme, toggleTheme } = useTheme();
  const {users, selectedUser, selectUser, loading, error } = useUsers();

  const userOptions = users?.map(user => ({ label: user.name, value: user.id })) ?? [];

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        {loading && <span>Loading users...</span>}
        {error && <span>Error loading users</span>}
        {!loading && !error && userOptions.length > 0 && (
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
      <div className={styles.headerRight}>
        <span className={styles.themeToggleIcon} title={`Switch to ${theme === Themes.LIGHT ? 'Dark' : 'Light'} theme`} onClick={toggleTheme}>
          {theme === Themes.LIGHT ? <MoonIcon /> : <SunIcon />}
        </span>
      </div>
    </div>
  );
};

export default Header;
