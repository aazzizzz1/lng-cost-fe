import React from "react";
import pgnlng from "../../Assets/Images/pgnlngdashboard.png";

const DashboardPages = () => {
  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div class="grid grid-cols-3 gap-4">
          <div class="col-span-2 ">
            <img
              className="w-full block rounded-lg"
              src={pgnlng}
              alt="dashboard"
            />
          </div>
          <div class="...">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Let's create more tools and ideas that brings us together.
            </h2>
            <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
              Menggunakan sistem ini, pengguna dapat melakukan simulasi dan
              analisis untuk memahami dampak dari berbagai faktor terhadap harga
              LNG dan pasokan LNG.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 ">
          <div className="space-y-8 md:grid md:grid-cols-4 lg:grid-cols-3 md:gap-12 md:space-y-0">
            <div>
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
            </div>
            <div>
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
                      d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-xl font-bold dark:text-white">
                  Pekerjaan
                  <p className="text-gray-500 dark:text-gray-400">78</p>
                </h3>
              </div>
            </div>
            <div>
              <div className="flex flex-row">
                <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                  <svg
                    className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="ml-3 text-xl font-bold dark:text-white">
                  Jasa
                  <p className="text-gray-500 dark:text-gray-400">89</p>
                </h3>
              </div>
            </div>
            <div>
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
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="ml-3 text-xl font-bold dark:text-white">
                  Operasi
                  <p className="text-gray-500 dark:text-gray-400">31</p>
                </h3>
              </div>
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
