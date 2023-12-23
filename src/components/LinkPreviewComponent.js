import React, { useState, useEffect } from 'react';

function LinkPreviewComponent({ url }) {
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(false);

 useEffect(() => {
  fetch(`https://api.linkpreview.net/?key={02e1500c953ede003ea6e4ea07c89f14}&q=${url}`)
    .then(response => response.json())
    .then(data => {
      if (data && data.image && data.title) {
        setMetadata(data);
      } else {
        setError(true);
      }
    })
    .catch(() => setError(true));
}, [url]);

if (metadata) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img src={metadata.image} alt={metadata.title} style={{width: "250px"}} />
      </a>
      <div>{metadata.title}</div>
    </div>
  );
} 

if (error) {
  return <a href={url}>{url}</a>;
}
}


export default LinkPreviewComponent;