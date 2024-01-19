

// export default ScrollableChat;
import {  FaFilePdf } from 'react-icons/fa'; // Importer l'icône de fichier
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import LinkPreviewComponent from '../components/LinkPreviewComponent';
import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import { useToast } from "@chakra-ui/toast";



import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";


const ScrollableChat = ({ messages }) => {//messages contient les donnes de l'utilisateur connecté qu'on a recupéré dans la fonction fetchMessages dans singleChat.js
  const { user } = ChatState();
  const serverUrl = 'http://localhost:5000'; // Remplacez ceci par l'URL de votre serveur
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [clickedMessageId, setClickedMessageId] = useState(null);
const [chatMessages, setChatMessages] = useState([]);

  const toast = useToast();

  
function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {type: mimeString});
}
 const handleDelete = async (id) => {
  console.log('handleDelete called with id:', id);
  if (!id) {
    console.log('id is not defined');
    return;
  }
  console.log('id:', id);
  try {
    const config = {  
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const {data} = await axios.get(
      `/api/Message/Supp/${id}`,
      {}, 
      config
    );
    console.log('delete request successful, data:', data);
        setChatMessages(messages.filter(message => message._id !== id));

  } catch (error) {
    console.log('delete request failed, error:', error.response ? error.response.data : error.message);
  }
};

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
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'flv':
      
        return 'video';
      case 'mp3':
      case 'wav':
      case 'ogg':
        return 'audio';
      default:
        return 'unknown';
    }
  }

  return (
    <ScrollableFeed>
      {messages && 
        messages.map((m, i) => {//boucle qui parcourt chaque message dans messages et rend un composant Box pour chaque message.
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
            <div style={{ display: "flex", alignItems: "center", position: 'relative' }} key={m._id} >
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
                    fileType === 'image' ? 'transparent' : 
                    fileType === 'document' ? '#4E4F50' : 
                    fileType === 'video' ? 'transparent' :
                    fileType === 'audio' ? 'transparent' :
                    "#4E4F50"
                  ) : m.content.startsWith('http') ? '#111111' :
                  (m.content.startsWith('data:audio') ? 'transparent' : 
                  (m.sender._id === user._id ? "#3797F0" : "#4E4F50"))
                }`,

                color: `${m.sender._id === user._id ? "white" : "white"}`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: m.file && fileType === 'image'  ? '20px' : (m.file ? '10px 10px 10px 0' : '20px'),
                boxShadow: m.file && fileType === 'image' ? '0px 3px 6px #00000029' : 'none',
                padding: m.file ? '10px 12px' : '5px 15px',


                maxWidth: "75%",
              }}
              onMouseEnter={() => setHoveredMessage(m._id)}
              onMouseLeave={() => setHoveredMessage(null)}
              >
{m._id === hoveredMessage && <DeleteIcon className="icon-hover" style={{ width:'20px' }} onClick={() => handleDelete(m._id)} />}          

                 {m.file ? (
                    console.log(m.createdAt),
                    fileType === 'image' ? (
                      <div style={{ position: 'relative', width: '300px' }}>
                        <a href={`${serverUrl}/${m.file.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer">
                        <div style={{ position: 'relative' }} onMouseEnter={(e) => {document.getElementById(`img-${i}`).style.filter = 'blur(2px)'; document.getElementById(`date-${i}`).style.display = 'block';}} onMouseLeave={(e) => {document.getElementById(`img-${i}`).style.filter = 'none'; document.getElementById(`date-${i}`).style.display = 'none';}}>
                          <img id={`img-${i}`} src={`${serverUrl}/${m.file.replace(/\\/g, '/')}`} alt="Message content" style={{width: "100%", transition: '0.3s'}} />
                          <div id={`date-${i}`} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', display: 'none', color:"#111111" }}>{`send : ${new Date(m.createdAt).toLocaleString()}`}</div>
                        </div>
                      </a>
                      </div>
                      ) : fileType === 'video' ? (
                        <div style={{ position: 'relative', width: '300px', borderRadius:"10px 10px 10px 10px", boxShadow:"0px 3px 6px #111111" }}>
                          <video controls style={{width: "100%", transition: '0.3s'}} onMouseOver={(e) => {e.currentTarget.style.filter = 'blur(2px)'; document.getElementById(`date-${i}`).style.display = 'block';}} onMouseOut={(e) => {e.currentTarget.style.filter = 'none'; document.getElementById(`date-${i}`).style.display = 'none';}}>
                            <source src={`${serverUrl}/${m.file.replace(/\\/g, '/')}`} type="video/mp4" />
                            Your browser does not support the video tag.
                            <div id={`date-${i}`} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', display: 'none', color:"#111111" }}>{`send  : ${new Date(m.createdAt).toLocaleString()}`}</div>

                          </video>
                        </div>
                    )  : (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FaFilePdf size={20} />
                        <a href={`${serverUrl}/${m.file.replace(/\\/g, '/')}`} download>
                          {fileName.length > 50 ? fileName.substring(0, 30) + '...' : fileName} ({fileExtension})
                        </a>
                      </div>
                    )
                  ) : (
                     
                        m.content.startsWith('data:audio') ? (
                        <div style={{ position: 'relative', width: '175px', height: '50px', borderRadius:"10px 10px 10px 10px" }}>
                          <audio style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls>
                            <source src={m.content} />
                          </audio>
                        </div>
                      ) : (
                        m.content
                      )
                      )
                    }
                
                    
              </span>
            </div>
          );
        })}
     
    </ScrollableFeed>
  );
};

export default ScrollableChat;