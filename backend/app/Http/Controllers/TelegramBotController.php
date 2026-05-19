<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\TelegramAccount;

class TelegramBotController extends Controller
{
    public function webhook(Request $request)
    {
        $data = $request->all();

        // Telegram sends chat info in 'message'
        $message = $data['message'] ?? null;
        if (!$message) return 'No message';

        $chatId = $message['chat']['id'];
        $text = $message['text'] ?? '';

        // Check if user sent /start OTP
        if (str_starts_with($text, '/start')) {
            $otp = trim(str_replace('/start', '', $text));

            // Find the user with this OTP
            $user = User::where('otp', $otp)
                        ->where('otp_expires_at', '>', now())
                        ->first();

            if (!$user) {
                $this->sendMessage($chatId, "Invalid or expired OTP.");
                return 'done';
            }

            // Save Telegram account
            TelegramAccount::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'telegram_id' => $chatId,
                    'telegram_phone_number' => $message['from']['telegram_phone_number'] ?? null,
                ]
            );

            // Confirm to user
            $this->sendMessage($chatId, "OTP verified! You can now complete registration.");

            // Optionally, mark OTP as used
            $user->update([
                'otp' => null,
                'otp_expires_at' => null
            ]);
        }

        return 'ok';
    }

    private function sendMessage($chatId, $text)
    {
        $botToken = env('TELEGRAM_BOT_TOKEN');

        $url = "https://api.telegram.org/bot{$botToken}/sendMessage";

        \Illuminate\Support\Facades\Http::get($url, [
            'chat_id' => $chatId,
            'text' => $text,
        ]);
    }
}