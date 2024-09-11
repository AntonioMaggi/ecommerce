<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'image_url' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function index()
    {
        $products = Product::all();
        return response()->json($products);
    }
}
