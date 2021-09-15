import { request } from 'umi';

/** 获取规则列表 GET /api/rule */
export async function pipelines(
  params: API.PipeLineListSearchParam,
  options?: Record<string, any>,
) {
  return request<API.Result<API.PipeLineListItem[]>>('/api/pipeline/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function pipelineMap(options?: Record<string, any>) {
  return request<API.Result<Record<string, string>[]>>('/api/pipeline/ids', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updatePipeline(options?: Record<string, any>) {
  return request<API.PipeLineListItem>('/api/pipeline', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 DELETE /api/rule */
export async function deletePipeline(id: string) {
  return request<API.PipeLineListItem>('/api/pipeline', {
    method: 'DELETE',
    id,
  });
}

/** 新建规则 POST /api/rule */
export async function recordZero(params: API.CalibrationParam) {
  return request<API.Result<null>>('/api/recaord', {
    method: 'POST',
    ...params,
  });
}
