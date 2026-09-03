'use client';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { AdminUserListResponse } from '../interfaces/users.interface';
import {
  callChangeKYCStatus,
  callGetKYCDetails,
  callGetKYCPending,
} from '../services/users-service';
import { safeAny } from '../interfaces/global.interface';
import { ONBOARDING_STATUS } from '../enum';

export const useFetchKYC = () => {
  return useMutation({
    mutationFn: (userId: string) => callGetKYCDetails(userId),
  });
};

export const useFetchKYCPending = ({
  search,
  page,
  limit,
}: {
  search: string;
  page: number;
  limit: number;
}): UseQueryResult<[AdminUserListResponse | null, safeAny], Error> => {
  return useQuery({
    queryKey: ['kyc-pending'],
    queryFn: () => callGetKYCPending(search, page, limit),
    refetchOnWindowFocus: true, // Refetch when the window is focuse
  });
};

export const useChangeKYCStatus = () => {
  return useMutation({
    mutationFn: ({
      userId,
      onboardingStatus,
    }: {
      userId: string;
      onboardingStatus: ONBOARDING_STATUS;
    }) => callChangeKYCStatus(userId, onboardingStatus),
  });
};
