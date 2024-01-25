import { useRef, useState } from "react";
import axios from "axios";
import Header from "../Header";
import { useLocation, useNavigate } from "react-router-dom";

const NewItem = () => {
  let baseURL = "http://aidana-final-project-test.eba-npwyzs2b.us-east-1.elasticbeanstalk.com/items";
  const { state } = useLocation();
  const navigate = useNavigate();
  const nameRef = useRef();
  const tagRef = useRef();
  const [errorMessage, setErrorMessage] = useState("");
  let language = localStorage.getItem("language");

  const onSaveClicked = (event) => {
    event.preventDefault();

    if (nameRef.current.value === "") {
      if (language === "ENG") {
        setErrorMessage("Name cannot be blank");
        return;
      } else {
        setErrorMessage("Имя не должно быть пустым");
        return;
      }
    }

    axios
      .post(
        baseURL,
        {
          name: nameRef.current.value,
          tag: tagRef.current.value,
          collectionId: state.collectionId,
        },
        {
          headers: {
            "access-token": localStorage.getItem("access-token"),
          },
        }
      )
      .then((res) => {
        if (res.status === 201) {
          if (language === "ENG") {
            if (window.confirm("Item successfully created.")) {
              navigate("/my-items");
            }
          } else {
            if (window.confirm("Элемент успешно создан.")) {
              navigate("/my-items");
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {language === "ENG" ? (
        <div className="container">
          <Header />
          <div className="edit_form_box">
            <h1 className="edit_form_header">New Item Form</h1>
            {errorMessage ? (
              <p style={{ color: "red" }}>{errorMessage}</p>
            ) : null}
            <form className="edit_form">
              <label>Name: </label>
              <input ref={nameRef} />
              <br></br>
              <label>Tag: </label>
              <input ref={tagRef} />
              <br></br>
              <button type="submit" className="btn" onClick={onSaveClicked}>
                Save
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="container">
          <Header />
          <div className="edit_form_box">
            <h1 className="edit_form_header">Добавить новый элемент</h1>
            {errorMessage ? (
              <p style={{ color: "red" }}>{errorMessage}</p>
            ) : null}
            <form className="edit_form">
              <label>Имя: </label>
              <input ref={nameRef} />
              <br></br>
              <label>Тэг: </label>
              <input ref={tagRef} />
              <br></br>
              <button type="submit" className="btn" onClick={onSaveClicked}>
                Сохранить
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewItem;
