<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Availability;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AvailabilityDateTest extends TestCase
{
    use RefreshDatabase;

    public function test_date_column_is_handled_in_creation()
    {
        // Test création avec date (non récurrent)
        $data = [
            'doctor_id' => 1,
            'is_recurring' => false,
            'date' => '2025-11-15',
            'start_time' => '09:00',
            'end_time' => '17:00'
        ];

        $availability = Availability::create($data);

        $this->assertEquals('2025-11-15', $availability->date);
        $this->assertFalse($availability->is_recurring);
        $this->assertNull($availability->day_of_week);

        // Test création récurrente (sans date)
        $data2 = [
            'doctor_id' => 1,
            'is_recurring' => true,
            'day_of_week' => 1,
            'start_time' => '09:00',
            'end_time' => '17:00'
        ];

        $availability2 = Availability::create($data2);

        $this->assertNull($availability2->date);
        $this->assertTrue($availability2->is_recurring);
        $this->assertEquals(1, $availability2->day_of_week);
    }
}
