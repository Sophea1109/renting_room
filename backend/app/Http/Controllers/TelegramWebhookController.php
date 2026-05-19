<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\TelegramAccount;

class TelegramWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $data = $request->all();

        if (!isset($data['message'])){
            return response()->json(['status' => 'ignored']);
        }

        $message = $data['message'];
        $chatId = $message['chat']['id'];
        $username = $message['from']['username'] ?? null;
        $text = $message['text'] ?? '';

        if (str_starts_with($text, '/start')){

            $parts = explode(' ', $text);
            $otp = $parts[1] ?? null;

            if (!$otp) {
                return response()->json(['status' => 'no otp']);
            }

            $user = User::Where('otp', $otp)->first();

            if (!$user) {
                return response()->json(['status' => 'invalid otp']);
            }

            TelegramAccount::updatedOrCreate(
                ['user_id' => $user->id],
                [
                    'telegram_id' => $chatId,
                    ' telegram_phone_number' => $username
                ]
            );
        }
        return response()->json(['status' => 'ok']);
    }
}