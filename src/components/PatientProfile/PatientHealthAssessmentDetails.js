import { Paper } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { firstCharUpper } from '../../helpers/firstCharUpper';

const PatientHealthAssessmentDetails = ({ health_assessment }) => {
	return (
		<React.Fragment>
			<Paper style={{ padding: '15px', marginTop: '20px', marginBottom: '20px' }}>
				<div className='row'>
					<h3>Health Profile</h3>
				</div>
				<div className='row space-between'>
					<span>Height:</span>
					<span>{health_assessment.height}</span>
				</div>
				<div className='row space-between'>
					<span>Weight:</span>
					<span>{health_assessment.weight}</span>
				</div>
				<div className='row space-between'>
					<span>Smoker:</span>
					<span>{firstCharUpper(health_assessment.smoking.toString())}</span>
				</div>
				{typeof health_assessment.health_conditions !== 'undefined' &&
					health_assessment.health_conditions.length > 0 && (
						<div className='row'>
							<ul style={{ listStyleType: 'none' }}>
								{health_assessment.health_conditions.map((condition, i) => {
									switch (condition) {
										case value:
											break;

										default:
											break;
									}
								})}
							</ul>
						</div>
					)}
			</Paper>
		</React.Fragment>
	);
};

export default PatientHealthAssessmentDetails;
