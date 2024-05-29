<?php

namespace App\Enums;

enum GroupAccessEnum: int
{
    case PRIVATE = 1;
    case PUBLIC = 2;

    public function title(): string
    {
        return match ($this) {
            self::PRIVATE => 'Приватная',
            self::PUBLIC => 'Публичная'
        };
    }

    public static function toArray(): array
    {
        return array_map(fn($res) => $res->value, self::cases());
    }
}
