import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Header.js";

const ViewItem = () => {
  const { state } = useLocation();
  const [item, setItem] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const commentRef = useRef();
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

  const onCommentSave = (event) => {
    event.preventDefault();
    if (commentRef.current.value === "") {
      if (language === "ENG") {
        setErrorMessage("Comment cannot be blank");
        return;
      } else {
        setErrorMessage("Комментарий не должен быть пустым");
        return;
      }
    }
    axios
      .post(
        "http://aidana-final-project-test.eba-npwyzs2b.us-east-1.elasticbeanstalk.com/comments",
        {
          comment: commentRef.current.value,
          itemId: state.itemId,
        },
        {
          headers: {
            "access-token": localStorage.getItem("access-token"),
          },
        }
      )
      .then((res) => {
        if (res.status === 201) {
          getItem();
        }
      })
      .catch((err) => {});
  };

  return (
    <div>
      {language === "ENG" ? (
        <div className="container">
          <Header />
          <div className="edit_form_box">
            <h1 className="edit_form_header">Item View</h1>
            {errorMessage ? (
              <p style={{ color: "red" }}>{errorMessage}</p>
            ) : null}
            <form className="edit_form">
              <label for="nameLabel">Name: </label>
              <input disabled value={item && item.name} />
              <br></br>
              <label for="tagLabel">Tag: </label>
              <input disabled value={item && item.tag} />
            </form>
          </div>
          <div className="editComment">
            <form className="editCommentForm">
              <label>Comment: </label>
              <input className="comment" ref={commentRef} />
              <br></br>
              <button className="commentBtn" onClick={onCommentSave}>
                Save Comment
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
                    <th>User ID</th>
                    {localStorage.getItem("userRole-from-token") ===
                      "admin" && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {item.comments.map((comment) => {
                    return (
                      <tr key={comment.id}>
                        <td>{comment.id}</td>
                        <td>{comment.comment}</td>
                        <td>{comment.created_at}</td>
                        <td>{comment.user_id}</td>
                        {localStorage.getItem("userRole-from-token") ===
                          "admin" && (
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
                        )}
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
            <h1 className="edit_form_header">Посмотреть элемент</h1>
            {errorMessage ? (
              <p style={{ color: "red" }}>{errorMessage}</p>
            ) : null}
            <form className="edit_form">
              <label>Имя: </label>
              <input disabled value={item && item.name} />
              <br></br>
              <label>Тэг: </label>
              <input disabled value={item && item.tag} />
            </form>
          </div>
          <div className="editComment">
            <form className="editCommentForm">
              <label>Комментарий: </label>
              <input className="comment" ref={commentRef} />
              <br></br>
              <button className="btn" onClick={onCommentSave}>
                Сохранить комментарий
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
                    <th>Идентиф. пользователя</th>
                    {localStorage.getItem("userRole-from-token") ===
                      "admin" && <th>Действия</th>}
                  </tr>
                </thead>
                <tbody>
                  {item.comments.map((comment) => {
                    return (
                      <tr key={comment.id}>
                        <td>{comment.id}</td>
                        <td>{comment.comment}</td>
                        <td>{comment.created_at}</td>
                        <td>{comment.user_id}</td>
                        {localStorage.getItem("userRole-from-token") ===
                          "admin" && (
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
                        )}
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

export default ViewItem;
