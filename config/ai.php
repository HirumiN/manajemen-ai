<?php

return [

    /*
    |--------------------------------------------------------------------------
    | AI Service URL
    |--------------------------------------------------------------------------
    |
    | URL backend Python (FastAPI / Flask) yang menerima request dari aplikasi.
    | Nilai default menggunakan localhost:5000/chat.
    |
    */

    'service_url' => env('AI_SERVICE_URL', 'http://127.0.0.1:8000/chat'),

];
