import { Input } from "@chakra-ui/input";
import { Box, Text} from "@chakra-ui/layout";
import { FaRegComment } from "react-icons/fa";
import { InputGroup, InputRightElement, InputLeftElement} from "@chakra-ui/react";
import {  FiFile,FiSend, FiSmile } from "react-icons/fi";
import { IoIosMic } from "react-icons/io";
import Picker from 'emoji-picker-react';
import React from 'react';
import { useRef } from 'react';
import soundFile from './interface-124464.mp3';

import { IconButton , Icon} from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import { ChatState } from "../Context/ChatProvider"; 
import { useEffect, useState } from "react";
import { FormControl } from "@chakra-ui/form-control";
import { Spinner, useToast} from "@chakra-ui/react";
import ScrollableChat from "./ScrollableChat";
import axios from "axios";
import io from "socket.io-client";
import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/react";

const ENDPOINT = "http://localhost:5000"; // URL du serveur Socket.IO
var  socket, selectedChatCompare;
//..
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [audioUrl, setAudioUrl] = useState(null);
  


  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  
  const { user, selectedChat, setSelectedChat } = ChatState(); //selectedChat est un objet qui contient les info du chat selectionner
  //Lorsqu'un utilisateur sélectionne un chat dans l'interface utilisateur de notre application, une fonction ( setSelectedChat) 
  //est appelée pour mettre à jour la valeur de selectedChat avec les informations du chat sélectionné.
  //la valeur de seselectedchat est definie dans Mychats.js
 
  let mediaRecorder;
let recordedChunks = [];
  

  const startRecording = () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      mediaRecorder.addEventListener('dataavailable', function(e) {
        recordedChunks.push(e.data);
      });
    });
}


