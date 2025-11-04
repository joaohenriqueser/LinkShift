<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SumOfWeightsIs100 implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_array($value)) {
            return;
        }

        $weights = array_column($value, 'weight');

        $totalWeight = array_sum($weights);

        if($totalWeight !== 100){
            $fail('A soma de todos os pesos (weights) deve ser igual a 100.');
        }
    }
}
