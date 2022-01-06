import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { ToastsStore } from 'react-toasts';
import adminService from '../../services/adminService';
import CountryForm from '../../components/SAComponents/CountryForm';
import CountriesAppBar from '../../components/SAComponents/CountriesAppBar';
import BigWhiteContainer from '../../components/Containers/BigWhiteContainer';

const CreateCountry = ({ token}) => {
	const [status, setStatus] = useState(); // { severity, message }

	return (
		<CountriesAppBar value={1}>
            <BigWhiteContainer>
                <Formik
                    initialValues={{
                        name: '',
                        address_5: '',
                        email: '',
                        prohibited_schedule: '',
                        prohibited_schedule_narcotics: [],
                        prohibited_schedule_psychotropics: [],
                        recommendations: [],
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
                        await adminService.createCountry(token, {
                            NCA_address: {
                                address_5,
                                email,
                            },
                            ...restValues
                        }).then((response) => {
                            if (response.success) {
                                setStatus({ severity: 'success', message: 'Country has been created successfully.' });
                            } else {
                                ToastsStore.error(response.error);
                                setStatus({ severity: 'error', message: response.error });
                            }
                        })
                        .catch((err) => setStatus({ severity: 'error', message: err.error }));
                    }}
                >
                    <CountryForm isEdit status={status} />
                </Formik>
            </BigWhiteContainer>
		</CountriesAppBar>
	);
};

export default CreateCountry;
