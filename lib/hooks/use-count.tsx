import { useMutation, useQuery } from '@tanstack/react-query';
import { editCountRequest } from '../interfaces/users.interface';
import {
  callAllCounts,
  callGetCount,
  callEditCount,
} from '../services/users-service';

export const useEditCount = () => {
  return useMutation({
    mutationFn: (data: editCountRequest) => {
      return callEditCount(data);
    },
  });
};

export const useGetCount = (userId: string) => {
  return useQuery({
    queryKey: ['count'],
    queryFn: () => callGetCount(userId),
  });
};
