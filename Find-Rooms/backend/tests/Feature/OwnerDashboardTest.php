<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Room;
use App\Models\RoomPayment;
use App\Models\User;
use Tests\TestCase;

//only run when type command for it only
class OwnerDashboardTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;

    public function test_owner_dashboard_returns_revenue_and_occupancy_cards(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);

        $roomOne = Room::create([
            'owner_id' => $owner->id,
            'name' => 'R-1',
            'monthly_rent' => 100,
            'occupancy_status' => 'occupied',
            'payment_status' => 'paid',
        ]);

        Room::create([
            'owner_id' => $owner->id,
            'name' => 'R-2',
            'monthly_rent' => 150,
            'occupancy_status' => 'available',
            'payment_status' => 'unpaid',
        ]);

        RoomPayment::create([
            'room_id' => $roomOne->id,
            'owner_id' => $owner->id,
            'amount' => 100,
            'paid_at' => now()->toDateString(),
        ]);

        $response = $this->getJson('/api/owner/dashboard?owner_id=' . $owner->id);

        $response->assertOk()
            ->assertJsonPath('cards.totalRevenue', 100)
            ->assertJsonPath('cards.totalRooms', 2)
            ->assertJsonPath('cards.occupiedRooms', 1)
            ->assertJsonPath('cards.availableRooms', 1);
    }

    public function test_marking_room_paid_creates_payment_record(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);

        $room = Room::create([
            'owner_id' => $owner->id,
            'name' => 'R-5',
            'monthly_rent' => 200,
            'occupancy_status' => 'available',
            'payment_status' => 'unpaid',
        ]);

        $response = $this->patchJson('/api/owner/rooms/' . $room->id . '/status', [
            'occupancy_status' => 'occupied',
            'payment_status' => 'paid',
        ]);

        $response->assertOk()->assertJsonPath('room.paymentStatus', 'paid');

        $this->assertDatabaseHas('room_payments', [
            'room_id' => $room->id,
            'amount' => 200,
        ]);
    }
}
