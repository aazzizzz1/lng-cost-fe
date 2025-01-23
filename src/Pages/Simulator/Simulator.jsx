import { React } from "react";
import OpenSeaMap from "./OpenSeaMap";
import FormSimulator from "./FormSimulator";
import { useDispatch, useSelector } from "react-redux";
import SuccessAlert from "../../Components/Alerts/SuccessAlert";
import ErrorAlert from "../../Components/Alerts/ErrorAlert";
import { clearMessages } from "../../Provider/simulatorSlice";

const Simulator = () => {
  const dispatch = useDispatch();
  // Close alert handlers
  const handleCloseError = () => dispatch(clearMessages());
  const handleCloseSuccess = () => dispatch(clearMessages());
  const {
    // success
    successMessage,
    errorMessage,
  } = useSelector((state) => state.simulator);
  return (
    <div className="p-4 dark:bg-darkmode">
      <div className="mt-3">
        {errorMessage && (
          <ErrorAlert message={errorMessage} onClose={handleCloseError} />
        )}
        {successMessage && (
          <SuccessAlert message={successMessage} onClose={handleCloseSuccess} />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="border-2 shadow-md p-2 col-span-1 flex flex-col">
          <FormSimulator />
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
