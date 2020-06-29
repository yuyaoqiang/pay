// @ts-ignore
import request from '@/utils/request';

/**
 * 获取系统信息
 * @param params
 */
export async function getSystemSetting(params: any) {
  return request(`/test/masterControl/getSystemSetting`, {
    method: 'get',
  });
}

/**
 * 获取订单信息
 * @param params
 */
export async function getOrderGatheringCode(params: any) {
  return request(`/test/api/getOrderGatheringCode?orderNo=${params.orderNo}`, {
    method: 'get',
  });
}
