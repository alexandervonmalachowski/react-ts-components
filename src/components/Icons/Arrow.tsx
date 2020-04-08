import React from 'react';
interface IArrowProps {
  color: string;
}
const Arrow: React.FC<IArrowProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="17"
      viewBox="0 0 24 17"
      cursor="pointer"
    >
      <path fill="none" d="M0,0H24V13H0Z" />
      <path
        fill={props.color}
        d="M20,11H7.83l5.59-5.59L12,4,4,12l8,8,1.41-1.41L7.83,13H20Z"
        transform="translate(0 -3)"
      />
    </svg>
  );
};
export default Arrow;
