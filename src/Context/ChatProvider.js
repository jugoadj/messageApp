import React, { createContext, useContext, useEffect, useState } from "react";//context est utiliser pour passer des data entre les composants sans passer par les 
import { useHistory } from "react-router-dom";

// on définit un contexte React appelé ChatContext. Ce contexte est utilisé pour partager des données entre différents composants sans avoir à les passer explicitement à travers chaque niveau de l'arborescence des composants.
const ChatContext = createContext();//

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();  // 
  const [supselectedChat, setSupselectedChat] = useState();  
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();

  const history = useHistory();

  useEffect(() => { // recupere les données de l'utilisateur et les stocke dans le localstorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      history.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  return ( // on retourne le contexte avec les valeurs qu'on veut partager
    <ChatContext.Provider // ChatContext.Provider est un composant qui permet à tous ses enfants d'accéder aux valeurs passées dans la prop value
      value={{
        selectedChat, //selectedChat est une variable d'état qui contient les détails du chat sélectionné par l'utilisateur.
        setSelectedChat,//setSelectedChat est une fonction qui met à jour la variable d'état selectedChat.
        supselectedChat,
        setSupselectedChat,
        user, 
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => { // ChatState est une fonction qui utilise le Hook useContext pour accéder aux valeurs du ChatContext.
  return useContext(ChatContext);
};

export default ChatProvider;