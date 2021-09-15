import type {Effect, Reducer, Subscription} from 'umi';
import {pipelines} from "@/services/ant-design-pro/pipelineApi";

export type PipeLineModelState = {
  data: API.PipeLineListItem[];
  pagination: API.PageParams;
};

export interface PipeLineModelType {

  namespace: string;

  state: PipeLineModelState;

  effects: {
    loadPipeline: Effect;
  };

  reducers: {
    savePipeline: Reducer<PipeLineModelState>;
  };
  subscriptions: { setup: Subscription };
}

const pipelineModel: PipeLineModelType = {

  namespace: "pipeline",

  state: {
    data: [],
    pagination: {
      current: 1,
      pageSize: 10
    }
  },

  effects: {
    * loadPipeline(action, {call, put}) {
      const result = yield call(pipelines, action.payload);
      if (result.total > 0) {
        yield put({
          type: "savePipeline",
          payload: result
        })
      }
    }
  },
  reducers: {
    savePipeline(state, {payload}) {
      return {
        pagination: {
          current: payload.current,
          pageSize: payload.pageSize,
          total: payload.total
        }, data: payload.data
      } as PipeLineModelState
    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen(({pathname}) => {
        if (pathname === '/pipeline/list') {
          dispatch({
            type: 'loadPipeline',
            payload: {
              current: 1,
              pageSize: 10
            }
          });
        }
      });
    }
  }

}

export default pipelineModel



