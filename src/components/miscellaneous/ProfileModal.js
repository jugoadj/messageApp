import { PhoneIcon } from "@chakra-ui/icons";
import { AtSignIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose,Supp } = useDisclosure();

  return (
    <>
      {children ? ( // 
        <span onClick={onOpen}>{children}</span>
      ) : (
        // <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
          <>
            {/* // <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} /> */}
            
            <Icon   as={AtSignIcon} boxSize={5} onClick={onOpen}/>
            <Icon   as={PhoneIcon} boxSize={5} onClick={Supp}/>
      </>
         
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
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
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;