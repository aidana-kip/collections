import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

function SignIn() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  let language = localStorage.getItem("language");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const onLanguageChange = (language) => {
    if (language === "rus") {
      localStorage.setItem("language", "RUS");
      window.location.reload();
    } else {
      localStorage.setItem("language", "ENG");
      window.location.reload();
    }
  };

  const onLogin = () => {
    axios
      .post("http://aidana-final-project-test.eba-npwyzs2b.us-east-1.elasticbeanstalk.com/users/sign-in", {
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("access-token", res.data.token);
          localStorage.setItem("userId-from-token", res.data.user.id);
          localStorage.setItem("userName-from-token", res.data.user.first_name);
          localStorage.setItem("userRole-from-token", res.data.user.role);

          if (res.data.user.role === "admin") {
            navigate("/users");
          } else {
            navigate("/my-collections");
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          if (err.response.data.error) {
            setError(err.response.data.error);
          } else {
            setError(localStorage.getItem('language') === 'ENG' ? err.response.data.errors[0].msg.en : err.response.data.errors[0].msg.ru);
          }
        } else if (err.status === 500) {
          setError(err.response.data.errors[0].msg || err.response.data.error);
        }
      });
  };

  return (
    <div>
      {language === "ENG" ? (
        <div className="auth_container">
          <div className="languages">
            <button className="eng" onClick={() => onLanguageChange("eng")}>
              ENG
            </button>
            <button className="rus" onClick={() => onLanguageChange("rus")}>
              РУС
            </button>
          </div>
          <div className="authorization__box">
            <h2>Sign-in</h2>
            {error !== "" ? <p style={{ color: "red" }}>{error}</p> : null}
            <form action="" onSubmit={handleSubmit} className="form">
              <label for="email">
                <strong>Email</strong>
              </label>
              <input
                type="text"
                value={email}
                placeholder="Enter Email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <label for="password">
                <strong>Password</strong>
              </label>
              <input
                type="password"
                value={password}
                placeholder="Enter Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </form>
            <button type="submit" className="auth_btn" onClick={onLogin}>
              Login
            </button>
            <Link to="/sign-up" className="btn__link">
              Create Account
            </Link>
          </div>
        </div>
      ) : (
        <div className="auth_container">
          <div className="languages">
            <button className="eng" onClick={() => onLanguageChange("eng")}>
              ENG
            </button>
            <button className="rus" onClick={() => onLanguageChange("rus")}>
              РУС
            </button>
          </div>
          <div className="authorization__box">
            <h2>Вход</h2>
            {error !== "" ? <p style={{ color: "red" }}>{error}</p> : null}
            <form action="" onSubmit={handleSubmit} className="form">
              <label for="email">
                <strong>Почта</strong>
              </label>
              <input
                type="text"
                value={email}
                placeholder="Введите почту"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <label for="password">
                <strong>Пароль</strong>
              </label>
              <input
                type="password"
                value={password}
                placeholder="Введите пароль"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </form>
            <button type="submit" className="auth_btn" onClick={onLogin}>
              Вход
            </button>
            <Link to="/sign-up" className="btn__link">
              Регистрация
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignIn;
