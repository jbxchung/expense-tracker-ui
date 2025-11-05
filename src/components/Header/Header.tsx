import type { FC } from 'react';

import { useTheme } from 'contexts/themeContext';

import logo from '../../assets/logo_white_transparent.png';

import styles from './Header.module.scss';

interface HeaderProps {

}

const Header: FC<HeaderProps> = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <img src={logo} alt="logo" className={styles.homeLogo} onClick={() => window.location.href = '/'} />
      </div>
      <div className={styles.headerRight}>
        <span className={styles.themeToggleIcon} onClick={toggleTheme}>
          click to toggle {theme} theme (todo: add icons)
        </span>
      </div>
    </div>
  );
};

export default Header;
