<?php

namespace App\Http\Controllers;

use App\Models\Shortlink;
use App\Http\Requests\UpdateShortlinkRequest;
use Illuminate\Http\Request;
use App\Http\Requests\StoreShortlinkRequest;
use App\Services\ShortlinkService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use App\Http\Requests\ReportRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ShortlinkController extends Controller
{
    /**
     * @param StoreShortlinkRequest $request
     * @param ShortlinkService $shortlinkService
     * @return JsonResponse
     */

    use AuthorizesRequests;

    public function index(Request $request): JsonResponse
    {
        $shortlinks = $request->user()
                              ->shortlinks()
                              ->with('variants') 
                              ->latest()      
                              ->get();
        
        return response()->json($shortlinks);
    }

    public function store(StoreShortlinkRequest $request, ShortlinkService $service): JsonResponse
    {
        $shortlink = $service->createShortlink (
            $request->validated(),
            $request->user()
        );

        return response()->json($shortlink, 201);
    }
    /**
     * @param Shortlink $shortlink 
     */
    public function show(Shortlink $shortlink): JsonResponse
    {
        $this->authorize('view', $shortlink);

        return response()->json($shortlink->load('variants'));
    }

    /**
     * @param UpdateShortlinkRequest $request 
     * @param Shortlink $shortlink 
     * @param ShortlinkService $service
     */
    public function update(UpdateShortlinkRequest $request, Shortlink $shortlink, ShortlinkService $service): JsonResponse
    {      
        $updatedShortlink = $service->updateShortlink(
            $shortlink,
            $request->validated()
        );

        return response()->json($updatedShortlink);
    }

    /**
     * @param Shortlink $shortlink 
     * @param ShortlinkService $service
     */
    public function destroy(Shortlink $shortlink, ShortlinkService $service): Response
    {
        $this->authorize('delete', $shortlink);

        $service->deleteShortlink($shortlink);

        return response()->noContent();
    }

    /**
     * @param ReportRequest $request 
     * @param Shortlink $shortlink 
     * @param ShortlinkService $service
     * @return JsonResponse
     */
    public function report(ReportRequest $request, Shortlink $shortlink, ShortlinkService $service): JsonResponse
    {      
        $reportData = $service->getReport(
            $shortlink,
            $request->validated('start_date'),
            $request->validated('end_date')
        );

        return response()->json($reportData);
    }
}
