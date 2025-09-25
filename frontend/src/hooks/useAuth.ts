'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../lib/api';
import { LoginRequest, SignupRequest } from '@/types/auth';
import { setAuthData } from '../lib/auth';
import { useAuth } from '@/contexts/AuthContext';

export const useLogin = () => {
  const { setUser } = useAuth();
  
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (authResponse) => {
      setAuthData(authResponse.access_token, authResponse.user);
      setUser(authResponse.user);
    },
  });
};

export const useSignup = () => {
  const { setUser } = useAuth();
  
  return useMutation({
    mutationFn: (data: SignupRequest) => authApi.signup(data),
    onSuccess: (authResponse) => {
      setAuthData(authResponse.access_token, authResponse.user);
      setUser(authResponse.user);
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
    enabled: false, // We'll enable this manually when needed
  });
};
