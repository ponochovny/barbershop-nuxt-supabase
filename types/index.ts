import type { Database } from './database.types';

export type BookingWithService = Pick<
  Database['public']['Tables']['bookings']['Row'],
  'id' | 'start_time' | 'status'
> & {
  service: Pick<
    Database['public']['Tables']['services']['Row'],
    'name' | 'duration_minutes'
  > | null;
};
