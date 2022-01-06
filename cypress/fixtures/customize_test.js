// Setup desired values before each run (end-to-end test from purchase to booking and cerificate generation)

export const test_data = 
[
	{  // Quantity of products which will be added in the basket
		"ftt_antigen_dochq": 		1,	  	// id-19
		"day2_ant_kit" : 			1,		// id-68
		"ftt_pcr": 					0,		// id-12
		"day2_pcr_kit_dochq":   	0,		// id-63
		"pre_dep_antigen_dochq": 	0,		// id-22
		"amber_bundle": 			0,		// id-15 (day2pcr + day8pcr)
		"ant_consult" :				0,    	// id-64 (buy with id-67)
		"cov-19_certificate":		0,		// id-67 (buy with id-64)
		"ftt_antigen_ofl":			0,		// id-80
		"pre_dep_antigen_ofl":		0,		// id-39
		"day3_ant_kit_ofl":			0,		// id-82
		"day2_pcr_kit_ofl":			0,		// id-85

	},
	{  // Universal discount code
		"discount_code" : 		"", /*** implement discount code in order_test ***/
		"email"			: 		"daniel.albul@dochq.co.uk",
		"country_code"	:		"+380",
		"phone"	:				"638302847"
	},
		
	{ 	// choose prefered short_token or leave it "null" to book for the last order made by order_a_product.js
		"short_token" :   		null,
		"flight_timezone": 		"London, United Kingdom",	//default is London, United Kingdom
		// Paste your date in format 'dd/mm/yyyy' (make sure shifts are open for this date)
		"booking_date":			"",
		"vaccine_status":		"yes"
	}
]