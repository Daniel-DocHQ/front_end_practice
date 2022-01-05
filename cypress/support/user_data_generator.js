import { Chance } from 'chance'

let chance = new Chance(Math.random);
let num_users = 10
let vaccine_types = ['Moderna', 'Pfizer', 'Astrazeneca', 'Johnson & Johnson', 'Sputnik']
let vaccine_shots = ['One dose of vaccine', 'Two doses of vaccine']
let users_arr = new Array(num_users).fill().map(function() {
    return {
        first_name: chance["first"](),
        last_name : chance["last"](),
        email: chance["email"](),
        //date_of_birth : (chance["birthday"]()).toLocaleDateString("en-GB", { //convert to DD/MM/YYYY format
        //    year: "numeric",
        //    month: "2-digit",
        //    day: "2-digit",
        //}),
        date_of_birth: "05051995",
        sex: chance["gender"](),
        address: {
            country: "England", //chance["country"]({ full: true }),
            street: chance["address"](),
            city: chance["city"](),
            postcode: chance["postcode"](), //generate a random U.K. postcode
            time_zone: "London, United Kingdom"
        },
        country_code: "+44",
        phone: chance["phone"]({ country: 'uk', mobile: true, formatted: false }),
        vaccine: {
            name: vaccine_types[Math.floor(Math.random() * vaccine_types.length)],
            shots: vaccine_shots[Math.floor(Math.random() * vaccine_shots.length)]
        }
    };
});

//const fs = require('fs')
let users_json = JSON.stringify({ users: users_arr }, null, 2)

module.exports = {users_json}