import './App.css';
import { Route } from "react-router-dom" // importé le composant Route (<Route/>)de la bibliothèque react-router-dom
import ChatPage from "./Pages/chatPage"; //on import le composant chatPage (const chatPage = ()=>{..}) qu'on a importe de chatPage.js
import Connexion from "./Pages/connexion";
import Landingpage from './Pages/landingpage';

function App() {
  return (
    <div className='App'>
      {/**Route est utilisé pour définir des routes spécifiques. Chaque Route prend au moins deux props : path (le chemin de l'URL associé à la route) et component (le composant React à rendre lorsque la route est activée) */}
      <Route path= '/' component= { Landingpage } exact />
      <Route path= '/connexion' component= { Connexion }  /> {/*exact : Cet attribut est utilisé pour indiquer que la route doit correspondre exactement à l'URL spécifiée dans le path. Sans l'attribut exact, la route correspondrait à tous les chemins qui commencent par '/'.  */}
      <Route path= '/chats' component= { ChatPage } />  {/* lorsque l'URL de votre application correspond à '/chats',
 le composant ChatPage (fichier chatpage.js) sera rendu à la place du composant actuellement rendu. En d'autres 
termes, cela configure le routage pour afficher le contenu de ChatPage lorsque l'utilisateur navigue vers l'URL '/chats'. 
component={ChatPage}: Cela indique le composant React à rendre lorsque la route est activée. Dans notre cas, c'est le composant ChatPage*/}
    </div>
    
  );
}

export default App; //indique que le composant App est l'export par défaut du fichier, ce qui signifie qu'il est accessible pour l'importation dans d'autres fichiers.
