/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { createContext, useState, useContext } from "react";

const KycContext = createContext();

export const useKyc = () => {
  return useContext(KycContext);
};

export const KycProvider = ({ children }) => {
  const [kycStatus, setKycStatus] = useState(null);

  return (
    <KycContext.Provider value={{ kycStatus, setKycStatus }}>
      {children}
    </KycContext.Provider>
  );
};
