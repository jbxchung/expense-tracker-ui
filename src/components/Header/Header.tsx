import type { FC } from 'react';

import logo from '../../assets/logo_white_transparent.png';

import styles from './Header.module.scss';

interface HeaderProps {

}

const Header: FC<HeaderProps> = () => {
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <img src={logo} alt="logo" className={styles.homeLogo} onClick={() => window.location.href = '/'} />
      </div>
    </div>
  );
};

export default Header;
