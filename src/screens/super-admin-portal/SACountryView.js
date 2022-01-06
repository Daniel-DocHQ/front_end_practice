import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useParams } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import CountryForm from '../../components/SAComponents/CountryForm';

const SACountryView = ({ token }) => {
    const { id } = useParams();
    const [status, setStatus] = useState();
    const [country, setCountry] = useState();
	const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

	const getCountry = async () => {
        setIsLoading(true);
		await adminService
			.getCountry(token, id)
			.then(data => {
				if (data.success) {
					setCountry(data.country);
				} else {
					ToastsStore.error(data.error);
				}
			})
			.catch(err => ToastsStore.error(err.err));
        setIsLoading(false);
    };

    useEffect(() => {
		if (!country) {
			getCountry();
		}
	}, []);

    if (isLoading || !country) {
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
                    ...country,
                    ...country.NCA_address,
                }}
                validationSchema={Yup.object().shape({
                    name: Yup.string().required('Input name'),
                    address_5: Yup.string().required('Input address'),
                    prohibited_schedule: Yup.number().required('Input Prohibited Schedule'),
                    email: Yup.string().email().required('Input email'),
                    prohibited_schedule_narcotics: Yup.array().of(Yup.number().required()),
                    prohibited_schedule_psychotropics: Yup.array().of(Yup.number().required()),
                    recommendations: Yup.array().of(Yup.object().shape({
                        recommendation: Yup.string().required('Input Recommendation'),
                    })),
                })}
                onSubmit={async (values) => {
                    const {
                        address_5,
                        email,
                        ...restValues
                    } = values;
                    await adminService.editCountry(token, id, {
                        NCA_address: {
                            address_5,
                            email,
                        },
                        ...restValues
                    }).then((response) => {
                        if (response.success) {
                            setStatus({ severity: 'success', message: 'Country has been successfully edited.' });
                        } else {
                            ToastsStore.error(response.error);
                            setStatus({ severity: 'error', message: response.error });
                        }
                    })
                    .catch((err) => setStatus({ severity: 'error', message: err.error }));
                }}
            >
				<CountryForm isView isEdit={isEdit} setIsEdit={setIsEdit} status={status} />
			</Formik>
		</BigWhiteContainer>
	);
};

export default SACountryView;
