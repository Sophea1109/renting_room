<?php

namespace Tests\Feature;

use App\Models\Room;
use App\Models\RoomPayment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OwnerDashboardTest extends TestCase
{
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


    public function test_owner_can_create_room_from_api(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);

        $response = $this->postJson('/api/owner/rooms', [
            'owner_id' => $owner->id,
            'name' => 'R-10',
            'monthly_rent' => 300,
            'occupancy_status' => 'available',
            'payment_status' => 'unpaid',
        ]);

        $response->assertCreated()->assertJsonPath('room.name', 'R-10');

        $this->assertDatabaseHas('rooms', [
            'owner_id' => $owner->id,
            'name' => 'R-10',
            'monthly_rent' => 300,
        ]);
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

    public function test_marking_room_unpaid_creates_negative_payment_record(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);

        $room = Room::create([
            'owner_id' => $owner->id,
            'name' => 'R-6',
            'monthly_rent' => 220,
            'occupancy_status' => 'occupied',
            'payment_status' => 'paid',
        ]);

        $response = $this->patchJson('/api/owner/rooms/' . $room->id . '/status', [
            'payment_status' => 'unpaid',
        ]);

        $response->assertOk()->assertJsonPath('room.paymentStatus', 'unpaid');

        $this->assertDatabaseHas('room_payments', [
            'room_id' => $room->id,
            'amount' => -220,
        ]);
    }

    public function test_dashboard_revenue_uses_paid_rooms_monthly_rent(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);

        Room::create([
            'owner_id' => $owner->id,
            'name' => 'R-8',
            'monthly_rent' => 400,
            'occupancy_status' => 'occupied',
            'payment_status' => 'paid',
        ]);

        Room::create([
            'owner_id' => $owner->id,
            'name' => 'R-9',
            'monthly_rent' => 250,
            'occupancy_status' => 'available',
            'payment_status' => 'unpaid',
        ]);

        $response = $this->getJson('/api/owner/dashboard?owner_id=' . $owner->id);

        $response->assertOk()->assertJsonPath('cards.totalRevenue', 400);

        $room = Room::where('owner_id', $owner->id)->where('name', 'R-9')->firstOrFail();

        $this->patchJson('/api/owner/rooms/' . $room->id . '/status', [
            'payment_status' => 'paid',
        ])->assertOk();

        $updated = $this->getJson('/api/owner/dashboard?owner_id=' . $owner->id);
        $updated->assertOk()->assertJsonPath('cards.totalRevenue', 650);
    }

    public function test_owner_can_delete_room_from_api(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);

        $room = Room::create([
            'owner_id' => $owner->id,
            'name' => 'R-7',
            'monthly_rent' => 300,
            'occupancy_status' => 'available',
            'payment_status' => 'unpaid',
        ]);

        $response = $this->deleteJson('/api/owner/rooms/' . $room->id);

        $response->assertOk();

        $this->assertDatabaseMissing('rooms', [
            'id' => $room->id,
        ]);
    }
}