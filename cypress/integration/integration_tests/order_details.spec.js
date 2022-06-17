
import {order_data} from '../../fixtures/order_list.json'
import {test_data} from '../../fixtures/customize_test.js'
import OrderManagement from '../../page_objects/OrderManagePage.js'
import BookingPage from '../../page_objects/BookingPage.js'


const OrderM = new OrderManagement();   
const OrderInfo = new BookingPage(test_data);

describe("Get Order Details", () => {

    it('Login as Super Admin', () => {
        cy.myhealth_login('super_admin');
    })

	it('Find order in the list', () => {
		//returns custom short_token or takes the last order from order_list
		let short_token = test_data[1].short_token ?? OrderInfo.get_short_token();
		cy.intercept({method: 'GET', url: `https://api-staging.dochq.co.uk/v1/order/${short_token}`,}).as('order_details')

		// get to the Order Management page
		cy.get('button').contains('Order List').click();
		cy.wait(2000);
		let products;

		// Find order details by short token, email or discount code
		OrderM.get_order_details({short_id : short_token});
		// Assert order info
		cy.wait('@order_details').then( req => {
                expect(req.response.statusCode).eq(200)
                expect(req.response.headers['content-type']).eq('application/json')
                expect(req.response.body).to.not.be.null;
                cy.log(req.response.body);
		})

		// Get products titles and quantities
		products = OrderM.get_products_data(short_token);

	})

})
