import type { FC } from 'react';

import logo from '../../assets/logo_white_transparent.png';

import './Header.scss';

interface HeaderProps {

}

const Header: FC<HeaderProps> = () => {
  return (
    <div className="header">
      <div className="header-left">
        <img src={logo} alt="logo" className="home-logo" onClick={() => window.location.href = '/'} />
      </div>
    </div>
  );
};

export default Header;
