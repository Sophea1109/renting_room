<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserReport;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function handleAction(Request $request, $id) {
        $report = UserReport::findOrFail($id);
        
        if ($request->action === 'approve') {
            $user = User::find($report->user_id);
            if ($user) {
                $user->update(['is_banned' => true]);
            }
        }

        $report->update([
            'status' => $request->action === 'approve' ? 'approved' : 'dismissed',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        return response()->json(['status' => 'success', 'message' => 'Action successfully applied.']);
    }
}