import React from "react";

const ClerkLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-r from-blue-700 to-green-300">
      {children}
    </div>
  );
};

export default ClerkLayout;
