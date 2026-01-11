import { Router } from 'express';
import { table_booking_controller } from '../controllers/table-booking.controller';

const route = Router();

route.post('/table-booking', table_booking_controller.createBooking);

route.post('/table-booking/start-served/:bookingId', table_booking_controller.startServedBooking);

route.post('/table-booking/cancel-booking/:bookingId', table_booking_controller.cancelBooking);

export const table_booking_route = route;
