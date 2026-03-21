import React from 'react';

const Button = ({ children, loading, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "relative flex items-center justify-center font-semibold transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "btn-primary",
    outline: "border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary px-6 py-2 rounded-xl",
    secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10 px-6 py-2 rounded-xl"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : children}
    </button>
  );
};

export default Button;
