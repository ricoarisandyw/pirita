// const { createWorker } = require('tesseract.js');
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';
import FilterUtils from './utils/FilterUtils';

export default function App() {
  const [uploadedFile, setUploadedFile] = useState<any>()
  const [result, setResult] = useState('')

  const recognize = () => {
    Tesseract.recognize(
      uploadedFile,
      'eng',
      { logger: m => console.log(m) }
    ).then((result) => {
      setResult(result.data.text)

      // DRAW RESULT
      const oldImage = new Image();
      oldImage.src = uploadedFile;

      oldImage.onload = async () => {
        // RESIZE 
        const width = 500;
        const scale = width / oldImage.width;

        result.data.words.forEach((word) => {
          const text = document.createElement('div')
          Object.assign(text.style, {
            position: 'absolute',
            left: (word.bbox.x0 * scale) + "px",
            top: (word.bbox.y0 * scale) + "px",
            border: "1px solid blue",
            backgroundColor: 'rgba(30,129,176,0.5)',
            fontSize: (word.font_size * scale) + "px",
            // color: 'transparent'
          })
          // text.innerText = word.bbox.x0 + ":" + word.bbox.y0
          text.innerText = word.text
            .replace(/([a-zA-Z])(\d+)/g, '$1 $2 ')
            .replace(/(\d+)([a-zA-Z])/g, '$1 $2 ')
            .replace(/\.|\,/g, '')
            .replace(/(\d)\s+(\d)/g, '$1$2')
          document.getElementById('result-box')?.appendChild(text)
        })

        console.log({ data: result.data })

        alert("CONFIDENT:" + result.data.confidence)
      }
    })
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0)
    if (file) {
      const blob = new Blob([file], { type: file.type });
      const blobUrl = URL.createObjectURL(blob);

      const newUrl = await FilterUtils.darken(blobUrl)

      setUploadedFile(newUrl)
    }
  }

  return <div style={{ display: 'flex' }}><div style={{
    padding: '4rem',
    width: '100%'
  }}>
    <div>
      <input type="file" onChange={handleChange} />
    </div>
    <button onClick={recognize} style={{
      background: 'pink',
      padding: "8px",
      borderRadius: '4px',
      border: 'none',
      marginTop: '8px',
      color: 'white',
      fontWeight: 'bold',
      cursor: 'pointer'
    }}>RECOGNIZE</button>
    <div style={{
      marginTop: "8px"
    }}>
      RESULT :
      {result}
    </div>
    <div id='result-box' style={{
      position: 'relative',
      height: '100vh',
      width: '100%',
      border: "1px solid gray"
    }}>
      <img src={uploadedFile} width={500} style={{
        zIndex: -1,
        position: "absolute",
        // opacity: 0.3
      }} />
    </div>
  </div>
  </div>
}