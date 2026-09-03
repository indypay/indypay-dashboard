import { useQuery } from '@tanstack/react-query';
import { reportsApiMap } from '@/app/(dashboard)/reports/config/reportsApiMap';
// import { mapColumn } from '@/app/(dashboard)/reports/config/reportsColumnMap';
import { isAdmin } from '../utils/utils';

export const useReports = ({
  section,
  role,
  selectedUserId,
  page,
  limit,
  startDate,
  endDate,
  status,
  enabled,
}: any) => {
  return useQuery({
    queryKey: [
      'reports',
      section,
      role,
      selectedUserId,
      page,
      limit,
      startDate,
      endDate,
      status,
    ],

    queryFn: async () => {
      const api = resolveApi({
        section,
        role,
        selectedUserId,
      });

      return api({
        userId: selectedUserId,
        page,
        limit,
        search: '',
        startDate,
        endDate,
        // status,
      });
    },

    enabled,
  });
};

function resolveApi({ section, role, selectedUserId }: any) {
  const sectionApis = reportsApiMap[section as keyof typeof reportsApiMap];

  if (isAdmin(role)) {
    return sectionApis?.admin?.withUserId;
  }

  return sectionApis?.merchant;
}
