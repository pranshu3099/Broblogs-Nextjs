import { Input, Button } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useRouter } from "next/router";
const Login = () => {
  let [data, setData] = React.useState({
    email: "",
    password: "",
  });
  let [requiredFields, setRequireFields] = React.useState({});
  let [error, setError] = React.useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  let changeIcon = (e, icon) => {
    if (icon === "/icons/eye.png") {
      e.target.attributes.src.textContent = "/icons/hidden.png";
    } else {
      e.target.attributes.src.textContent = "/icons/eye.png";
    }
  };

  const showPassword = (e) => {
    const password = document.getElementById("password");
    const icon = e.target.attributes.src.textContent;
    if (e.target.id === "password-icon") {
      changeIcon(e, icon);
      const type =
        password.getAttribute("type") === "Password" ? "text" : "Password";
      password.setAttribute("type", type);
    }
  };

  function checkRequiredfields() {
    const res = {};
    Object.keys(data).forEach((key) => {
      if (data[key] === "") {
        res[key] = true;
      }
    });
    if (Object.keys(res).length) {
      setRequireFields(res);
      return false;
    } else {
      setRequireFields({});
      return true;
    }
  }

  function fetchdata() {
    axios
      .post("http://localhost:3000/login", data)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("Bearer", response?.data?.Authorization);
          localStorage.setItem("admin", JSON.stringify(response?.data?.user));
          router.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
        // setError(q?.data?.message);
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkRequiredfields()) {
      fetchdata();
    }
  };

  return (
    <>
      <div>
        <div className="login">
          <h1 className="login-h1">
            Welcome!! Start Writing Your Tech Blog Today
          </h1>
        </div>
        <form action="">
          <div className="login-container">
            <div>
              <Input
                type="email"
                placeholder="email"
                width={"500px"}
                margin={5}
                variant="flushed"
                value={data.email}
                onChange={(e) => {
                  setData({
                    ...data,
                    email: e.target.value,
                  });
                }}
              />
              <img src="/icons/email.png" alt="" className="login-icons" />
              {requiredFields?.email && <div>The email field is required</div>}
              {error?.email && <div>{error?.email}</div>}
              <Input
                type="Password"
                id="password"
                placeholder="password"
                width={"500px"}
                margin={5}
                variant="flushed"
                onChange={(e) => {
                  setData({
                    ...data,
                    password: e.target.value,
                  });
                }}
              />{" "}
              <img
                src="/icons/eye.png"
                id="password-icon"
                alt=""
                className="login-icons"
                onClick={showPassword}
              />
              {requiredFields.password && (
                <div>The passsword field is required</div>
              )}
              {error.password && <div>{error.password}</div>}
              <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                Login
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default Login;
