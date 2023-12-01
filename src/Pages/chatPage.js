import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatPage = () => { //créé un composant fonctionnel chatPage en utilisant une syntaxe de fonction fléchée.  renvoie une div contenant le texte "chat page". 
    const [chats, setChats] = useState([]); // État local pour stocker les chats récupérés de l'API
    //useState : Crée une variable d'état chats et une fonction setChats pour mettre à jour cet état. L'état est initialement défini comme un tableau vide.

    //donc on recupere les donnes renvoyer par (get('/api/chat')) dans la variable data apres on met a jour la variable chats grace a la fonction setchats qui contient les donnees qu'ona recuperer
    const fetchChats = async () => {

        const {data} = await axios.get('/api/chat')
        //utilise Axios pour effectuer une requête GET à l'URL (/api/chat) cette url on la configurer dans notre api (backend/server.js) pour quelle nous response le tableau chats qui se trouve dans backend/data.js
        //La réponse de la requête est stockée dans la variable data.
        // donc la on vien de recuperer les donnees que notre api a envoyer depuis le backend avc la requete (/api/chat)
        // await (utiliser dans une fonction asynchrone):  le programme va suspendre l'exécution de la fonction fetchChats jusqu'à ce que la requête HTTP soit terminée et que les données soient prêtes.
        
        setChats(data); // Met à jour l'état 'chats' avec les données récupérées

    };
    useEffect(() => { //: Utilise le hook useEffect pour déclencher la fonction fetchChats au moment du montage initial du composant (lorsqu'il est ajouté au DOM).
        fetchChats();
    }, []);
    
    return (
        <div> 
            {chats.map(chat => ( //methode map ,elle itère sur chaque élément du tableau chats et applique une fonction fleches chat qui renvoie pour chaque chat une div qui contien le chatName et la cle unique (important)
                <div key={chat._id}> {chat.chatName} </div> //jsx
            ))} 
        </div>
    );
};

export default ChatPage; // le composant chatPage on va pouvoir l'importer dans nimport quel autre fichier
// example dans le componant d'une route pour le retourner si la route est atteinte