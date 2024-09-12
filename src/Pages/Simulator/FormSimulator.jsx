import { React } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateWaypoint,
  updateFormInput,
  validationData,
} from "../../Provider/simulatorSlice"; // Import the action to add a waypoint

const FormSimulator = () => {
  const dispatch = useDispatch();
  const { temperaturemin,
    temperaturemax,
    humidity,
    windDirection,
    windVelocity,
    airPressure,
    heading,
    headingRate,
    roll,
    pitch,
    angularVelocity,
    speedofShipThroughWater,
    waterCurrentSpeed,
    waterDepth,
    headingMagnetic,
    headingDeviation,
    headingVariation,
    // latitude,
    // longitude,
    waypoints,
    errors,
    isFormValid, } = useSelector(
    (state) => state.simulator
  );

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormInput({ field: name, value }));
  };

  // Handle updating an existing waypoint
  const handleWaypointChange = (index, field, value) => {
    const updatedWaypoints = waypoints.map((waypoint, i) =>
      i === index ? { ...waypoint, [field]: parseFloat(value) } : waypoint
    );

    // Dispatch the updated waypoints to the Redux store
    dispatch(updateWaypoint({ index, waypoint: updatedWaypoints[index] }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(validationData());

    if (!isFormValid) {
      alert('Form contains errors. Please fix them before submitting.');
      return;
    }

    // Perform submit actions here if the form is valid
    alert('Form submitted successfully.');
  };

  return (
    <div className="">
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="w-full bg-white rounded-lg shadow dark:border md:max-w-5xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          {/* Modal body */}
          <div className="p-6 space-y-4 md:space-y-6">
            {/* {successMessage && (
                      <SuccessToast
                        showToast={showToastUser}
                        setShowToast={setShowToastUser}
                        message={successMessage}
                      />
                    )} */}
            {errors && (
              <div className="text-red-500 text-sm mb-4">{errors}</div>
            )}
            <h1 className="text-xl font-bold eading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Simulator Form
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 grid-cols-5">
                <div className="text-lg font-semibold col-span-5 text-gray-900 dark:text-white">
                  Wheater
                </div>
                <div>
                  <label
                    htmlFor="temperaturemin"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Temperature
                  </label>
                  <div className="flex flex-row gap-2">
                    <input
                      type="number"
                      name="temperaturemin"
                      value={temperaturemin}
                      onChange={handleInputChange}
                      id="temperaturemin"
                      className={`bg-gray-50 border ${
                        parseFloat(temperaturemin) > 40
                          ? "border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="Min Temperature"
                      required=""
                      disabled
                    />
                    <input
                      type="number"
                      name="temperaturemax"
                      id="temperaturemax"
                      value={temperaturemax}
                      onChange={handleInputChange}
                      className={`bg-gray-50 border ${
                        parseFloat(temperaturemax) > 70
                          ? "border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="Type product name"
                      required=""
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Air Humidity
                  </label>
                  <div className="flex flex-row gap-2">
                    <input
                      type="text"
                      name="humidity"
                      value={humidity}
                      id="name"
                      className={`bg-gray-50 border ${
                        parseFloat(humidity) > 70
                          ? "border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="Type product name"
                      required=""
                    />
                    <input
                      type="text"
                      name="humidity"
                      value={humidity}
                      id="name"
                      className={`bg-gray-50 border ${
                        parseFloat(humidity) > 70
                          ? "border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="Type product name"
                      required=""
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="brand"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Wind Direct
                  </label>
                  <input
                    type="text"
                    name="windDirection"
                    value={windDirection}
                    id="brand"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Product brand"
                    required=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Wind Velocity
                  </label>
                  <div className="flex flex-row gap-2">
                    <input
                      type="text"
                      name="windVelocity"
                      value={windVelocity}
                      id="price"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="wind velocity"
                      required=""
                    />
                    <input
                      type="text"
                      name="windVelocity"
                      value={windVelocity}
                      id="price"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="wind velocity"
                      required=""
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Air Pressure
                  </label>
                  <div className="flex flex-row gap-2">
                    <input
                      type="text"
                      name="temperaturemin"
                      value={temperaturemin}
                      id="name"
                      className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      required=""
                      disabled
                    />
                    <input
                      type="text"
                      name="price"
                      value={airPressure}
                      id="price"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="$2999"
                      required=""
                    />
                  </div>
                </div>
                <div className="text-lg font-semibold col-span-5 text-gray-900 dark:text-white">
                  Gyro/INS
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Heading
                  </label>
                  <div className="flex flex-row gap-2">
                    <div className="flex flex-row gap-2">
                      <input
                        type="text"
                        name="temperaturemin"
                        value={temperaturemin}
                        id="name"
                        className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Type product name"
                        required=""
                        disabled
                      />
                      <input
                        type="text"
                        name="name"
                        value={heading}
                        id="name"
                        className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Type product name"
                        required=""
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Heading Rate
                  </label>
                  <div className="flex flex-row gap-2">
                    <div className="flex flex-row gap-2">
                      <input
                        type="text"
                        name="temperaturemin"
                        value={temperaturemin}
                        id="name"
                        className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Type product name"
                        required=""
                        disabled
                      />
                      <input
                        type="text"
                        name="name"
                        value={headingRate}
                        id="name"
                        className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Type product name"
                        required=""
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    roll
                  </label>
                  <div className="flex flex-row gap-2">
                    <div className="flex flex-row gap-2">
                      <input
                        type="text"
                        name="temperaturemin"
                        value={temperaturemin}
                        id="name"
                        className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Type product name"
                        required=""
                        disabled
                      />
                      <input
                        type="text"
                        name="name"
                        value={roll}
                        id="name"
                        className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Type product name"
                        required=""
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    pitch
                  </label>
                  <div className="flex flex-row gap-2">
                    <input
                      type="text"
                      name="pitch"
                      value={pitch}
                      id="name"
                      className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      required=""
                      disabled
                    />
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      required=""
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Angularvelocity
                  </label>
                  <div className="flex flex-row gap-2">
                    <input
                      type="text"
                      name="angularVelocities"
                      value={angularVelocity}
                      id="name"
                      className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      required=""
                      disabled
                    />
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      required=""
                    />
                  </div>
                </div>
                <div className="text-lg font-semibold col-span-5 text-gray-900 dark:text-white">
                  SpeedLog
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Speed of Ship Motion on Water
                  </label>
                  <div className="flex flex-row gap-2">
                    <input
                      type="text"
                      name="speedofShipThroughWater"
                      value={speedofShipThroughWater}
                      id="name"
                      className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      required=""
                      disabled
                    />
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      required=""
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Water Current Speed
                  </label>
                  <div className="flex flex-row gap-2">
                    <input
                      type="text"
                      name="waterCurrentSpeed"
                      value={waterCurrentSpeed}
                      id="name"
                      className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      required=""
                      disabled
                    />
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      required=""
                      disabled
                    />
                  </div>
                </div>
                <div className="text-lg font-semibold col-span-5 text-gray-900 dark:text-white">
                  Depth
                </div>
                <div className="col-span-5">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Ocean Water Depth
                  </label>
                  <div className="flex flex-row gap-2">
                    <input
                      type="text"
                      name="waterDepth"
                      value={waterDepth}
                      id="name"
                      className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      required=""
                      disabled
                    />
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      required=""
                    />
                  </div>
                </div>
                <div className="text-lg font-semibold col-span-5 text-gray-900 dark:text-white">
                  Magnetic Compass
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Heading Magnetic
                  </label>
                  <div className="flex flex-row gap-2">
                    <input
                      type="text"
                      name="headingMagnetic"
                      value={headingMagnetic}
                      id="name"
                      className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      required=""
                      disabled
                    />
                    <input
                      type="text"
                      name="headingMagnetic"
                      value={headingMagnetic}
                      id="name"
                      className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      required=""
                      disabled
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Heading-Deviation
                  </label>
                  <div className="flex flex-row gap-2">
                    <input
                      type="text"
                      name="headingDeviation"
                      value={headingDeviation}
                      id="name"
                      className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      required=""
                      disabled
                    />
                    <input
                      type="text"
                      name="headingDeviation"
                      value={headingDeviation}
                      id="name"
                      className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      required=""
                      disabled
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Variation
                  </label>
                  <div className="flex flex-row gap-2">
                    <input
                      type="text"
                      name="headingVariation"
                      value={headingVariation}
                      id="name"
                      className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      required=""
                      disabled
                    />
                    <input
                      type="text"
                      name="headingVariation"
                      value={headingVariation}
                      id="name"
                      className="cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      required=""
                      disabled
                    />
                  </div>
                </div>
                <div className="text-lg font-semibold col-span-5 text-gray-900 dark:text-white">
                  Select to Fill the Waypoint
                </div>
                <div className="text-lg font-semibold col-span-5 text-gray-900 dark:text-white">
                  <div className="flex flex-row gap-2">
                    <button className=" w-auto text-white justify-center inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                      <svg
                        className="mr-1 -ml-1 w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Generate from backend
                    </button>
                    <button className=" w-auto text-white justify-center inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                      <svg
                        className="mr-1 -ml-1 w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Click in map
                    </button>
                  </div>
                </div>
                <div className="text-lg font-semibold col-span-5 text-gray-900 dark:text-white">
                  Latitude
                </div>
                {/* Waypoint Latitude*/}
                <div className="grid gap-4 col-span-5 md:gap-6 grid-cols-5">
                  {waypoints.map((waypoint, index) => (
                    <div key={index}>
                      <label
                        htmlFor="weight"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Waypoint {index + 1}
                      </label>
                      <input
                        type="number"
                        name="latitude"
                        value={waypoint.latitude}
                        onChange={(e) =>
                          handleWaypointChange(
                            index,
                            "latitude",
                            e.target.value
                          )
                        }
                        id="weight"
                        className={`bg-gray-50 border ${waypoint.latitude < -90 || waypoint.latitude > 90 ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                        placeholder="Longitude"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-lg font-semibold col-span-5 text-gray-900 dark:text-white">
                  Longitude
                </div>
                {/* Waypoint Longitude*/}
                <div className="grid gap-4 col-span-5 md:gap-6 grid-cols-5">
                  {waypoints.map((waypoint, index) => (
                    <div key={index}>
                      <label
                        htmlFor="weight"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Waypoint {index + 1}
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={waypoint.longitude}
                        onChange={(e) =>
                          handleWaypointChange(
                            index,
                            "longitude",
                            e.target.value
                          )
                        }
                        id="weight"
                        className={`bg-gray-50 border ${waypoint.longitude < -180 || waypoint.longitude > 180 ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                        placeholder={12}
                        required=""
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="items-center flex space-y-0 space-x-4">
                <button
                  type="submit"
                  className=" w-auto justify-center text-white inline-flex bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Start Simulation
                </button>
                <button
                  data-modal-toggle="createProductModal2"
                  type="button"
                  className=" justify-center w-auto text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                >
                  <svg
                    className="mr-1 -ml-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FormSimulator;
