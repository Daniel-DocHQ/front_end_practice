import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useParams } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import DrugForm from '../../components/SAComponents/DrugForm';

const SADrugView = ({ token }) => {
    const { id } = useParams();
    const [drug, setDrug] = useState();
    const [status, setStatus] = useState();
	const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

	const getDrug = async () => {
        setIsLoading(true);
		await adminService
			.getDrug(token, id)
			.then(data => {
				if (data.success) {
					setDrug(data.drug);
				} else {
					ToastsStore.error(data.error);
				}
			})
			.catch(err => ToastsStore.error(err.err));
        setIsLoading(false);
    };

    useEffect(() => {
		if (!drug) {
			getDrug();
		}
	}, []);

    if (isLoading) {
		return (
			<BigWhiteContainer>
				<div className='row center'>
					<LoadingSpinner />
				</div>
			</BigWhiteContainer>
		);
	}

	return (
		<BigWhiteContainer>
            <Formik
                initialValues={{
                    ...drug,
                }}
                validationSchema={Yup.object().shape({
                    name: Yup.string().required('Input name'),
                    type: Yup.string().required('Input type'),
                    class: Yup.number().required('Input class'),
                    base_component: Yup.string().required('Input Base Component'),
                })}
                onSubmit={async (values) => {
                    await adminService.editDrug(token, id, {
                        ...values,
                    }).then((response) => {
                        if (response.success) {
                            setStatus({ severity: 'success', message: 'Drug has been successfully edited.' });
                        } else {
                            ToastsStore.error(response.error);
                            setStatus({ severity: 'error', message: response.error });
                        }
                    })
                    .catch((err) => setStatus({ severity: 'error', message: err.error }));
                }}
            >
				<DrugForm isView isEdit={isEdit} setIsEdit={setIsEdit} status={status} />
			</Formik>
		</BigWhiteContainer>
	);
};

export default SADrugView;
