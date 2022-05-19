// Setup desired values before each run (end-to-end test from purchase to booking and cerificate generation)

export const test_data =
	[
		{ // IDs and quantity of products which will be added in the basket [source]
			"19": 						0, // "ftt_antigen_dochq" 		[dochq]
			"68": 						0, // "day2_ant_kit" 			[dochq]
			"12": 						1, // "ftt_pcr"					[dochq]
			"63": 						0, // "day2_pcr_kit_dochq		[dochq]
			"86": 						0, // "day3_ant_kit_dochq"		[dochq]
			"22": 						0, // "pre_dep_antigen_dochq"	[dochq]
			"15": 						0, // "amber_bundle" (day2pcr + day8pcr)[dochq]
			"64": 						0, // "ant_consult_uk" (buy with id-67)	[dochq]
			"67": 						0, // "cov-19_certificate_uk" (buy with id-64) [dochq]
			"80": 						0, // "ftt_antigen_ofl" 		[ofl]
			"39": 						0, // "pre_dep_antigen_ofl" 	[ofl]
			"82": 						0, // "day3_ant_kit_ofl" 		[ofl]
			"85": 						0, // "day2_pcr_kit_ofl" 		[ofl]
			"98":						0, // "ant_consult_us" 			[dochq-us]
			"99": 						0,  // "cov-19_certificate_us" (buy with id-98) [dochq-us]
			"14":						0, 	// Day 8 PCR [dochq]
			"83":						1,	// Day 2 PCR Reconsultation [dochq]
			"26":						0	// Test To Release PCR
		},
		{ // DOCHQ shops setup
			"discount_code": 			"", /*** implement discount code in order_test ***/
			"email": 					"Daniel.Albul@dochq.co.uk", //"oleg.vakheta@dochq.co.uk",   "daniel.albul.biz@gmail.com"
			"country_code": 			"+380", 
			"phone": 					"638302847", // "637873352"   "660810189"
			// choose prefered short_token or leave it "null" to book for the last order made by order_a_product.js
			"short_token": 				"",
			"shop_source": 				"dochq", //"ofl"
			"flight_timezone": 			"Mykolayiv, Ukraine", // , "Orlando, United States of America"//default is "London, United Kingdom"
			// Paste your date in format 'mm/dd/yyyy' (make sure shifts are opened for this date)
			"booking_date": 			"",
			"departure_time":			"",
			"vaccine_status": 			"yes"
		},
		{	//AMEX pages setup
			"source":					"amex-uk", // "amex-uk" or "amex-it"
			"voucher": 					"AXPBD330033" // amex-uk voucher
		}
	]