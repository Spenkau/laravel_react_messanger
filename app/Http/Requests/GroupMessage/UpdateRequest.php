<?php

namespace App\Http\Requests\GroupMessage;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'id' => ['required', 'integer', 'exists:message_group,id'],
            'group_id' => ['required', 'integer'],
            'message' => ['required', 'string']
        ];
    }
}
