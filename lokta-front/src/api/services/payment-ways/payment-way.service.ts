import { useAuthStore } from "@/zustand-stores/auth.store";
import { resolveError } from "../helpers/error-resolver";
import axios from "axios";
import { API_URL } from "@/api/constants";
import { headerGenerator } from "../helpers/header-generator";
import { PaymentWay } from "./payment-ways.types";

class PaymentWayService {
  getAllPaymentWaysApi = async () => {
    try {
      const accessToken = useAuthStore.getState().accessToken;
      const { data } = await axios.get<{ data: PaymentWay[] }>(
        `${API_URL}/api/paymentways/get_all`,
        {
          headers: headerGenerator([
            {
              Authorization: `Bearer ${accessToken}`,
            },
          ]),
        }
      );

      return data.data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };
}

export const { getAllPaymentWaysApi } = new PaymentWayService();
