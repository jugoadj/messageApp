import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);  // crée un état fetchAgain avec une valeur initiale de false. setFetchAgain est la fonction qui sera utilisée pour mettre à jour cet état.
  const { user } = ChatState(); //utilise le Hook useContext pour accéder à l'état user du contexte ChatState
  //l'etat user dans chatprovider contient les info su user dans le local storage
  return (
    <div style={{ width: "100%",backgroundColor: "#18191A" }}>
      {user && <SideDrawer />} {/* si user est défini, alors le composant SideDrawer est rendu. */}
      <Box  display="flex" justifyContent ="space-between"  w="100%" h="91.5vh" p="2px">
        {user && <MyChats fetchAgain={fetchAgain} />} {/*si user estdefinit alors le composant MyChats est rendu avec la propriete fetchagain  */}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> 
          //fetchAgain est utilisé pour déclencher des actions dans les composants MyChats et Chatbox chaque fois qu'il change de valeur.
        )}
      </Box>
    </div>
  );
};

export default Chatpage;