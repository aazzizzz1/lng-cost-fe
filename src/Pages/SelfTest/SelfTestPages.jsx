import React from "react";
import SelfTest from "./SelfTest";

const SelfTestPages = () => {
  return (
    <div className="p-4">
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        SELF TEST
      </p>
      {/* <p className="text-lg text-gray-600 dark:text-white mb-2">
        Management and Configuration Self Test
      </p> */}
      <SelfTest />
    </div>
  );
};

export default SelfTestPages;
