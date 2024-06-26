<?php

namespace App\Enums;

enum GroupRoleEnum: int
{
    case USER = 0;
    case MODERATOR = 2;
    case ADMIN = 3;
}
