import React from 'react';

const Loader = ({ fullPage = false }) => {
  const content = (
    <div className="flex items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  if (fullPage) {
    return <div className="fixed inset-0 bg-white/80 z-[100] flex items-center justify-center">{content}</div>;
  }

  return content;
};

export default Loader;
