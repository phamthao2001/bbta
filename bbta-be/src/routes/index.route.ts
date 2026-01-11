import { admin_route } from './admin.route';
import { auth_route } from './auth.route';
import { customer_route } from './customer.route';
import { food_route } from './food.route';
import { order_route } from './order.route';
import { serve_session_route } from './serve-session.route';
import { staff_route } from './staff.route';
import { table_booking_route } from './table-booking.route';
import { table_route } from './table.route';

export const all_routes = [
  food_route,
  staff_route,
  table_route,
  order_route,
  serve_session_route,
  auth_route,
  admin_route,
  customer_route,
  table_booking_route,
];
