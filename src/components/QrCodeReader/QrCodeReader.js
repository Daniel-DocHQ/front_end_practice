import React, { useState } from 'react'
import QrReader from 'react-qr-scanner'
import DocButton from '../DocButton/DocButton';

const QrCodeReader = ({ handleResult }) => {
  const [result, setResult] = useState();
  const [scan, setScan] = useState(false);

  const previewStyle = {
    height: 240,
    width: 320,
  }

  return (
    <div>
      {scan ? (
        <QrReader
          delay={100}
          style={previewStyle}
          facingMode="rear"
          legacyMode
          onError={(err) => console.error(err)}
          onScan={(data) => {
            if (!!data) {
              const { text } = data;
              setResult(text);
              handleResult(text);
              setScan(false);
            }
          }}
        />
      ) : (
        <DocButton text="Scan QR" onClick={() => setScan(true)} color="green"/>
      )}
    </div>
  );
}

export default QrCodeReader;
