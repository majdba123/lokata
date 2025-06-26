import { useAuthStore } from "@/zustand-stores/auth.store";
import { resolveError } from "../helpers/error-resolver";
import axios from "axios";
import { API_URL } from "@/api/constants";
import { headerGenerator } from "../helpers/header-generator";
import { AdsElement, AdsPlanElement, AdsType } from "./ads.types";

class AdsService {
  getMyAdsApi = async () => {
    try {
      const accessToken = useAuthStore.getState().accessToken;
      const { data } = await axios.get<AdsElement[]>(
        `${API_URL}/api/ads/get_my_ads`,
        {
          headers: headerGenerator([
            {
              Authorization: `Bearer ${accessToken}`,
            },
          ]),
        }
      );
      return data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };

  getAdsByTypeAndCategoryApi = async ({
    type,
    category,
  }: {
    type: AdsType;
    category: string;
  }) => {
    try {
      await axios.get(`${API_URL}/api/ads/filter`, {
        params: {
          type,
          category_id: category,
        },
      });
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };

  getAdsPlansApi = async () => {
    try {
      const accessToken = useAuthStore.getState().accessToken;
      const { data } = await axios.get<{ data: AdsPlanElement[] }>(
        `${API_URL}/api/offers/fillter`,
        {
          headers: headerGenerator([
            {
              Authorization: `Bearer ${accessToken}`,
            },
          ]),
        }
      );
      return data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };
}

export const { getMyAdsApi, getAdsByTypeAndCategoryApi, getAdsPlansApi } =
  new AdsService();
