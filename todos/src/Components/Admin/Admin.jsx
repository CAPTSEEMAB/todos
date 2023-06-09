import * as React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "./Admin.css";
import "../Navbar/Navbar.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, width: "800px" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const [value, setValue] = useState(0);
  const [allUser, setAllUser] = useState([]);
  const [userAllTask, setUserAllTask] = useState([]);
  const { state } = useLocation();
  const navigate = useNavigate();
  const authToken = useSelector((state) => state.authTokenValue);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const logOut = () => {
    fetch("http://localhost:3001/api/logout", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        email: state.email,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.isActive) {
          navigate("/");
        }
      });
  };

  //get all userData
  useEffect(() => {
    fetch("http://localhost:3001/api/signup/getAllUser", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result?.errors) {
          alert(result.errors);
        } else {
          setAllUser(result);
        }
      });
  }, []);

  //get admin task per user
  const getUserData = (email) => {
    fetch("http://localhost:3001/api/todo/getUserTodo", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.errors) {
          alert(result.errors);
        } else {
          setUserAllTask(result);
        }
      });
  };

  //delete task per id
  const deleteTodo = (id, email) => {
    fetch("http://localhost:3001/api/todo/delete", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        id: id,
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        setUserAllTask(result);
      });
  };

  return (
    <>
      <div className="navbar">
        <div className="username">{state.email}</div>
        <div className="userLog">
          <div className="logo">Admin</div>
          <div
            className="signOut"
            onClick={logOut}
            style={{ cursor: "pointer" }}
          >
            SignOut
          </div>
        </div>
      </div>
      <Box sx={{ flexGrow: 1, backgroundColor: "#212121", display: "flex" }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{
            width: "250px",
            height: "100vh",
            boxShadow:
              "1.5px 1.5px 3px #0e0e0e, -1.5px -1.5px 3px rgb(95 94 94 / 25%), inset 0px 0px 0px #0e0e0e, inset 0px -0px 0px #5f5e5e",
          }}
        >
          {allUser?.map((user, index) => {
            return (
              <Tab
                label={`${user.email}`}
                {...a11yProps(index)}
                onClick={() => getUserData(user.email)}
              />
            );
          })}
        </Tabs>
        {allUser?.map((user, index) => {
          return (
            <TabPanel value={value} index={index}>
              {userAllTask &&
                userAllTask.length > 0 &&
                userAllTask?.map((data) => {
                  return (
                    <div className="List">
                      <div class="TodosLists">
                        <div className="titleLists">
                          Date -{data.date}
                          <button
                            style={{
                              marginLeft: "25rem",
                              marginBottom: "1rem",
                            }}
                            onClick={(e) => deleteTodo(data._id, data.email)}
                          >
                            Delete
                          </button>
                        </div>

                        <div className="contentLists">{data.description}</div>
                      </div>
                    </div>
                  );
                })}
              {userAllTask?.length === 0 && (
                <div style={{ color: "white" }}>Please add some task</div>
              )}
            </TabPanel>
          );
        })}
      </Box>
    </>
  );
}
