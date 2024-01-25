import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Header.js";

const ViewCollection = () => {
  const { state } = useLocation();
  const [collection, setCollection] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();
  let language = localStorage.getItem("language");

  const getCollection = () => {
    axios
      .get("http://aidana-final-project-test.eba-npwyzs2b.us-east-1.elasticbeanstalk.com/collections/" + state.collectionId)
      .then((res) => {
        setCollection(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCollection();
  }, []);

  const onDeleteItem = (item) => {
    if (language === "ENG") {
      if (window.confirm("Do you really want to delete item?")) {
        axios
          .delete("http://aidana-final-project-test.eba-npwyzs2b.us-east-1.elasticbeanstalk.com/items/" + item.id, {
            headers: {
              "access-token": localStorage.getItem("access-token"),
            },
          })
          .then((res) => {
            if (res.status === 204) {
              getCollection();
            }
          })
          .catch((err) => {
            setErrorMessage(err.response.data);
          });
      }
    } else {
      if (window.confirm("Вы действительно хотите удалить элемент?")) {
        axios
          .delete("http://aidana-final-project-test.eba-npwyzs2b.us-east-1.elasticbeanstalk.com/items/" + item.id, {
            headers: {
              "access-token": localStorage.getItem("access-token"),
            },
          })
          .then((res) => {
            if (res.status === 204) {
              getCollection();
            }
          })
          .catch((err) => {
            setErrorMessage(err.response.data);
          });
      }
    }
  };

  const onViewItem = (item) => {
    navigate("/view-item", { state: { itemId: item.id } });
  };

  return (
    <div>
      {language === "ENG" ? (
        <div className="container">
          <Header />
          <div className="edit_form_box">
            {" "}
            <h1 className="edit_form_header">Collection View</h1>
            {errorMessage ? (
              <p style={{ color: "red" }}>{errorMessage}</p>
            ) : null}
            <form className="edit_form">
              <label>Name: </label>
              <input disabled value={collection && collection.name} />
              <br></br>
              <label>Description: </label>
              <input disabled value={collection && collection.description} />
              <br></br>
              <label>Topic: </label>
              <input disabled value={collection && collection.topic} />
            </form>
          </div>
          <div className="table">
            {" "}
            {collection && collection.items?.length ? (
              <table id="collections">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Tag</th>
                    <th>CreatedAt</th>
                    <th>UserId</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {collection.items.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.tag}</td>
                        <td>{item.created_at}</td>
                        <td>{item.user_id}</td>
                        <td>
                          <button
                            className="btn"
                            onClick={() => {
                              onViewItem(item);
                            }}
                          >
                            View
                          </button>
                          {localStorage.getItem("userRole-from-token") ===
                            "admin" && (
                            <button
                              className="btn"
                              onClick={() => {
                                onDeleteItem(item);
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              "No items to display"
            )}
          </div>
        </div>
      ) : (
        <div className="container">
          <Header />
          <div className="edit_form_box">
            {" "}
            <h1 className="edit_form_header">Посмотреть коллекцию</h1>
            {errorMessage ? (
              <p style={{ color: "red" }}>{errorMessage}</p>
            ) : null}
            <form className="edit_form">
              <label>Имя: </label>
              <input disabled value={collection && collection.name} />
              <br></br>
              <label>Описание: </label>
              <input disabled value={collection && collection.description} />
              <br></br>
              <label>Тема: </label>
              <input disabled value={collection && collection.topic} />
            </form>
          </div>
          <div className="table">
            {" "}
            {collection && collection.items?.length ? (
              <table id="collections">
                <thead>
                  <tr>
                    <th>Идентификатор</th>
                    <th>Имя</th>
                    <th>Тэг</th>
                    <th>Создано</th>
                    <th>Идентиф. пользователя</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {collection.items.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.tag}</td>
                        <td>{item.created_at}</td>
                        <td>{item.user_id}</td>
                        <td>
                          <button
                            className="btn"
                            onClick={() => {
                              onViewItem(item);
                            }}
                          >
                            Посмотреть
                          </button>
                          {localStorage.getItem("userRole-from-token") ===
                            "admin" && (
                            <button
                              className="btn"
                              onClick={() => {
                                onDeleteItem(item);
                              }}
                            >
                              Удалить
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              "Элементов пока нет"
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCollection;
