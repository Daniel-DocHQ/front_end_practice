import React, { useState, useEffect } from 'react';
import { bookingSvc } from '../services/booking';
import { format } from 'date-fns';
import { Button } from '@material-ui/core';

export default function Finish({ stepData, setStepData, handleBack }) {
	const [isProcessing, setProcessing] = useState(true);
	const [errors, setErrors] = useState(null);
	const [booking, setResult] = useState(null);

	const fromStepData = data => {
		let request = {};

		for (let step in data) {
			request = Object.assign(request, data[step].data);
		}

		return request;
	};

	useEffect(() => {
		const data = fromStepData(stepData);
		const paymentInfo = {
			amount: data.price,
			card: {
				number: data.card_number ? data.card_number : '41111111111111111',
				expiration_date: data.expiry ? data.expiry : '11/22',
				cvv: data.cvv ? data.cvv : '111',
			},
			billing_details: {
				first_name: data.first_name,
				last_name: data.last_name,
				dateOfBirth: format(new Date(data.dateOfBirth ? data.dateOfBirth : null), 'dd-MM-yyyy'),
				email: data.email,
				phone: data.telephone,
				company: '',
				street_address: data.billing_street,
				extended_address: '',
				locality: data.billing_locality,
				region: data.billing_region,
				postal_code: data.billing_postcode,
			},
			toc_accept: true,
			marketing_accept: !!data.subscription,
			discount_code: data.discount_code ? data.discount_code : '',
		};

		(async () => {
			const result = await bookingSvc.paymentRequest(data.appointment, paymentInfo);
			if (result && result.error) {
				setErrors(result.error);
				setStepData('finish', {
					data: { error: result.error },
					fields: ['error'],
				});
			} else {
				setResult(result);
				if (window.$ != null) {
					window.SCREEN_STATE = '';
					window
						.$('.dochq-submit.dochq-back-alt')
						.text('back to start button')
						.click(function(event) {
							window.location.reload();
						});

					try {
						var sale = window.PostAffTracker.createSale();
						sale.setTotalCost(result.paid);
						sale.setOrderID(result.id);
						sale.setProductID('vaccination1');
						window.PostAffTracker.register();

						console.log('PostAffTracker', sale, {
							totalCost: result.paid,
							orderID: result.id,
						});
					} catch (ex) {
						console.log('PostAffTracker', 'failed to create sale. possible adblock');
					}
				}
			}
			setProcessing(false);
		})();
	}, []);

	if (isProcessing) {
		return (
			<div className='finish'>
				<h1>Processing booking ....</h1>
			</div>
		);
	} else {
		if (!errors) {
			const data = fromStepData(stepData);
			const saleAmount = data.price;
			const body = document.getElementsByTagName('body')[0];
			const awinRegex = new RegExp(/^https\:\/\/(www.)?([dochq]+).*$/);
			if (awinRegex.test(window.location.href)) {
				// Mandatory fallback
				const awinTrackingPixel = document.createElement('img');
				awinTrackingPixel.src = `https://www.awin1.com/sread.img?tt=ns&tv=2&merchant=19181&amount=${parseFloat(
					saleAmount
				).toFixed(2)}&ch=aw&parts=DEFAULT:${parseFloat(saleAmount).toFixed(
					2
				)}&vc=${data.discount_code || ''}&cr=GBP&ref=${
					booking.provider_booking_reference
				}&testmode=0`;
				body.appendChild(awinTrackingPixel);

				/*** Do not change ***/
				window.AWIN = {};
				let AWIN = window.AWIN;
				AWIN.Tracking = {};
				AWIN.Tracking.Sale = {};
				AWIN.Tracking.Sale.amount = parseFloat(saleAmount).toFixed(2);
				AWIN.Tracking.Sale.channel = 'aw';
				AWIN.Tracking.Sale.voucher = data.discount_code || '';
				AWIN.Tracking.Sale.orderRef = booking.provider_booking_reference;
				AWIN.Tracking.Sale.parts = `DEFAULT:${parseFloat(saleAmount).toFixed(2)}`;
				AWIN.Tracking.Sale.currency = 'GBP';
				AWIN.Tracking.Sale.test = '0';

				var awMastertag = document.createElement('script');
				awMastertag.setAttribute('defer', 'defer');
				awMastertag.src = 'https://www.dwin1.com/19181.js';
				awMastertag.type = 'text/javascript';

				body.appendChild(awMastertag);

				window.processComplete = true;
				window.parent.postMessage('processComplete', '*');
			}

			return (
				<div className='finish'>
					<h1>
						Thank you for placing your booking with <strong>DocHQ</strong>
					</h1>
					<div>
						<p>
							Your booking reference is:{' '}
							<strong style={{ overflowWrap: 'break-word' }}>{booking.id}</strong>
						</p>
						<p>
							A confirmation email has been sent to <strong>{booking.booking_user.email}</strong>
						</p>
						<p>Your appointment booking confirmation will be sent in a separate email.</p>
					</div>
				</div>
			);
		} else {
			return (
				<div className='finish'>
					<h1>Something went wrong when placing your booking.</h1>
					<div style={{ color: 'red' }} className='payment-errors'>
						{errors.split('\n').map((error, index) => (
							<p key={'error_' + index}>{error}</p>
						))}
					</div>
					<Button onClick={handleBack} variant='contained' disableElevation>
						Back
					</Button>
				</div>
			);
		}
	}
}
