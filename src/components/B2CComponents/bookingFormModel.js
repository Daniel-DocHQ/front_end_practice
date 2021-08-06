import COUNTRIES from "../../helpers/countries";

const bookingFormModel = {
    formInitialValues: {
        numberOfPeople: 1,
        product: 0,
        testType: {},
        city: undefined,
        timezone: undefined,
        bookingUsers: [],
        travelDate: new Date(),
        travelTime: new Date(),
        passengers: [
            {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                countryCode: COUNTRIES.find(({ country }) => country === 'United Kingdom'),
                dateOfBirth: null,
                ethnicity: '',
                sex: '',
                passportNumber: '',
                fillWithBookingUser: '',
                passportNumberConfirmation: '',
            },
        ],
        tocAccept: false,
        appointmentDate: new Date(),
        selectedSlot: null,
        landingDate: new Date(),
        landingTime: new Date(),
        transportNumber: '',
        transportType: 'Flight',
        vaccineStatus: '',
        vaccineNumber: '',
        vaccineTypeName: '',
        vaccineType: '',
        purchaseCode: '',
    },
    formField: {
        fillWithBookingUser: {
            name: 'fillWithBookingUser',
            label: 'Fill with passenger details',
            id: 'fill-with-booking-user',
            type: 'text',
        },
        postalCode: {
            name: 'postal_code',
            label: 'Postal Code',
            id: 'postal-code',
            required: true,
            type: 'text',
        },
        streetAddress: {
            name: 'street_address',
            label: 'Address 1',
            id: 'street_address',
            required: true,
            type: 'text',
        },
        extendedAddress: {
            name: 'extended_address',
            label: 'Address 2',
            id: 'extended_address',
            type: 'text',
        },
        locality: {
            name: 'locality',
            label: 'City',
            id: 'locality',
            required: true,
            type: 'text',
        },
        region: {
            name: 'region',
            label: 'County',
            id: 'region',
            required: true,
            type: 'text',
        },
        purchaseCode: {
            name: 'purchaseCode',
            label: 'Purchase Code',
            id: 'purchase-code',
            antigenPlaceholder: 'ANT000',
            pcrPlaceholder: 'PCR000',
            required: true,
            type: 'text',
        },
        numberOfPeople: {
            name: 'numberOfPeople',
            label: 'Number of People',
            id: 'number-of-people',
            type: 'number',
            required: true,
        },
        product: {
            name: 'product',
            label: 'Select the test you are booking for',
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
            label: 'Select Departure Date',
            placeholder: 'DD/MM/YYYY',
            required: true,
        },
        travelTime: {
            name: 'travelTime',
            label: 'Select Departure Time',
            placeholder: '00:00 AM/PM',
            required: true,
        },
        landingDate: {
            name: 'landingDate',
            label: 'Select Landing Date',
            placeholder: 'DD/MM/YYYY',
            required: true,
        },
        tocAccept: {
            name: 'tocAccept',
            required: true,
        },
        landingTime: {
            name: 'landingTime',
            label: 'Select Landing Time',
            placeholder: '00:00 AM/PM',
            required: true,
        },
        transportType: {
            name: 'transportType',
            label: 'Transport Type',
            id: 'transport-type',
            type: 'text',
            required: true,
        },
        transportNumber: {
            name: 'transportNumber',
            label: 'Transport Number',
            placeholder: 'E.g.: EY402',
            id: 'flight-number',
            type: 'text',
            required: true,
        },
        vaccineStatus: {
            name: 'vaccineStatus',
            label: 'Vaccine Status',
            id: 'vaccine-status',
            type: 'text',
            required: true,
        },
        vaccineTypeName: {
            name: 'vaccineTypeName',
            label: 'Vaccine Name',
            id: 'vaccine-name',
            type: 'text',
            required: true,
        },
        vaccineNumber: {
            name: 'vaccineNumber',
            label: 'How many doses of vaccine did you have?',
            id: 'vaccine-number',
            type: 'text',
            required: true,
        },
        vaccineType: {
            name: 'vaccineType',
            label: 'Vaccine Type',
            id: 'vaccine-type',
            type: 'text',
            required: true,
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
            emptyLabel: 'dd/mm/yyyy',
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
            label: 'Passport/Travel ID document',
            id: 'passport-number',
            type: 'text',
            required: true,
        },
        passportNumberConfirmation: {
            name: 'passportNumberConfirmation',
            label: 'Passport/Travel ID document Confirmation',
            id: 'passport-number-confirmation',
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
