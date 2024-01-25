import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Mode from "./Mode";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let language = localStorage.getItem("language");

  if (!localStorage.getItem("mode")) {
    localStorage.setItem("mode", "light");
  }

  useEffect(() => {
    if (
      !localStorage.getItem("access-token") ||
      localStorage.getItem("access-token") === ""
    ) {
      localStorage.clear();
      navigate("/sign-in");
    }
  }, []);

  const onLogoutClick = () => {
    localStorage.clear();
    navigate("/sign-in");
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

  return (
    <div>
      {language === "ENG" ? (
        <div>
          <div className="user">
            <h3> Hello, {localStorage.getItem("userName-from-token")}! </h3>
            <Link to="/sign-in" className="logout_link" onClick={onLogoutClick}>
              Logout
            </Link>
          </div>
          <Mode />
          <div className="languages">
            <button className="eng" onClick={() => onLanguageChange("eng")}>
              ENG
            </button>
            <button className="rus" onClick={() => onLanguageChange("rus")}>
              RUS
            </button>
          </div>
          <span>
            {localStorage.getItem("userRole-from-token") === "admin" && (
              <Link to="/users" className="logout_link">
                Users
              </Link>
            )}
            {localStorage.getItem("userRole-from-token") === "user" && (
              <Link to="/my-collections" className="logout_link" onClick={() => {
                if (location.pathname === '/my-collections') {
                  window.location.reload(false);
                }
              }}>
                My Collections
              </Link>
            )}
            <Link to="/all-collections" className="logout_link" onClick={() => {
              if (location.pathname === '/all-collections') {
                window.location.reload(false);
              }
            }}>
              All Collections
            </Link>
            {localStorage.getItem("userRole-from-token") === "user" && (
              <Link to="/my-items" className="logout_link" onClick={() => {
                if (location.pathname === '/my-items') {
                  window.location.reload(false);
                }
              }}>
                {" "}
                My Items
              </Link>
            )}
            <Link to="/all-items" className="logout_link" onClick={() => {
              if (location.pathname === '/all-items') {
                window.location.reload(false);
              }
            }}>
              All Items
            </Link>
          </span>
        </div>
      ) : (
        <div>
          <div className="user">
            <h3> Привет, {localStorage.getItem("userName-from-token")}! </h3>
            <Link to="/sign-in" className="logout_link" onClick={onLogoutClick}>
              Выйти
            </Link>
          </div>
          <Mode />
          <div className="languages">
            <button className="eng" onClick={() => onLanguageChange("eng")}>
              АНГ
            </button>
            <button className="rus" onClick={() => onLanguageChange("rus")}>
              РУС
            </button>
          </div>
          <span>
            {localStorage.getItem("userRole-from-token") === "admin" && (
              <Link to="/users" className="logout_link">
                Пользователи
              </Link>
            )}
            {localStorage.getItem("userRole-from-token") === "user" && (
              <Link to="/my-collections" className="logout_link" onClick={() => {
                if (location.pathname === '/my-collections') {
                  window.location.reload(false);
                }
              }}>
                Мои коллекции
              </Link>
            )}
            <Link to="/all-collections" className="logout_link" onClick={() => {
              if (location.pathname === '/all-collections') {
                window.location.reload(false);
              }
            }}>
              Все коллекции
            </Link>
            {localStorage.getItem("userRole-from-token") === "user" && (
              <Link to="/my-items" className="logout_link" onClick={() => {
                if (location.pathname === '/my-items') {
                  window.location.reload(false);
                }
              }}>
                {" "}
                Мои элементы
              </Link>
            )}
            <Link to="/all-items" className="logout_link" onClick={() => {
              if (location.pathname === '/all-items') {
                window.location.reload(false);
              }
            }}>
              Все элементы
            </Link>
          </span>
        </div>
      )}
    </div>
  );
};

export default Header;
