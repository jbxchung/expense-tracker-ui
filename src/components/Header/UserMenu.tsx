import { useState, useRef, useEffect, type FC } from 'react';
import { useTheme } from 'contexts/themeContext';
import styles from './Header.module.scss';

interface UserMenuProps {
  username: string;
  onChangeSettings: () => void;
}

const UserMenu: FC<UserMenuProps> = ({ username, onChangeSettings }) => {
  const [open, setOpen] = useState(false);
  const { toggleTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setOpen(prev => !prev);

  // Close dropdown if click is outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.userMenu} ref={menuRef}>
      <span className={styles.userMenuTrigger} onClick={handleToggle}>
        {username} ▾
      </span>
      {open && (
        <div className={styles.userMenuDropdown}>
          <button
            type="button"
            className={styles.dropdownItem}
            onClick={() => {
              onChangeSettings();
              setOpen(false);
            }}
          >
            Change User Settings
          </button>
          <button
            type="button"
            className={styles.dropdownItem}
            onClick={() => {
              toggleTheme();
              setOpen(false);
            }}
          >
            Toggle Theme
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
