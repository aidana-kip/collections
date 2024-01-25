import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Header";

const AllCollections = () => {
  const [myCollections, setMyCollections] = useState([]);
  const [error, setError] = useState("");
  const searchRef = useRef();
  const navigate = useNavigate();
  let baseURL = "http://aidana-final-project-test.eba-npwyzs2b.us-east-1.elasticbeanstalk.com/collections";
  let userId = localStorage.getItem("userId-from-token");
  let language = localStorage.getItem("language");
  const [searchText, setSearchText] = useState();

  const getCollections = () => {
    axios
      .get(baseURL)
      .then((res) => {
        if (res.status === 200) {
          console.log('Samat', res.data);
          setMyCollections(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCollections();
  }, []);

  const onViewCollection = (collection) => {
    navigate("/view-collection", { state: { collectionId: collection.id } });
  };

  const onDeleteCollection = (collection) => {
    const confirmMessage = language === "ENG" ? "Do you really want to delete collection?" : "Вы действительно хотите удалить коллекцию?";

    if (window.confirm(confirmMessage)) {
      axios
        .delete(baseURL + "/" + collection.id, {
          headers: {
            "access-token": localStorage.getItem("access-token"),
          },
        })
        .then((res) => {
          if (res.status === 204) {
            getCollections();
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
          setMyCollections(res.data);
        }
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  return (
    <div className="container">
      {language === "ENG" ? (
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
      ) : (
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
      )}
      <Header />
      <div className="content">
        {language === "ENG" ? (
          <div>
            {error ? <p style={{ color: "red" }}>{error}</p> : null}
            {myCollections?.length ? (
              <table id="collections">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Topic</th>
                    <th>UserId</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myCollections.map((collection) => {
                    return (
                      <tr key={collection.id}>
                        <td>{collection.id}</td>
                        <td>{collection.name}</td>
                        <td>{collection.description}</td>
                        <td>{collection.topic}</td>
                        <td>{collection.user_id}</td>
                        <td>
                          <button
                            className="btn"
                            onClick={() => {
                              onViewCollection(collection);
                            }}
                          >
                            View
                          </button>
                          {localStorage.getItem("userRole-from-token") ===
                            "admin" && (
                              <button
                                className="btn"
                                onClick={() => {
                                  onDeleteCollection(collection);
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
              "No collections to display"
            )}
          </div>
        ) : (
          <div>
            {error ? <p style={{ color: "red" }}>{error}</p> : null}
            {myCollections?.length ? (
              <table id="collections">
                <thead>
                  <tr>
                    <th>Идентификатор</th>
                    <th>Имя</th>
                    <th>Описание</th>
                    <th>Тема</th>
                    <th>Идентиф.пользователя</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {myCollections.map((collection) => {
                    return (
                      <tr key={collection.id}>
                        <td>{collection.id}</td>
                        <td>{collection.name}</td>
                        <td>{collection.description}</td>
                        <td>{collection.topic}</td>
                        <td>{collection.user_id}</td>
                        <td>
                          <button
                            className="btn"
                            onClick={() => {
                              onViewCollection(collection);
                            }}
                          >
                            Посмотреть
                          </button>
                          {localStorage.getItem("userRole-from-token") ===
                            "admin" && (
                              <button
                                className="btn"
                                onClick={() => {
                                  onDeleteCollection(collection);
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
              "Коллекции пока нет"
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCollections;
