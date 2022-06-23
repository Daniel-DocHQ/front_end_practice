const COUNTRIES = [
    { code: 'AD', country: 'Andorra', label: '+376' },
    { code: 'AE', country: 'United Arab Emirates', label: '+971' },
    { code: 'AF', country: 'Afghanistan', label: '+93' },
    { code: 'AG', country: 'Antigua and Barbuda', label: '+1-268' },
    { code: 'AI', country: 'Anguilla', label: '+1-264' },
    { code: 'AL', country: 'Albania', label: '+355' },
    { code: 'AM', country: 'Armenia', label: '+374' },
    { code: 'AO', country: 'Angola', label: '+244' },
    { code: 'AQ', country: 'Antarctica', label: '+672' },
    { code: 'AR', country: 'Argentina', label: '+54' },
    { code: 'AS', country: 'American Samoa', label: '+1-684' },
    { code: 'AT', country: 'Austria', label: '+43' },
    { code: 'AU', country: 'Australia', label: '+61', suggested: true },
    { code: 'AW', country: 'Aruba', label: '+297' },
    { code: 'AX', country: 'Alland Islands', label: '+358' },
    { code: 'AZ', country: 'Azerbaijan', label: '+994' },
    { code: 'BA', country: 'Bosnia and Herzegovina', label: '+387' },
    { code: 'BB', country: 'Barbados', label: '+1-246' },
    { code: 'BD', country: 'Bangladesh', label: '+880' },
    { code: 'BE', country: 'Belgium', label: '+32' },
    { code: 'BF', country: 'Burkina Faso', label: '+226' },
    { code: 'BG', country: 'Bulgaria', label: '+359' },
    { code: 'BH', country: 'Bahrain', label: '+973' },
    { code: 'BI', country: 'Burundi', label: '+257' },
    { code: 'BJ', country: 'Benin', label: '+229' },
    { code: 'BL', country: 'Saint Barthelemy', label: '+590' },
    { code: 'BM', country: 'Bermuda', label: '+1-441' },
    { code: 'BN', country: 'Brunei Darussalam', label: '+673' },
    { code: 'BO', country: 'Bolivia', label: '+591' },
    { code: 'BR', country: 'Brazil', label: '+55' },
    { code: 'BS', country: 'Bahamas', label: '+1-242' },
    { code: 'BT', country: 'Bhutan', label: '+975' },
    { code: 'BV', country: 'Bouvet Island', label: '+47' },
    { code: 'BW', country: 'Botswana', label: '+267' },
    { code: 'BY', country: 'Belarus', label: '+375' },
    { code: 'BZ', country: 'Belize', label: '+501' },
    { code: 'CA', country: 'Canada', label: '+1', suggested: true },
    { code: 'CC', country: 'Cocos (Keeling) Islands', label: '+61' },
    { code: 'CD', country: 'Congo, Democratic Republic of the', label: '+243' },
    { code: 'CF', country: 'Central African Republic', label: '+236' },
    { code: 'CG', country: 'Congo, Republic of the', label: '+242' },
    { code: 'CH', country: 'Switzerland', label: '+41' },
    { code: 'CI', country: "Cote d'Ivoire", label: '+225' },
    { code: 'CK', country: 'Cook Islands', label: '+682' },
    { code: 'CL', country: 'Chile', label: '+56' },
    { code: 'CM', country: 'Cameroon', label: '+237' },
    { code: 'CN', country: 'China', label: '+86' },
    { code: 'CO', country: 'Colombia', label: '+57' },
    { code: 'CR', country: 'Costa Rica', label: '+506' },
    { code: 'CU', country: 'Cuba', label: '+53' },
    { code: 'CV', country: 'Cape Verde', label: '+238' },
    { code: 'CW', country: 'Curacao', label: '+599' },
    { code: 'CX', country: 'Christmas Island', label: '+61' },
    { code: 'CY', country: 'Cyprus', label: '+357' },
    { code: 'CZ', country: 'Czech Republic', label: '+420' },
    { code: 'DE', country: 'Germany', label: '+49', suggested: true },
    { code: 'DJ', country: 'Djibouti', label: '+253' },
    { code: 'DK', country: 'Denmark', label: '+45' },
    { code: 'DM', country: 'Dominica', label: '+1-767' },
    { code: 'DO', country: 'Dominican Republic', label: '+1-809' },
    { code: 'DZ', country: 'Algeria', label: '+213' },
    { code: 'EC', country: 'Ecuador', label: '+593' },
    { code: 'EE', country: 'Estonia', label: '+372' },
    { code: 'EG', country: 'Egypt', label: '+20' },
    { code: 'EH', country: 'Western Sahara', label: '+212' },
    { code: 'ER', country: 'Eritrea', label: '+291' },
    { code: 'ES', country: 'Spain', label: '+34' },
    { code: 'ET', country: 'Ethiopia', label: '+251' },
    { code: 'FI', country: 'Finland', label: '+358' },
    { code: 'FJ', country: 'Fiji', label: '+679' },
    { code: 'FK', country: 'Falkland Islands (Malvinas)', label: '+500' },
    { code: 'FM', country: 'Micronesia, Federated States of', label: '+691' },
    { code: 'FO', country: 'Faroe Islands', label: '+298' },
    { code: 'FR', country: 'France', label: '+33', suggested: true },
    { code: 'GA', country: 'Gabon', label: '+241' },
    { code: 'GB', country: 'United Kingdom', label: '+44' },
    { code: 'GD', country: 'Grenada', label: '+1-473' },
    { code: 'GE', country: 'Georgia', label: '+995' },
    { code: 'GF', country: 'French Guiana', label: '+594' },
    { code: 'GG', country: 'Guernsey', label: '+44' },
    { code: 'GH', country: 'Ghana', label: '+233' },
    { code: 'GI', country: 'Gibraltar', label: '+350' },
    { code: 'GL', country: 'Greenland', label: '+299' },
    { code: 'GM', country: 'Gambia', label: '+220' },
    { code: 'GN', country: 'Guinea', label: '+224' },
    { code: 'GP', country: 'Guadeloupe', label: '+590' },
    { code: 'GQ', country: 'Equatorial Guinea', label: '+240' },
    { code: 'GR', country: 'Greece', label: '+30' },
    { code: 'GS', country: 'South Georgia and the South Sandwich Islands', label: '+500' },
    { code: 'GT', country: 'Guatemala', label: '+502' },
    { code: 'GU', country: 'Guam', label: '+1-671' },
    { code: 'GW', country: 'Guinea-Bissau', label: '+245' },
    { code: 'GY', country: 'Guyana', label: '+592' },
    { code: 'HK', country: 'Hong Kong', label: '+852' },
    { code: 'HM', country: 'Heard Island and McDonald Islands', label: '+672' },
    { code: 'HN', country: 'Honduras', label: '+504' },
    { code: 'HR', country: 'Croatia', label: '+385' },
    { code: 'HT', country: 'Haiti', label: '+509' },
    { code: 'HU', country: 'Hungary', label: '+36' },
    { code: 'ID', country: 'Indonesia', label: '+62' },
    { code: 'IE', country: 'Ireland', label: '+353' },
    { code: 'IL', country: 'Israel', label: '+972' },
    { code: 'IM', country: 'Isle of Man', label: '+44' },
    { code: 'IN', country: 'India', label: '+91' },
    { code: 'IO', country: 'British Indian Ocean Territory', label: '+246' },
    { code: 'IQ', country: 'Iraq', label: '+964' },
    { code: 'IR', country: 'Iran, Islamic Republic of', label: '+98' },
    { code: 'IS', country: 'Iceland', label: '+354' },
    { code: 'IT', country: 'Italy', label: '+39' },
    { code: 'JE', country: 'Jersey', label: '+44' },
    { code: 'JM', country: 'Jamaica', label: '+1-876' },
    { code: 'JO', country: 'Jordan', label: '+962' },
    { code: 'JP', country: 'Japan', label: '+81', suggested: true },
    { code: 'KE', country: 'Kenya', label: '+254' },
    { code: 'KG', country: 'Kyrgyzstan', label: '+996' },
    { code: 'KH', country: 'Cambodia', label: '+855' },
    { code: 'KI', country: 'Kiribati', label: '+686' },
    { code: 'KM', country: 'Comoros', label: '+269' },
    { code: 'KN', country: 'Saint Kitts and Nevis', label: '+1-869' },
    { code: 'KP', country: "Korea, Democratic People's Republic of", label: '+850' },
    { code: 'KR', country: 'Korea, Republic of', label: '+82' },
    { code: 'KW', country: 'Kuwait', label: '+965' },
    { code: 'KY', country: 'Cayman Islands', label: '+1-345' },
    { code: 'KZ', country: 'Kazakhstan', label: '+7' },
    { code: 'LA', country: "Lao People's Democratic Republic", label: '+856' },
    { code: 'LB', country: 'Lebanon', label: '+961' },
    { code: 'LC', country: 'Saint Lucia', label: '+1-758' },
    { code: 'LI', country: 'Liechtenstein', label: '+423' },
    { code: 'LK', country: 'Sri Lanka', label: '+94' },
    { code: 'LR', country: 'Liberia', label: '+231' },
    { code: 'LS', country: 'Lesotho', label: '+266' },
    { code: 'LT', country: 'Lithuania', label: '+370' },
    { code: 'LU', country: 'Luxembourg', label: '+352' },
    { code: 'LV', country: 'Latvia', label: '+371' },
    { code: 'LY', country: 'Libya', label: '+218' },
    { code: 'MA', country: 'Morocco', label: '+212' },
    { code: 'MC', country: 'Monaco', label: '+377' },
    { code: 'MD', country: 'Moldova, Republic of', label: '+373' },
    { code: 'ME', country: 'Montenegro', label: '+382' },
    { code: 'MF', country: 'Saint Martin (French part)', label: '+590' },
    { code: 'MG', country: 'Madagascar', label: '+261' },
    { code: 'MH', country: 'Marshall Islands', label: '+692' },
    { code: 'MK', country: 'Macedonia, the Former Yugoslav Republic of', label: '+389' },
    { code: 'ML', country: 'Mali', label: '+223' },
    { code: 'MM', country: 'Myanmar', label: '+95' },
    { code: 'MN', country: 'Mongolia', label: '+976' },
    { code: 'MO', country: 'Macao', label: '+853' },
    { code: 'MP', country: 'Northern Mariana Islands', label: '+1-670' },
    { code: 'MQ', country: 'Martinique', label: '+596' },
    { code: 'MR', country: 'Mauritania', label: '+222' },
    { code: 'MS', country: 'Montserrat', label: '+1-664' },
    { code: 'MT', country: 'Malta', label: '+356' },
    { code: 'MU', country: 'Mauritius', label: '+230' },
    { code: 'MV', country: 'Maldives', label: '+960' },
    { code: 'MW', country: 'Malawi', label: '+265' },
    { code: 'MX', country: 'Mexico', label: '+52' },
    { code: 'MY', country: 'Malaysia', label: '+60' },
    { code: 'MZ', country: 'Mozambique', label: '+258' },
    { code: 'NA', country: 'Namibia', label: '+264' },
    { code: 'NC', country: 'New Caledonia', label: '+687' },
    { code: 'NE', country: 'Niger', label: '+227' },
    { code: 'NF', country: 'Norfolk Island', label: '+672' },
    { code: 'NG', country: 'Nigeria', label: '+234' },
    { code: 'NI', country: 'Nicaragua', label: '+505' },
    { code: 'NL', country: 'Netherlands', label: '+31' },
    { code: 'NO', country: 'Norway', label: '+47' },
    { code: 'NP', country: 'Nepal', label: '+977' },
    { code: 'NR', country: 'Nauru', label: '+674' },
    { code: 'NU', country: 'Niue', label: '+683' },
    { code: 'NZ', country: 'New Zealand', label: '+64' },
    { code: 'OM', country: 'Oman', label: '+968' },
    { code: 'PA', country: 'Panama', label: '+507' },
    { code: 'PE', country: 'Peru', label: '+51' },
    { code: 'PF', country: 'French Polynesia', label: '+689' },
    { code: 'PG', country: 'Papua New Guinea', label: '+675' },
    { code: 'PH', country: 'Philippines', label: '+63' },
    { code: 'PK', country: 'Pakistan', label: '+92' },
    { code: 'PL', country: 'Poland', label: '+48' },
    { code: 'PM', country: 'Saint Pierre and Miquelon', label: '+508' },
    { code: 'PN', country: 'Pitcairn', label: '+870' },
    { code: 'PR', country: 'Puerto Rico', label: '+1' },
    { code: 'PS', country: 'Palestine, State of', label: '+970' },
    { code: 'PT', country: 'Portugal', label: '+351' },
    { code: 'PW', country: 'Palau', label: '+680' },
    { code: 'PY', country: 'Paraguay', label: '+595' },
    { code: 'QA', country: 'Qatar', label: '+974' },
    { code: 'RE', country: 'Reunion', label: '+262' },
    { code: 'RO', country: 'Romania', label: '+40' },
    { code: 'RS', country: 'Serbia', label: '+381' },
    { code: 'RU', country: 'Russian Federation', label: '+7' },
    { code: 'RW', country: 'Rwanda', label: '+250' },
    { code: 'SA', country: 'Saudi Arabia', label: '+966' },
    { code: 'SB', country: 'Solomon Islands', label: '+677' },
    { code: 'SC', country: 'Seychelles', label: '+248' },
    { code: 'SD', country: 'Sudan', label: '+249' },
    { code: 'SE', country: 'Sweden', label: '+46' },
    { code: 'SG', country: 'Singapore', label: '+65' },
    { code: 'SH', country: 'Saint Helena', label: '+290' },
    { code: 'SI', country: 'Slovenia', label: '+386' },
    { code: 'SJ', country: 'Svalbard and Jan Mayen', label: '+47' },
    { code: 'SK', country: 'Slovakia', label: '+421' },
    { code: 'SL', country: 'Sierra Leone', label: '+232' },
    { code: 'SM', country: 'San Marino', label: '+378' },
    { code: 'SN', country: 'Senegal', label: '+221' },
    { code: 'SO', country: 'Somalia', label: '+252' },
    { code: 'SR', country: 'Suriname', label: '+597' },
    { code: 'SS', country: 'South Sudan', label: '+211' },
    { code: 'ST', country: 'Sao Tome and Principe', label: '+239' },
    { code: 'SV', country: 'El Salvador', label: '+503' },
    { code: 'SX', country: 'Sint Maarten (Dutch part)', label: '+1-721' },
    { code: 'SY', country: 'Syrian Arab Republic', label: '+963' },
    { code: 'SZ', country: 'Swaziland', label: '+268' },
    { code: 'TC', country: 'Turks and Caicos Islands', label: '+1-649' },
    { code: 'TD', country: 'Chad', label: '+235' },
    { code: 'TF', country: 'French Southern Territories', label: '+262' },
    { code: 'TG', country: 'Togo', label: '+228' },
    { code: 'TH', country: 'Thailand', label: '+66' },
    { code: 'TJ', country: 'Tajikistan', label: '+992' },
    { code: 'TK', country: 'Tokelau', label: '+690' },
    { code: 'TL', country: 'Timor-Leste', label: '+670' },
    { code: 'TM', country: 'Turkmenistan', label: '+993' },
    { code: 'TN', country: 'Tunisia', label: '+216' },
    { code: 'TO', country: 'Tonga', label: '+676' },
    { code: 'TR', country: 'Turkey', label: '+90' },
    { code: 'TT', country: 'Trinidad and Tobago', label: '+1-868' },
    { code: 'TV', country: 'Tuvalu', label: '+688' },
    { code: 'TW', country: 'Taiwan, Province of China', label: '+886' },
    { code: 'TZ', country: 'United Republic of Tanzania', label: '+255' },
    { code: 'UA', country: 'Ukraine', label: '+380' },
    { code: 'UG', country: 'Uganda', label: '+256' },
    { code: 'US', country: 'United States', label: '+1', suggested: true },
    { code: 'UY', country: 'Uruguay', label: '+598' },
    { code: 'UZ', country: 'Uzbekistan', label: '+998' },
    { code: 'VA', country: 'Holy See (Vatican City State)', label: '+379' },
    { code: 'VC', country: 'Saint Vincent and the Grenadines', label: '+1-784' },
    { code: 'VE', country: 'Venezuela', label: '+58' },
    { code: 'VG', country: 'British Virgin Islands', label: '+1-284' },
    { code: 'VI', country: 'US Virgin Islands', label: '+1-340' },
    { code: 'VN', country: 'Vietnam', label: '+84' },
    { code: 'VU', country: 'Vanuatu', label: '+678' },
    { code: 'WF', country: 'Wallis and Futuna', label: '+681' },
    { code: 'WS', country: 'Samoa', label: '+685' },
    { code: 'XK', country: 'Kosovo', label: '+383' },
    { code: 'YE', country: 'Yemen', label: '+967' },
    { code: 'YT', country: 'Mayotte', label: '+262' },
    { code: 'ZA', country: 'South Africa', label: '+27' },
    { code: 'ZM', country: 'Zambia', label: '+260' },
    { code: 'ZW', country: 'Zimbabwe', label: '+263' },
];

export default COUNTRIES;