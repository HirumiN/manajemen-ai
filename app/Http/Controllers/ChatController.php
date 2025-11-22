<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http; 
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\Log; 
use Inertia\Inertia; 

class ChatController extends Controller
{
    /**
     * Menampilkan halaman Chat utama.
     * URL: /chat
     * Method: GET
     */
    public function index()
    {
        return Inertia::render('chat'); 
    }

    /**
     * Memproses pesan dari User dan mengirimnya ke AI Service.
     * URL: /chat/send
     * Method: POST
     */
    public function sendMessage(Request $request)
    {
        // [LOG] Mulai proses
        Log::info("ChatController: Menerima request pesan baru.");

        // 1. Validasi: Pastikan pesan tidak kosong
        try {
            $request->validate([
                'message' => 'required|string',
            ]);
        } catch (\Exception $e) {
            Log::warning("ChatController: Validasi gagal.", ['error' => $e->getMessage()]);
            throw $e;
        }

        // 2. Ambil user yang sedang login
        $user = Auth::user();

        // Safety check
        if (!$user) {
            Log::warning("ChatController: Akses ditolak (Unauthorized). User tidak ditemukan di session.");
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // [LOG] User teridentifikasi
        Log::info("ChatController: User teridentifikasi.", [
            'user_id' => $user->id, 
            'email' => $user->email
        ]);

        // 3. Tentukan URL Service Python (FastAPI)
        $aiServiceUrl = config('ai.service_url');
        
        // [LOG] Persiapan kirim ke Python
        Log::info("ChatController: Menyiapkan pengiriman ke AI Service.", [
            'url' => $aiServiceUrl,
            'message_length' => strlen($request->message)
        ]);

        try {
            // 4. Kirim Request ke Python (FastAPI)
            $response = Http::timeout(30)->post($aiServiceUrl, [
                'user_id' => $user->id,
                'message' => $request->message,
            ]);

            // 5. Cek Respons dari Python
            if ($response->successful()) {
                // [LOG] Sukses
                Log::info("ChatController: Sukses! Menerima balasan dari AI Service.", [
                    'status' => $response->status(),
                    // Kita log sedikit cuplikan reply untuk debugging (jangan semua jika panjang)
                    'reply_snippet' => substr($response->json()['reply'] ?? '', 0, 50) . '...' 
                ]);

                return response()->json($response->json());
            } else {
                // [LOG] Error dari sisi Python (misal 500 Internal Server Error)
                Log::error("ChatController: Gagal. AI Service merespon dengan error.", [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                return response()->json([
                    'error' => 'AI Service Error',
                    'details' => $response->body()
                ], 500);
            }

        } catch (\Exception $e) {
            // 6. Exception Handling (Koneksi putus/timeout)
            // [LOG] Exception fatal
            Log::error("ChatController: Exception Fatal saat menghubungi AI Service.", [
                'message' => $e->getMessage(),
                'url' => $aiServiceUrl
            ]);

            return response()->json([
                'error' => 'Gagal menghubungi AI Service. Pastikan server Python (main.py) sudah berjalan.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}