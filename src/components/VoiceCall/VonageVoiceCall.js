import React from 'react';
import PhoneIcon from '@material-ui/icons/Phone';
import { IconButton } from '@material-ui/core';
import parsePhoneNumber from 'libphonenumber-js'
import DocButton from '../DocButton/DocButton';
import DocModal from '../DocModal/DocModal';

const VonageVoiceCall = ({
  app,
  call,
  setCall,
  phoneNumber,
  isTable = false,
}) => {
  const parsedPhoneNumber = !!phoneNumber && parsePhoneNumber(phoneNumber);
  const formattedPhoneNumber = !!parsedPhoneNumber && `${parsedPhoneNumber.countryCallingCode}${parsedPhoneNumber.nationalNumber}`;

  return (
    <div className='row space-between no-margin'>
      {!isTable && (
        <p style={{ minWidth: 'max-content' }} className='tab-row-text title-info no-margin'>Phone No Client:</p>
      )}
      <div className="row flex-end no-margin">
        {isTable ? (
          !!app && !!formattedPhoneNumber && (
            <DocButton
              text="Call"
              style={{ minWidth: 60, padding: 0, height: 30, }}
              color="green"
              onClick={(event) => {
                event.preventDefault();
                try {
                  app.callServer(formattedPhoneNumber);
                } catch (error) {
                  console.log(error)
                }
              }}
            />
          )
        ) : (
          <>
            <p className='no-margin'>{phoneNumber}</p>
              {!!app && !!formattedPhoneNumber && (
                <IconButton
                  style={{ padding: 5 }}
                  onClick={(event) => {
                    event.preventDefault();
                    try {
                      app.callServer(formattedPhoneNumber);
                    } catch (error) {
                      console.log(error)
                    }
                  }}
                >
                  <PhoneIcon fontSize="small" className="green-text" />
                </IconButton>
              )}
          </>
        )}
      </div>
      {!!call && !!call.status && (
        <DocModal
          isVisible={true}
          title={`Calling to ${phoneNumber}`}
          content={
              <div className="row space-between" style={{ width: '100%' }}>
                <div>
                  <p>Call status: {call.status}</p>
                </div>
                <DocButton
                    color='pink'
                    text='Hang up'
                    onClick={() => {
                        call.hangUp().catch((error) => console.log(error));
                        setCall();
                    }}
                />
              </div>
          }
        />
      )}
    </div>
  );
};

export default VonageVoiceCall;