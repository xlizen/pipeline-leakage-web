import { request } from 'umi';

export async function schedulerJobs(params: { page?: number; limit?: number }) {
  return request<API.Result<API.SchedulerJobItem[]>>('/api/schedulerJob/list', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
