// Setup desired values before each run (end-to-end test from purchase to booking and cerificate generation)

export const test_data =
	[
		{ // IDs and quantity of products which will be added in the basket
			"19": 						2, // "ftt_antigen_dochq":
			"68": 						0, // "day2_ant_kit":
			"12": 						0, // "ftt_pcr"
			"63": 						0, // "day2_pcr_kit_dochq
			"86": 						2, // "day3_ant_kit_dochq"
			"22": 						0, // "pre_dep_antigen_dochq"
			"15": 						0, // "amber_bundle" (day2pcr + day8pcr)
			"64":					    0, // "ant_consult" (buy with id-67)
			"67": 						0, // "cov-19_certificate" (buy with id-64)
			"80": 						0, // "ftt_antigen_ofl"
			"39": 						0, // "pre_dep_antigen_ofl"
			"82": 						0, // "day3_ant_kit_ofl"
			"85": 						0, // "day2_pcr_kit_ofl"
		},
		{ // Universal discount code
			"discount_code": 			"", /*** implement discount code in order_test ***/
			"email": 					"daniel.albul@dochq.co.uk",
			"country_code": 			"+380",
			"phone": 					"638302847",
			// choose prefered short_token or leave it "null" to book for the last order made by order_a_product.js
			"short_token": 				null,
			"shop_source": 				"dochq",
			"flight_timezone": 			"London, United Kingdom", //default is London, United Kingdom
			// Paste your date in format 'dd/mm/yyyy' (make sure shifts are open for this date)
			"booking_date": 			"03-09-2022",
			"vaccine_status": 			"yes"
		}
	]