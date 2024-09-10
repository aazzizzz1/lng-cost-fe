import { React } from "react";
import OpenSeaMap from "./OpenSeaMap";
import FormSimulator from "./FormSimulator";

const Simulator = () => {

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="border-2 shadow-md p-2 col-span-1 flex flex-col">
          <FormSimulator/>
        </div>
        <div className="border-2 shadow-md p-2 col-span-1 flex flex-col">
          <OpenSeaMap />
        </div>
      </div>
      {/* Sensor Manager */}
    </div>
  );
};

export default Simulator;
