import router from 'umi/router';
import { Toast } from 'antd-mobile';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { getSystemSetting, getOrderGatheringCode } from '@/services/user';

export default {
  namespace: 'global',
  state: {
    orderInfo: {},
    settings: {},
  },
  effects: {
    *getSystemSetting({ payload, callback }, { call, put }) {
      const response = yield call(getSystemSetting, payload);
      if (response.success) {
        yield put({
          type: 'saveSystemSetting',
          payload: response.data,
        });
      }
      if (callback) {
        callback(response);
      }
    },
    *getOrderGatheringCode({ payload, callback }, { call, put }) {
      const response = yield call(getOrderGatheringCode, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {
    saveSystemSetting(state, { payload }) {
      return {
        ...state,
        settings: payload,
      };
    },
    saveOrderInfo(state, { payload }) {
      return {
        ...state,
        orderInfo: payload,
      };
    },
  },
};
