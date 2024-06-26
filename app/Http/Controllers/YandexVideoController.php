<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class YandexVideoController extends Controller
{
    public function createMeeting(Request $request)
    {
        $token = 'y0_AgAAAAB1WwVRAAwCigAAAAEInGgkAADDiCzwlCNFAqF_DX4n1YJIKUP5gQ';
        $time = $request->start_time ?? now();

        $client = new Client([
            'base_uri' => 'https://api.video.yandex.net',
            'verify' => '/etc/ssl/certs/cacert.pem'
        ]);

        try {
            $response = $client->post('/v1/rooms', [
                'headers' => [
                    'Authorization' => "Bearer $token",
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'title' => 'Новая встреча из мессенджера',
                    'start_time' => $time->toIso8601String(),
                    'end_time' => $time->addMinutes(60)->toIso8601String(),
                ],
            ]);

            $data = json_decode($response->getBody(), true);

            return response()->json($data);
        } catch (RequestException $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'response' => $e->hasResponse() ? json_decode($e->getResponse()->getBody(), true) : null
            ], $e->getCode());
        }
    }
}
