<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\SumOfWeightsIs100;
use Illuminate\Validation\Rule;

class UpdateShortlinkRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $shortlink = $this->route('shortlink');

        if (!$shortlink) {
            return false;
        }

        return $this->user()->can('update', $shortlink);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $shortlink = $this->route('shortlink');

        $slugRule = Rule::unique('shortlinks', 'slug');

        if ($shortlink) {
            $slugRule->ignore($shortlink);
        }

        return [
            'title' => ['required', 'string', 'max:255'],
            'variants' => ['required', 'array', 'min:1', new SumOfWeightsIs100()],
            'variants.*.url' => ['required', 'url', 'max:2048'],
            'variants.*.weight' => ['required', 'numeric', 'integer', 'min:1', 'max:100'],

            'slug' => [
                'required',
                'string',
                'max:255',
                'alpha_dash:ascii',
                $slugRule,
            ],
        ];
    }
}
