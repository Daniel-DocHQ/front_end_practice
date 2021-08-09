import * as Yup from 'yup';
import { FIT_TO_FLY_ANTIGEN } from '../../helpers/productsWithAdditionalInfo';
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

const useLufthansaValidationSchema = (activeStep) => (
  [
    Yup.object().shape({
        [city.name]: Yup.object().shape({
          timezone: Yup.string(),
        }).required('Select city'),
        [travelDate.name]: Yup.date(),
        [travelTime.name]: Yup.date(),
      }),
    Yup.object().shape({
        [purchaseCode.name]: Yup.array()
            .of(
            Yup.object().shape({
                code: Yup.string().required('Input your code')
                    .test('checkCode', 'Invalid code. You have chosen another test type',
                        function checkCode(value) {
                            const { product } = this.parent;
                            return !!value ? product === FIT_TO_FLY_ANTIGEN ? String(value).match(/^(EANT|EAIR)*/) : String(value).match(/^(EPCR)*/) : true;
                        }
                    )
                    .test('checkCodeBE', 'Your code is invalid',
                        function checkCodeBE(value) {
                        return !!value ? checkPurchaseCodeInfo(value) : true;
                    }),
            }))
            .min(1, 'Minimum 1 person'),
        [product.name]: Yup.string().required('Select test kit to book appointment'),
        [numberOfPeople.name]: Yup.number().required('Input number of people').min(1, 'Minimum 1 person for appointment').max(4, 'Maximum 4 people per appointment')
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

export default useLufthansaValidationSchema;
