import { Button } from "flowbite-react";
import React from "react";
import PencilIcon from "../../Assets/Svg/Account/PencilIcon";

const AccountManager = () => {
  return (
    <div className="p-4">
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-1">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-2 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              {/* {successMessage && (
                  <SuccessToast
                    showToast={showToastUser}
                    setShowToast={setShowToastUser}
                    message={successMessage}
                  />
                )} */}
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Account Setting
              </h1>
              <div className="space-y-4 md:space-y-6">
                <form action="">
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Fullname
                    </label>
                    <ul className="my-4 space-y-3">
                      <Button
                        class="w-full text-sm font-medium text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                        // onClick={() => { setOpenModal(true); handleAnotherFunction(); }}
                        // onClick={() => {
                        //   setOpenModalEditAccount(true);
                        // }}
                      >
                        <span class="ml-3 justify-start">
                          {/* {inputChangeAccount.full_name} */}
                        </span>
                        <PencilIcon />
                      </Button>
                    </ul>
                  </div>
                  <div>
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Username
                    </label>
                    <ul className="my-4 space-y-3">
                      <li>
                        <Button
                          class="w-full text-sm font-medium text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                          // onClick={() => { setOpenModal(true); handleAnotherFunction(); }}
                          // onClick={() => {
                          //   setOpenModalEditAccount(true);
                          // }}
                        >
                          <span class="ml-3 justify-start">
                            {/* {inputChangeAccount.username} */}
                          </span>
                          <PencilIcon />
                        </Button>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <ul className="my-4 space-y-3">
                      <li>
                        <Button
                          class="w-full text-sm font-medium text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                          // onClick={() => { setOpenModal(true); handleAnotherFunction(); }}
                          // onClick={() => {
                          //   setOpenModalEditPassword(true);
                          // }}
                        >
                          <span class="ml-3 justify-start">••••••••</span>
                          <PencilIcon />
                        </Button>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <label
                      htmlFor="confirm_password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Confirm Password
                    </label>
                    <ul className="my-4 space-y-3">
                      <li>
                        <Button
                          class="w-full text-sm font-medium text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                          // onClick={() => { setOpenModal(true); handleAnotherFunction(); }}
                          // onClick={() => {
                          //   setOpenModalEditPassword(true);
                          // }}
                        >
                          <span class="ml-3 justify-start">••••••••</span>
                          <PencilIcon />
                        </Button>
                      </li>
                    </ul>
                  </div>
                  <div class="flex items-center space-x-4">
                    <button
                      type="submit"
                      class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      class="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    >
                      <svg
                        class="w-6 h-6"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccountManager;
