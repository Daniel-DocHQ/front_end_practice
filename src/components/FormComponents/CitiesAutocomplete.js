import React from 'react';
import { usePlacesWidget } from "react-google-autocomplete";
import Input from './Input';

const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

const CitiesAutocomplete = ({ onPlaceSelected, ...restProps }) => {
    const { ref } = usePlacesWidget({
        apiKey,
        onPlaceSelected,
        options: {
          types: '[(cities)]',
          fields: '[name]',
        },
        language: 'en',
      });

    return <Input inputRef={ref} style={{ width: "90%" }} {...restProps} />;
}

export default CitiesAutocomplete;
