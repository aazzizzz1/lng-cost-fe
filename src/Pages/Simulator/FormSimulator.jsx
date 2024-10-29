import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateWaypoint,
  updateFormInput,
  // submitForm,
  validationData,
  setError,
  setSuccess,
  clearMessages,
} from "../../Provider/simulatorSlice"; // Import the action to add a waypoint
import MapGenerateIcon from "../../Assets/Svg/Simulator/MapGenerateIcon";

const FormSimulator = () => {
  const dispatch = useDispatch();
  const {
    temperaturemin,
    temperaturemax,
    humiditymin,
    humiditymax,
    windDirection,
    windVelocitymin,
    windVelocitymax,
    airPressuremin,
    airPressuremax,
    heading,
    headingRate,
    roll,
    pitch,
    angularVelocity,
    speedofShipThroughWaterMin,
    speedofShipThroughWaterMax,
    waterCurrentSpeedMin,
    waterCurrentSpeedMax,
    waterDepth,
    headingMagneticMin,
    headingMagneticMax,
    headingDeviationMin,
    headingDeviationMax,
    headingVariationMin,
    headingVariationMax,

    // latitude,
    // longitude,
    waypoints,
    errors,
    isFormValid,
  } = useSelector((state) => state.simulator);

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // // Handle form submission
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   dispatch(submitForm()); // Pindahkan semua logika validasi dan pengiriman ke Redux
  // };

  // Trigger form validation and mark form as submitting
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearMessages()); // Clear previous messages
    setIsSubmitting(true); // Mark form as submitting
    dispatch(validationData()); // Trigger validation
  };

  // Effect to check form validity after validation
  useEffect(() => {
    if (isSubmitting) {
      if (isFormValid) {
        dispatch(setSuccess("Simulasi berhasil dikirimkan!"));
      } else {
        dispatch(
          setError(
            `Pengiriman formulir gagal karena kesalahan validasi: ${errors}`
          )
        );
      }
      setIsSubmitting(false); // Reset submitting state
    }
  }, [isFormValid, errors, isSubmitting, dispatch]);

  return (
    <div className="">
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="w-full bg-white rounded-lg shadow dark:border md:max-w-full xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          {/* Modal body */}
          <div className="p-6 space-y-4 md:space-y-6">
            {/* {successMessage && (
                      <SuccessToast
                        showToast={showToastUser}
                        setShowToast={setShowToastUser}
                        message={successMessage}
                      />
                    )} */}
            {/* {errors && (
              <div className="text-red-500 text-sm mb-4">{errors}</div>
            )} */}

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
                        parseFloat(temperaturemin) < 0
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } cursor-not-allowed text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
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
                          ? "border-red-500 dark:border-red-500"
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
                      type="number"
                      name="humiditymin"
                      value={humiditymin}
                      onChange={handleInputChange}
                      id="humidity"
                      className={`bg-gray-50 border ${
                        parseFloat(humiditymin) < 0
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="Type product name"
                      required=""
                    />
                    <input
                      type="number"
                      name="humiditymax"
                      value={humiditymax}
                      onChange={handleInputChange}
                      id="humiditymax"
                      className={`bg-gray-50 border ${
                        parseFloat(humiditymax) > 70
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } cursor-not-allowed text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="Type product name"
                      required=""
                      disabled
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
                    onChange={handleInputChange}
                    id="windDirection"
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
                      type="number"
                      name="windVelocitymin"
                      value={windVelocitymin}
                      onChange={handleInputChange}
                      id="windVelocitymin"
                      className={`bg-gray-50 border ${
                        parseFloat(windVelocitymin) < 0
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="wind velocity"
                      required=""
                    />
                    <input
                      type="number"
                      name="windVelocitymax"
                      value={windVelocitymax}
                      onChange={handleInputChange}
                      id="windVelocitymax"
                      className={`bg-gray-50 border ${
                        parseFloat(windVelocitymax) > 300
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
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
                      type="number"
                      name="airPressuremin"
                      value={airPressuremin}
                      onChange={handleInputChange}
                      id="airPressuremin"
                      className={`bg-gray-50 border ${
                        parseFloat(airPressuremin) < 870
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } cursor-not-allowed text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="Type product name"
                      required=""
                      disabled
                    />
                    <input
                      type="number"
                      name="airPressuremax"
                      value={airPressuremax}
                      onChange={handleInputChange}
                      id="airPressuremax"
                      className={`bg-gray-50 border ${
                        parseFloat(airPressuremax) > 1080
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
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
                        type="number"
                        name="heading"
                        value={heading}
                        onChange={handleInputChange}
                        id="heading"
                        className={`bg-gray-50 border ${
                          parseFloat(heading) < 0 || parseFloat(heading) >= 360
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300"
                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                        placeholder="Type product name"
                        required=""
                      />
                      {/* <input
                        type="text"
                        name="name"
                        value={heading}
                        id="name"
                        className={`bg-gray-50 border ${
                          parseFloat(windVelocitymin) > 70
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300"
                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                        placeholder="Type product name"
                        required=""
                        disabled
                      /> */}
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
                        type="number"
                        name="headingRate"
                        value={headingRate}
                        onChange={handleInputChange}
                        id="headingRate"
                        className={`bg-gray-50 border ${
                          parseFloat(headingRate) < 0 || headingRate > 100
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300"
                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                        placeholder="Type product name"
                        required=""
                      />
                      {/* <input
                        type="text"
                        name="name"
                        value={headingRate}
                        id="name"
                        className={`bg-gray-50 border ${
                          parseFloat(windVelocitymin) > 70
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300"
                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                        placeholder="Type product name"
                        required=""
                        disabled
                      /> */}
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
                        type="number"
                        name="roll"
                        value={roll}
                        onChange={handleInputChange}
                        id="roll"
                        className={`bg-gray-50 border ${
                          roll < -90 || roll > 90
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300"
                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                        placeholder="Type product name"
                        required=""
                      />
                      {/* <input
                        type="text"
                        name="name"
                        value={roll}
                        id="name"
                        className={`bg-gray-50 border ${
                          parseFloat(windVelocitymin) > 70
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300"
                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                        placeholder="Type product name"
                        required=""
                        disabled
                      /> */}
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
                      type="number"
                      name="pitch"
                      value={pitch}
                      onChange={handleInputChange}
                      id="pitch"
                      className={`bg-gray-50 border ${
                        parseFloat(pitch) < 0
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="Type product name"
                      required=""
                    />
                    {/* <input
                      type="text"
                      name="name"
                      id="name"
                      className={`bg-gray-50 border ${
                        parseFloat(windVelocitymin) > 70
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="Type product name"
                      required=""
                    /> */}
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
                      type="number"
                      name="angularVelocity"
                      value={angularVelocity}
                      onChange={handleInputChange}
                      id="angularVelocity"
                      className={`bg-gray-50 border ${
                        parseFloat(angularVelocity) > 70
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="Type product name"
                      required=""
                    />
                    {/* <input
                      type="text"
                      name="angularVelocity"
                      id="angularVelocity"
                      className={`bg-gray-50 border ${
                        parseFloat(angularVelocity) > 70
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="Type product name"
                      required=""
                    /> */}
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
                      type="number"
                      name="speedofShipThroughWaterMin"
                      value={speedofShipThroughWaterMin}
                      onChange={handleInputChange}
                      id="speedofShipThroughWaterMin"
                      className={` bg-gray-50 border ${
                        parseFloat(speedofShipThroughWaterMin) < 0
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="Type product name"
                      required=""
                    />
                    <input
                      type="number"
                      name="speedofShipThroughWaterMax"
                      value={speedofShipThroughWaterMax}
                      onChange={handleInputChange}
                      id="speedofShipThroughWaterMax"
                      className={`cursor-not-allowed bg-gray-50 border ${
                        parseFloat(speedofShipThroughWaterMax) > 70
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="Type product name"
                      required=""
                      disabled
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
                      type="number"
                      name="waterCurrentSpeedMin"
                      value={waterCurrentSpeedMin}
                      onChange={handleInputChange}
                      id="waterCurrentSpeedMin"
                      className={`cursor-not-allowed bg-gray-50 border ${
                        parseFloat(waterCurrentSpeedMin) < 0
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="Type product name"
                      required=""
                      disabled
                    />
                    <input
                      type="number"
                      name="waterCurrentSpeedMax"
                      value={waterCurrentSpeedMax}
                      onChange={handleInputChange}
                      id="waterCurrentSpeedMax"
                      className={`cursor-not-allowed bg-gray-50 border ${
                        parseFloat(waterCurrentSpeedMax) > 70
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
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
                      type="number"
                      name="waterDepth"
                      value={waterDepth}
                      onChange={handleInputChange}
                      id="waterDepth"
                      className={`cursor-not-allowed bg-gray-50 border ${
                        parseFloat(waterDepth) < 0
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="Water Depth"
                      required=""
                      disabled
                    />
                    {/* <input
                      type="text"
                      name="name"
                      id="name"
                      className={`bg-gray-50 border ${
                        parseFloat(windVelocitymin) > 70
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="Type product name"
                      required=""
                    /> */}
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
                      type="number"
                      name="headingMagneticMin"
                      value={headingMagneticMin}
                      onChange={handleInputChange}
                      id="headingMagneticMin"
                      className={`cursor-not-allowed bg-gray-50 border ${
                        parseFloat(headingMagneticMin) < 0
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="Type product name"
                      required=""
                      disabled
                    />
                    <input
                      type="number"
                      name="headingMagneticMax"
                      value={headingMagneticMax}
                      onChange={handleInputChange}
                      id="headingMagneticMax"
                      className={`cursor-not-allowed bg-gray-50 border ${
                        parseFloat(headingMagneticMax) > 70
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
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
                      type="number"
                      name="headingDeviationMin"
                      value={headingDeviationMin}
                      onChange={handleInputChange}
                      id="headingDeviationMin"
                      className={`cursor-not-allowed bg-gray-50 border ${
                        parseFloat(headingDeviationMin) < 0
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="Type product name"
                      required=""
                      disabled
                    />
                    <input
                      type="number"
                      name="headingDeviationMax"
                      value={headingDeviationMax}
                      onChange={handleInputChange}
                      id="headingDeviationMax"
                      className={`cursor-not-allowed bg-gray-50 border ${
                        parseFloat(headingDeviationMax) > 70
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
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
                      type="number"
                      name="headingVariationMin"
                      value={headingVariationMin}
                      onChange={handleInputChange}
                      id="headingVariationMin"
                      className={`cursor-not-allowed bg-gray-50 border ${
                        parseFloat(headingVariationMin) > 70
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="headingVariationMin"
                      required=""
                      disabled
                    />
                    <input
                      type="number"
                      name="headingVariationMax"
                      value={headingVariationMax}
                      onChange={handleInputChange}
                      id="headingVariationMax"
                      className={`cursor-not-allowed bg-gray-50 border ${
                        parseFloat(headingVariationMax) > 70
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                      placeholder="headingVariationMax"
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
                      <MapGenerateIcon />
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
                        className={`bg-gray-50 border ${
                          waypoint.latitude < -90 || waypoint.latitude > 90
                            ? "border-red-500"
                            : "border-gray-300"
                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
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
                        className={`bg-gray-50 border ${
                          waypoint.longitude < -180 || waypoint.longitude > 180
                            ? "border-red-500"
                            : "border-gray-300"
                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
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
