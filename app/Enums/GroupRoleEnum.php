<?php

namespace App\Enums;

enum GroupRoleEnum: int
{
    case USER = 1;
    case MODERATOR = 2;
    case ADMIN = 3;
}
