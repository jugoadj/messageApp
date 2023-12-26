import { PhoneIcon } from "@chakra-ui/icons";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';


import { AtSignIcon } from "@chakra-ui/icons";
import { Drawer,DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useToast} from "@chakra-ui/toast";
import { ChatState } from "../../Context/ChatProvider";
import { useEffect } from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Text,
  Image,
  Icon,
  Box,
} from "@chakra-ui/react";

const ProfileModal = ({ children }) => { // user dont la valeure est définie dans le composant MyChats.js (/(userInfo);)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [messages, setMessages] = useState([]); //
  const toast = useToast();

  const {user, selectedChat } = ChatState(); //utilise le Hook useContext pour accéder à plusieurs états du contexte ChatState.

  const serverUrl = 'http://localhost:5000'; // Remplacez ceci par l'URL de votre serveur
  


  function getFileType(file) {
    const extension = file.split('.').pop();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
      case 'ppt':
      case 'pptx':
      case 'xls':
      case 'xlsx':
      case 'csv':
      case 'py':
      case 'js':
      case 'html':
      case 'css':
        return 'document';
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'flv':
        return 'video';
      case 'mp3':
        return 'audio';
      default:
        return 'unknown';
    }
  }


  const handlePhoneIconClick = () => {
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
  };

  const fetchfiles = async () => {

    if (!selectedChat) { //Si aucun chat n'est sélectionné, la fonction se termine immédiatement.
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

    

      const { data } = await axios.get( //envoie une requête GET à l'API pour récupérer les messages du chat sélectionné.
        //data contient la réponse du serveur à la requête GET  
      `/api/message/${selectedChat._id}/files`,
        config
      );

      setMessages(data);
     

    } catch (error) { //
      console.log(error);

      toast({
        title: "Error Occured!",
        description: "Failed to Load files",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchfiles();
  }, [selectedChat]); // Exécute fetchfiles chaque fois que selectedChat change

  return (
    <>
      {children ? ( 
        <span onClick={onOpen}>{children}</span> // lor
      ) : (
        // <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
          <>
            {/* // <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} /> */}
            <div style={{ display: 'flex'}}>
              <Icon as={AtSignIcon} boxSize={5} onClick={onOpen} margin={2} />
              <Icon as={MoreVertOutlinedIcon} boxSize={5} onClick={handlePhoneIconClick} margin={2} />
            </div>
           
      </>
         
      )}

      





      <Drawer placement="right" onClose={handleClose} isOpen={isDrawerOpen} style={{ height: '500px' }}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton color={"#f1f1f1"} />
            <DrawerHeader bg={"#242526"} color={"#f1f1f1"} borderBottomWidth="1px">contenu multimedia  </DrawerHeader>
            
            {selectedChat && messages.every(m => getFileType(m.file) !== 'image' && getFileType(m.file) !== 'video') ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  w="100%"
                  h="100%"
                  bg="#4E4F50"
                  color={"white"}
                  overflow="auto"
                >
                  <p>Pas de contenu multimedia disponible</p>
                </Box>
              ) : (
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(2, 1fr)"
                  gridAutoRows="150px"
                  gap={2}
                  w="100%"
                  h="100%"
                  bg="#4E4F50"
                  color={"white"}
                  overflow="auto"
                >
                  {messages.map((m, i) => {
                    let fileUrl = '';
                    let fileType = 'unknown'; // Définir fileType par défaut à 'unknown'
                    let fileName = ''; // Définir fileName par défaut à une chaîne vide
                    let fileExtension = ''; // Définir fileExtension par défaut à une chaîne vide
                    if (m.file) {
                      fileType = getFileType(m.file); // Si m.file est défini, obtenir le type de fichier
                      fileUrl = `${serverUrl}/${m.file.replace(/\\/g, '/')}`; // Si m.file est défini, obtenir l'URL du fichier
                      fileName = m.file.split('\\').pop(); // Si m.file est défini, extraire le nom du fichier
                      fileExtension = fileName.split('.').pop(); // Si m.file est défini, extraire l'extension du fichier
                    }
                     return (
                      fileType === 'image' ? (
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" >
                          <img src={fileUrl} alt="Message content" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </a>
                      ) : fileType === 'video' ? (
                        <video style={{ width: '100%', height: '100%', objectFit: 'cover' }}  controls>
                          <source src={fileUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : null
                    );
                  })}
                </Box>
              )}
            
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent bg={"#4E4F50"} color={"#f1f1f1"}  width={"300px"}>
          <ModalHeader
            fontSize="20px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="75px"
              src={user.pic}
              alt={user.name}
            />
            <Text
            
              fontSize={{ base: "14px", md: "15px" }}
              fontFamily="Work sans"
            >
              name: {user.name} <br />                                          
              Email: {user.email}
            </Text>
          </ModalBody>
          
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;