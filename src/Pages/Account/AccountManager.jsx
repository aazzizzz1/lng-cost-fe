import { Button } from 'flowbite-react';
import React from 'react'
import PencilIcon from '../../Assets/Svg/Account/PencilIcon';

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
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
  )
}

export default AccountManager