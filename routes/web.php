<?php

use App\Http\Controllers\RedirectController;
use App\Models\Shortlink; // <--- GARANTA QUE ESTA LINHA 'use' EXISTA no topo
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- Rota da Página Inicial ---
Route::get('/', function () {
    return Inertia::render('welcome', [ 
        'canRegister' => app('router')->has('register'),
    ]);
})->name('welcome');

// --- ROTA PÚBLICA ---
Route::get('/redir/{shortlink:slug}', RedirectController::class);


// --- ROTAS DE AUTENTICAÇÃO ---
Route::middleware(['auth', 'verified'])->group(function () {

    // 1. ROTA DE LISTAGEM (DASHBOARD)
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // 2. ROTA DE CRIAÇÃO (FORMULÁRIO)
    Route::get('/shortlinks/create', function () {
        return Inertia::render('shortlinks/form', [
            'shortlink' => null
        ]);
    })->name('shortlinks.create'); // <-- Ponto-e-vírgula aqui

    // --- CORREÇÃO AQUI: Removemos o Route Model Binding ---
    // 3. ROTA DE EDIÇÃO (FORMULÁRIO)
    Route::get('/shortlinks/{slug}/edit', function (string $slug) { // Trocado 'Shortlink $shortlink' por 'string $slug'
        
        // Carregamos o modelo manualmente
        $shortlink = Shortlink::where('slug', $slug)->firstOrFail();

        if (! auth()->user()->can('update', $shortlink)) {
            abort(403);
        }

        return Inertia::render('shortlinks/form', [
            'shortlink' => $shortlink->load('variants')
        ]);
    })->name('shortlinks.edit'); // <-- Ponto-e-vírgula aqui

    // --- CORREÇÃO AQUI: Removemos o Route Model Binding ---
    // 4. ROTA DE RELATÓRIO
    Route::get('/shortlinks/{slug}/report', function (string $slug) { // Trocado 'Shortlink $shortlink' por 'string $slug'
        
        // Carregamos o modelo manualmente
        $shortlink = Shortlink::where('slug', $slug)->firstOrFail();

        if (! auth()->user()->can('view', $shortlink)) {
            abort(403);
        }

        return Inertia::render('shortlinks/report', [
            'shortlink' => $shortlink->load('variants')
        ]);
    })->name('shortlinks.report'); // <-- Ponto-e-vírgula aqui

}); // <-- Fecha o 'group'