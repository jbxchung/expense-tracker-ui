import type { FC } from 'react';

import { Themes, useTheme } from 'contexts/themeContext';

import logoBlack from '../../assets/logo_black_transparent.png';
import logoWhite from '../../assets/logo_white_transparent.png';

import styles from './Header.module.scss';
import UserMenu from './UserMenu';

const THEME_LOGO_MAP = {
  [Themes.DARK]: logoWhite,
  [Themes.LIGHT]: logoBlack,
};

const Header: FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <img src={THEME_LOGO_MAP[theme]} alt="logo" className={styles.homeLogo} onClick={() => window.location.href = '/'} />
      </div>
      <div className={styles.headerRight}>
        <UserMenu username="JohnDoe" onChangeSettings={() => alert('Change User Settings clicked')} />
        {/* <span className={styles.themeToggleIcon} onClick={toggleTheme}>
          click to toggle {theme} theme (todo: add icons)
        </span> */}
      </div>
    </div>
  );
};

export default Header;
