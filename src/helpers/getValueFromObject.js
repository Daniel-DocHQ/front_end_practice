const getValueFromObject = (obj, value, defaultValue = null) => (
    !!obj && !!obj[value] ? obj[value] : defaultValue
);

export default getValueFromObject;
