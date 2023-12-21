import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
// import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";

const MyChats = ({ fetchAgain }) => { //fetchAgain est une prop passée au composant MyChats. Il est utilisé comme une dépendance pour le Hook useEffect dans ce composan
  const [loggedUser, setLoggedUser] = useState();//crée un état loggedUser avec une valeur initiale non définie. setLoggedUser est la fonction qui sera utilisée pour mettre à jour cet état

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState(); //utilise le Hook useContext pour accéder à plusieurs états du contexte ChatState.

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, //l'en-tête d'autorisation est défini avec le jeton d'accès de l'utilisateur connecté.
          //dans chatprovider setUser(userInfo) danc user = userinfo ;

        },
      };

      //Axios pour communiquer avec notre API

      const { data } = await axios.get("/api/chat", config);
      //fait une requête GET à /api/chat avec un en-tête d'autorisation (config). Si la requête réussit, 
      //elle met à jour l'état chats avec les données reçues. Si la requête échoue, elle affiche une notification d'erreur.

      setChats(data); //met à jour l'état chats avec les données reçues
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => { // Hook qui exécute le code à l'intérieur de la fonction chaque fois que fetchAgain change.
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));// il met à jour l'état loggedUser avec les informations de l'utilisateur stockées dans le stockage local, et il appelle la fonction fetchChats
    fetchChats(); // la fonction fetchChats qui sert a récupérer les chats de l'utilisateur connecté
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="#18191A"
      color={"white"}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#242526"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? ( //si chats est vrai), alors le code à l'intérieur des parenthèses est rendu. Sinon, le composant ChatLoading est rendu.
          <Stack overflowY="scroll">
            {chats.map((chat) => ( //boucle qui parcourt chaque chat dans chats et rend un composant Box pour chaque chat.
              <Box
                onClick={() => setSelectedChat(chat)}//lorsque l'utilisateur clique sur un chat, il met à jour l'état selectedChat avec le chat sur lequel il a cliqué.
                cursor="pointer"
                bg={selectedChat === chat ? "#3A3B3C" : "none"}
                color={selectedChat === chat ? "white" : "white"}//si le chat est sélectionné, le texte est blanc. Sinon, le texte est noir.
                px={3}
                py={2}
                borderRadius="lg"
                boxShadow="0px 3px 6px #00000029"


                key={chat._id}
              >
                <Text>
                  {chat.isGroupChat ? chat.chatName : getSender(loggedUser, chat.users)}

                </Text>
               {chat.latestMessage && (
                  <Text fontSize="xs">
                    

                    {chat.latestMessage.file ? (
                      chat.latestMessage.file.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                        <p>{chat.latestMessage.sender.name} vous a envoyé une photo ({chat.latestMessage.file.split('.').pop()})</p>
                      ) : (
                        <p>{chat.latestMessage.sender.name} vous a envoyé un document ({chat.latestMessage.file.split('.').pop()})</p>
                      )
                    ) : (
                      chat.latestMessage.content ? (
                        <p>
                          {chat.latestMessage.content.length > 50 
                            ? chat.latestMessage.content.substring(0, 51) + "..." 
                            : chat.latestMessage.content}
                        </p>
                      ) : null
                    )}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;