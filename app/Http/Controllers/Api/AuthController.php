<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // 1. REGISTER (Daftar Akun Baru)
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'buyer', // Default role
        ]);

        // Langsung buatkan token agar user langsung login setelah daftar
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(
            [
                'success' => true,
                'message' => 'Registrasi berhasil',
                'data' => [
                    'user' => $user,
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                ],
            ],
            201,
        );
    }

    // 2. LOGIN (Masuk Aplikasi)
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // Cek apakah user ada DAN password benar
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Email atau Password salah',
                ],
                401,
            );
        }

        // Hapus token lama (opsional, agar 1 HP 1 Token)
        // $user->tokens()->delete();

        // Buat Token Baru
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'data' => [
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ],
        ]);
    }

    // 3. LOGOUT (Keluar)
    public function logout(Request $request)
    {
        // Kita ambil user yang sedang login
        $user = $request->user();

        // Cek apakah user punya token yang sedang aktif
        if ($user->currentAccessToken()) {
            // Kita beritahu editor bahwa ini adalah PersonalAccessToken agar method delete() dikenali
            /** @var \Laravel\Sanctum\PersonalAccessToken $token */
            $token = $user->currentAccessToken();

            // Hapus token
            $token->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil',
        ]);
    }

    // 4. ME (Cek Profil Sendiri)
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user(),
        ]);
    }
}
