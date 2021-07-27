import * as Yup from 'yup';
import bookingFormModel from './bookingFormModel';
import {
	VIDEO_CONSULTATION_PRODUCTS
} from '../../helpers/productsWithAdditionalInfo';

const {
  formField: {
    numberOfPeople,
    product,
    travelDate,
    travelTime,
    selectedSlot,
    city,
    tocAccept,
    purchaseCode,
  }
} = bookingFormModel;

const useValidationSchema = (activeStep, isBookingSkip = false, isPharmacy = false) => (
  [
    Yup.object().shape({
      ...(isPharmacy ? {
        [purchaseCode.name]: Yup.string().required('Input your code').matches(new RegExp(/^(ANT|PFF|ATE)-[0-9]*/), 'Invalid code'),
      } : {
        [product.name]: Yup.number().required('Select test kit to book appointment'),
        [numberOfPeople.name]: Yup.number().required('Input number of people').min(1, 'Minimum 1 person for appointment').max(4, 'Maximum 4 people per appointment')
        .test('maximum', 'You can\'t book more people than the quantity of test that you have bought',
          function checkNumberOfPeople(value) {
            const { testType } = this.parent;
            return VIDEO_CONSULTATION_PRODUCTS.includes(testType.sku) ? true : value <= testType.quantity;
          }),
      }),
    }),
    Yup.object().shape({
      [city.name]: Yup.object().shape({
        timezone: Yup.string(),
      }).required('Select city'),
      [travelDate.name]: Yup.date(),
      [travelTime.name]: Yup.date(),
    }),
    ...(isBookingSkip ? [] : [
      Yup.object().shape({
        [selectedSlot.name]: Yup.object().typeError('You should select appointment time').shape({
          id: Yup.string().required(),
          end_time: Yup.string().required(),
          start_time: Yup.string().required(),
        }).required('You should select appointment time'),
      })
    ]),
    Yup.object().shape(),
    Yup.object().shape({
      [tocAccept.name]: Yup.boolean().test('accept', 'You must accept this acknowledge',
      function accept(value) {
        return value;
      }),
    }),
    Yup.object().shape(),
  ][activeStep]
);

export default useValidationSchema ;
