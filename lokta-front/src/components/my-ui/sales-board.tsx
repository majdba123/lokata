import React from "react";

import rect5 from "@/assets/Rectangle5.png";

const SalesBoard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 flex justify-center">
      <div className="w-full lg:w-9.5/10">
        <img
          src={rect5}
          alt="Cyber Monday Sale"
          className="w-full h-auto max-h-[500px] object-fill"
        />
      </div>
    </div>
  );
};

export default SalesBoard;
