import React from 'react';

const Link = ({ 
  href = "#", 
  children, 
  className = "",
  target,
  rel,
  onClick,
  ...props 
}) => {
  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={handleClick}
      className={`hover:opacity-80 transition-opacity ${className}`}
      {...props}
    >
      {children}
    </a>
  );
};

export default Link;

