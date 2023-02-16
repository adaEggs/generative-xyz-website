import { LocalStorageKey } from '@enums/local-storage';
import { ILocationDectectionResponse } from '@interfaces/api/location-detector';
import { isBrowser } from '@utils/common';
import { RAPID_CLIENT_TOKEN, RAPI_HOST, RAPI_URL } from '@constants/config';
import { LocationDetectorError } from '@enums/location-detector';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';

const LOG_PREFIX = 'detectLocationFromIP';

export const detectLocationFromIP =
  (): Promise<ILocationDectectionResponse> => {
    return new Promise((resolve, reject) => {
      if (!isBrowser()) {
        reject(LocationDetectorError.NOT_BROWSER);
      }
      try {
        const locationJson = localStorage.getItem(
          LocalStorageKey.USER_LOCATION
        );
        const userLocation: ILocationDectectionResponse = locationJson
          ? JSON.parse(locationJson)
          : {};
        if (userLocation && userLocation.ip) {
          resolve(userLocation);
        } else {
          fetch(RAPI_URL, {
            method: 'GET',
            headers: {
              'x-rapidapi-host': RAPI_HOST,
              'x-rapidapi-key': RAPID_CLIENT_TOKEN,
              mode: 'cors',
            },
          })
            .then(response => response.json())
            .then((res: ILocationDectectionResponse) => {
              if (res && res.ip) {
                localStorage.setItem(
                  LocalStorageKey.USER_LOCATION,
                  JSON.stringify(res)
                );
                resolve(res);
              } else {
                reject(LocationDetectorError.API_ERROR);
              }
            })
            .catch(err => {
              log(err as Error, LogLevel.ERROR, LOG_PREFIX);
            });
        }
      } catch (_: unknown) {
        reject(LocationDetectorError.UNKNOWN);
      }
    });
  };
