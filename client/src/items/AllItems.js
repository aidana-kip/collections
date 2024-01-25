import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Header";

const AllItems = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  let baseURL = "http://aidana-final-project-test.eba-npwyzs2b.us-east-1.elasticbeanstalk.com/items";
  let language = localStorage.getItem("language");
  const searchRef = useRef();
  const [searchText, setSearchText] = useState();

  useEffect(() => {
    axios
      .get(baseURL)
      .then((res) => {
        if (res.status === 200) {
          setItems(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onViewItem = (item) => {
    navigate("/view-item", { state: { itemId: item.id } });
  };

  const onDeleteItem = (item) => {
    const confirmMessage = language === "ENG" ? "Do you really want to delete item?" : "Вы действительно хотите удалить элемент?";


    if (window.confirm(confirmMessage)) {
      axios
        .delete(baseURL + "/" + item.id, {
          headers: {
            "access-token": localStorage.getItem("access-token"),
          },
        })
        .then((res) => {
          if (res.status === 204) {
            axios
              .get(baseURL)
              .then((res) => {
                if (res.status === 200) {
                  setItems([...res.data]);
                }
              })
              .catch((error) => {
                setError(error.response.data);
              });
          }
        })
        .catch((err) => {
          setError(err.response.data);
        });
    }
  };

  const onSearch = () => {
    axios
      .post(
        baseURL + "/search",
        {
          searchText: searchRef.current.value,
        },
        {
          headers: {
            "access-token": localStorage.getItem("access-token"),
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setItems(res.data);
        }
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  return (
    <div>
      {language === "ENG" ? (
        <div className="container">
          <div className="searchDiv">
            <form className="search_form">
              <input
                className="search_input"
                ref={searchRef}
                placeholder="Type to search"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </form>
            <button type="submit" className="search_btn" onClick={onSearch}>
              Search
            </button>
          </div>
          <Header />
          <div className="content">
            <div>
              {error ? <p style={{ color: "red" }}>{error}</p> : null}
              {items?.length ? (
                <table id="collections">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Name</th>
                      <th>Tag</th>
                      <th>Created At</th>
                      <th>UserId</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
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
        </div>
      ) : (
        <div className="container">
          <div className="searchDiv">
            <form className="search_form">
              <input
                className="search_input"
                ref={searchRef}
                placeholder="Type to search"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </form>
            <button type="submit" className="search_btn" onClick={onSearch}>
              Поиск
            </button>
          </div>
          <Header />
          <div className="content">
            <div>
              {error ? <p style={{ color: "red" }}>{error}</p> : null}
              {items?.length ? (
                <table id="collections">
                  <thead>
                    <tr>
                      <th>Идентификатор</th>
                      <th>Имя</th>
                      <th>Тэг</th>
                      <th>Создано</th>
                      <th>Идентиф.пользователя</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
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
        </div>
      )}
    </div>
  );
};

export default AllItems;
