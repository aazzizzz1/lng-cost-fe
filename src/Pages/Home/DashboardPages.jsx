import React from "react";
import pgnlng from "../../Assets/Images/pgnlngdashboard.png";
import ChartItems from "./ChartItems";

const DashboardPages = () => {
  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <h2 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          Selamat Datang di Dashboard LNG
        </h2>
        <p className="mb-2 font-normal text-gray-500 md:text-lg dark:text-gray-400">
          Dashboard ini memberikan gambaran umum tentang komposisi harga satuan
          LNG.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 ">
            <img
              className="w-full block rounded-lg"
              src={pgnlng}
              alt="dashboard"
            />
          </div>
          <div className="...">
            <ChartItems />
          </div>
        </div>
      </section>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 ">
          <div className="space-y-8 md:grid md:grid-cols-4 lg:grid-cols-3 md:gap-12 md:space-y-0">
            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex flex-row">
                <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                  <svg
                    className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className=" ml-3 text-xl font-bold dark:text-white">
                  Material
                  <p className="text-gray-500 dark:text-gray-400">367</p>
                </h3>
              </div>
              <a
                href="#a"
                className="inline-flex font-medium items-center text-blue-600 hover:underline"
              >
                See our guideline
                <svg
                  className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
                  />
                </svg>
              </a>
            </div>
            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex flex-row">
                <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                  <svg
                    className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className=" ml-3 text-xl font-bold dark:text-white">
                  Pekerjaan
                  <p className="text-gray-500 dark:text-gray-400">78</p>
                </h3>
              </div>
              <a
                href="#a"
                className="inline-flex font-medium items-center text-blue-600 hover:underline"
              >
                See our guideline
                <svg
                  className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
                  />
                </svg>
              </a>
            </div>
            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex flex-row">
                <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                  <svg
                    className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className=" ml-3 text-xl font-bold dark:text-white">
                  Jasa
                  <p className="text-gray-500 dark:text-gray-400">78</p>
                </h3>
              </div>
              <a
                href="#a"
                className="inline-flex font-medium items-center text-blue-600 hover:underline"
              >
                See our guideline
                <svg
                  className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
                  />
                </svg>
              </a>
            </div>
            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex flex-row">
                <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                  <svg
                    className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className=" ml-3 text-xl font-bold dark:text-white">
                  Operasi
                  <p className="text-gray-500 dark:text-gray-400">78</p>
                </h3>
              </div>
              <a
                href="#a"
                className="inline-flex font-medium items-center text-blue-600 hover:underline"
              >
                See our guideline
                <svg
                  className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardPages;

// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// // import BackgroundLNG from "../../Assets/Images/PLI.jpeg";

// const DashboardPages = () => {
//   const navigate = useNavigate()

//   const handleClick = (path) => {
//     navigate(path)
//   }

//   return (
//     <div className="relative w-full h-screen bg-blue-200">
//       {/* Background Gambar Utama */}
//       {/* <img src={BackgroundLNG} alt="LNG Diagram" className="w-full h-auto" /> */}

//       {/* Tombol Interaktif - Posisi disesuaikan dengan posisi gambar */}
//       <button
//         onClick={() => handleClick('/storage')}
//         className="absolute top-[20%] left-[10%] w-[80px] h-[80px] bg-transparent"
//         title="Storage"
//       />

//       <button
//         onClick={() => handleClick('/fsru')}
//         className="absolute top-[10%] left-[30%] w-[80px] h-[80px] bg-transparent"
//         title="FSRU / LNGC"
//       />

//       <button
//         onClick={() => handleClick('/offshore-platform')}
//         className="absolute top-[10%] left-[60%] w-[80px] h-[80px] bg-transparent"
//         title="Offshore Platform"
//       />

//       <button
//         onClick={() => handleClick('/tank')}
//         className="absolute top-[50%] left-[40%] w-[80px] h-[80px] bg-transparent"
//         title="Tank"
//       />

//       <button
//         onClick={() => handleClick('/truck-tank')}
//         className="absolute top-[70%] left-[20%] w-[80px] h-[80px] bg-transparent"
//         title="Truck Tank"
//       />

//       <button
//         onClick={() => handleClick('/plant')}
//         className="absolute top-[70%] left-[60%] w-[80px] h-[80px] bg-transparent"
//         title="Plant"
//       />
//     </div>
//   )
// }

// export default DashboardPages
