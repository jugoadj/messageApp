import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; //importe le fichier App.js
import { ChakraProvider } from '@chakra-ui/react';
import ChatProvider from "./Context/ChatProvider";

import { BrowserRouter  } from "react-router-dom"; //import le composant browserRouter de la bibliotheque react router dom qui est une bibliothèque très populaire dans l'écosystème React, spécialement conçue pour gérer le routage dans les applications à page unique (SPA)

const root = ReactDOM.createRoot(document.getElementById('root'));// crée un "root" React en utilisant la fonction createRoot de ReactDOM document.getElementById('root') récupère l'élément DOM avec l'ID "root", qui est le point d'ancrage où l'application React sera rendue. l'id root est dans le fichier index.html dans le dossier public
root.render( ////Cette méthode render est appelée sur le "root" React et prend en argument le JSX à rendre. Dans cet exemple, le composant App est rendu
    <React.StrictMode>
      <BrowserRouter> {/**BrowserRouter est utilisé comme composant parent qui fournit le contexte du routage. ici le routage doit ce faire dans toute lapplication react cest a dire le composant app (la fonction) qu'on a importe de app.js*/}
        <ChatProvider>
          <ChakraProvider>
              <App />   {/*<App /> est une manière courante de représenter un composant React appelé App notre application react qui va etre rendu dans la div avec l'id root dans index.html pour que linterface react saffiche  par le moteur de rendu React (ReactDOM) */}
          </ChakraProvider>
        </ChatProvider>
      </BrowserRouter>
    </React.StrictMode>
);

