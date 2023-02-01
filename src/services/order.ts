import { GN_API_BASE_URL } from '@constants/config';
import { LogLevel } from '@enums/log-level';
import { IMakeOrderPayload, IMakeOrderResponse } from '@interfaces/api/order';
import { post } from '@services/http-client';
import log from '@utils/logger';

const LOG_PREFIX = 'ProductService';

const API_PATH = '/v1/order';

export const makeOrder = async (
  payload: IMakeOrderPayload
): Promise<IMakeOrderResponse> => {
  try {
    const res = await post<Record<string, unknown>, IMakeOrderResponse>(
      `${API_PATH}/make`,
      {
        details: [
          {
            product_id: payload.details[0].id,
            quantity: payload.details[0].qty,
          },
        ],
        email: payload.email,
        shipping_firstname: payload.name,
        shipping_address1: payload.address,
        shipping_address2: payload.address2,
        shipping_postal_code: payload.zip,
        shipping_region: payload.state,
        shipping_city: payload.city,
        shipping_country: payload.country,
        source: payload.source,
        wallet_address: payload.wallet_address,
      },
      {
        baseUrl: GN_API_BASE_URL,
      }
    );
    return res;
  } catch (err: unknown) {
    log('failed to make order', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to make order');
  }
};
