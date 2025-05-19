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
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          {/* <div className="max-w-screen-md mb-8 lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Designed for business teams like yours
            </h2>
            <p className="text-gray-500 sm:text-xl dark:text-gray-400">
              Here at Flowbite we focus on markets where technology, innovation,
              and capital can unlock long-term value and drive economic growth.
            </p>
          </div> */}
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
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto max-w-screen-xl">
            {/* Start coding here */}
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="w-full md:w-1/2">
                  <h1 className="text-base dark:text-white">
                    Project Overview
                  </h1>
                </div>
                <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                  <button
                    type="button"
                    className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                  >
                    <svg
                      className="h-3.5 w-3.5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      />
                    </svg>
                    Add Project
                  </button>
                  <div className="flex items-center space-x-3 w-full md:w-auto">
                    <button
                      id="filterDropdownButton"
                      data-dropdown-toggle="filterDropdown"
                      className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="h-4 w-4 mr-2 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Filter
                      <svg
                        className="-mr-1 ml-1.5 w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          clipRule="evenodd"
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        />
                      </svg>
                    </button>
                    <div
                      id="filterDropdown"
                      className="z-10 hidden w-48 p-3 bg-white rounded-lg shadow dark:bg-gray-700"
                    >
                      <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                        Choose brand
                      </h6>
                      <ul
                        className="space-y-2 text-sm"
                        aria-labelledby="filterDropdownButton"
                      >
                        <li className="flex items-center">
                          <input
                            id="apple"
                            type="checkbox"
                            defaultValue=""
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor="apple"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                          >
                            Apple (56)
                          </label>
                        </li>
                        <li className="flex items-center">
                          <input
                            id="fitbit"
                            type="checkbox"
                            defaultValue=""
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label
                            htmlFor="fitbit"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                          >
                            Microsoft (16)
                          </label>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-4 py-3">
                        Project name
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Category
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Brand
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Description
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Price
                      </th>
                      <th scope="col" className="px-4 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        LNG Plant
                      </th>
                      <td className="px-4 py-3">PC</td>
                      <td className="px-4 py-3">Apple</td>
                      <td className="px-4 py-3">300</td>
                      <td className="px-4 py-3">$2999</td>
                      <td className="px-4 py-3 flex items-center justify-end">
                        <button
                          id="apple-imac-27-dropdown-button"
                          data-dropdown-toggle="apple-imac-27-dropdown"
                          className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                          type="button"
                        >
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                        <div
                          id="apple-imac-27-dropdown"
                          className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                        >
                          <ul
                            className="py-1 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="apple-imac-27-dropdown-button"
                          >
                            <li>
                              <a
                                href="#d"
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Show
                              </a>
                            </li>
                            <li>
                              <a
                                href="#d"
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Edit
                              </a>
                            </li>
                          </ul>
                          <div className="py-1">
                            <a
                              href="#s"
                              className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        FSRU Lampung
                      </th>
                      <td className="px-4 py-3">PC</td>
                      <td className="px-4 py-3">Apple</td>
                      <td className="px-4 py-3">200</td>
                      <td className="px-4 py-3">$1499</td>
                      <td className="px-4 py-3 flex items-center justify-end">
                        <button
                          id="apple-imac-20-dropdown-button"
                          data-dropdown-toggle="apple-imac-20-dropdown"
                          className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                          type="button"
                        >
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                        <div
                          id="apple-imac-20-dropdown"
                          className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                        >
                          <ul
                            className="py-1 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="apple-imac-20-dropdown-button"
                          >
                            <li>
                              <a
                                href="#d"
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Show
                              </a>
                            </li>
                            <li>
                              <a
                                href="#d"
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Edit
                              </a>
                            </li>
                          </ul>
                          <div className="py-1">
                            <a
                              href="#d"
                              className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        LNG Carier
                      </th>
                      <td className="px-4 py-3">Phone</td>
                      <td className="px-4 py-3">Apple</td>
                      <td className="px-4 py-3">1237</td>
                      <td className="px-4 py-3">$999</td>
                      <td className="px-4 py-3 flex items-center justify-end">
                        <button
                          id="apple-iphone-14-dropdown-button"
                          data-dropdown-toggle="apple-iphone-14-dropdown"
                          className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                          type="button"
                        >
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                        <div
                          id="apple-iphone-14-dropdown"
                          className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                        >
                          <ul
                            className="py-1 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="apple-iphone-14-dropdown-button"
                          >
                            <li>
                              <a
                                href="#w"
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Show
                              </a>
                            </li>
                            <li>
                              <a
                                href="#w"
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Edit
                              </a>
                            </li>
                          </ul>
                          <div className="py-1">
                            <a
                              href="#w"
                              className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <nav
                className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                aria-label="Table navigation"
              >
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  Showing
                  <span className="font-semibold text-gray-900 dark:text-white">
                    1-10
                  </span>
                  of
                  <span className="font-semibold text-gray-900 dark:text-white">
                    1000
                  </span>
                </span>
                <ul className="inline-flex items-stretch -space-x-px">
                  <li>
                    <a
                      href="#d"
                      className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#d"
                      className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      1
                    </a>
                  </li>
                  <li>
                    <a
                      href="#d"
                      className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      2
                    </a>
                  </li>
                  <li>
                    <a
                      href="#d"
                      aria-current="page"
                      className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    >
                      3
                    </a>
                  </li>
                  <li>
                    <a
                      href="#d"
                      className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      ...
                    </a>
                  </li>
                  <li>
                    <a
                      href="#d"
                      className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      100
                    </a>
                  </li>
                  <li>
                    <a
                      href="#d"
                      className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>
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
