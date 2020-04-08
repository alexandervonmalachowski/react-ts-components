import React from 'react';
import styles from './_button.scss';
import classnames from 'classnames';

interface IButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type: 'primary' | 'secondary';
}

const Button: React.FC<IButtonProps> = (props) => {
  const { onClick, children, type } = props;
  return (
    <button
      className={classnames(styles.button, {
        [styles.primary]: type === 'primary',
        [styles.secondary]: type === 'secondary',
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
