'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryApi, reportApi } from '@/lib/api';
import { CreateQueryRequest } from '@/types/api';

export const useCreateQuery = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateQueryRequest) => queryApi.create(data),
    onSuccess: () => {
      // Invalidate query history to refresh the list
      queryClient.invalidateQueries({ queryKey: ['queryHistory'] });
    },
  });
};

export const useQueryById = (queryId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['query', queryId],
    queryFn: () => queryApi.get(queryId),
    enabled,
  });
};

export const useQueryHistory = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['queryHistory', page, pageSize],
    queryFn: () => queryApi.getHistory(page, pageSize),
  });
};

export const useRiskAnalysis = (queryId: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['riskAnalysis', queryId],
    queryFn: () => reportApi.getRiskAnalysis(queryId),
    enabled,
    retry: false, // Don't retry failed requests (404 when not ready)
  });
};

export const useGenerateActionPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (queryId: number) => reportApi.generateActionPlan(queryId),
    onSuccess: (_, queryId) => {
      // Invalidate action plan query to refetch
      queryClient.invalidateQueries({ queryKey: ['actionPlan', queryId] });
    },
  });
};

export const useActionPlan = (queryId: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['actionPlan', queryId],
    queryFn: () => reportApi.getActionPlan(queryId),
    enabled,
    retry: false,
  });
};
