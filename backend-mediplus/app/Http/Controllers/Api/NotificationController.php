<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NotificationCustom;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // GET /api/notifications
    public function index(Request $request)
    {
        $user = $request->user();
        $notifications = NotificationCustom::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'items' => $notifications,
            'count' => $notifications->count()
        ]);
    }

    // GET /api/notifications/unread
    public function unread(Request $request)
    {
        $user = $request->user();
        $notifications = NotificationCustom::where('user_id', $user->id)
            ->whereNull('read_at')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'items' => $notifications,
            'count' => $notifications->count()
        ]);
    }

    // PATCH /api/notifications/{id}/read
    public function markAsRead(Request $request, $id)
    {
        $user = $request->user();
        $notification = NotificationCustom::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $notification->update(['read_at' => now()]);

        return response()->json(['message' => 'Notification marquée comme lue']);
    }
}
