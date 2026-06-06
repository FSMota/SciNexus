// defina o componente MyButton
import React from 'react';

interface MyButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const MyButton = ({ onClick, children }: MyButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-5 py-2 bg-primary text-white hover:bg-primary-dark transition-colors"
    >
      {children}
    </button>
  );
}