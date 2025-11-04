<?php

namespace App\Services;

use App\Models\Shortlink;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Throwable;

class ShortlinkService
{
    /**
     * @param array $data
     * @param User $user
     * @return Shortlink
     * @throws Throwable
     */
    public function createShortlink(array $data, User $user): Shortlink
    {
        return DB::transaction(function () use ($data, $user) {
            $shortlink = $user->shortlinks()->create([
                'title' => $data['title'],
                'slug' => $data['slug'], 
            ]);

            foreach ($data['variants'] as $variantData) {
                $shortlink->variants()->create([
                    'url' => $variantData['url'],
                    'weight' => $variantData['weight'],
                ]);
            }

            return $shortlink->load('variants');
        });
    }

    /**
     * @param Shortlink $shortlink
     * @param array $data 
     * @return Shortlink 
     * @throws Throwable
     */
    public function updateShortlink(Shortlink $shortlink, array $data): Shortlink
    {
        return DB::transaction(function () use ($shortlink, $data) {
            
            $shortlink->update([
                'title' => $data['title'],
                'slug' => $data['slug'],
            ]);

            $shortlink->variants()->delete();

            foreach ($data['variants'] as $variantData) {
                $shortlink->variants()->create([
                    'url' => $variantData['url'],
                    'weight' => $variantData['weight'],
                ]);
            }

            return $shortlink->load('variants');
        });
    }

    /**
     * @param Shortlink $shortlink 
     * @return void
     */
    public function deleteShortlink(Shortlink $shortlink): void
    {       
        $shortlink->delete();
    }

    /**
     * @param Shortlink $shortlink
     * @return string 
     * @throws Throwable
     */
    public function selectVariantForRedirect(Shortlink $shortlink): string
    {
        
        return DB::transaction(function () use ($shortlink) {
            

            $variants = $shortlink->variants;

            $totalWeight = $variants->sum('weight');
            
            $randomNumber = rand(1, $totalWeight);

            $selectedVariant = null;
            $cumulativeWeight = 0; 

            foreach ($variants as $variant) {
                $cumulativeWeight += $variant->weight;
                
                if ($randomNumber <= $cumulativeWeight) {
                    $selectedVariant = $variant;
                    break; // Para o loop assim que encontrar
                }
            }
            
            if (!$selectedVariant) {
                $selectedVariant = $variants->first();
            }

            $shortlink->clicks()->create([
                'shortlink_variant_id' => $selectedVariant->id,
            ]);

            return $selectedVariant->url;
        });
    }
    /**
     * @param Shortlink $shortlink 
     * @param string $startDate (Formato 'Y-m-d')
     * @param string $endDate (Formato 'Y-m-d')
     * @return array
     */
    public function getReport(Shortlink $shortlink, string $startDate, string $endDate): array
    {
        $startOfDay = $startDate . ' 00:00:00';
        $endOfDay = $endDate . ' 23:59:59';

        $totalClicks = $shortlink->clicks()
            ->whereBetween('created_at', [$startOfDay, $endOfDay])
            ->count();

        $variantsData = $shortlink->variants()
            ->withCount([
                'clicks' => function ($query) use ($startOfDay, $endOfDay) {
                    $query->whereBetween('created_at', [$startOfDay, $endOfDay]);
                }
            ])
            ->get(); 

        return [
            'total_clicks_in_period' => $totalClicks,
            'variants_report' => $variantsData,
        ];
    }
}