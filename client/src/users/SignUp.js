import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
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

  const onFormSubmit = () => {
    axios
      .post("http://aidana-final-project-test.eba-npwyzs2b.us-east-1.elasticbeanstalk.com/users/sign-up", {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
      })
      .then((res) => {
        if (res.status === 201) {
          navigate("/sign-in");
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
            <h2>Sign-up</h2>
            {error !== "" ? <p style={{ color: "red" }}>{error}</p> : null}
            <form action="" onSubmit={handleSubmit} className="form">
              <label for="firstName">
                <strong>First Name </strong>
              </label>
              <input
                type="text"
                value={firstName}
                placeholder="Enter First Name"
                name="firstName"
                onChange={(e) => setFirstName(e.target.value)}
              />
              <label for="lastName">
                <strong>Last Name </strong>
              </label>
              <input
                type="text"
                value={lastName}
                placeholder="Enter Last Name"
                name="lastName"
                onChange={(e) => setLastName(e.target.value)}
              />
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
            <button type="submit" className="auth_btn" onClick={onFormSubmit}>
              Sign-up
            </button>
            <Link to="/sign-in" className="btn__link">
              Login
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
            <h2>Регистрация</h2>
            {error !== "" ? <p style={{ color: "red" }}>{error}</p> : null}
            <form action="" onSubmit={handleSubmit} className="form">
              <label for="firstName">
                <strong>Имя </strong>
              </label>
              <input
                type="text"
                value={firstName}
                placeholder="Введите имя"
                name="firstName"
                onChange={(e) => setFirstName(e.target.value)}
              />
              <label for="lastName">
                <strong>Фамилия </strong>
              </label>
              <input
                type="text"
                value={lastName}
                placeholder="Введите фамилию"
                name="lastName"
                onChange={(e) => setLastName(e.target.value)}
              />
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
            <button type="submit" className="auth_btn" onClick={onFormSubmit}>
              Регистрация
            </button>
            <Link to="/sign-in" className="btn__link">
              Войти
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;
