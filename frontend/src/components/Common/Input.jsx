import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-sm font-medium text-text-dim ml-1">{label}</label>}
      <input
        className={`input-field ${error ? 'border-error ring-error/20' : ''}`}
        {...props}
      />
      {error && <p className="text-xs text-error mt-1 ml-1">{error}</p>}
    </div>
  );
};

export default Input;
