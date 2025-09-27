import React from 'react';
import { useSelector } from 'react-redux';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import { RootState } from '../store/store';




export default function RootNavigator() {
  const token = useSelector((state: RootState) => state.auth.token);
  return token ? <AppNavigator /> : <AuthNavigator />;
}
