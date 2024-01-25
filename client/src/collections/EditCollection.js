import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Header.js";

const EditCollection = () => {
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

  const onSaveClicked = (event) => {
    event.preventDefault();

    if (collection.name === "") {
      if (language === "ENG") {
        setErrorMessage("Name cannot be blank");
        return;
      } else {
        setErrorMessage("Имя не должно быть пустым");
        return;
      }
    }

    if (collection.topic === "") {
      if (language === "ENG") {
        setErrorMessage("Topic cannot be blank");
        return;
      } else {
        setErrorMessage("Тема не должна быть пустой");
        return;
      }
    }
    if (language === "ENG") {
      if (window.confirm("Do you really want to update collection?")) {
        axios
          .put(
            "http://aidana-final-project-test.eba-npwyzs2b.us-east-1.elasticbeanstalk.com/collections/" + state.collectionId,
            collection,
            {
              headers: {
                "access-token": localStorage.getItem("access-token"),
              },
            }
          )
          .then((res) => {
            res.data.items = collection.items;
            setCollection(res.data);
          })
          .catch((err) => {});
      }
      navigate("/my-collections");
    } else {
      if (window.confirm("Вы действительно хотите обновить коллекцию?")) {
        axios
          .put(
            "http://aidana-final-project-test.eba-npwyzs2b.us-east-1.elasticbeanstalk.com/collections/" + state.collectionId,
            collection,
            {
              headers: {
                "access-token": localStorage.getItem("access-token"),
              },
            }
          )
          .then((res) => {
            res.data.items = collection.items;
            setCollection(res.data);
          })
          .catch((err) => {});
      }
      navigate("/my-collections");
    }
  };

  const onNameChanged = (e) => {
    setCollection((prevState) => ({
      ...prevState,
      name: e.target.value,
    }));
  };
  const onDescriptionChanged = (e) => {
    setCollection((prevState) => ({
      ...prevState,
      description: e.target.value,
    }));
  };
  const onTopicChanged = (e) => {
    setCollection((prevState) => ({
      ...prevState,
      topic: e.target.value,
    }));
  };

  const onEditItem = (item) => {
    navigate("/edit-item", { state: { itemId: item.id } });
  };

  const onDeleteItem = (item) => {
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
  };

  return (
    <div>
      {language === "ENG" ? (
        <div className="container">
          <Header />{" "}
          <div className="edit_form_box">
            <h1 className="edit_form_header">Edit Collection Form</h1>
            {errorMessage ? (
              <p style={{ color: "red" }}>{errorMessage}</p>
            ) : null}
            <form className="edit_form">
              <label>Name: </label>
              <input
                value={collection && collection.name}
                onChange={onNameChanged}
              />
              <br></br>
              <label>Description: </label>
              <input
                value={collection && collection.description}
                onChange={onDescriptionChanged}
              />
              <br></br>
              <label>Topic: </label>
              <input
                value={collection && collection.topic}
                onChange={onTopicChanged}
              />
              <br></br>
              <button type="submit" className="btn" onClick={onSaveClicked}>
                Save
              </button>
            </form>
          </div>
          <button
            className="addBtn"
            onClick={() =>
              navigate("/new-item", { state: { collectionId: collection.id } })
            }
          >
            Add New Item
          </button>
          <div className="table">
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
                              onEditItem(item);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn"
                            onClick={() => {
                              onDeleteItem(item);
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
              "No items to display"
            )}
          </div>
        </div>
      ) : (
        <div className="container">
          <Header />{" "}
          <div className="edit_form_box">
            <h1 className="edit_form_header">Отредактировать коллекцию</h1>
            {errorMessage ? (
              <p style={{ color: "red" }}>{errorMessage}</p>
            ) : null}
            <form className="edit_form">
              <label>Имя: </label>
              <input
                value={collection && collection.name}
                onChange={onNameChanged}
              />
              <br></br>
              <label>Описание: </label>
              <input
                value={collection && collection.description}
                onChange={onDescriptionChanged}
              />
              <br></br>
              <label>Тема: </label>
              <input
                value={collection && collection.topic}
                onChange={onTopicChanged}
              />
              <br></br>
              <button type="submit" className="btn" onClick={onSaveClicked}>
                Сохранить
              </button>
            </form>
          </div>
          <button
            className="addBtn"
            onClick={() =>
              navigate("/new-item", { state: { collectionId: collection.id } })
            }
          >
            Добавить новый элемент
          </button>
          <div className="table">
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
                              onEditItem(item);
                            }}
                          >
                            Изменить
                          </button>
                          <button
                            className="btn"
                            onClick={() => {
                              onDeleteItem(item);
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
              "Элементов пока нет"
            )}
          </div>{" "}
        </div>
      )}
    </div>
  );
};

export default EditCollection;
