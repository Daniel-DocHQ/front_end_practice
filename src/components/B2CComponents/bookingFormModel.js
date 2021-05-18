import COUNTRIES from "../../helpers/countries";

const bookingFormModel = {
    formInitialValues: {
        numberOfPeople: 1,
        product: 0,
        testType: {},
        city: '',
        timezone: '',
        travelDate: new Date(),
        travelTime: new Date(),
        passengers: [
            {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                countryCode: COUNTRIES.find(({ country }) => country === 'United Kingdom'),
                dateOfBirth: '',
                ethnicity: '',
                sex: 'Female',
                passportNumber: '',
            },
        ],
        appointmentDate: new Date(),
        selectedSlot: null,
    },
    formField: {
        numberOfPeople: {
            name: 'numberOfPeople',
            label: 'Number of People',
            id: 'number-of-people',
            type: 'number',
            required: true,
        },
        product: {
            name: 'product',
            label: 'Product',
            id: 'product',
            type: 'text',
            required: true,
        },
        countryCode: {
            name: 'Country Code',
            label: 'Choose a country code',
            id: 'country-code',
            type: 'text',
            required: true,
        },
        city: {
            name: 'city',
            label: 'Select Country of Origin',
            id: 'city',
            type: 'text',
            placeholder: 'Select Country of Origin',
            required: true,
        },
        pcrTest: {
            name: 'pcrTest',
            label: 'PCR Tests',
            id: 'pcr-kit',
            type: 'number',
            required: true,
        },
        travelDate: {
            name: 'travelDate',
            label: 'Select Date',
        },
        travelTime: {
            name: 'travelTime',
            label: 'Select Time',
        },
        firstName: {
            name: 'firstName',
            label: 'First Name',
            id: 'first-name',
            type: 'text',
            required: true,
        },
        lastName: {
            name: 'lastName',
            label: 'Last Name',
            id: 'last-name',
            type: 'text',
            required: true,
        },
        email: {
            name: 'email',
            label: 'Email Address',
            id: 'email',
            type: 'email',
            required: true,
        },
        phone: {
            name: 'phone',
            label: 'Phone number',
            id: 'phone',
            type: 'text',
            required: true,
        },
        dateOfBirth: {
            name: 'dateOfBirth',
            label: 'Date Of Birth',
            id: 'date-of-birth',
            placeholder: 'dd/mm/yyyy',
            type: 'text',
            required: true,
        },
        ethnicity: {
            name: 'ethnicity',
            label: 'Ethnicity',
            id: 'ethnicity',
            type: 'text',
            required: true,
        },
        sex: {
            name: 'sex',
            label: 'Sex',
            required: true,
        },
        passportNumber: {
            name: 'passportNumber',
            label: 'Passport Number',
            id: 'passport-number',
            type: 'text',
            required: true,
        },
        appointmentDate: {
            name: 'appointmentDate',
            label: 'Select Date',
        },
        selectedSlot: {
            name: 'selectedSlot',
            label: 'Select Time',
        },
    },
};

export default bookingFormModel;
