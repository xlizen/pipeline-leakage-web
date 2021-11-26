import { request } from 'umi';

/** 获取规则列表 GET /api/rule */
export async function pipelines(
  params: API.PipeLineListSearchParam,
  options?: Record<string, any>,
) {
  return request<API.Result<API.PipeLineListItem[]>>('/dev/pipeline/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function pipelineMap(options?: Record<string, any>) {
  return request<API.Result<Record<string, any>[]>>('/dev/pipeline/listPipelineMap', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function sensorMap(pipelineId: string,options?: Record<string, any>) {
  return request<API.Result<Record<string, any>>>(`/dev/pipeline/listSensorMap?pipelineId=${pipelineId}`, {
    method: 'GET',
    ...(options || {}),
  });
}


/** 新建规则 PUT /api/rule */
export async function updatePipeline(data: API.PipeLineListItem, options?: Record<string, any>) {
  return request<API.PipeLineListItem>('/dev/pipeline/update', {
    method: 'POST',
    data,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function savePipeline(data: API.PipeLineListItem, options?: Record<string, any>) {
  return request<API.PipeLineListItem>('/dev/pipeline/insert', {
    method: 'POST',
    data,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 新建规则 DELETE /api/rule */
export async function deletePipeline(data: API.PipeLineListItem, options?: Record<string, any>) {
  return request<API.PipeLineListItem>('/dev/pipeline/delete', {
    method: 'POST',
    data,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function recordZero(data: Record<string, string | number>) {
  return request<API.Result<null>>('/dev/flow/recordStand', {
    method: 'POST',
    data,
    requestType: 'form',
  });
}

export async function clacK(data: Record<string, string | number>) {
  return request<API.Result<null>>('/dev/pipeline/calcK', {
    method: 'POST',
    data,
    requestType: 'form',
  });
}

/** 新建规则 PUT /api/rule */
export async function updateSensor(data: API.SensorListItem, options?: Record<string, any>) {
  return request<API.Result<null>>('/dev/sensor/update', {
    method: 'POST',
    data,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function deleteSensor(data: API.SensorListItem, options?: Record<string, any>) {
  return request<API.Result<null>>('/dev/sensor/delete', {
    method: 'POST',
    data,
    requestType: 'form',
    ...(options || {}),
  });
}
