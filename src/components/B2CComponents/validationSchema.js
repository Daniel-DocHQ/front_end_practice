import * as Yup from 'yup';
import bookingFormModel from './bookingFormModel';

const {
  formField: {
    numberOfPeople,
    product,
    travelDate,
    travelTime,
    selectedSlot,
    city,
  }
} = bookingFormModel;

export default [
  Yup.object().shape({
    [product.name]: Yup.number().required('Select test kit to book appointment'),
    [numberOfPeople.name]: Yup.number().required('Input number of people').min(1, 'Minimum 1 person for appointment').max(4, 'Maximum 4 people per appointment')
    // .test('maximum', 'You can\'t have more people that quantity of test that you bought',
    // function checkNumberOfPeople(value) {
    //   const { testType } = this.parent;
    //   return value <= testType.quantity;
    // }),
  }),
  Yup.object().shape({
    [city.name]: Yup.object().shape({
      timezone: Yup.string(),
    }).required('Select city'),
    [travelDate.name]: Yup.date(),
    [travelTime.name]: Yup.date(),
  }),
  Yup.object().shape({
    [selectedSlot.name]: Yup.object().typeError('You should select appointment time').shape({
      id: Yup.string().required(),
      end_time: Yup.string().required(),
      start_time: Yup.string().required(),
    }).required('You should select appointment time'),
  }),
  Yup.object().shape(),
  Yup.object().shape(),
  Yup.object().shape(),
];
