<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\TelegramAccount;

class TelegramService
{
    public function sendToUser(int $userId, string $message): void
    {
        $account = TelegramAccount::where('user_id', $userId)->first();
        if (!$account) return;

        Http::get("https://api.telegram.org/bot" . env('TELEGRAM_BOT_TOKEN') . "/sendMessage", [
            'chat_id' => $account->telegram_id,
            'text'    => $message,
        ]);
    }
}