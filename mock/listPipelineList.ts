import { Request, Response } from 'express';
import { parse } from 'url';
import moment from 'moment';

const genList = (current: number, pageSize: number) => {
  const tableListDataSource: API.PipeLineListItem[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
      id: index.toString(),
      name: `管路${index}`,
      xlsFileName: '',
      standard: index % 5,
      duration: index % 3,
      sensorList: genSensors(index.toString(), i % 5),
    });
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

const genSensors = (pipelineId: string, size: number) => {
  const sensors: API.SensorListItem[] = [];
  for (let i = 0; i < size; i++) {
    sensors.push({
      no: `${pipelineId}:${i}`,
      pre: i - 1 < 0 ? undefined : `${pipelineId}:${i - 1}`,
      next: i + 1 >= size ? undefined : `${pipelineId}:${i + 1}`,
      r: 0.225,
      l: 120,
      type: i == 0 ? 4 : 1,
      head: `${pipelineId}:0`,
      createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  }
  return sensors;
};

let tableListDataSource = genList(1, 100);

function getPipeline(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const { current = 1, pageSize = 10 } = req.query;
  const params = parse(realUrl, true).query as unknown as API.PipeLineListSearchParam &
    API.PageParams & { total?: number };
  const { current: pi = 1, pageSize: ps = 10, total = 100, ...filter } = params;

  let filterTableListDataSource: API.PipeLineListItem[] = tableListDataSource;

  if (filter) {
    if (Object.keys(filter).length > 0) {
      filterTableListDataSource = [...tableListDataSource].filter((item) => {
        return Object.keys(filter).some((key) => {
          if (!filter[key]) {
            return true;
          }
          return filter[key] != '' && filter[key].includes(`${item[key]}`);
        });
      });
    }
  }

  let dataSource = [...filterTableListDataSource].slice(
    ((current as number) - 1) * (pageSize as number),
    (current as number) * (pageSize as number),
  );

  const result = {
    data: dataSource,
    total: filterTableListDataSource.length,
    success: true,
    pageSize,
    current: parseInt(`${params.current}`, 10) || 1,
  };

  return res.json(result);
}

function getIdsEnum(req: Request, res: Response, u: string) {
  let result = Object.create(null);
  tableListDataSource.forEach((item) => (result[item.id] = item.name));
  res.json({
    total: 1,
    data: result,
  });
}

function postPipeline(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method, name, standard, duration, referencePoint, id } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter((item) => id.indexOf(item.id) === -1);
      break;
    case 'post':
      (() => {
        const newPipeline: API.PipeLineListItem = {
          id: tableListDataSource.length.toString(),
          xlsFileName: '',
          name,
          standard,
          duration,
          referencePoint,
        };
        tableListDataSource.unshift(newPipeline);
        return res.json(newPipeline);
      })();
      return;

    case 'update':
      (() => {
        let newRule = {};
        tableListDataSource = tableListDataSource.map((item) => {
          if (item.id === id) {
            newRule = { ...item, name, standard, duration, referencePoint };
            return { ...item, name, standard, duration, referencePoint };
          }
          return item;
        });
        return res.json(newRule);
      })();
      return;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  res.json(result);
}

export default {
  'GET /api/pipeline/list': getPipeline,
  'GET /api/pipeline/ids': getIdsEnum,
  'POST /api/pipeline': postPipeline,
};
