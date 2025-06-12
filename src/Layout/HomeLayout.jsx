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
import SimulatorIcon from "../Assets/Svg/Sidebar/SimulatorIcon";
import SensorIcon from "../Assets/Svg/Sidebar/SensorIcon";
import AccountIcon from "../Assets/Svg/Sidebar/AccountIcon";
import SeltTestIcon from "../Assets/Svg/Sidebar/SeltTestIcon";
import NdduIcon from "../Assets/Svg/Sidebar/NdduIcon";
import IconLogOut from "../Assets/Svg/Sidebar/IconLogOut";
import MatrixIcon from "../Assets/Svg/Sidebar/MatrixIcon";
import MobileNavbar from "./MobileNavbar";
import EditSourceModal from "./EditSourceModal";
import Cookies from 'js-cookie';

const HomeLayout = (props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check system color scheme preference and stored preference in localStorage
    const storedPreference = localStorage.getItem("darkMode");
    if (storedPreference) {
      return storedPreference === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [sensors, setSensors] = useState([
    { id: 1, name: "Depth Sensor", value: "5790 ms" },
    { id: 2, name: "Gyroscope", value: "5790 rad/s" },
    { id: 3, name: "Barometer", value: "5790 atm" },
    { id: 4, name: "Speed Sensor", value: "5790 mil/h" },
    { id: 5, name: "Temperature", value: "25°C" },
    { id: 6, name: "Temperature", value: "25°C" },
    { id: 7, name: "Temperature", value: "25°C" },
  ]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);

  const handleEditClick = (sensor) => {
    setSelectedSensor(sensor);
    setEditModalOpen(true);
  };

  const handleUpdateSensor = (updatedSensor) => {
    setSensors((prevSensors) =>
      prevSensors.map((sensor) =>
        sensor.id === updatedSensor.id ? updatedSensor : sensor
      )
    );
    setEditModalOpen(false);
  };

  useEffect(() => {
    // Apply dark mode based on isDarkMode state
    if (isDarkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const iconMapping = {
    "depth sensor": DeepthSensorIcon,
    gyroscope: GyroscopeSensorIcon,
    barometer: BarometerSensorIcon,
    "speed sensor": SpeedSensorIcon,
    temperature: TemperatureSensorIcon,
  };

  const [mode, setMode] = useState("Operation Mode");

  useEffect(() => {
    const interval = setInterval(() => {
      setMode((prevMode) =>
        prevMode === "Operation Mode" ? "Simulation Mode" : "Operation Mode"
      );
    }, 3000); // 3000ms = 3 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/signin';
  };

  const footerLinks = [
    { to: "/dashboard", icon: HomeIcon, label: "Home" },
    { to: "/simulator", icon: SimulatorIcon, label: "Simulator" },
    { to: "/object", icon: SensorIcon, label: "Object" },
    { to: "/matrix", icon: MatrixIcon, label: "Matrix" },
    { to: "/account", icon: AccountIcon, label: "Account" },
    {
      to: "/selftest",
      icon: SeltTestIcon,
      label: "Self Test",
      alert: "danger",
    },
    { to: "#", icon: IconLogOut, label: "Log Out", onClick: handleLogout },
  ];

  return (
    <>
      {/* Modal for editing sensor value */}
      <EditSourceModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdate={handleUpdateSensor}
        sensor={selectedSensor}
      />

      {/* Navbar content */}
      <nav className="bg-white dark:bg-gray-900 fixed top-0 left-0 w-full z-30 border-b border-gray-200 dark:border-gray-600">
        {/* Navbar button mobile */}
        <MobileNavbar
          isOpen={isOpen}
          toggleSidebar={toggleSidebar}
          toggleDarkMode={toggleDarkMode}
        />
        {/* Time Position Sensor */}
        <div className="hidden w-full md:grid gap-0 md:grid-cols-6">
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
                <button
                  key={sensor.id}
                  className="flex-none h-[82px] w-52 rounded border-[1px] bg-white dark:bg-gray-800 p-3"
                  onClick={() => handleEditClick(sensor)}
                >
                  <div className="flex flex-col justify-start items-start">
                    <div className="flex items-center space-x-2">
                      {IconComponent ? <IconComponent /> : <SensorIcon />}
                      <p className="text-base text-gray-900 dark:text-white">
                        {sensor.name}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {sensor.value}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="px-2 py-10 md:py-[81px] dark:bg-darkmode">
        {/* Time Position Sensor Mobile */}
        <div className="md:hidden pb-2 w-full grid grid-cols-4 gap-0">
          <div className="h-full w-full rounded border-[1px] bg-white dark:bg-gray-800 p-1">
            <div className="flex flex-col justify-start items-start">
              <div className="flex flex-col ml-2 justify-start items-start">
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  Time
                </p>
                <Clock />
              </div>
            </div>
          </div>
          <div className="h-full w-full rounded border-[1px] bg-white dark:bg-gray-800 p-1">
            <div className="flex flex-col justify-start items-start">
              <div className="flex flex-col ml-2 justify-start items-start">
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  Position
                </p>
                <CurrentPosition />
              </div>
            </div>
          </div>
          {/* Tambahkan elemen sensor lainnya di sini */}
          <div className="col-span-2 overflow-x-auto flex custom-scrollbar">
            {sensors.map((sensor) => {
              const IconComponent = iconMapping[sensor.name.toLowerCase()];
              return (
                <button
                  key={sensor.id}
                  className="flex-none h-full w-52 rounded border-[1px] bg-white dark:bg-gray-800 p-3"
                  onClick={() => handleEditClick(sensor)}
                >
                  <div className="flex flex-col justify-start items-start">
                    <div className="flex items-center space-x-2">
                      {IconComponent ? <IconComponent /> : <SensorIcon />}
                      <p className="text-base text-gray-900 dark:text-white">
                        {sensor.name}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {sensor.value}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        {/* Main Content */}
        <div className="home">{props.children}</div>
      </div>

      {/* Footer */}
      <footer className="hidden md:fixed bottom-0 left-0 z-10 w-full p-2 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-4 dark:bg-gray-800 dark:border-gray-600">
        {/* Footer content */}
        <ul className="flex gap-4 flex-wrap items-center mt-2 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          {footerLinks.map((link, index) => (
            <li key={index} className="relative">
              <Link to={link.to} className="mr-2 flex flex-col items-center" onClick={link.onClick}>
                <link.icon className="w-6 h-6" />
                <p className="text-maincolor dark:text-white mt-1">
                  {link.label}
                </p>
                {window.location.pathname === link.to && (
                  <span className="block w-8 h-[3px] mt-1 bg-gray-300 dark:bg-gray-400 rounded-full" />
                )}
              </Link>
              {link.alert === "danger" && (
                <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 w-3.5 h-3.5 bg-red-600 border-2 border-white dark:border-gray-800 rounded-full" />
              )}
            </li>
          ))}
        </ul>

        <span className="flex flex-row text-sm text-gray-500 sm:text-center dark:text-gray-400">
          <ul className="flex flex-row">
            <li>
              <p
                className={`me-4 md:me-6 mt-3 ${
                  mode === "Simulation Mode" ? "text-red-500" : "text-green-500"
                }`}
              >
                {mode}
              </p>
            </li>
            <li>
              {/* dark mode */}
              <button
                className="w-10 h-10 mt-1 mr-4 hover:text-gray-700 dark:hover:text-gray-200 text-gray-900 dark:text-white"
                onClick={toggleDarkMode}
              >
                <svg
                  width="40"
                  height="41"
                  viewBox="0 0 40 41"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 27.1666C23.6819 27.1666 26.6667 24.1819 26.6667 20.5C26.6667 16.8181 23.6819 13.8333 20 13.8333C16.3181 13.8333 13.3334 16.8181 13.3334 20.5C13.3334 24.1819 16.3181 27.1666 20 27.1666Z"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M33.3333 20.5H35M5 20.5H6.66667M20 33.8333V35.5M20 5.5V7.16667M29.4283 29.9283L30.6067 31.1067M9.39333 9.89333L10.5717 11.0717M10.5717 29.9283L9.39333 31.1067M30.6067 9.89333L29.4283 11.0717"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                  />
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
            </li>
          </ul>
        </span>
      </footer>
    </>
  );
};

export default HomeLayout;
