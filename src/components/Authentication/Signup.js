import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";

const Signup = () => { 
  const [show, setShow] = useState(false);//Utilisation de l'état local pour gérer si le mot de passe doit être affiché en clair ou masqué.
  //L'état local en React se réfère à la gestion des données à l'intérieur d'un composant React, sans qu'elles soient partagées avec 
  //d'autres composants. La gestion de l'état local est réalisée à l'aide du hook useState. Chaque composant React peut avoir son propre
  // état local, indépendant des autres composants, ce qui permet de stocker et de mettre à jour des valeurs spécifiques à ce composant.

  const handleClick = () => setShow(!show); //Fonction pour basculer l'affichage/masquage du mot de passe lorsqu'on clique sur le bouton "Show/Hide".
  
  const toast = useToast();
  const history = useHistory(); //Utilisation de l'objet history pour rediriger l'utilisateur vers une autre page après une inscription réussie.

  const [name, setName] = useState(); //Déclaration d'état local pour stocker le valeur du champs name du formulaire.
  const [pseudo, setPseudo] = useState(); //Déclaration d'état local pour stocker le valeur du champs name du formulaire.
  const [secretQuestion, setSecretQuestion] = useState(); //Déclaration d'état local pour stocker le valeur du champs name du formulaire.
  const [secretAnswer, setSecretAnswer] = useState(); //Déclaration d'état local pour stocker le valeur du champs name du formulaire.
  const [trustedEmail, setTrustedEmail] = useState(); //Déclaration d'état local pour stocker le valeur du champs name du formulaire.
  const [email, setEmail] = useState();// Déclaration d'état local pour stocker le valeur du champs email du formulaire.
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);

  const submitHandler = async () => {
// Gère la soumission du formulaire d'inscription. vers lurl axios.post("/api/user",
// Vérifie que tous les champs obligatoires sont remplis.
// Vérifie que les mots de passe correspondent.
// 
// /Envoie une requête POST au serveur avec les informations d'inscription (nom, email, mot de passe, image).///
//
// Stocke les informations de l'utilisateur dans le stockage local.
// Redirige l'utilisateur vers la page "/chats" après une inscription réussie.
    setPicLoading(true);//picLoading est un état dans un composant React qui est utilisé pour suivre si une image est en cours de chargement ou non.
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false); 
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(name,pseudo, email, trustedEmail,secretAnswer,secretQuestion, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post( "/api/user/register",
        {
          name,
          pseudo,
          trustedEmail,
          secretAnswer,
          secretQuestion,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data); //Affiche les données de l'utilisateur dans la console. Ces données sont probablement la réponse d'une requête d'inscription réussie.
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data)); //Enregistre les données de l'utilisateur dans le stockage local du navigateur. Cela permet de persister les données de l'utilisateur même après que la page a été rechargée.
      setPicLoading(false);
      history.push("/connexion"); //Redirige l'utilisateur vers la page "/chats" après une inscription réussie.


    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => { //Fonction pour gérer le téléchargement de l'image du profil. Elle utilise l'API Cloudinary pour télécharger l'image et stocke l'URL de l'image dans l'état local pic
    setPicLoading(true);
    if (pics === undefined) { // si lutilisateur na pas choisi dimage
      toast({ //on affiche un toast de chakraui pour lui dire de choisir une image
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return; //on sort de la fonction
    }
    console.log(pics);
    //télécharger une image sur Cloudinary, un service de stockage d'images dans le cloud
    if (pics.type === "image/jpeg" || pics.type === "image/png") { //si le type de l'image (pics.type) est "image/jpeg" ou "image/png". Si ce n'est pas le cas, le code ne fait rien.
      const data = new FormData();//S'il s'agit d'une image JPEG ou PNG, il crée un nouvel objet FormData. FormData est utilisé pour envoyer des données de formulaire encodées en multipart/form-data via AJAX.
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dnorktqq7");//ajoute l'image, un "upload_preset" et un "cloud_name" à l'objet FormData. L'"upload_preset" est un ensemble de paramètres de téléchargement prédéfinis, et le "cloud_name" est le nom de votre compte Cloudinary.
      fetch("https://api.cloudinary.com/v1_1/dnorktqq7/image/upload", { // Cloudinary est utilisé pour télécharger (ou "uploader") une image depuis votre application vers le cloud. Une fois l'image téléchargée sur Cloudinary, elle est stockée de manière sécurisée et peut être facilement récupérée ou partagée grâce à une URL unique fournie par Cloudinary.
        method: "post",
        body: data,
        //Stockage et sauvegarde : Cloudinary stocke vos fichiers multimédias sur le cloud, ce qui signifie que vous n'avez pas à vous soucier de la gestion du stockage sur votre propre serveur.
      })
        .then((res) => res.json())
        .then((data) => {//.then(), data est l'objet JSON renvoyé par l'API de Cloudinary. Cet objet contient plusieurs propriétés, dont url qui est l'URL de l'image téléchargée. Vous pouvez utiliser cette URL pour récupérer l'image.
// Vous utilisez la fonction setPic(data.url.toString()) pour enregistrer l'URL de l'image dans l'état de votre application, ce qui signifie que vous pouvez l'utiliser plus tard pour afficher l'image ou la partager.
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  return ( // je jsx que la fonction signup va retourner fais avec chakra ui
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)} //onchange un événement qui est déclenché chaque fois que la valeur d'un élément de formulaire change. Dans le contexte d'un champ de saisie (<Input />), cela se produit lorsque l'utilisateur tape ou modifie le texte dans le champ.
          // setEmail est une fonction de mise à jour de l'état locale déclarée avec useState pour mettre à jour la valeur de l'état associé à name. Lorsque la fonction setname est appelée avec la nouvelle valeur de name (e.target.value), elle met à jour la valeur de l'état, et cette valeur est alors utilisée dans le rendu du composant.
          //e.target.value donne la valeur actuelle de l'élément qui a déclenché l'événement.(onchange) Pour les champs de saisie (<input>, <textarea>
        // onChange du composant <Input>. Elle prend l'événement e en paramètre, extrait la valeur du champ d'entrée avec e.target.value, et met à jour l'état email à l'aide de la fonction setEmail.
       //apres cest la nouvelle valeur de setname qui sera utiliser pour la bdd etc
       />
      </FormControl> 
      <FormControl id="pseudo" isRequired>
        <FormLabel>Pseudo</FormLabel>
        <Input
          placeholder="Enter Your Pseudo"
          onChange={(e) => setPseudo(e.target.value)} //onchange un événement qui est déclenché chaque fois que la valeur d'un élément de formulaire change. Dans le contexte d'un champ de saisie (<Input />), cela se produit lorsque l'utilisateur tape ou modifie le texte dans le champ.
          // setEmail est une fonction de mise à jour de l'état locale déclarée avec useState pour mettre à jour la valeur de l'état associé à name. Lorsque la fonction setname est appelée avec la nouvelle valeur de name (e.target.value), elle met à jour la valeur de l'état, et cette valeur est alors utilisée dans le rendu du composant.
          //e.target.value donne la valeur actuelle de l'élément qui a déclenché l'événement.(onchange) Pour les champs de saisie (<input>, <textarea>
        // onChange du composant <Input>. Elle prend l'événement e en paramètre, extrait la valeur du champ d'entrée avec e.target.value, et met à jour l'état email à l'aide de la fonction setEmail.
       //apres cest la nouvelle valeur de setname qui sera utiliser pour la bdd etc
       />
      </FormControl> 
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Trusted Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your TRUSTED Email Address"
          onChange={(e) => setTrustedEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="text" isRequired>
        <FormLabel>secretQuestion</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your SECRET QUESTION"
          onChange={(e) => setSecretQuestion(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>secretAnswer</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your SECRET ANSWER"
          onChange={(e) => setSecretAnswer(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"} //si show est vrai on affiche du texte sinon les point password
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {/* quand on click la fonction handleclick est appele si le var show est vrai (par defaut elle est false ) alors handleclick va inverse show a false */}
              {show ? "Hide" : "Show"} {/** si show est vrai onafiche hide sinon on affiche show */}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        bg="#293741" color="#B08085"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler} //quand on click sur le bouton submitHandler est appele qui est une fonction qui va envoyer les donnees de lutilisateur avec axios.post 
        isLoading={picLoading}
      >
        Sign Up
      </Button>
      
    </VStack>
  );
};

export default Signup;