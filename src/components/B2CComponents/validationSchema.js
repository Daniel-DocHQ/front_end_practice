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
    selectedSlot,
  }
} = bookingFormModel;

export default [
  Yup.object().shape({
    [antigenTest.name]: Yup.number().required('Input number of kits').min(1, 'Minimum 0 number of kits').max(4, 'You can\'t order more than 4'),
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
      .matches(/^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/, 'Invalid date of birth'),
    [ethnicity.name]: Yup.string().required('Input ethnicity'),
    [sex.name]: Yup.string().required('Select sex'),
    [passportNumber.name]: Yup.string().required('Input passport number'),
  }),
  Yup.object().shape({
    [selectedSlot.name]: Yup.object().typeError('You should select appointment time').shape({
      id: Yup.string().required(),
      end_time: Yup.string().required(),
      start_time: Yup.string().required(),
    }).required('You should select appointment time'),
  }),
];