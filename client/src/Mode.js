import { useState, useEffect } from "react";
function getDefaultMode() {
  const savedMode = localStorage.getItem("mode");
  return savedMode ? savedMode : "light";
}

function Mode() {
  const [mode, setMode] = useState(getDefaultMode());
  let language = localStorage.getItem("language");

  useEffect(() => {
    if (mode === "dark") {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    }
    localStorage.setItem("mode", mode);
  }, [mode]);

  return (
    <div className="mode">
      {language === "ENG" ? (
        <button
          className="mode-switch"
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
        >
          {" "}
          {mode === "dark" ? "Light mode" : "Dark mode"}
        </button>
      ) : (
        <button
          className="mode-switch"
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
        >
          {" "}
          {mode === "dark" ? "Светлый режим" : "Тёмный режим"}
        </button>
      )}
    </div>
  );
}

export default Mode;
