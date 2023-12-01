import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
// La fonction Connexion utilise des composants de l'interface utilisateur à partir de la bibliothèque Chakra UI et des fonctionnalités 
//de React Router. Les composants importés comprennent Container, Box, Text, Tabs, TabList, Tab, TabPanels, et TabPanel. De plus, les 
//composants Login et Signup sont importés depuis des fichiers externes (probablement Login.js et Signup.js).

function Connexion() {
  const history = useHistory();//: Le hook useHistory est utilisé pour accéder à l'objet d'historique de navigation, qui peut être
  // utilisé pour naviguer vers différentes pages.

  useEffect(() => {// Un effet est utilisé pour rediriger l'utilisateur vers la page "/chats" si des informations d'utilisateur sont 
    //présentes dans le stockage local (localStorage). Cet effet est déclenché après le rendu initial du composant, car il dépend de 
    //history et est ajouté comme dépendance à useEffect
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  return ( //la fonction connexion retourne Contenu JSX : Le reste de la fonction définit la structure de la page. Il utilise des composants de mise en page tels que 
  //Container et Box de Chakra UI pour organiser les éléments. Les onglets (Tabs, TabList, Tab, TabPanels, TabPanel) sont utilisés 
  //pour basculer entre les composants de connexion (Login) et d'inscription (Signup).
    <Container  maxW="xl" centerContent >
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        color="#B08085"
        bg="#293741"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" display= "flex" justifyContent="center">
          MAIL-WALKER
          
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab bg="#293741" color="#B08085">Login</Tab>
            <Tab bg="#293741" color="#B08085">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel >
              <Login /> {/**lecomposant login qu'on a importe de login.js */}
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Connexion;