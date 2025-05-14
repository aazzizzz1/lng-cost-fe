import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../Provider/GlobalContext";
import EyeClosedIcon from "../../Assets/Svg/Auth/EyeClosedIcon";
import EyeOpenIcon from "../../Assets/Svg/Auth/EyeOpenIcon";
import ErrorButton from "../../Components/Button/ErrorButton";
import SuccessToastAuth from "../../Components/Toast/SucessToastAuth";
import ErrorToastAuth from "../../Components/Toast/ErrorToastAuth";
import TooltipAuth from "../../Components/Tooltip/TooltipAuth";
// import LogoLen from "../../Assets/Images/logonddu.svg";
import LogoLng from "../../Assets/Images/Logolng.png";
import BackgroundLNG from "../../Assets/Images/PLI.jpeg";
// import BackGround from "../../Assets/Svg/Auth/BackgorundAuth.png";

const SignIn = () => {
  //Memanggil state dari GlobalContext dan dari destructuring dibawah ini
  const { state, handleFunction } = useContext(GlobalContext);
  //Membuat destructuring dari Global Context
  const {
    inputLogin,
    successMessage,
    errorMessage,
    formSubmitted,
    passwordVisible,
    validation,
    validationPass,
    showToast,
  } = state;

  const { handleInputLogin, handleLogin, handleTogglePasswordVisibility } =
    handleFunction;

  return (
    <>
    <div className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${BackgroundLNG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      >
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
          <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img
              className="w-40 h-30"
              src={LogoLng}
              alt="Logo-Len"
              border="0"
            />
          </div>
          {successMessage && <SuccessToastAuth message={successMessage} />}
          {errorMessage && (
            <ErrorToastAuth showToast={showToast} message={errorMessage} />
          )}
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form
                onSubmit={handleLogin}
                className="space-y-4 md:space-y-6"
                action="#"
              >
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    value={inputLogin.username}
                    onChange={handleInputLogin}
                    type="text"
                    name="username"
                    id="username"
                    className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                      validation === false || validationPass === false
                        ? "border-red-600"
                        : ""
                    }`}
                    placeholder="PGN LNG Indonesia"
                    required
                  />
                  {validation === false ? (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-500">
                      <span>
                        <ErrorButton />
                      </span>{" "}
                      <span className="ml-2">
                        User not registered, create an account first!
                      </span>
                    </div>
                  ) : null}
                  {validationPass === false ? (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-500">
                      <span>
                        <ErrorButton />
                      </span>{" "}
                      <span className="ml-2">
                        Invalid username or password!
                      </span>
                    </div>
                  ) : null}
                  {formSubmitted && !inputLogin.username && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      <span className="font-medium">Oh, snapp!</span> Images is
                      Required
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <TooltipAuth
                    content={
                      <div className="flex items-center justify-between relative w-80 md:w-96">
                        <input
                          className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                            validationPass === false ? "border-red-600" : ""
                          }`}
                          value={inputLogin.password}
                          onChange={handleInputLogin}
                          type={passwordVisible ? "text" : "password"}
                          name="password"
                          id="password"
                          placeholder="••••••••"
                          required
                        />
                        <span
                          className="absolute inset-y-0 flex items-center right-2 "
                          onClick={handleTogglePasswordVisibility}
                        >
                          {passwordVisible ? (
                            <EyeClosedIcon />
                          ) : (
                            <EyeOpenIcon />
                          )}
                        </span>
                      </div>
                    }
                  />
                  {formSubmitted && !inputLogin.password && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      <span className="font-medium">Oh, snapp!</span> Password
                      is Required
                    </p>
                  )}
                  {validationPass === false ? (
                    <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-500">
                      <span>
                        <ErrorButton />
                      </span>{" "}
                      <span className="ml-2">
                        Invalid username or password!
                      </span>
                    </div>
                  ) : null}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  {/* <a
                    href="a"
                    className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Forgot password?
                  </a> */}
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-secondcolor hover:bg-maincolor focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Sign in
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
    </div>
      {/* Popover */}
    </>
  );
};

export default SignIn;
