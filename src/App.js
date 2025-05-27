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
      <h1>Beans Image Generator</h1>

      {!loading && <ImageDropZone setImageVar={setImage}></ImageDropZone>}
      {appImage.length > 0 && <GenerateButton appImage={appImage} loadingSetter={setLoading}/>}
    </div>
  );
}

export default App;
