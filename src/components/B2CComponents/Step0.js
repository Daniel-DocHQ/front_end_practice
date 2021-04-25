import React from 'react';
import { Field } from 'formik';
import Input from '../FormComponents/Input';
import bookingFormModel from './bookingFormModel';
import './BookingEngine.scss';

const Step0 = () => {
    const {
        formField: {
            antigenTest,
            pcrTest,
        }
    } = bookingFormModel;

	return (
		<React.Fragment>
            <div className='row space-between' style={{ flexWrap: 'wrap', width: '60%' }}>
                <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                    <Field name={antigenTest.name}>
                        {({ field, meta }) => (
                            <Input
                                error={!!meta.error}
                                touched={meta.touched}
                                helperText={(meta.error && meta.touched) && meta.error}
                                {...antigenTest}
                                {...field}
                            />
                        )}
                    </Field>
                </div>
                {/* <div style={{ maxWidth: '40%', minWidth: '320px' }}>
                    <Field name={pcrTest.name}>
                        {({ field, meta }) => (
                            <Input
                                error={!!meta.error}
                                touched={meta.touched}
                                helperText={(meta.error && meta.touched) && meta.error}
                                {...pcrTest}
                                {...field}
                            />
                        )}
                    </Field>
                </div> */}
		    </div>
            <h4 style={{ margin: '0px', marginTop: '10px', textAlign: 'left', width: 'max-content' }}>
                Remember  that children under 18 years can only attend the online video appointment with an adult (18+) present from the same appointment booking.
            </h4>
		</React.Fragment>
	);
};

export default Step0;
