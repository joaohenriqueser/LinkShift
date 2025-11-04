<?php

namespace App\Http\Controllers;

use App\Models\Shortlink;
use App\Services\ShortlinkService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse; 

class RedirectController extends Controller
{
    /**
     * @param Shortlink $shortlink
     * @param ShortlinkService $service
     * @return RedirectResponse
     */
    public function __invoke(Shortlink $shortlink, ShortlinkService $service): RedirectResponse
    {
        $redirectUrl = $service->selectVariantForRedirect($shortlink);

        return redirect()->away($redirectUrl, 302);
    }
}