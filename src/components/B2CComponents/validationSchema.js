import * as Yup from 'yup';
import bookingFormModel from './bookingFormModel';

const {
  formField: {
    antigenTest,
    pcrTest,
    travelDate,
    travelTime,
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    ethnicity,
    sex,
    passportNumber,
    appointmentDate,
    selectedSlot,
  }
} = bookingFormModel;

export default [
  Yup.object().shape({
    [antigenTest.name]: Yup.number().required('Input number of kits').min(0, 'Minimum 0 number of kits').max(15, 'You can\'t order more than 15'),
    [pcrTest.name]: Yup.number().required('Input number of kits').min(0, 'Minimum 0 number of kits').max(15, 'You can\'t order more than 15'),
  }),
  Yup.object().shape({
    [travelDate.name]: Yup.date(),
    [travelTime.name]: Yup.date(),
  }),
  Yup.object().shape({
    [firstName.name]: Yup.string().required('Input first name'),
    [lastName.name]: Yup.string().required('Input last name'),
    [email.name]: Yup.string().email('Email not valid').required('Input email'),
    [phone.name]: Yup.string().required('Input phone').min(5, 'Invalid phone number'),
    [dateOfBirth.name]: Yup.string()
        .required('Input date of birth')
        .matches(/^[0-3][1-9]\/[0-1][0-9]\/[0-9][0-9][0-9][0-9]$/, 'Invalid date of birth'),
    [ethnicity.name]: Yup.string().required('Input ethnicity'),
    [sex.name]: Yup.string().required('Select sex'),
    [passportNumber.name]: Yup.string().required('Input passport number'),
  }),
  Yup.object().shape({
    [appointmentDate.name]: Yup.date(),
    [selectedSlot.name]: Yup.date(),
  }),
];