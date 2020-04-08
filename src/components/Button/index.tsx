import React, { useState } from 'react';
import styles from './_button.scss';
import classnames from 'classnames';

interface IButtonProps {
  type: 'primary' | 'secondary';
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<IButtonProps> = (props) => {
  const {
    onMouseEnter,
    onMouseLeave,
    onClick,
    children,
    type,
    className,
  } = props;
  const [hoverd, setHoverd] = useState(false);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onMouseEnter) {
      onMouseEnter(e);
    } else {
      setHoverd(true);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onMouseLeave) {
      onMouseLeave(e);
    } else {
      setHoverd(false);
    }
  };

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={classnames(
        styles.button,
        {
          [styles.primary]: type === 'primary',
          [styles.secondary]: type === 'secondary',
          [styles.hover]: hoverd,
        },
        className ? className : ''
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleOnClick}
    >
      {children}
    </button>
  );
};

export default Button;
