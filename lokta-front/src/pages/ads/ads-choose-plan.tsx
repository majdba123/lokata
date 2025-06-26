import usePaymentsWayQuery from "../vendor-pages/create-product/hooks/usePaymentsWayQuery";
import useAdsPlansQuery from "./hooks/useAdsPlansQuery";

type Props = {
  backToForm: () => void;
  adsData: { image: File; adLink: string };
};

function AdsChoosePlan({ backToForm }: Props) {
  const paymentsWayQuery = usePaymentsWayQuery();
  const adsPlansQuery = useAdsPlansQuery();
  return <div className="w-full h-full flex items-center justify-center"></div>;
}

export default AdsChoosePlan;
