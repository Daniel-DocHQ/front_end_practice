.PHONY: dockerpush

BUILDNO := 11

dockerpush:
	docker login reg.dochq.co.uk && \
	docker build --build-arg=REACT_APP_BOOKING_URL=https://dochq-booking-api.dochq.co.uk \
	--build-arg=REACT_APP_DISCOUNT_URL=https://services-discounts.dochq.co.uk \
	--build-arg=REACT_APP_DELFIN_URL=https://dochq-booking-api.dochq.co.uk \
	--build-arg=REACT_APP_BOOKING_USER_DATA_URL=https://services-booking-user-data.dochq.co.uk \
	--build-arg=REACT_APP_LOGIN_URL=https://services-login.dochq.co.uk \
	--build-arg=REACT_APP_IDENTITIES_URL=https://services-identity.dochq.co.uk \
	--build-arg=REACT_APP_WEB_SOCKET_URL=https://services-websocket-server.dochq.co.uk \
	--build-arg=REACT_APP_IDENTITES_UI=https://login.dochq.co.uk/login \
	-t reg.dochq.co.uk/ui/video-consultations:peter-release-${BUILDNO} . && \
	docker push reg.dochq.co.uk/ui/video-consultations:peter-release-${BUILDNO}
