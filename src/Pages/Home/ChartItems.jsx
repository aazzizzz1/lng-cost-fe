import React from "react";
import Chart from "react-apexcharts";

const series = [40, 54, 56, 27];
const options = {
  colors: ["#1C64F2", "#16BDCA", "#9061F9"],
  chart: {
    height: 420,
    width: "100%",
    type: "pie",
  },
  stroke: {
    colors: ["white"],
    lineCap: "",
  },
  plotOptions: {
    pie: {
      labels: {
        show: true,
      },
      size: "100%",
      dataLabels: {
        offset: -25,
      },
    },
  },
  labels: ["Material", "Pekerjaan", "Jasa", "Operasi"],
  dataLabels: {
    enabled: true,
    style: {
      fontFamily: "Inter, sans-serif",
    },
  },
  legend: {
    position: "bottom",
    fontFamily: "Inter, sans-serif",
  },
  yaxis: {
    labels: {
      formatter: function (value) {
        return value + "%";
      },
    },
  },
  xaxis: {
    labels: {
      formatter: function (value) {
        return value + "%";
      },
    },
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
  },
};

const ChartItems = () => {
  return (
    <div className="max-w-xl w-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-6 md:p-4">
      <div className="flex justify-between items-start w-full">
        <div className="flex-col items-center">
          <div className="flex items-center mb-1">
            <h5 className="text-base font-bold leading-none text-gray-900 dark:text-white me-1">
              Harga Satuan LNG
            </h5>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center text-gray-500 w-8 h-8 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm"
        >
          <svg
            className="w-3.5 h-3.5 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 3"
          >
            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
          </svg>
          <span className="sr-only">Open dropdown</span>
        </button>
      </div>
      <div className="py-8 flex justify-center" id="pie-chart">
        <Chart
          options={options}
          series={series}
          type="pie"
          className="w-72 lg:w-96 sm:w-64 "
        />
      </div>
      <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
        <div className="flex justify-between items-center pt-2">
          <button
            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
            type="button"
          >
            Last 7 days
            <svg
              className="w-2.5 m-2.5 ms-1.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          <a
            href="#a"
            className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-1"
          >
            Analisa biaya
            <svg
              className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m1 9 4-4-4-4"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ChartItems;
