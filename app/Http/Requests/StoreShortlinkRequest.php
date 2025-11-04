<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\SumOfWeightsIs100;
use Illuminate\Validation\Rule;

class StoreShortlinkRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            
            'slug' => [
                'required', 
                'string', 
                'max:255', 
                'alpha_dash:ascii', 
                Rule::unique('shortlinks', 'slug') 
            ],

            'variants' => [
                'required', 
                'array', 
                'min:1',
                new SumOfWeightsIs100()
            ],
            'variants.*.url' => [
                'required', 
                'url', 
                'max:2048'
            ],

            'variants.*.weight' => [
                'required', 
                'numeric', 
                'integer', 
                'min:1',   
                'max:100' 
            ],
        ];
    }
}
