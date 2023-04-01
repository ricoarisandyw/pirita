// const { createWorker } = require('tesseract.js');
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

export default function App() {
  const [uploadedFile, setUploadedFile] = useState<any>()
  const [result, setResult] = useState('')
  const [progress, setProgress] = useState(0);

  const buildBox = (word: Tesseract.Word, scale = 1) => {
    const text = document.createElement('div')
    Object.assign(text.style, {
      position: 'absolute',
      left: (word.bbox.x0 * scale) + "px",
      top: (word.bbox.y0 * scale) + "px",
      border: "1px solid blue",
      backgroundColor: 'rgba(255,255,255,0.5)',
      fontSize: (word.font_size * scale) + "px",
      // color: 'transparent'
    })
    // text.innerText = word.bbox.x0 + ":" + word.bbox.y0
    text.innerText = word.text
      .replace(/([a-zA-Z])(\d+)/g, '$1 $2 ')
      .replace(/(\d+)([a-zA-Z])/g, '$1 $2 ')
      .replace(/\.|\,/g, '')
      .replace(/(\d)\s+(\d)/g, '$1$2')
    return text
  }

  const recognize = () => {
    const box = document.getElementById('result-box')
    if (box) {
      Object.assign(box, {
        innerHTML: ''
      })
    }
    Tesseract.recognize(
      uploadedFile,
      'eng',
      {
        logger: m => {
          setProgress(m.progress)
        },
      }
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
          if(word.text.length > 1) { // REMOVE NOISE FROM ONE WORD
            const text = buildBox(word, scale);
            document.getElementById('result-box')?.appendChild(text)
          }
        })

        console.log({ data: result.data })
      }
    })
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0)
    if (file) {
      const blob = new Blob([file], { type: file.type });
      const blobUrl = URL.createObjectURL(blob);

      // const newUrl = await FilterUtils.darken(blobUrl)

      setUploadedFile(blobUrl)
    }
  }

  return <div style={{ display: 'flex' }}>
    <div style={{
      padding: '4rem',
      width: '100%',
      display: 'grid'
    }}>
      <img width={500} src="/logo.png" style={{ margin: "0 auto" }} />
      <div>
        <input type="file" onChange={handleChange} />
      </div>
      <div style={{ display: 'flex' }}>
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
          height: '10px',
          width: "300px",
          border: '1px solid black',
          margin: 'auto 10px',
        }}>
          <div style={{
            width: (progress * 100) + "%",
            background: 'pink',
            height: '100%'
          }}></div>
        </div>
      </div>
      <div style={{
        width: '100%',
        display: 'flex',
        gap: '1rem',
        marginTop: '8px'
      }}>
        <img src={uploadedFile} width={500} style={{
          objectFit: 'contain'
          // zIndex: -1,
          // position: "absolute",
          // opacity: 0.3
        }} />
        <div id='result-box' style={{
          position: 'relative',
          height: '100vh',
          border: "1px solid gray",
          flex: '1',
          width: "500px",
        }}>
        </div>
      </div>
    </div>
  </div>
}