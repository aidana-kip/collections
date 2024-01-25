import { useRef, useState } from "react";
import axios from "axios";
import Header from "../Header";
import { useNavigate } from "react-router-dom";

const NewCollection = () => {
  let baseURL = "http://aidana-final-project-test.eba-npwyzs2b.us-east-1.elasticbeanstalk.com/collections";
  const navigate = useNavigate();
  const nameRef = useRef();
  const descriptionRef = useRef();
  const topicRef = useRef();
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
    if (topicRef.current.value === "") {
      if (language === "ENG") {
        setErrorMessage("Topic cannot be blank");
        return;
      } else {
        setErrorMessage("Тема не должна быть пустой");
        return;
      }
    }

    axios
      .post(
        baseURL,
        {
          name: nameRef.current.value,
          description: descriptionRef.current.value,
          topic: topicRef.current.value,
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
            if (window.confirm("Collection successfully created.")) {
              navigate("/my-collections");
            }
          } else {
            if (window.confirm("Коллекция успешно создана")) {
              navigate("/my-collections");
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
            {errorMessage ? (
              <p style={{ color: "red" }}>{errorMessage}</p>
            ) : null}
            <h1 className="edit_form_header">New Collection Form</h1>
            <form className="edit_form">
              <label>Name: </label>
              <input ref={nameRef} />
              <br></br>
              <label>Description: </label>
              <input ref={descriptionRef} />
              <br></br>
              <label>Topic: </label>
              <input ref={topicRef} />
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
            {errorMessage ? (
              <p style={{ color: "red" }}>{errorMessage}</p>
            ) : null}
            <h1 className="edit_form_header">Добавить новую коллекцию</h1>
            <form className="edit_form">
              <label>Имя: </label>
              <input ref={nameRef} />
              <br></br>
              <label>Описание: </label>
              <input ref={descriptionRef} />
              <br></br>
              <label>Тема: </label>
              <input ref={topicRef} />
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

export default NewCollection;
