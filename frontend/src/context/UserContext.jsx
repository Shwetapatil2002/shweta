import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const EmployeeContext = createContext();

const client = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export const EmployeeContextProvider = ({ children }) => {
  const [employeesData, setEmployeesData] = useState([]);
  const navigate = useNavigate();

  const getEmployees = async () => {
    try {
      const response = await client.get("/users");
      setEmployeesData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  getEmployees();
  const validateEmail = async (email) => {
    console.log("Inside Validate");
    const userExists = employeesData.find((user) => user.email === email);
    return userExists;
  };

  const Login = async (email, password) => {
    try {
      const request = await client.post("/login", {
        email,
        password,
      });

      if (request.status === 200) {
        localStorage.setItem("token", request.data.token);
        localStorage.setItem("user", { email });
        navigate("/test"); // Updated from router to navigate
      }
    } catch (e) {
      console.log(e);
      throw new Error("Login failed");
    }
  };

  const data = {
    employeesData,
    getEmployees,
    validateEmail,
    Login,
  };

  return (
    <EmployeeContext.Provider value={data}>{children}</EmployeeContext.Provider>
  );
};
