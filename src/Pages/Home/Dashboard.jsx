import React, { useState, useEffect } from "react";
import CompasWindTrue from '../../Assets/Svg/Home/WindTrueCompas';
import WindTrueCompasIcon from "../../Assets/Svg/Home/WindTrueCompasIcon";
import CompasWindRelative from '../../Assets/Svg/Home/WindRelativeCompass';
import CourseAndHeadingCompass from '../../Assets/Svg/Home/CourseAndHeadingCompass';
import RollCompass from "../../Assets/Svg/Home/RollCompass";
import PitchArrowIcon from "../../Assets/Svg/Home/PitchArrowIcon";
import PitchCompass from "../../Assets/Svg/Home/PitchCompass";
import WindRelativeArrow from "../../Assets/Svg/Home/WindRealtiveShip.png";
import RollArrow from "../../Assets/Svg/Home/RollShip.png";
import { ReactComponent as CourseAndHeadingArrow } from "../../Assets/Svg/Home/caharrow.svg";

const validateValue = (value, min, max) => {
  if (value === null || value === undefined) {
    return { valid: false, error: "Missing data" };
  }
  if (isNaN(value)) {
    return { valid: false, error: "Invalid value" };
  }
  if (value < min || value > max) {
    return { valid: false, error: "Out-of-range value" };
  }
  return { valid: true, error: null };
};

