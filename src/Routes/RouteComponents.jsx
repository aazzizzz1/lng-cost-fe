import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { GlobalProvider } from '../Provider/GlobalContext'
import ErrorPage from '../Pages/Error/ErrorPage'
import SignIn from '../Pages/Auth/SignIn'
import SignUp from '../Pages/Auth/SignUp'
import Dashboard from '../Pages/Home/Dashboard'
import HomeLayout from '../Layout/HomeLayout'
import Simulator from '../Pages/Simulator/Simulator'
import SensorPages from '../Pages/Sensor/SensorPages'
import AccountSetting from '../Pages/Account/AccountSetting'

const RouteComponents = () => {
  return (
    <BrowserRouter>
      <GlobalProvider>
                    <Routes>
                    <Route
                        path="/dashboard"
                        element={
                          <HomeLayout>
                            <Dashboard />
                          </HomeLayout>
                        }
                      />
                      <Route
                        path="/simulator"
                        element={
                          <HomeLayout>
                            <Simulator/>
                          </HomeLayout>
                        }
                      />
                      <Route
                        path="/sensor"
                        element={
                          <HomeLayout>
                            <SensorPages/>
                          </HomeLayout>
                        }
                      />
                      <Route
                        path="/account"
                        element={
                          <HomeLayout>
                            <AccountSetting/>
                          </HomeLayout>
                        }
                      />
                    <Route
                        path="/"
                        element={
                              <SignIn />
                            // <Dashboard />
                        }
                      />
                    <Route
                        path="/signin"
                        element={
                            <SignIn/>
                        }
                      />
                      <Route
                        path="/signup"
                        element={
                            <SignUp/>
                        }
                      />
                      <Route path="/*" element={<ErrorPage />} />
                    </Routes>
      </GlobalProvider>
    </BrowserRouter>
  )
}

export default RouteComponents