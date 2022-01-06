import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { ToastsStore } from 'react-toasts';
import adminService from '../../services/adminService';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';
import DrugForm from '../../components/SAComponents/DrugForm';
import DrugsAppBar from '../../components/SAComponents/DrugsAppBar';

const CreateDrug = ({ token}) => {
	const [status, setStatus] = useState(); // { severity, message }

	return (
		<DrugsAppBar value={1}>
            <BigWhiteContainer>
                <Formik
                    initialValues={{
                        name: '',
                        base_component: '',
                        type: '',
                        class: '',
                        show_in_autocomplete: false,
                    }}
                    validationSchema={Yup.object().shape({
                        name: Yup.string().required('Input name'),
                        type: Yup.string().required('Input type'),
                        class: Yup.number().required('Input class'),
                        base_component: Yup.string().required('Input Base Component'),
                    })}
                    onSubmit={async (values) => {
                        await adminService.createDrug(token, {
                            ...values,
                        }).then((response) => {
                            if (response.success) {
                                setStatus({ severity: 'success', message: 'Drug has been successfully created.' });
                            } else {
                                ToastsStore.error(response.error);
                                setStatus({ severity: 'error', message: response.error });
                            }
                        })
                        .catch((err) => setStatus({ severity: 'error', message: err.error }));
                    }}
                >
                    <DrugForm isEdit status={status} />
                </Formik>
            </BigWhiteContainer>
		</DrugsAppBar>
	);
};

export default CreateDrug;
