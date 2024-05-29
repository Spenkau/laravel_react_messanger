<?php

namespace App\Http\Requests\GroupMessage;

use App\Models\Group;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreRequest extends FormRequest
{
    /**
     * @return void
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'user_id' => Auth::id()
        ]);
    }

    /**
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'group_id' => ['required', 'integer', Rule::exists('groups', 'id')],
            'message' => ['string'],
            'reply_id' => ['nullable', 'integer'],
            'message_attachments' => ['nullable', 'array'],
            'message_attachments.*' => ['file', 'mimes:jpeg,png,jpg,gif,svg,txt,pdf,doc,docx,xls,xlsx,csv'],
            'user_id' => ['integer', Rule::exists('users', 'id')]
        ];
    }

    /**
     * @param Validator $validator
     * @return void
     */
    public function withValidator(Validator $validator): void
    {
        $validator->sometimes('message', 'required', fn($input) => empty($input->message_attachments));
    }
}
