import { useAuthStore } from "@/zustand-stores/auth.store";
import { resolveError } from "../helpers/error-resolver";
import axios from "axios";
import { Offer } from "./offers.types";
import { API_URL } from "@/api/constants";
import { headerGenerator } from "../helpers/header-generator";

class OffersService {
  getAllOffersApi = async () => {
    try {
      const accessToken = useAuthStore.getState().accessToken;
      const { data } = await axios.get<{ data: Offer[] }>(
        `${API_URL}/api/offers/fillter`,
        {
          headers: headerGenerator([
            { Authorization: `Bearer ${accessToken}` },
          ]),
        }
      );
      return data.data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };
}

export const { getAllOffersApi } = new OffersService();
