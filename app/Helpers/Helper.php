<?php

namespace App\Helpers;

class Helper
{
    public static function userLastActivityStatus($timestamp): ?string
    {
        $lastSeenFormat = $timestamp?->isToday() ? "Был(-а) сегодня в {$timestamp?->format('H:i')}" : ($timestamp?->isYesterday()
            ? "Был(-а) вчера в {$timestamp?->format('H:i')}"
            : "Был(-а) в сети {$timestamp?->format('d/m/Y H:i')}"
        );

        return $timestamp?->gt(now()->subSeconds(5)) ? 'Онлайн' : $lastSeenFormat;
    }
}
