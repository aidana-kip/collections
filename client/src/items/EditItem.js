import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Header.js";

const EditItem = () => {
  const { state } = useLocation();
  const [item, setItem] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();
  let language = localStorage.getItem("language");

  const getItem = () => {
    axios
      .get("http://aidana-final-project-test.eba-npwyzs2b.us-east-1.elasticbeanstalk.com/items/" + state.itemId)
      .then((res) => {
        setItem(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getItem();
  }, []);

  const onSaveClicked = (event) => {
    event.preventDefault();

    if (item.name === "") {
      if (language === "ENG") {
        setErrorMessage("Name cannot be blank");
        return;
      } else {
        setErrorMessage("Имя не должно быть пустым");
        return;
      }
    }

    if (language === "ENG") {
      if (window.confirm("Do you really want to update item?")) {
        axios
          .put("http://aidana-final-project-test.eba-npwyzs2b.us-east-1.elasticbeanstalk.com/items/" + state.itemId, item, {
            headers: {
              "access-token": localStorage.getItem("access-token"),
            },
          })
          .then((res) => {
            res.data.items = item.items;
            setItem(res.data);
          })
          .catch((err) => {});
      }
      navigate("/my-items");
    } else {
      if (window.confirm("Вы действительно хотите обновить элемент?")) {
        axios
          .put("http://aidana-final-project-test.eba-npwyzs2b.us-east-1.elasticbeanstalk.com/items/" + state.itemId, item, {
            headers: {
              "access-token": localStorage.getItem("access-token"),
            },
          })
          .then((res) => {
            res.data.items = item.items;
            setItem(res.data);
          })
          .catch((err) => {});
      }
      navigate("/my-items");
    }
  };

  const onNameChanged = (e) => {
    setItem((prevState) => ({
      ...prevState,
      name: e.target.value,
    }));
  };
  const onTagChanged = (e) => {
    setItem((prevState) => ({
      ...prevState,
      tag: e.target.value,
    }));
  };

  const onDeleteComment = (comment) => {
    if (language === "ENG") {
      if (window.confirm("Do you really want to delete comment?")) {
        axios
          .delete("http://aidana-final-project-test.eba-npwyzs2b.us-east-1.elasticbeanstalk.com/comments/" + comment.id, {
            headers: {
              "access-token": localStorage.getItem("access-token"),
            },
          })
          .then((res) => {
            if (res.status === 204) {
              getItem();
            }
          })
          .catch((err) => {
            setErrorMessage(err.response.data);
          });
      }
    } else {
      if (window.confirm("Вы действительно хотите удалить комментарий?")) {
        axios
          .delete("http://aidana-final-project-test.eba-npwyzs2b.us-east-1.elasticbeanstalk.com/comments/" + comment.id, {
            headers: {
              "access-token": localStorage.getItem("access-token"),
            },
          })
          .then((res) => {
            if (res.status === 204) {
              getItem();
            }
          })
          .catch((err) => {
            setErrorMessage(err.response.data);
          });
      }
    }
  };

  return (
    <div>
      {language === "ENG" ? (
        <div className="container">
          <Header />
          <div className="edit_form_box">
            {" "}
            <h1 className="edit_form_header">Edit Item Form</h1>
            {errorMessage ? (
              <p style={{ color: "red" }}>{errorMessage}</p>
            ) : null}
            <form className="edit_form">
              <label>Name: </label>
              <input value={item && item.name} onChange={onNameChanged} />
              <br></br>
              <label>Tag: </label>
              <input value={item && item.tag} onChange={onTagChanged} />
              <br></br>
              <button type="submit" onClick={onSaveClicked}>
                Save
              </button>
            </form>
          </div>
          <div className="table">
            {" "}
            {item && item.comments?.length ? (
              <table id="collections">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Comment</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {item.comments.map((comment) => {
                    return (
                      <tr key={comment.id}>
                        <td>{comment.id}</td>
                        <td>{comment.comment}</td>
                        <td>{comment.created_at}</td>
                        <td>
                          <button
                            className="btn"
                            onClick={() => {
                              onDeleteComment(comment);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              "No comments to display"
            )}
          </div>
        </div>
      ) : (
        <div className="container">
          <Header />
          <div className="edit_form_box">
            {" "}
            <h1 className="edit_form_header">Отредактировать элемент</h1>
            {errorMessage ? (
              <p style={{ color: "red" }}>{errorMessage}</p>
            ) : null}
            <form className="edit_form">
              <label>Имя: </label>
              <input value={item && item.name} onChange={onNameChanged} />
              <br></br>
              <label>Тэг: </label>
              <input value={item && item.tag} onChange={onTagChanged} />
              <br></br>
              <button type="submit" onClick={onSaveClicked}>
                Сохранить
              </button>
            </form>
          </div>
          <div className="table">
            {" "}
            {item && item.comments?.length ? (
              <table id="collections">
                <thead>
                  <tr>
                    <th>Имя</th>
                    <th>Комментарий</th>
                    <th>Создано</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {item.comments.map((comment) => {
                    return (
                      <tr key={comment.id}>
                        <td>{comment.id}</td>
                        <td>{comment.comment}</td>
                        <td>{comment.created_at}</td>
                        <td>
                          <button
                            className="btn"
                            onClick={() => {
                              onDeleteComment(comment);
                            }}
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              "Комментариев пока нет"
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditItem;
