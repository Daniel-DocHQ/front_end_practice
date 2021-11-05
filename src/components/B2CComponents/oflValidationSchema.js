import * as Yup from 'yup';
import { DAY_2_ANTIGEN, DAY_2_ANTIGEN_US, FIT_TO_FLY_ANTIGEN } from '../../helpers/productsWithAdditionalInfo';
import adminService from '../../services/adminService';
import bookingFormModel from './bookingFormModel';

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

const checkPurchaseCodeInfo = async (value) => {
  const err = await adminService.checkPurchaseCodeInfo(value)
    .then(result => {
      if (result.success && result.data && result.data.value) {
        if (!!result.data.uses) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }).catch((error) => false);
  return err;
}

const useOflValidationSchema = (activeStep) => (
  [
    Yup.object().shape({
      [product.name]: Yup.string().required('Select test kit to book appointment'),
      [numberOfPeople.name]: Yup.number().required('Input number of people').min(1, 'Minimum 1 person for appointment').max(4, 'Maximum 4 people per appointment'),
      [purchaseCode.name]: Yup.array()
        .of(
        Yup.object().shape({
          code: Yup.string().required('Input your code')
            .test(
              {
                name: 'checkCodeF2F',
                exclusive: false,
                params: { },
                message: 'Invalid code. This code is not a Fit to Fly code. Please enter a code starting with F2F.',
                test: function (value, ctx) {
                  const [patent1, patent2] = ctx.from;
                  const regex = new RegExp(/^(F2F)[A-Z, 0-9]*/);
                  return (!!value && patent2.value.product === FIT_TO_FLY_ANTIGEN) ? regex.test(value) : true;
                },
              },
            )
            .test(
              {
                name: 'checkCodeD2T',
                exclusive: false,
                params: { },
                message: 'Invalid code. This code is not a Fit to Fly code. Please enter a code starting with D2T or D2D.',
                test: function (value, ctx) {
                  const [patent1, patent2] = ctx.from;
                  const regex = new RegExp(/^(D2T|D2D)[A-Z, 0-9]*/);
                  return (!!value && patent2.value.product === DAY_2_ANTIGEN) ? regex.test(value) : true;
                },
              },
            )
            .test(
              {
                name: 'checkCodeUS2',
                exclusive: false,
                params: { },
                message: 'Invalid code. This code is not a Fit to Fly code. Please enter a code starting with US2.',
                test: function (value, ctx) {
                  const [patent1, patent2] = ctx.from;
                  const regex = new RegExp(/^(US2)[A-Z, 0-9]*/);
                  return (!!value && patent2.value.product === DAY_2_ANTIGEN_US) ? regex.test(value) : true;
                },
              },
            )
            .test('checkCodeBE', 'Your code is invalid',
              function checkCodeBE(value) {
              return !!value ? checkPurchaseCodeInfo(value) : true;
            }),
        })).min(1, 'Minimum 1 person'),
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
    Yup.object().shape({
      [tocAccept.name]: Yup.boolean().test('accept', 'You must accept this acknowledge',
      function accept(value) {
        return value;
      }),
    }),
    Yup.object().shape(),
  ][activeStep]
);

export default useOflValidationSchema;
