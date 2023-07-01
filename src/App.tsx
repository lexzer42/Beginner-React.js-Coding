import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

// https://randomuser.me/api

interface UserName {
  first: string;
  last: string;
  title: string;
}

interface Picture {
  thumbnail: string;
}
interface UserInfo {
  name: UserName;
  picture: Picture;
}

const fetchRandomData = (pageNumber: number) => {
  // ?page=2
  return axios
    .get(`https://randomuser.me/api?page=${pageNumber}`)
    .then(({ data }) => {
      //handle success
      console.log(data);
      return data;
    })
    .catch((err) => {
      //handle error
      console.error(err);
    });
};

const getFullUserName = (userInfo: UserInfo) => {
  const {
    name: { first, last },
  } = userInfo;
  return `${first} ${last}`;
};

function App() {
  const [counter, setCounter] = useState(0);
  const [nextPageNumber, setNextPageNumber] = useState(1);
  const [userInfos, setUserInfos] = useState<UserInfo[]>([]);
  const [showUserList, setShowUserList] = useState(false);
  const setUserList = () => {
    setShowUserList(!showUserList);
  };
  const userListStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  };
  const fecthNextUser = useRef(() => {});

  fecthNextUser.current = () => {
    fetchRandomData(nextPageNumber).then((randomData) => {
      // setRandomUserDataJSON(JSON.stringify(randomData, null, 2) || "No user data found.");
      if (randomData === undefined) return;

      const newUserInfos = [...userInfos, ...randomData.results];
      setUserInfos(newUserInfos);
      setNextPageNumber(randomData.info.page + 1);
    });
  };

  useEffect(() => {
    // fetchNextUser();
    fecthNextUser.current();
  }, []);

  return (
    <div className="App">
      <h1>Hola Oscar Rojas!</h1>
      <h2>Empieza a programar desde aqui!</h2>

      <p>{counter}</p>
      <button
        onClick={() => {
          setCounter(counter + 1);
          console.log("foo");
        }}>
        Incrementar contador!
      </button>
      <button
        onClick={() => {
          fecthNextUser.current();
        }}>
        Siguiente usuario!
      </button>
      <button onClick={setUserList}>
        {showUserList
          ? "Ocultar lista de usuarios"
          : "Mostrar lista de usuarios"}
      </button>

      {showUserList && (
        <div style={userListStyle}>
          {userInfos.map((userInfo: UserInfo, idx: number) => (
            <div key={idx} style={{ margin: "10px" }}>
              <p>{getFullUserName(userInfo)}</p>
              <img src={userInfo.picture.thumbnail} alt="Profile" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
