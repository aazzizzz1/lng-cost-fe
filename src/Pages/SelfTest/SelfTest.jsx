import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LeftArrowIcon from "../../Assets/Svg/SelfTest/LeftArrowIcon";
import RightArrowIcon from "../../Assets/Svg/SelfTest/RightArrowIcon";
// import { updateCpu, updatecpuMax, updateDisk, updateNetwork } from "../../Provider/selftestSlice";

const SelfTest = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to track the current ID for Interface Module and PSU
  const [currentINTERFACEID, setCurrentINTERFACEID] = useState(1);
  const [currentPSUID, setCurrentPSUID] = useState(1);

  const {
    cpu,
    ram,
    // ramMax,
    storageMax,
    redudant,
    lcd,
    touchscreen,
    psuData,
    interfaceModuleData,
    // disk,
    // network,
  } = useSelector((state) => state.selftest);

  const handleClickDisplay = () => {
    // Update state CPU di Redux
    // dispatch(updateCpu(80));

    // Setelah dispatch, lakukan navigasi
    navigate("/selftest/display"); // Ganti '/link-tujuan' dengan path yang ingin dituju
  };

  // Function to change ID for Interface Module
  const handleNextID = () => {
    setCurrentINTERFACEID((prevID) =>
      prevID < interfaceModuleData.length ? prevID + 1 : 1
    );
  };

  const handlePrevID = () => {
    setCurrentINTERFACEID((prevID) =>
      prevID > 1 ? prevID - 1 : interfaceModuleData.length
    );
  };

  // Function to change ID for PSU
  const handleNextPSUID = () => {
    setCurrentPSUID((prevID) => (prevID < psuData.length ? prevID + 1 : 1));
  };

  const handlePrevPSUID = () => {
    setCurrentPSUID((prevID) => (prevID > 1 ? prevID - 1 : psuData.length));
  };

  // Ekstraksi logika ternary ke variabel baru
  let serialInterfaceClass = "";

  if (
    interfaceModuleData[currentINTERFACEID - 1].serialInterface === "connected"
  ) {
    serialInterfaceClass = "border-green-600 text-green-600 dark:border-green-600 dark:text-green-600";
  } else if (
    interfaceModuleData[currentINTERFACEID - 1].serialInterface ===
    "disconnected"
  ) {
    serialInterfaceClass = "border-red-500 text-red-500 dark:border-red-500 dark:text-red-500";
  } else if (
    interfaceModuleData[currentINTERFACEID - 1].serialInterface === "testok"
  ) {
    serialInterfaceClass = "border-yellow-500 text-yellow-500 dark:border-yellow-500 dark:text-yellow-500";
  } else if (
    interfaceModuleData[currentINTERFACEID - 1].serialInterface === "testnotok"
  ) {
    serialInterfaceClass = "border-orange-500 text-orange-500 dark:border-orange-500 dark:text-orange-500";
  } else {
    serialInterfaceClass = "border-gray-300 text-gray-900 dark:border-gray-300 dark:text-gray-900";
  }

  // Ekstraksi logika ternary ke variabel baru
  let analogInterfaceClass = "";

  if (
    interfaceModuleData[currentINTERFACEID - 1].analogInterface === "connected"
  ) {
    analogInterfaceClass = "border-green-600 text-green-600 dark:border-green-600 dark:text-green-600";
  } else if (
    interfaceModuleData[currentINTERFACEID - 1].analogInterface ===
    "disconnected"
  ) {
    analogInterfaceClass = "border-red-500 text-red-500 dark:border-red-500 dark:text-red-500";
  } else if (
    interfaceModuleData[currentINTERFACEID - 1].analogInterface === "testok"
  ) {
    analogInterfaceClass = "border-yellow-500 text-yellow-500 dark:border-yellow-500 dark:text-yellow-500";
  } else if (
    interfaceModuleData[currentINTERFACEID - 1].analogInterface === "testnotok"
  ) {
    analogInterfaceClass = "border-orange-500 text-orange-500 dark:border-orange-500 dark:text-orange-500";
  } else {
    analogInterfaceClass = "border-gray-300 text-gray-900 dark:border-gray-300 dark:text-gray-900";
  }

  // Ekstraksi logika ternary ke variabel baru
  let gpioInterfaceClass = "";

  if (interfaceModuleData[currentINTERFACEID - 1].digitalGpio === "connected") {
    gpioInterfaceClass = "border-green-600 text-green-600 dark:border-green-600 dark:text-green-600";
  } else if (
    interfaceModuleData[currentINTERFACEID - 1].digitalGpio === "disconnected"
  ) {
    gpioInterfaceClass = "border-red-500 text-red-500 dark:border-red-500 dark:text-red-500";
  } else if (
    interfaceModuleData[currentINTERFACEID - 1].digitalGpio === "testok"
  ) {
    gpioInterfaceClass = "border-yellow-500 text-yellow-500 dark:border-yellow-500 dark:text-yellow-500";
  } else if (
    interfaceModuleData[currentINTERFACEID - 1].digitalGpio === "testnotok"
  ) {
    gpioInterfaceClass = "border-orange-500 text-orange-500 dark:border-orange-500 dark:text-orange-500";
  } else {
    gpioInterfaceClass = "border-gray-300 text-gray-900 dark:border-gray-300 dark:text-gray-900";
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {/* Core */}
        <div className="border-2 shadow-md md:h-auto p-2 col-span-2 md:col-span-1 flex flex-col">
          <div className="text-lg font-semibold col-span-5 text-gray-900 dark:text-white">
            CORE
          </div>
          <div className="text-xs font-light mb-3 col-span-5 text-gray-900 dark:text-white">
            Last Update At {new Date().toLocaleString()}
          </div>
          <div>
            <label
              htmlFor="cpu"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              CPU
            </label>
            <div
              className={`bg-gray-50 border ${
                parseFloat(cpu) < 0
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300"
              } cursor-not-allowed text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
            >
              {cpu}% 0.88 Ghz
            </div>
          </div>
          <div>
            <label
              htmlFor="ram"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              RAM
            </label>
            <div
              className={`bg-gray-50 border ${
                parseFloat(ram) < 0
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300"
              } cursor-not-allowed text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
            >
              {ram}MB / 128MB
            </div>
          </div>
          <div>
            <label
              htmlFor="storage"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              STORAGE
            </label>
            <div className="flex flex-row gap-2 mb-2">
              <div
                className={`bg-gray-50 border ${
                  parseFloat(storageMax) < 0
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300"
                } cursor-not-allowed text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
              >
                {storageMax}%
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="redudant"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              REDUDANT
            </label>
            <div className="flex flex-row gap-2 mb-2">
              <input
                type="number"
                name="redudant"
                value={redudant}
                onChange={redudant}
                id="redudant"
                className={`bg-gray-50 border ${
                  parseFloat(redudant) < 0
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300"
                } cursor-not-allowed text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                placeholder="Min Temperature"
                required=""
                disabled
              />
            </div>
          </div>
        </div>
        {/* Display */}
        <div className="border-2 shadow-md md:h-auto p-2 col-span-2 md:col-span-1 flex flex-col">
          <div className="text-lg font-semibold col-span-5 text-gray-900 dark:text-white">
            DISPLAY
          </div>
          <div className="text-xs font-light mb-3 col-span-5 text-gray-900 dark:text-white">
            Last Update At {new Date().toLocaleString()}
          </div>
          <button
            onClick={handleClickDisplay}
            className=" w-auto mb-3 justify-center text-white inline-flex bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Check Display
          </button>
          <div>
            <label
              htmlFor="cpu"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              LCD
            </label>
            <div className="flex flex-row gap-2 mb-2">
              <input
                type="text"
                name="lcd"
                value={lcd}
                onChange={lcd}
                id="lcd"
                className={`bg-gray-50 border ${
                  lcd !== "normal"
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300"
                } cursor-not-allowed text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                placeholder="Min Temperature"
                required=""
                disabled
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="touchscreen"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              TOUCHSCREEN
            </label>
            <div className="flex flex-row gap-2 mb-2">
              <input
                type="text"
                name="touchscreen"
                value={touchscreen}
                onChange={touchscreen}
                id="touchscreen"
                className={`bg-gray-50 border ${
                  touchscreen !== "normal"
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300"
                } cursor-not-allowed text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                placeholder="Min Temperature"
                required=""
                disabled
              />
            </div>
          </div>
        </div>
        {/* Interface */}
        <div className="border-2 shadow-md p-2 md:h-auto col-span-2 flex flex-col">
          <div className="text-lg font-semibold col-span-5 text-gray-900 dark:text-white">
            INTERFACE
          </div>
          <div className="text-xs font-light mb-3 col-span-5 text-gray-900 dark:text-white">
            Last Update At {new Date().toLocaleString()}
          </div>
          <button
            type="submit"
            className=" w-auto mb-3 justify-center text-white inline-flex bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Check Interface
          </button>
          <p className="font-bold mb-2 text-gray-900 dark:text-white">
            INTERFACE ID: {currentINTERFACEID}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="cpu"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                CPU
              </label>
              <div className="flex flex-row gap-2">
                <input
                  type="number"
                  name="cpu"
                  value={interfaceModuleData[currentINTERFACEID - 1].cpu}
                  onChange={interfaceModuleData[currentINTERFACEID - 1].cpu}
                  id="cpu"
                  className={`bg-gray-50 border ${
                    parseFloat(
                      interfaceModuleData[currentINTERFACEID - 1].cpu
                    ) < 0
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300"
                  } cursor-not-allowed text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                  placeholder="Min Temperature"
                  required=""
                  disabled
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="cpu"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                RAM
              </label>
              <div className="flex flex-row gap-2 ">
                <input
                  type="number"
                  name="cpu"
                  value={interfaceModuleData[currentINTERFACEID - 1].ram}
                  onChange={interfaceModuleData[currentINTERFACEID - 1].ram}
                  id="cpu"
                  className={`bg-gray-50 border ${
                    parseFloat(
                      interfaceModuleData[currentINTERFACEID - 1].ram
                    ) > 0
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300"
                  } cursor-not-allowed text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                  placeholder="Min Temperature"
                  required=""
                  disabled
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="cpu"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                STORAGE
              </label>
              <div className="flex flex-row gap-2">
                <input
                  type="number"
                  name="cpuMax"
                  id="cpuMax"
                  value={interfaceModuleData[currentINTERFACEID - 1].storage}
                  onChange={interfaceModuleData[currentINTERFACEID - 1].storage}
                  className={`bg-gray-50 border ${
                    parseFloat(
                      interfaceModuleData[currentINTERFACEID - 1].storage
                    ) > 70
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
                htmlFor="cpu"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                CAN BUS
              </label>
              <div className="flex flex-row gap-2">
                <input
                  type="text"
                  name="serial_interface"
                  value={interfaceModuleData[currentINTERFACEID - 1].canBus}
                  onChange={interfaceModuleData[currentINTERFACEID - 1].canBus}
                  id="serial_interface"
                  className={`bg-gray-50 border ${
                    interfaceModuleData[currentINTERFACEID - 1].canBus !==
                    "connected"
                      ? "border-red-500 text-red-500 dark:border-red-500 dark:text-red-500"
                      : "border-green-600 text-green-600 dark:border-green-600 dark:text-green-600"
                  } cursor-not-allowed text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                  placeholder="Min Temperature"
                  required=""
                  disabled
                />
              </div>
            </div>
            <div className="col-span-2">
              <label
                htmlFor="cpu"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                DETECT INTERFACE
              </label>
              <div className="flex flex-row gap-2">
                <div
                  className={`bg-gray-50 border ${serialInterfaceClass} cursor-not-allowed text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                >
                  Serial Interface
                </div>
                <div
                  className={`bg-gray-50 border ${gpioInterfaceClass} cursor-not-allowed text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                >
                  Digital GPIO
                </div>
                <div
                  className={`bg-gray-50 border ${analogInterfaceClass} cursor-not-allowed text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                >
                  Analog Interface
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex justify-center space-x-2">
                <button onClick={handlePrevID}>
                  <LeftArrowIcon />
                </button>
                <button onClick={handleNextID}>
                  <RightArrowIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* PSU */}
        <div className="border-2 shadow-md md:h-auto p-2 col-span-2 md:col-span-1 flex flex-col">
          <div className="text-lg font-semibold col-span-5 text-gray-900 dark:text-white">
            PSU
          </div>
          <div className="text-xs font-light mb-3 col-span-5 text-gray-900 dark:text-white">
            Last Update At {new Date().toLocaleString()}
          </div>
          <button
            type="submit"
            className=" w-auto mb-3 justify-center text-white inline-flex bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Check PSU
          </button>
          {/* PSU Section */}
          <p className="font-bold mb-2 text-gray-900 dark:text-white">
            PSU ID: {currentPSUID}
          </p>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label
                htmlFor="cpu"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                VOLTAGE
              </label>
              <div className="flex flex-row gap-2">
                <input
                  type="number"
                  name="cpu"
                  value={psuData[currentPSUID - 1].voltage1}
                  onChange={psuData[currentPSUID - 1].voltage1}
                  id="cpu"
                  className={`bg-gray-50 border ${
                    parseFloat(cpu) < 0
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300"
                  } cursor-not-allowed text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                  placeholder="Min Temperature"
                  required=""
                  disabled
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="cpu"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                CURRENT
              </label>
              <div className="flex flex-row gap-2 ">
                <input
                  type="number"
                  name="cpuMax"
                  id="cpuMax"
                  value={psuData[currentPSUID - 1].current1}
                  onChange={psuData[currentPSUID - 1].current1}
                  className={`bg-gray-50 border ${
                    parseFloat(psuData[currentPSUID - 1].current1) > 70
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300"
                  } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                  placeholder="Type product name"
                  required=""
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-2">
            <button onClick={handlePrevPSUID}>
              <LeftArrowIcon />
            </button>
            <button onClick={handleNextPSUID}>
              <RightArrowIcon />
            </button>
          </div>
        </div>
      </div>
      {/* Button Submit */}
      <div className="items-center flex space-y-0 space-x-4 mt-4">
        <button
          type="submit"
          className=" w-auto justify-center text-white inline-flex bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Start Selftest
        </button>
        <div className="text-xs font-light mb-3 col-span-5 text-gray-900 dark:text-white">
            Last Update At {new Date().toLocaleString()}
          </div>
        {/* <button
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
        </button> */}
      </div>
    </div>
  );
};

export default SelfTest;
