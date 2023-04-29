import { useState, useEffect } from "react";
import axios from "axios";
import { login } from "./api/workersapi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const jwtCookie = document.cookie
      .split(";")
      .find((cookie) => cookie.startsWith("jwt="));
    if (jwtCookie) {
      const token = jwtCookie.split("=")[1];
      window.location.href = "/shorten";
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await login({ username, password });
      const { token, exp } = response;
      // Convert exp (in seconds) to a date object
      const expirationDate = new Date(exp * 1000);
      // Add exp as expiration time to the cookie
      document.cookie = `jwt=${token}; path=/; expires=${expirationDate.toUTCString()}`;
      window.location.href = "/shorten";
    } catch (error) {
      alert(`Invalid credentials:${error.response}`); // error message is in response.data
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <h1 className="text-3xl font-bold mb-8" style={{ color: "black" }}>
        EastLake Short Url System Login
      </h1>
      <form
        className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 font-bold mb-2"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-0 mr-2"
              onClick={toggleShowPassword}
            >
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="text-gray-500"
              />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded focus:outline-none focus:shadow-outline mx-auto"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
