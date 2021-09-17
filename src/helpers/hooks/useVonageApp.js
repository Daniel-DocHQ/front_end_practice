import { useEffect, useState } from 'react';
import { get } from 'lodash';
import nexmoClient from 'nexmo-client';
import { ToastsStore } from 'react-toasts';
import adminService from '../../services/adminService';
import getRandomIntFromRange from '../getRandomIntFromRange';

const getToken = async (userName) => (
    await adminService
      .getIvrToken(userName)
      .catch((err) => ToastsStore.error(err.error))
);

const useVonageApp = (userName = 'Practitioner') => {
    const [app, setApp] = useState(null);
	const [call, setCall] = useState();

    useEffect(() => {
        (async () => {
            const response = await getToken(`${userName}${getRandomIntFromRange(0, 10)}`);
            new nexmoClient({ debug: true })
                .login(get(response, 'token', ''))
                .then(app => {
                    setApp(app);
                    app.on("call:status:changed",(call) => {
                    setCall(call);
                    });
                }).catch((error) => console.log(error));
        })();
    }, []);

    return ({
        app,
        call,
        setCall,
    });
};

export default useVonageApp;
