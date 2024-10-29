import React from 'react'
import AccountManager from './AccountManager'

const AccountSetting = () => {
  return (
    <div className="p-4">
      <p className="text-2xl font-bold text-gray-900 dark:text-white">Management and Configuration Account</p>
      <p className="text-lg text-gray-600 dark:text-white mb-2">
      Management and Configuration Account Detail
      </p>
      {/* Home Manager */}
      <AccountManager/>
    </div>
  )
}

export default AccountSetting