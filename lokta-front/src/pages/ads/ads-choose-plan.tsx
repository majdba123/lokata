import { Button } from "@/components/ui/button";

type Props = {
  backToForm: () => void;
};

function AdsChoosePlan({ backToForm }: Props) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Button onClick={backToForm}>العودة</Button>
    </div>
  );
}

export default AdsChoosePlan;
