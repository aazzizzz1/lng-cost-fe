import React from "react";
import OpexChart from "./OpexChart";
import { useDispatch, useSelector } from "react-redux";
import { selectOpexInfra, selectOpexUI, setActiveInfra } from "../../Provider/Opex/OpexSlice";

const Opex = () => {
  const dispatch = useDispatch();
  const infrastructures = useSelector(selectOpexInfra);
  const ui = useSelector(selectOpexUI);

  return (
    <div className="space-y-6">
      {/* Buttons to choose LNG infrastructure OPEX */}
      <div className="flex flex-wrap gap-2">
        {infrastructures.map((infra) => {
          const active = ui.activeInfra === infra.id;
          return (
            <button
              key={infra.id}
              onClick={() => dispatch(setActiveInfra(infra.id))}
              className={
                "px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors " +
                (active
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700")
              }
            >
              {infra.label}
            </button>
          );
        })}
      </div>

      <OpexChart />
    </div>
  );
};

export default Opex;