<?php

namespace App\Http\Requests\Group;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Storage;

class StoreRequest extends FormRequest
{
    /**
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['string', 'max:121'],
            'description' => ['string', 'max:256'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,svg,png']
        ];
    }

    /**
     * @return void
     */
    protected function passedValidation(): void
    {
        if ($this->hasFile('image')) {
            $this->merge([
                'image_url' => Storage::url(
                    Storage::putFileAs(
                        'images',
                        data_get($this->validated(), 'image')
                    )
                )
            ]);
        }
    }
}
