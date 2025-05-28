import logo from './logo.svg';
import './App.css';
import ImageDropZone from './components/ImageDropZone';
import GenerateButton from './components/GenerateButton'
import { useState } from 'react';

function App() {
  const [appImage, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <h1>Mighty Beans Image Generator</h1>
      <h3>
        Upload any image and press generate and get your Meme Beans <br />
        Official CA: <br />
        Offical Twitter: <a href="https://x.com/i/communities/1927305352602640601" target="_blank" rel="noopener noreferrer">https://x.com/i/communities/1927305352602640601</a> <br />
      </h3>
      <p>Refresh if there are any issues.</p>

      {!loading && <ImageDropZone setImageVar={setImage}></ImageDropZone>}
      {appImage.length > 0 && <GenerateButton appImage={appImage} loadingSetter={setLoading}/>}
    </div>
  );
}

export default App;
