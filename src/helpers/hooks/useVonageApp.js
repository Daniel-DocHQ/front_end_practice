import { useEffect, useState } from 'react';
import nexmoClient from 'nexmo-client';
import { ToastsStore } from 'react-toasts';
import adminService from '../../services/adminService';

const getToken = async () => (
    await adminService
      .getIvrToken('Practitioner1')
      .catch((err) => ToastsStore.error(err.error))
);

const useVonageApp = () => {
    const [app, setApp] = useState(null);
	const [call, setCall] = useState();

    useEffect(() => {
        (async () => {
            const { token } = await getToken();
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
