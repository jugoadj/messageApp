import React from "react";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom"; //Link est utilisé pour créer des liens de navigation entre différentes pages dans une application React qui utilise React Router. cest a dire toute nore app comme cest specifiee dans index.js

const Landingpage = () => { //fonction flechee qui retourne un js est un boutton
  return (
    <div>
      <Button colorScheme="blue" marginTop="30px" bg="#293741" color="#B08085" _hover="#B08085">
        <Link to="/connexion">Aller à la page Connexion</Link>
      </Button>
    </div>
  );
};

export default Landingpage;
