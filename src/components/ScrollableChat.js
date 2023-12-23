// import { Avatar } from "@chakra-ui/avatar";
// import { Tooltip } from "@chakra-ui/tooltip";
// import ScrollableFeed from "react-scrollable-feed";
// import {
//   isLastMessage,
//   isSameSender,
//   isSameSenderMargin,
//   isSameUser,
// } from "../config/ChatLogics";
// import { ChatState } from "../Context/ChatProvider";

// const ScrollableChat = ({ messages }) => { //
//   const { user } = ChatState();
//   const serverUrl = 'http://localhost:5000'; //  l'URL du votre serveur

//   function getFileType(file) {
//     const extension = file.split('.').pop();
//     switch (extension) {
//       case 'jpg':
//       case 'jpeg':
//       case 'png':
//       case 'gif':
//         return 'image';
//       case 'pdf':
//       case 'doc':
//       case 'docx':
//         return 'document';
//       default:
//         return 'unknown';
//     }
//   }

//   return (
//     <ScrollableFeed>
//       {messages &&
//         messages.map((m, i) => (
//           <div style={{ display: "flex" }} key={m._id}>
//             {(isSameSender(messages, m, i, user._id) ||
//               isLastMessage(messages, i, user._id)) && (
//               <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
//                 <Avatar
//                   mt="7px"
//                   mr={1}
//                   size="sm"
//                   cursor="pointer"
//                   name={m.sender.name}
//                   src={m.sender.pic}
//                 />
//               </Tooltip>
//             )}
//             <span
//               style={{
//                 backgroundColor: `${
//                   m.sender._id === user._id ? "#18191A" : "#18191A"
//                 }`,
//                 color: `${m.sender._id === user._id ? "white" : "white"}`,
//                 marginLeft: isSameSenderMargin(messages, m, i, user._id),
//                 marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
//                 borderRadius: "20px",
//                 padding: "5px 15px",
//                 maxWidth: "75%",
//               }}
//             >
//               {m.file ? <img src={`${serverUrl}/${m.file.replace(/\\/g, '/')}`} alt="Message content" style={{width: "175px"}} /> : m.content}

              

//             </span>
//           </div>
//         ))}
//     </ScrollableFeed>
//   );
// };

// export default ScrollableChat;
import {  FaFilePdf } from 'react-icons/fa'; // Importer l'icône de fichier
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import LinkPreviewComponent from '../components/LinkPreviewComponent';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
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
        return 'document';
      default:
        return 'unknown';
    }
  }

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
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
            <div style={{ display: "flex" }} key={m._id}>
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}
              <span
                style={{
                backgroundColor: `${
                  m.file ? (
                    fileType === 'image' ? '#f1f1f1' : 
                    (fileType === 'document') ? '#4E4F50' : 
                    (m.sender._id === user._id ? "#3797F0" : "#4E4F50")
                  ) : m.content.startsWith('http') ? '#111111' :
                  (m.sender._id === user._id ? "#3797F0" : "#4E4F50")
                }`,

                color: `${m.sender._id === user._id ? "white" : "white"}`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: m.file && fileType === 'image' ? '20px' : (m.file ? '10px 10px 10px 0' : '20px'),
                boxShadow: m.file && fileType === 'image' ? '0px 3px 6px #00000029' : 'none',
                padding: m.file ? '10px 12px' : '5px 15px',


                maxWidth: "75%",
              }}
              >
                 {m.file ? (
                  fileType === 'image' ? (
                    <a href={`${serverUrl}/${m.file.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer" >
                      <img src={`${serverUrl}/${m.file.replace(/\\/g, '/')}`} alt="Message content" style={{width: "175px"}} />
                    </a>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FaFilePdf size={20} />
                      <a href={`${serverUrl}/${m.file.replace(/\\/g, '/')}`} download>
                        {fileName.length > 50 ? fileName.substring(0, 30) + '...' : fileName} ({fileExtension})
                      </a>
                    </div>
                  )
                ) : (
                  m.content.startsWith('http') ? (
                      // <a href={m.content} target="_blank" rel="noopener noreferrer">
                      //   {m.content}
                      // </a>
                      <LinkPreviewComponent url={m.content} />
                    
                  ) : (
                    m.content
                  )
                 
                )}
              </span>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;