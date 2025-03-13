import { Subcategory as _Subcategory } from "@/api/services/category/types";

type Props = _Subcategory & { onClick: () => void };

function Subcategory({ title, image, onClick }: Props) {
  return (
    <div className="w-72 h-75  cursor-pointer " onClick={onClick}>
      <div className="flex items-center justify-center w-ful">
        <img src={image} alt={title} className="  w-3/4 rounded-[50%]" />
      </div>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
      </div>
    </div>
  );
}

export default Subcategory;
