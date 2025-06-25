import React, { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleNotificationDropdown } from '../Provider/layoutSlice'

const NotificationNavbar = ({ notificationRef: propNotificationRef }) => {
  const dispatch = useDispatch()
  const isNotificationOpen = useSelector(state => state.layout.isNotificationOpen)
  const internalRef = useRef(null)
  const ref = propNotificationRef || internalRef

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (isNotificationOpen && ref.current && !ref.current.contains(event.target)) {
        dispatch(toggleNotificationDropdown())
      }
    }
    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isNotificationOpen, ref, dispatch])

  return (
    <>
      <button
        type="button"
        onClick={() => dispatch(toggleNotificationDropdown())}
        className="p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
      >
        <span className="sr-only">View notifications</span>
        {/* Bell icon */}
        <svg
          className="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.193-.538 1.193H5.538c-.538 0-.538-.6-.538-1.193 0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365Zm-8.134 5.368a8.458 8.458 0 0 1 2.252-5.714m14.016 5.714a8.458 8.458 0 0 0-2.252-5.714M8.54 17.901a3.48 3.48 0 0 0 6.92 0H8.54Z"
          />
        </svg>
      </button>
      {/* Dropdown menu */}
      <div
        ref={ref}
        className={`
          absolute top-12 right-0 mt-2 bg-white shadow-lg rounded-lg p-4 divide-y divide-gray-100 dark:divide-gray-600 dark:bg-gray-700
          transition-all duration-200 ease-in-out z-50
          ${isNotificationOpen ? 'opacity-100 scale-100 pointer-events-auto visible' : 'opacity-0 scale-95 pointer-events-none invisible'}
        `}
        style={{ minWidth: 320 }}
      >
        {isNotificationOpen && (
          <>
            <div className="block py-2 px-4 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-600 dark:text-gray-300">
              Notifications
            </div>
            <div>
              <a
                href="mm"
                className="flex py-3 px-4 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
              >
                <div className="flex-shrink-0">
                  <img
                    className="w-11 h-11 rounded-full"
                    src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
                    alt="Bonnie Green avatar"
                  />
                  <div className="flex absolute justify-center items-center ml-6 -mt-5 w-5 h-5 rounded-full border border-white bg-primary-700 dark:border-gray-700">
                    <svg
                      aria-hidden="true"
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z" />
                      <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                    </svg>
                  </div>
                </div>
                <div className="pl-3 w-full">
                  <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                    New message from
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Bonnie Green
                    </span>
                    : "Hey, what's up? All set for the presentation?"
                  </div>
                  <div className="text-xs font-medium text-primary-600 dark:text-primary-500">
                    a few moments ago
                  </div>
                </div>
              </a>
              <a
                href="mm"
                className="flex py-3 px-4 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
              >
                <div className="flex-shrink-0">
                  <img
                    className="w-11 h-11 rounded-full"
                    src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png"
                    alt="Jese Leos avatar"
                  />
                  <div className="flex absolute justify-center items-center ml-6 -mt-5 w-5 h-5 bg-gray-900 rounded-full border border-white dark:border-gray-700">
                    <svg
                      aria-hidden="true"
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                  </div>
                </div>
                <div className="pl-3 w-full">
                  <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Jese leos
                    </span>
                    and
                    <span className="font-medium text-gray-900 dark:text-white">
                      5 others
                    </span>
                    started following you.
                  </div>
                  <div className="text-xs font-medium text-primary-600 dark:text-primary-500">
                    10 minutes ago
                  </div>
                </div>
              </a>
              <a
                href="a"
                className="flex py-3 px-4 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
              >
                <div className="flex-shrink-0">
                  <img
                    className="w-11 h-11 rounded-full"
                    src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png"
                    alt="Joseph McFall avatar"
                  />
                  <div className="flex absolute justify-center items-center ml-6 -mt-5 w-5 h-5 bg-red-600 rounded-full border border-white dark:border-gray-700">
                    <svg
                      aria-hidden="true"
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="pl-3 w-full">
                  <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Joseph Mcfall
                    </span>
                    and
                    <span className="font-medium text-gray-900 dark:text-white">
                      141 others
                    </span>
                    love your story. See it and view more stories.
                  </div>
                  <div className="text-xs font-medium text-primary-600 dark:text-primary-500">
                    44 minutes ago
                  </div>
                </div>
              </a>
            </div>
            <a
              href="h"
              className="block py-2 text-md font-medium text-center text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-600 dark:text-white dark:hover:underline"
            >
              <div className="inline-flex items-center">
                <svg
                  aria-hidden="true"
                  className="mr-2 w-4 h-4 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 0 1 8 0z"
                    clipRule="evenodd"
                  />
                </svg>
                View all
              </div>
            </a>
          </>
        )}
      </div>
    </>
  )
}

export default NotificationNavbar