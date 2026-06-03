<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    // 1. Get List of Users (with search support)
   // In ChatController.php

   
   public function users(Request $request)
    {
        $search = $request->query('search');
        $query = User::query()->where('id', '!=', Auth::id());
    
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', '%' . $search . '%')
                  ->orWhere('last_name', 'like', '%' . $search . '%');
            });
        }
        
        return response()->json($query->get()); // Removed dd()
    }
    public function messages($id)
    {
        $messages = Message::with(['sender:id,first_name,last_name,avatar']) // Eager-load sender info
            ->where(function ($query) use ($id) {
                $query->where('sender_id', Auth::id())->where('receiver_id', $id);
            })
            ->orWhere(function ($query) use ($id) {
                $query->where('sender_id', $id)->where('receiver_id', Auth::id());
            })
            ->orderBy('created_at', 'asc')
            ->get();
    
        return response()->json($messages);
    }

    // 3. Send a Message
    public function send(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
            'is_read' => false,
        ]);

        return response()->json($message);
    }

    // 4. Mark messages as read
    public function markAsRead($id)
    {
        Message::where('sender_id', $id)
            ->where('receiver_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['status' => 'success']);
    }

    // Inside App\Http\Controllers\ChatController.php

public function unreadCount(Request $request)
{
    $unreadCount = \App\Models\Message::where('receiver_id', $request->user()->id)
        ->where('is_read', false)
        ->count();

    return response()->json(['unread_count' => $unreadCount]);
}
}