import React from 'react';
export const LoadingContext = React.createContext(null);
export const useLoading = () => React.useContext(LoadingContext);

