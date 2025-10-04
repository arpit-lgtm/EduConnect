import React from 'react';
import MainScreen from './src/screens/MainScreen';

const Main = ({ user, onLogout }) => {
  return <MainScreen user={user} onLogout={onLogout} />;
};

export default Main;
