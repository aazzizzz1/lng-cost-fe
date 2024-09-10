import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LogoLen from "../Assets/Svg/Sidebar/LogoLen.svg";
import HomeIcon from "../Assets/Svg/Sidebar/HomeIcon";
import DeepthSensorIcon from "../Assets/Svg/Layout/DeepthSensorIcon";
import BarometerSensorIcon from "../Assets/Svg/Layout/BarometerSensorIcon";
import GyroscopeSensorIcon from "../Assets/Svg/Layout/GyroscopeSensorIcon";
import SpeedSensorIcon from "../Assets/Svg/Layout/SpeedSensorIcon";
import TemperatureSensorIcon from "../Assets/Svg/Layout/TemperatureSensorIcon";
import Clock from "../Components/Clock/Clock";
import CurrentPosition from "../Components/Position/Position";
import "../Style/CustomScrollbar.css";
import SimulatorIcon from "../Assets/Svg/Sidebar/SimulatorIcon";
import SensorIcon from "../Assets/Svg/Sidebar/SensorIcon";
import AccountIcon from "../Assets/Svg/Sidebar/AccountIcon";
import NdduIcon from "../Assets/Svg/Sidebar/NdduIcon";

const HomeLayout = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const iconMapping = {
    "depth sensor": DeepthSensorIcon,
    gyroscope: GyroscopeSensorIcon,
    barometer: BarometerSensorIcon,
    "speed sensor": SpeedSensorIcon,
    "temperature": TemperatureSensorIcon,
  };

  // Data dummy statis untuk sensor
  const sensors = [
    {
      id: 1,
      name: "Depth Sensor",
      value: "5790 ms",
    },
    {
      id: 2,
      name: "Gyroscope",
      value: "5790 rad/s",
    },
    {
      id: 3,
      name: "Barometer",
      value: "5790 atm",
    },
    {
      id: 4,
      name: "Speed Sensor",
      value: "5790 mil/h",
    },
    {
      id: 5,
      name: "Temperature",
      value: "25°C",
    },
  ];

  const [mode, setMode] = useState("Operation Mode");

  useEffect(() => {
    const interval = setInterval(() => {
      setMode((prevMode) =>
        prevMode === "Operation Mode" ? "Simulation Mode" : "Operation Mode"
      );
    }, 3000); // 3000ms = 3 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  return (
    <>
      {/* Navbar content */}
      <nav className="bg-white dark:bg-gray-900 fixed top-0 left-0 w-full z-10 border-b border-gray-200 dark:border-gray-600">
        <button
          className={`inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900 md:hidden ${
            isOpen ? "p-0 pl-2" : "p-2"
          }`}
          onClick={toggleSidebar}
        >
          <svg
            className="w-6 h-6"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
          {isOpen && (
            <div className="md:hidden">
              <div className="px-2 space-y-1 sm:px-3 flex flex-row">
                <Link
                  to="/dashboard"
                  className="block px-3 mt-1 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Home
                </Link>
                <Link
                  to="/simulator"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Simulator
                </Link>
                <Link
                  to="/sensor"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Sensor
                </Link>
                <Link
                  to="/account"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Account Setting
                </Link>
                {/* <Link
                to="/settings"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Setting
              </Link> */}
              </div>
            </div>
          )}
        </button>
        {/* Time Position Sensor */}
        <div className="hidden w-full md:grid grid-cols-1 gap-0 md:grid-cols-6">
          <div className="h-full w-full rounded border-[1px] bg-white dark:bg-gray-800 p-1">
            <div className="flex flex-col justify-start items-start">
              <div className="flex flex-col ml-5 justify-start items-start">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  Time
                </p>
                <Clock />
              </div>
            </div>
          </div>
          <div className="h-full w-full rounded border-[1px] bg-white dark:bg-gray-800 p-1">
            <div className="flex flex-col justify-start items-start">
              <div className="flex flex-col ml-5 justify-start items-start">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  Position
                </p>
                <CurrentPosition />
              </div>
            </div>
          </div>
          {/* Tambahkan elemen sensor lainnya di sini */}
          <div className="col-span-4 overflow-x-auto flex custom-scrollbar">
            {sensors.map((sensor) => {
              const IconComponent = iconMapping[sensor.name.toLowerCase()];
              return (
                <div
                  key={sensor.id}
                  className="flex-none h-[82px] w-52 rounded border-[1px] bg-white dark:bg-gray-800 p-3"
                >
                  <div className="flex flex-col justify-start items-start">
                    <div className="flex items-center space-x-2">
                      {IconComponent ? <IconComponent /> : "icon tidak ada"}
                      <p className="text-base text-gray-900 dark:text-white">
                        {sensor.name}
                      </p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {sensor.value}
                    </p>
                  </div>
                </div>
              );
            })}
            <div className="flex-none h-[82px] w-52 rounded border-[1px] bg-white dark:bg-gray-800 p-3">
              <div className="flex flex-col justify-start items-start">
                <div className="flex items-center space-x-2">
                  <DeepthSensorIcon />
                  <p className="text-base text-gray-900 dark:text-white">
                    Depth Sensor
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  5790 ms
                </p>
              </div>
            </div>
            <div className="flex-none h-[82px] w-52 rounded border-[1px] bg-white dark:bg-gray-800 p-3">
              <div className="flex flex-col justify-start items-start">
                <div className="flex items-center space-x-2">
                  <DeepthSensorIcon />
                  <p className="text-base text-gray-900 dark:text-white">
                    Gyroscope
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  5790 rad/s
                </p>
              </div>
            </div>
            <div className="flex-none h-[82px] w-52 rounded border-[1px] bg-white dark:bg-gray-800 p-3">
              <div className="flex flex-col justify-start items-start">
                <div className="flex items-center space-x-2">
                  <DeepthSensorIcon />
                  <p className="text-base text-gray-900 dark:text-white">
                    Barometer
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  5790 atm
                </p>
              </div>
            </div>
            <div className="flex-none h-[82px] w-52 rounded border-[1px] bg-white dark:bg-gray-800 p-3">
              <div className="flex flex-col justify-start items-start">
                <div className="flex items-center space-x-2">
                  <DeepthSensorIcon />
                  <p className="text-base text-gray-900 dark:text-white">
                    Speed Sensor
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  5790 mil/h
                </p>
              </div>
            </div>
            <div className="flex-none h-[82px] w-52 rounded border-[1px] bg-white dark:bg-gray-800 p-3">
              <div className="flex flex-col justify-start items-start">
                <div className="flex items-center space-x-2">
                  <DeepthSensorIcon />
                  <p className="text-base text-gray-900 dark:text-white">
                    Barometer
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  5790 atm
                </p>
              </div>
            </div>
            <div className="flex-none h-[82px] w-52 rounded border-[1px] bg-white dark:bg-gray-800 p-3">
              <div className="flex flex-col justify-start items-start">
                <div className="flex items-center space-x-2">
                  <DeepthSensorIcon />
                  <p className="text-base text-gray-900 dark:text-white">
                    Speed Sensor
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  5790 mil/h
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="px-2 py-10 md:py-[81px] dark:bg-darkmode">
        {/* Time Position Sensor Mobile */}
        <div className="md:hidden pb-2 w-full grid grid-cols-2 gap-0 md:grid-cols-6">
          <div className="h-full w-full rounded border-[1px] bg-white dark:bg-gray-80 p-1">
            <div className="flex flex-col justify-start items-start">
              <div className="flex flex-col ml-5 justify-start items-start">
                <p className="text-3xl font-bold text-gray-900">Time</p>
                <Clock />
              </div>
            </div>
          </div>
          <div className="h-full w-full rounded border-[1px] bg-white dark:bg-gray-80 p-1">
            <div className="flex flex-col justify-start items-start">
              <div className="flex flex-col ml-5 justify-start items-start">
                <p className="text-3xl font-bold text-gray-900">Position</p>
                <CurrentPosition />
              </div>
            </div>
          </div>
          {/* Tambahkan elemen sensor lainnya di sini */}
          <div className="col-span-4 overflow-x-auto flex custom-scrollbar">
            <div className="flex-none h-[82px] w-52 rounded border-[1px] bg-white dark:bg-gray-800 p-3">
              <div className="flex flex-col justify-start items-start">
                <div className="flex items-center space-x-2">
                  <DeepthSensorIcon />
                  <p className="text-base text-gray-900 dark:text-white">
                    Depth Sensor
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  5790 ms
                </p>
              </div>
            </div>
            <div className="flex-none h-[82px] w-52 rounded border-[1px] bg-white dark:bg-gray-800 p-3">
              <div className="flex flex-col justify-start items-start">
                <div className="flex items-center space-x-2">
                  <DeepthSensorIcon />
                  <p className="text-base text-gray-900 dark:text-white">
                    Gyroscope
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  5790 rad/s
                </p>
              </div>
            </div>
            <div className="flex-none h-[82px] w-52 rounded border-[1px] bg-white dark:bg-gray-800 p-3">
              <div className="flex flex-col justify-start items-start">
                <div className="flex items-center space-x-2">
                  <DeepthSensorIcon />
                  <p className="text-base text-gray-900 dark:text-white">
                    Barometer
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  5790 atm
                </p>
              </div>
            </div>
            <div className="flex-none h-[82px] w-52 rounded border-[1px] bg-white dark:bg-gray-800 p-3">
              <div className="flex flex-col justify-start items-start">
                <div className="flex items-center space-x-2">
                  <DeepthSensorIcon />
                  <p className="text-base text-gray-900 dark:text-white">
                    Speed Sensor
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  5790 mil/h
                </p>
              </div>
            </div>
            <div className="flex-none h-[82px] w-52 rounded border-[1px] bg-white dark:bg-gray-800 p-3">
              <div className="flex flex-col justify-start items-start">
                <div className="flex items-center space-x-2">
                  <DeepthSensorIcon />
                  <p className="text-base text-gray-900 dark:text-white">
                    Barometer
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  5790 atm
                </p>
              </div>
            </div>
            <div className="flex-none h-[82px] w-52 rounded border-[1px] bg-white dark:bg-gray-800 p-3">
              <div className="flex flex-col justify-start items-start">
                <div className="flex items-center space-x-2">
                  <DeepthSensorIcon />
                  <p className="text-base text-gray-900 dark:text-white">
                    Speed Sensor
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  5790 mil/h
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="home">{props.children}</div>
      </div>

      {/* Footer */}
      <footer className="hidden md:fixed bottom-0 left-0 z-10 w-full p-2 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-4 dark:bg-gray-800 dark:border-gray-600">
        {/* Footer content */}
        <ul className="flex gap-4 flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <Link
              to="/dashboard"
              className="me-4 md:me-6 flex flex-col items-center"
            >
              <HomeIcon />
              <p className="text-maincolor dark:text-white">Home</p>
            </Link>
          </li>
          <li>
            <Link
              to="/simulator"
              className="me-4 md:me-6 flex flex-col items-center"
            >
              <SimulatorIcon />
              <p className="text-maincolor dark:text-white">Simulator</p>
            </Link>
          </li>
          <li>
            <Link
              to="/sensor"
              className="me-4 md:me-6 flex flex-col items-center"
            >
              <SensorIcon />
              <p className="text-maincolor dark:text-white">Sensor</p>
            </Link>
          </li>
          <li>
            <Link
              to="/account"
              className="me-4 md:me-6 flex flex-col items-center"
            >
              <AccountIcon />
              <p className="text-maincolor dark:text-white"> Account Setting</p>
            </Link>
          </li>
          {/* <li>
            <Link
              to="/simulator"
              className="me-4 md:me-6 flex flex-col items-center"
            >
              <Setting />
              <p className="text-maincolor">Setting</p>
            </Link>
          </li> */}
        </ul>
        <span className="flex flex-row text-sm text-gray-500 sm:text-center dark:text-gray-400">
          <ul className="flex flex-row">
            <li>
              <p
                className={`me-4 md:me-6 ${
                  mode === "Simulation Mode" ? "text-red-500" : "text-green-500"
                }`}
              >
                {mode}
              </p>
            </li>
            <li>
              {/* dark mode */}
              <button
                className="w-10 h-10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                onClick={() => {
                  document.body.classList.toggle("dark");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M12 2a1 1 0 01.993.883L13 3v2a1 1 0 01-1.993.117L11 5V3a1 1 0 011-1zm5.657 2.343a1 1 0 011.32-.083l.094.083 1.414 1.414a1 1 0 01-1.32 1.497l-.094-.083-1.414-1.414a1 1 0 010-1.414zm-11.314 0a1 1 0 01.083 1.32l-.083.094L4.343 7.071a1 1 0 01-1.497-1.32l.083-.094L4.343 4.343a1 1 0 011.414 0zM12 17a5 5 0 110-10 5 5 0 010 10zm-8 3a1 1 0 01.117 1.993L4 22H2a1 1 0 01-.117-1.993L2 20h2zm16 0a1 1 0 01.117 1.993L20 22h-2a1 1 0 01-.117-1.993L18 20h2zM5.636 18.364a1 1 0 011.497-1.32l.094.083 1.414 1.414a1 1 0 01-1.32 1.497l-.094-.083-1.414-1.414a1 1 0 010-1.414zm12.728 0a1 1 0 01.083 1.32l-.083.094-1.414 1.414a1 1 0 01-1.497-1.32l.083-.094 1.414-1.414a1 1 0 011.414 0zM12 20a1 1 0 01.993.883L13 21v2a1 1 0 01-1.993.117L11 23v-2a1 1 0 011-1z" />
                </svg>
              </button>
            </li>
            <li className="me-0 md:me-0">
              <img
                className="w-15 h-10"
                src={LogoLen}
                alt="Logo-Len"
                border="0"
              />
            </li>
            <li>
              <NdduIcon />
              {/* <img
              className="w-15 h-10"
              src={LogoNddu}
              alt="Logo-Nddu"
              border="0"
            /> */}
            </li>
          </ul>
        </span>
      </footer>
    </>
  );
};

export default HomeLayout;
