import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../Header";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  let baseURL = "http://aidana-final-project-test.eba-npwyzs2b.us-east-1.elasticbeanstalk.com/users";
  let language = localStorage.getItem("language");

  const getUsers = () => {
    axios
      .get(baseURL)
      .then((res) => {
        if (res.status === 200) {
          setUsers(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const onUserBlock = (user) => {
    axios
      .get(baseURL + "/block/" + user.id, {
        headers: {
          "access-token": localStorage.getItem("access-token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          axios
            .get(baseURL)
            .then((res) => {
              if (res.status === 200) {
                getUsers();
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
  };

  const onUserUnblock = (user) => {
    axios
      .get(baseURL + "/unblock/" + user.id, {
        headers: {
          "access-token": localStorage.getItem("access-token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          axios
            .get(baseURL)
            .then((res) => {
              if (res.status === 200) {
                getUsers();
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
  };

  const onUserDelete = (user) => {
    const confirmMessage = language === "ENG" ? "Do you really want to delete user?" : "Вы действительно хотите удалить пользователя?";


    if (window.confirm(confirmMessage)) {
      axios
        .delete(baseURL + "/" + user.id, {
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
                  getUsers();
                }
              })
              .catch((error) => {
                setError(error.response.data.error);
              });
          }
        })
        .catch((err) => {
          setError(err.response.data.error);
        });
    }
  };

  const onMakeAdminClicked = (user) => {
    axios
      .put(baseURL + "/" + user.id + "/admin", null, {
        headers: {
          "access-token": localStorage.getItem("access-token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          getUsers();
        }
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  const onMakeUserClicked = (user) => {
    axios
      .put(baseURL + "/" + user.id + "/user", null, {
        headers: {
          "access-token": localStorage.getItem("access-token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          getUsers();
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
          <Header />
          <div className="content">
            <div>
              {error ? <p style={{ color: "red" }}>{error}</p> : null}
              {users?.length ? (
                <table id="users">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      return (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.first_name}</td>
                          <td>{user.last_name}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td>{user.status}</td>
                          <td>
                            {localStorage.getItem("userRole-from-token") ===
                              "admin" &&
                              user.role === "user" && (
                                <button
                                  className="btn"
                                  onClick={() => onMakeAdminClicked(user)}
                                >
                                  Make Admin
                                </button>
                              )}
                            {localStorage.getItem("userRole-from-token") ===
                              "admin" &&
                              user.role === "admin" && (
                                <button
                                  className="btn"
                                  onClick={() => onMakeUserClicked(user)}
                                >
                                  Remove from admin
                                </button>
                              )}
                            <button
                              className="btn"
                              onClick={() => {
                                onUserBlock(user);
                              }}
                            >
                              Block
                            </button>
                            <button
                              className="btn"
                              onClick={() => {
                                onUserUnblock(user);
                              }}
                            >
                              Unblock
                            </button>
                            <button
                              className="btn"
                              onClick={() => {
                                onUserDelete(user);
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
                "No users to display"
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          <Header />
          <div className="content">
            <div>
              {error ? <p style={{ color: "red" }}>{error}</p> : null}
              {users?.length ? (
                <table id="users">
                  <thead>
                    <tr>
                      <th>Идентификатор</th>
                      <th>Имя</th>
                      <th>Фамилия</th>
                      <th>Почта</th>
                      <th>Роль</th>
                      <th>Статус</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      return (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.first_name}</td>
                          <td>{user.last_name}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td>{user.status}</td>
                          <td>
                            {localStorage.getItem("userRole-from-token") ===
                              "admin" &&
                              user.role === "user" && (
                                <button
                                  className="btn"
                                  onClick={() => onMakeAdminClicked(user)}
                                >
                                  Сделать админом
                                </button>
                              )}
                            {localStorage.getItem("userRole-from-token") ===
                              "admin" &&
                              user.role === "admin" && (
                                <button
                                  className="btn"
                                  onClick={() => onMakeUserClicked(user)}
                                >
                                  Убрать из админа
                                </button>
                              )}
                            <button
                              className="btn"
                              onClick={() => {
                                onUserBlock(user);
                              }}
                            >
                              Заблокировать
                            </button>
                            <button
                              className="btn"
                              onClick={() => {
                                onUserUnblock(user);
                              }}
                            >
                              Разблокировать
                            </button>
                            <button
                              className="btn"
                              onClick={() => {
                                onUserDelete(user);
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
                "Пользователей пока нет"
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
