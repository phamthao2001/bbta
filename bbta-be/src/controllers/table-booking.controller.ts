import { Request, Response } from 'express';
import serve_session_model from '../models/serve-session.model';
import table_booking_model from '../models/table-booking.model';
import { generateCodeLogin } from './serve-session.controller';

const createBooking = (req: Request, res: Response) => {
  const { customerId, table_ids } = req.body;

  try {
    const newBooking = new table_booking_model({
      customer_id: customerId,
      table_ids,
      booking_time: new Date(),
    });

    newBooking.save();

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error });
  }
};

const startServedBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  try {
    const booking = await table_booking_model.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.set('state', 'done');
    const tableIds = booking.table_ids;

    const code_login = generateCodeLogin();

    const newServeSession = new serve_session_model({
      table_ids: tableIds,
      code_login,
      started_at: new Date(),
    });

    await newServeSession.save();
    await booking.save();

    res.status(200).json({ message: 'Served booking started successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error starting served booking', error });
  }
};

const cancelBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  try {
    const booking = await table_booking_model.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.set('state', 'cancel');
    await booking.save();
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error });
  }
};

export const table_booking_controller = {
  createBooking,
  startServedBooking,
  cancelBooking,
};
