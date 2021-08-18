import { useEffect, useState } from 'react';
import nexmoClient from 'nexmo-client';
import { ToastsStore } from 'react-toasts';
import adminService from '../../services/adminService';

const getToken = async (userName) => (
    await adminService
      .getIvrToken(userName)
      .catch((err) => ToastsStore.error(err.error))
);

const useVonageApp = (userName = 'Practitioner1') => {
    const [app, setApp] = useState(null);
	const [call, setCall] = useState();

    useEffect(() => {
        (async () => {
            const { token } = await getToken(userName);
            new nexmoClient({ debug: true })
            .login(token)
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
