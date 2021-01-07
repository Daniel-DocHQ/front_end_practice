import React, { useState, useEffect } from 'react';
import DocButton from '../DocButton/DocButton';
import TextInputElement from '../FormComponents/TextInputElement';
import './ShippingDetails.scss';

const ShippingDetails = ({ initialData, update }) => {
	const [first_name, setFirst_name] = useState('');
	const [last_name, setLast_name] = useState('');
	const [street_address, setStreet_address] = useState('');
	const [extended_address, setExtended_address] = useState('');
	const [locality, setLocality] = useState('');
	const [region, setRegion] = useState('');
	const [postal_code, setPostal_code] = useState('');
	const [isModified, setIsModified] = useState(false);
	useEffect(() => {
		update({
			first_name,
			last_name,
			street_address,
			extended_address,
			locality,
			region,
			postal_code,
		});
		checkModified();
	}, [first_name, last_name, street_address, locality, region, postal_code]);
	useEffect(() => {
		if (typeof initialData !== 'undefined') {
			if (typeof initialData.first_name !== 'undefined') setFirst_name(initialData.first_name);
			if (typeof initialData.last_name !== 'undefined') setLast_name(initialData.last_name);
			if (typeof initialData.street_address !== 'undefined')
				setStreet_address(initialData.street_address);
			if (typeof initialData.extended_address !== 'undefined')
				setExtended_address(initialData.extended_address);
			if (typeof initialData.locality !== 'undefined') setLocality(initialData.locality);
			if (typeof initialData.region !== 'undefined') setRegion(initialData.region);
			if (typeof initialData.postal_code !== 'undefined') setPostal_code(initialData.postal_code);
		}
	});

	function checkModified() {
		if (typeof initialData !== 'undefined') {
			let modified = false;
			if (
				typeof initialData.first_name !== 'undefined' &&
				initialData.first_name.toLowerCase() !== first_name.toLowerCase()
			)
				modified = true;
			if (
				typeof initialData.last_name !== 'undefined' &&
				initialData.last_name.toLowerCase() !== last_name.toLowerCase()
			)
				modified = true;
			if (
				typeof initialData.street_address !== 'undefined' &&
				initialData.street_address.toLowerCase() !== street_address.toLowerCase()
			)
				modified = true;
			if (
				typeof initialData.extended_address !== 'undefined' &&
				initialData.extended_address.toLowerCase() !== extended_address.toLowerCase()
			)
				modified = true;
			if (
				typeof initialData.locality !== 'undefined' &&
				initialData.locality.toLowerCase() !== locality.toLowerCase()
			)
				modified = true;
			if (
				typeof initialData.region !== 'undefined' &&
				initialData.region.toLowerCase() !== region.toLowerCase()
			)
				modified = true;
			if (
				typeof initialData.postal_code !== 'undefined' &&
				initialData.postal_code.toLowerCase() !== postal_code.toLowerCase()
			)
				modified = true;

			if (modified !== isModified) {
				setIsModified(modified);
			}
		}
	}
	return (
		<React.Fragment>
			<div className='shipping-address-details' aria-label='Shipping address form section'>
				<React.Fragment>
					<div className='row'>
						<h4>Personal Details</h4>
					</div>
					<div className='row'>
						<TextInputElement
							value={first_name}
							id='shipping-first_name'
							label='First Name'
							onChange={setFirst_name}
							autoComplete='given-name'
							pattern={new RegExp(/^[a-zA-Z ]+$/)}
							inputProps={{ minLength: '2' }}
							required={true}
						/>
					</div>
					<div className='row'>
						<TextInputElement
							value={last_name}
							id='shipping-last_name'
							label='Last Name'
							onChange={setLast_name}
							autoComplete='family-name'
							pattern={new RegExp(/^[a-zA-Z ]+$/)}
							required={true}
						/>
					</div>
					<div className='row'>
						<h4>Shipping Address</h4>
					</div>
					<div className='row'>
						<TextInputElement
							value={street_address}
							id='shipping-street_address'
							label='Address Line 1'
							onChange={setStreet_address}
							autoComplete='shipping address-line1'
							pattern={new RegExp(/^[a-zA-Z0-9 ]+$/)}
							inputProps={{ minLength: '1' }}
							required={true}
						/>
					</div>
					<div className='row'>
						<TextInputElement
							value={locality}
							id='shipping-locality'
							label='Town'
							onChange={setLocality}
							autoComplete='shipping locality'
							pattern={new RegExp(/^[A-Za-z ]+$/)}
							inputProps={{ minLength: '3' }}
							required={true}
						/>
					</div>
					<div className='row'>
						<TextInputElement
							value={region}
							id='shipping-region'
							label='County'
							onChange={setRegion}
							autoComplete='shipping region'
							pattern={new RegExp(/[a-zA-Z ]+$/)}
							inputProps={{ minLength: '3' }}
							required={true}
						/>
					</div>

					<div className='row'>
						<TextInputElement
							value={postal_code}
							id='shipping-postcode'
							label='Postcode'
							onChange={setPostal_code}
							autoComplete='shipping postal_code'
							pattern={
								new RegExp(
									/([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/
								)
							}
							inputProps={{ maxLength: '8' }}
							required={true}
						/>
					</div>
					{isModified && (
						<div className='row'>
							<DocButton
								text='Save Changes'
								color='green'
								onClick={() => console.log('update me')}
							/>
						</div>
					)}
				</React.Fragment>
			</div>
		</React.Fragment>
	);
};

export default ShippingDetails;