const stopAndDisplayAudio = async () => {
  if (mediaRecorder) {
    mediaRecorder.stop();

    // Attendre que l'enregistrement soit terminé
    mediaRecorder.addEventListener('stop', async function() {
      let audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });

      recordedChunks = [];

      let reader = new FileReader();
      reader.readAsDataURL(audioBlob); 
      reader.onloadend = function() {
        let base64data = reader.result;                

        // Créer un nouvel élément audio et le jouer
        let audio = new Audio(base64data);
        audio.play();

        // Mettre à jour l'URL de l'audio
        setNewMessage(base64data);
      }
    });
  }
}


  const onEmojiClick = (emoji) => {
    setNewMessage(prevMessage => prevMessage + emoji);
  };

  const fetchMessages = async () => {
    if (!selectedChat) { //Si aucun chat n'est sélectionné, la fonction se termine immédiatement.
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true); //met l'état loading à true pour afficher le spinner de chargement.

      const { data } = await axios.get( //envoie une requête GET à l'API pour récupérer les messages du chat sélectionné.
        //data contient la réponse du serveur à la requête GET  
      `/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id); //envoie un événement "join chat" depuis le client vers le serveur via Socket.IO. L'événement est accompagné de l'ID du chat sélectionné (selectedChat._id).


    } catch (error) {
      if (!toast.isActive("error-toast")) {
        toast.closeAll();
        toast({
          id: "error-toast",
          render: () => (
            <Alert status="error" colorScheme="red" fontSize="sm">
              <AlertIcon />
              <AlertTitle mr={2}>Error Occured!</AlertTitle>
              <AlertDescription>Failed to loads the chats</AlertDescription>
            </Alert>
          ),
          duration: 2500,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT); // crée une connexion Socket.IO à l'endpoint spécifié (le serveur)
    socket.emit("setup", user) // envoie un événement "setup" avec l'utilisateur en tant que données 
    socket.on("connection", () => setSocketConnected(true)); // gestionnaire d'événements pour l'événement "connection" qui met à jour l'état socketConnected à true lorsque la connexion est établie
  }, []);

  useEffect(() => { // exécuté la fonction fetchMessages chaque fois que selectedChat change
    fetchMessages(); 

    selectedChatCompare = selectedChat; //selectedChatCompare est une variable qui contient les info du chat selectionner
  }, [selectedChat]);

  

   useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => { // gestionnaire d'événements pour l'événement "message recieved" qui est déclenché lorsque le serveur envoie un événement "message recieved" au client via Socket.IO.
      //La fonction de rappel reçoit newMessageReceived comme argument, qui est le nouveau message reçu du serveur.
      if( !selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){ //
        //notification
      }else{
        setMessages([...messages, newMessageRecieved]);
      }
    });

  });

 
  


  const sendMessage = async (event) => {//La fonction sendMessage est appelée lorsque l'utilisateur appuie sur la touche Entrée ou clique sur le bouton Envoyer.event est l'événement qui déclenche la fonction.

      
    if ((event.key === "Enter" || event.type === 'click') && newMessage) { 
      let audio = new Audio(soundFile);
      audio.play();

      //Si l'utilisateur appuie sur la touche Entrée ou clique sur le bouton Envoyer et que la zone de texte n'est pas vide, la fonction se poursuit.
      // socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`, 
          },
        };
        setNewMessage("");//met à jour l'état newMessage avec une chaîne vide pour effacer le champ de saisie de la zone de texte.
        const { data } = await axios.post( //envoie une requête POST à l'API pour enregistrer le nouveau message dans la base de données.
          //data contient la réponse du serveur à la requête POST
          "/api/message",
          {
            content: newMessage, 
            chatId: selectedChat._id,  //dans le contexte de MongoDB , chaque document stocké dans la base de données a une propriété unique _id qui est automatiquement générée par MongoDB lors de la création du document. C'est un identifiant unique pour chaque document.
          //ici selcted chat est mis a jour quand on clique sur chat dans mychat.js (onClick={() => setSelectedChat(chat)}//lorsque 
          //l'utilisateur clique sur un chat, il met à jour l'état selectedChat avec le chat sur lequel il a cliqué.)
          },
          config
        );

        socket.emit("new message", data);


        setMessages([...messages, data]); //met à jour l'état messages avec les messages actuels plus le nouveau message.

      } catch (error) {
        if (!toast.isActive("error-toast")) {
          toast.closeAll();
          toast({
            id: "error-toast",
            render: () => (
              <Alert status="error" colorScheme="red" fontSize="sm">
                <AlertIcon />
                <AlertTitle mr={2}>Error Occured!</AlertTitle>
                <AlertDescription>Failed to loads the chats</AlertDescription>
              </Alert>
            ),
            duration: 2500,
            isClosable: true,
            position: "bottom-left",
          });
        }
      }
    }
  };



  const typingHandler = (e) => {
    setNewMessage(e.target.value);// met à jour l'état newMessage avec la valeur actuelle de la zone de texte.

    if (!socketConnected) { //Si la connexion socket n'est pas établie (socketConnected est false), la fonction se termine immédiatement.
      return;
    }

    if (!typing) {
      setTyping(true);
      // socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        // socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

 
  return (
    <>
      {selectedChat ? ( //Si un chat est sélectionné, le composant affiche les messages du chat sélectionné.
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}  //lorsque l'utilisateur clique sur le bouton de retour, il met à jour l'état selectedChat avec une chaîne vide.
            />
            {messages && //Si des messages sont disponibles, le composant affiche le nom de l'expéditeur du dernier message.

              (!selectedChat.isGroupChat ? (//si le chat n'est pas un chat de groupe, le composant affiche le nom de l'expéditeur du dernier message.
                <>
                  {getSender(user, selectedChat.users)} 
                  <ProfileModal  //ProfileModal est un composant qui affiche les informations de l'utilisateur lorsqu'il est cliqué.
                    user={getSenderFull(user, selectedChat.users)}//getSenderFull est une fonction qui renvoie l'objet utilisateur complet de l'expéditeur du dernier message.
                  />
                </>
              ) : (//sinon si le chat est un chat de groupe, le composant affiche le nom du chat.
                <>
                  {selectedChat.chatName.toUpperCase()}
                  {/* <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  /> */}
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="#242526"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : ( // sinon si loading est false, le composant affiche les messages du chat sélectionné.
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage} //lorsque l'utilisateur appuie sur une touche entrer, la fonction sendMessage est appelée.
              id="first-name"
              isRequired
              mt={3} 
            >
            <InputGroup>
 <InputGroup>
  <Input
    variant="filled"
    bg="#3A3B3C"
    color={"white"}
    placeholder="Enter a message.."
    value={newMessage.startsWith('data:audio') ? '' : newMessage} // 
    onChange={typingHandler}
    _hover={{
      bg: "#3A3B3C",
    }}
    _focus={{
      borderColor: "transparent",
    }}
  />
  {newMessage.startsWith('data:audio') && (
    <div style={{ width: '100%' }}>
      <audio style={{ width: '100%' }} src={newMessage} controls />
    </div>
  )}
</InputGroup>
<Box display="flex" justifyContent={"space-between"}></Box>
   
  <Box display="flex" justifyContent={"space-between"}>
    <IconButton aria-label="Fichier" icon={<FiFile />} color={"white"} bg="3A3B3C" _hover={{ bg: "3A3B3C" }}  />
    <IconButton aria-label="Emoji" icon={<FiSmile />} color={"white"} bg="3A3B3C" _hover={{ bg: "3A3B3C" }} onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
    {showEmojiPicker && <Picker onEmojiClick={(_event, emojiObject) => {
      console.log(emojiObject);
      onEmojiClick(emojiObject.emoji);
    }} />}
    <IconButton aria-label="Envoyer" icon={<IoIosMic />} color={"white"} bg="3A3B3C" _hover={{ bg: "3A3B3C" }} onMouseDown={startRecording} onMouseUp={stopAndDisplayAudio} />
    <IconButton aria-label="Envoyer" icon={<FiSend />} color={"white"} bg="3A3B3C" _hover={{ bg: "3A3B3C" }} onClick={sendMessage}  />
  </Box>
</InputGroup>
        

            </FormControl>
          </Box>
        </>
      ) : ( // Si aucun chat n'est sélectionné, le composant affiche un message indiquant qu'aucun chat n'est sélectionné.
        // to get socket.io on same page
        <Box display="flex" alignItems="center" justifyContent="center" h="100%" flexDirection="column">
          <Icon as={FaRegComment} boxSize={10} mb={3} />

          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Aucune discussion sélectionnée
          </Text>
        </Box>
      )}
    </>
  );
  
};

export default SingleChat;