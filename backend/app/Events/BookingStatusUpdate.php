<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Booking;

class BookingStatusUpdate implements ShouldBroadcast{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $booking;

    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }
    public function broadcastOn()
    {
        return new PrivateChannel('bookings.' . $this->booking->unit->user_id);
    }

    public function broadcastAs()
    {
        return 'BookingStatusUpdate';
    }

    public function broadcastWith()
    {
        return [
            'booking_ref' => $this->booking->booking_ref,
            'status' => $this->booking->status,
            'unit_id' => $this->booking->unit_id,
            'start_date' => $this->booking->start_date,
            'end_date' => $this->booking->end_date,
        ];
    }
}