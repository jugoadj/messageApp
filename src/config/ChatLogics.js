export const isSameSenderMargin = (messages, m, i, userId) => { // vérifie si le message actuel est envoyé par le même utilisateur que le message précédent, et retourne la valeur de la marge gauche appropriée.
  // console.log(i === messages.length - 1);

  if (i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId) {
    return 33;
  } else if ((i < messages.length - 1 &&
                          messages[i + 1].sender._id !== m.sender._id &&
                          messages[i].sender._id !== userId) ||
                        (i === messages.length - 1 && messages[i].sender._id !== userId)) {
           return 0;
         } else {
           return "auto";
         }
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {// vérifie si le message actuel est le dernier message du chat, et retourne l'ID de l'utilisateur qui l'a envoyé.
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, m, i) => {// vérifie si le message actuel est envoyé par le même utilisateur que le message précédent, et retourne un booléen.
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
  
  
};

export const getSender = (loggedUser, users) => { //
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name; 
  //vérifie si le premier utilisateur dans le tableau users est l'utilisateur actuellement connecté, et retourne le nom du deuxième utilisateur si c'est le cas, sinon elle retourne le nom du premier utilisateur.
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
  // similaire à getSender, mais elle retourne l'objet utilisateur complet au lieu du nom.
};