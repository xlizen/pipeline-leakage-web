import { request } from 'umi';

export async function schedulerJobs(
  params: {
    limit?: number;
    page?: number;
  },
  options?: Record<string, any>,
) {
  return request<API.Result<API.SchedulerJobItem[]>>('/dev/schedulerJob/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateSchedulerJob(
  data: API.SchedulerJobItem,
  options?: Record<string, any>,
) {
  return request<API.Result<null>>('/dev/schedulerJob/update', {
    method: 'POST',
    data,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function saveSchedulerJob(data: API.SchedulerJobItem, options?: Record<string, any>) {
  return request<API.Result<null>>('/dev/schedulerJob/save', {
    method: 'POST',
    data,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function deleteSchedulerJob(
  data: API.SchedulerJobItem,
  options?: Record<string, any>,
) {
  return request<API.Result<null>>('/dev/schedulerJob/delete', {
    method: 'POST',
    data,
    requestType: 'form',
    ...(options || {}),
  });
}