const Dashboard = () => {
  const [angleTrue, setAngleTrue] = useState(0);
  const [angleRelative, setAngleRelative] = useState(0);
  const [courseHeadingAngle, setCourseHeadingAngle] = useState(0);
  const [rollAngle, setRollAngle] = useState(0);
  const [pitchAngle, setPitchAngle] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const intervalTrue = setInterval(() => {
      const newAngle = (angleTrue + 30) % 360;
      const validation = validateValue(newAngle, 0, 360);
      if (!validation.valid) {
        setErrors((prev) => ({ ...prev, angleTrue: validation.error }));
      } else {
        setAngleTrue(newAngle);
        setErrors((prev) => ({ ...prev, angleTrue: null }));
      }
    }, 3000);

    const intervalRelative = setInterval(() => {
      const newAngle = (angleRelative + 30) % 360;
      const validation = validateValue(newAngle, 0, 360);
      if (!validation.valid) {
        setErrors((prev) => ({ ...prev, angleRelative: validation.error }));
      } else {
        setAngleRelative(newAngle);
        setErrors((prev) => ({ ...prev, angleRelative: null }));
      }
    }, 3000);

    const intervalCourseHeading = setInterval(() => {
      const newAngle = (courseHeadingAngle + 30) % 360;
      const validation = validateValue(newAngle, 0, 360);
      if (!validation.valid) {
        setErrors((prev) => ({ ...prev, courseHeadingAngle: validation.error }));
      } else {
        setCourseHeadingAngle(newAngle);
        setErrors((prev) => ({ ...prev, courseHeadingAngle: null }));
      }
    }, 3000);

    const intervalRoll = setInterval(() => {
      const newAngle = (rollAngle + 10) % 40;
      const validation = validateValue(newAngle, -50, 50);
      if (!validation.valid) {
        setErrors((prev) => ({ ...prev, rollAngle: validation.error }));
      } else {
        setRollAngle(newAngle);
        setErrors((prev) => ({ ...prev, rollAngle: null }));
      }
    }, 3000);

    const intervalPitch = setInterval(() => {
      const newAngle = (pitchAngle + 10) % 40;
      const validation = validateValue(newAngle, -50, 50);
      if (!validation.valid) {
        setErrors((prev) => ({ ...prev, pitchAngle: validation.error }));
      } else {
        setPitchAngle(newAngle);
        setErrors((prev) => ({ ...prev, pitchAngle: null }));
      }
    }, 3000);

    return () => {
      clearInterval(intervalTrue);
      clearInterval(intervalRelative);
      clearInterval(intervalCourseHeading);
      clearInterval(intervalRoll);
      clearInterval(intervalPitch);
    };
  }, [angleTrue, angleRelative, courseHeadingAngle, rollAngle, pitchAngle]);

  return (
    <div className="p-4 dark:bg-darkmode">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
          <div className="border-2 shadow-md p-2 h-96 md:h-60 flex flex-col">
            <h3 className="text-left font-bold mb-2 text-xl dark:text-white">Wind True</h3>
            <div className="flex justify-center items-center flex-grow relative">
              <div className="absolute z-0">
                <CompasWindTrue />
              </div>
              <div
                className="absolute z-10"
                style={{
                  transform: `rotate(${angleTrue}deg)`,
                  transition: "transform 0.5s",
                }}
              >
                <WindTrueCompasIcon />
              </div>
            </div>
            {errors.angleTrue && <div className="text-red-500">{errors.angleTrue}</div>}
            <div className="flex justify-around mt-2">
              <div className="border-2 border-gray-300 bg-gray-300 dark:border-secondlight dark:bg-secondlight dark:text-white p-1 shadow-md rounded font-medium">
                120 Deg
              </div>
              <div className="border-2 border-gray-300 bg-gray-300 dark:border-secondlight dark:bg-secondlight dark:text-white p-1 shadow-md rounded font-medium">
                30.00 kts
              </div>
            </div>
          </div>
          <div className="border-2 shadow-md p-2 h-96 md:h-60 flex flex-col">
            <h3 className="text-left font-bold mb-2 text-xl dark:text-white">Wind Relative</h3>
            <div className="flex justify-center items-center flex-grow relative">
              <div className="absolute z-0">
                <CompasWindRelative />
              </div>
              <div
                className="absolute z-10"
                style={{
                  transform: `rotate(${angleRelative}deg)`,
                  transition: "transform 0.5s",
                }}
              >
                <img
                  className="w-15 h-10"
                  src={WindRelativeArrow}
                  alt="Wind Relative Arrow"
                  border="0"
                />
              </div>
            </div>
            {errors.angleRelative && <div className="text-red-500">{errors.angleRelative}</div>}
            <div className="flex justify-around mt-2">
              <div className="border-2 border-gray-300 bg-gray-300 dark:border-secondlight dark:bg-secondlight dark:text-white p-1 shadow-md rounded font-medium">
                100 Deg
              </div>
              <div className="border-2 border-gray-300 bg-gray-300 dark:border-secondlight dark:bg-secondlight dark:text-white p-1 shadow-md rounded font-medium">
                6.50 kts
              </div>
            </div>
          </div>
        </div>
        <div className="border-2 shadow-md p-2 h-[650px] md:h-auto col-span-2 flex flex-col">
          <h3 className="text-left font-bold mb-2 text-xl dark:text-white">
            Course and Heading
          </h3>
          <div className="flex justify-center items-center flex-grow relative">
            <div className="absolute z-0">
              <CourseAndHeadingCompass />
            </div>
            <div
              className="absolute z-10"
              style={{
                transform: `rotate(${courseHeadingAngle}deg)`,
                transition: "transform 0.5s",
              }}
            >
              <CourseAndHeadingArrow />
            </div>
          </div>
          {errors.courseHeadingAngle && <div className="text-red-500">{errors.courseHeadingAngle}</div>}
          <div className="flex justify-around mt-2">
            <div className="border-2 border-gray-300 bg-gray-300 dark:border-secondlight dark:bg-secondlight dark:text-white p-1 shadow-md rounded font-medium">
              Course: 30°
            </div>
            <div className="border-2 border-gray-300 bg-gray-300 dark:border-secondlight dark:bg-secondlight dark:text-white p-1 shadow-md rounded font-medium">
              Heading: 60°
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2 bg-gray-100 dark:bg-secondlight p-3 rounded">
            <div className="flex flex-col">
              <p className="dark:text-white">Depth</p>
              <div className="border-2 border-gray-300 bg-gray-300 dark:border-secondcontent dark:bg-secondcontent dark:text-white p-1 shadow-md rounded font-medium">
                30.55 m
              </div>
            </div>
            <div className="flex flex-col sm:col-span-2">
              <p className="dark:text-white">Magnetic Heading</p>
              <div className="border-2 border-gray-300 bg-gray-300 dark:border-secondcontent dark:bg-secondcontent dark:text-white p-1 shadow-md rounded font-medium">
                46°
              </div>
            </div>
            <div className="flex flex-col">
              <p className="dark:text-white">Speed Over Ground</p>
              <div className="border-2 border-gray-300 bg-gray-300 dark:border-secondcontent dark:bg-secondcontent dark:text-white p-1 shadow-md rounded font-medium">
                12.00 kts
              </div>
            </div>
            <div className="flex-col flex">
              <p className="dark:text-white">Speed Through Water</p>
              <div className="border-2 border-gray-300 bg-gray-300 dark:border-secondcontent dark:bg-secondcontent dark:text-white p-1 shadow-md rounded font-medium">
                17.71 kts
              </div>
            </div>
          </div>
        </div>
        <div className="border-2 shadow-md h-[500px] md:h-auto p-2 col-span-2 md:col-span-1 flex flex-col">
          <h3 className="text-left font-bold mb-2 text-xl dark:text-white">Roll</h3>
          <div className="flex justify-center items-center flex-grow relative">
            <div className="absolute z-0">
              <RollCompass />
            </div>
            <div
              className="absolute z-10 mb-8"
              style={{
                transform: `rotate(${rollAngle - 20}deg)`,
                transition: "transform 0.5s",
              }}
            >
              <img
                className="w-15 h-9"
                src={RollArrow}
                alt="Roll Arrow"
                border="0"
              />
            </div>
          </div>
          {errors.rollAngle && <div className="text-red-500">{errors.rollAngle}</div>}
          <div className="flex justify-center mt-2 border-2 border-gray-300 bg-gray-300 dark:border-secondlight dark:bg-secondlight dark:text-white p-1 shadow-md rounded ">
            <div>{rollAngle - 20}°</div>
          </div>
          <div className="dark:bg-secondlight bg-gray-100 p-2 mt-2 rounded">
            <div className="flex-col flex">
              <p className="dark:text-white">Air Temperature</p>
              <div className="border-2 border-gray-300 bg-gray-300 dark:border-secondcontent dark:bg-secondcontent dark:text-white p-1 shadow-md rounded font-medium">
                1.50°C
              </div>
            </div>
            <div className="flex-col flex">
              <p className="dark:text-white">Barometric Pressure</p>
              <div className="border-2 border-gray-300 bg-gray-300 dark:border-secondcontent dark:bg-secondcontent dark:text-white p-1 shadow-md rounded font-medium">
                182.55 mbar
              </div>
            </div>
            <div className="flex-col flex">
              <p className="dark:text-white">Relative Humidity</p>
              <div className="border-2 border-gray-300 bg-gray-300 dark:border-secondcontent dark:bg-secondcontent dark:text-white p-1 shadow-md rounded font-medium">
                6.50%
              </div>
            </div>
          </div>
        </div>
        <div className="border-2 shadow-md h-[500px] md:h-auto p-2 col-span-1 flex flex-col">
          <h3 className="text-left font-bold mb-2 text-xl dark:text-white">Pitch</h3>
          <div className="flex justify-center items-center flex-grow relative">
            <div className="absolute z-0">
              <PitchCompass />
            </div>
            <div
              className="absolute z-10 mb-5"
              style={{
                transform: `rotate(${pitchAngle - 20}deg)`,
                transition: "transform 0.5s",
              }}
            >
              <PitchArrowIcon />
            </div>
          </div>
          {errors.pitchAngle && <div className="text-red-500">{errors.pitchAngle}</div>}
          <div className="flex justify-center mt-2 border-2 border-gray-300 bg-gray-300 dark:border-secondlight dark:bg-secondlight dark:text-white p-1 shadow-md rounded font-medium">
            <div>{pitchAngle - 20}°</div>
          </div>
          <div className="dark:bg-secondlight bg-gray-100 p-2 shadow-md rounded mt-2">
            <div className="flex-col flex">
              <p className="dark:text-white">UTC</p>
              <div className="border-2 border-gray-300 bg-gray-300 dark:border-secondcontent dark:bg-secondcontent dark:text-white p-1 shadow-md rounded font-medium">
                5.21.2022 - 05:43:45
              </div>
            </div>
            <div className="flex-col flex">
              <p className="dark:text-white">Local Time</p>
              <div className="border-2 border-gray-300 bg-gray-300 dark:border-secondcontent dark:bg-secondcontent dark:text-white p-1 shadow-md rounded font-medium">
                5.21.2022 - 12:43:45
              </div>
            </div>
            <div className="flex-col flex">
              <p className="dark:text-white">Position</p>
              <div className="border-2 border-gray-300 bg-gray-300 dark:border-secondcontent dark:bg-secondcontent dark:text-white p-1 shadow-md rounded font-medium">
                N41025’34.00” W025056’24.30”
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
