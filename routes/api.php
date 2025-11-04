<?php

use App\Http\Controllers\ShortlinkController; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('shortlinks')
    ->middleware('auth:sanctum')
    ->controller(ShortlinkController::class)
    ->group(function () {
    
    Route::post('/', 'store');

    Route::get('/', 'index');

    Route::get('/{shortlink}', 'show');

    Route::put('/{shortlink}', 'update');
    Route::patch('/{shortlink}', 'update');

    Route::delete('/{shortlink}', 'destroy');

    Route::get('/{shortlink}/report', 'report');
});