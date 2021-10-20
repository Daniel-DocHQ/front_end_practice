import React, { useState, useRef } from 'react'
import QrReader from 'react-qr-scanner'
import DocButton from '../DocButton/DocButton';

const QrCodeReader = ({ handleResult }) => {
  const [result, setResult] = useState();
  const [scan, setScan] = useState(false);
  const qrCodeReader = useRef(null);

  const previewStyle = {
    height: 240,
    width: 320,
  }

  return (
    <div>
      {scan ? (
        <>
          <QrReader
            ref={qrCodeReader}
            delay={100}
            style={previewStyle}
            facingMode="rear"
            chooseDeviceId={1}
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
          {(!!qrCodeReader && !!qrCodeReader.current) && (
            <div className="row">
              <DocButton color="green" onClick={() => qrCodeReader.current.openImageDialog()} text="Submit a QR Code"/>
            </div>
          )}
        </>
      ) : (
        <DocButton text="Scan QR" onClick={() => setScan(true)} color="green"/>
      )}
    </div>
  );
}

export default QrCodeReader;
