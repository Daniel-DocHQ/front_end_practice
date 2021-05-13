import * as Yup from 'yup';
import bookingFormModel from './bookingFormModel';

const {
  formField: {
    antigenTest,
    pcrTest,
    travelDate,
    travelTime,
    selectedSlot,
    city,
  }
} = bookingFormModel;

export default [
  Yup.object().shape({
    [antigenTest.name]: Yup.number().required('Input number of kits').min(1, 'Minimum 1 number of kits').max(4, 'Maximum 4 people per appointment'),
    [pcrTest.name]: Yup.number().required('Input number of kits').min(0, 'Minimum 0 number of kits').max(15, 'You can\'t order more than 15'),
  }),
  Yup.object().shape({
    [city.name]: Yup.object().shape({
      timezone: Yup.string(),
    }).required('Select city'),
    [travelDate.name]: Yup.date(),
    [travelTime.name]: Yup.date(),
  }),
  Yup.object().shape(),
  Yup.object().shape({
    [selectedSlot.name]: Yup.object().typeError('You should select appointment time').shape({
      id: Yup.string().required(),
      end_time: Yup.string().required(),
      start_time: Yup.string().required(),
    }).required('You should select appointment time'),
  }),
  Yup.object().shape(),
  Yup.object().shape(),
];