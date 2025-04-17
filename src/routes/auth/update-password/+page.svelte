<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import type { SupabaseClient } from '@supabase/supabase-js';

	// Access Supabase client passed down from root layout
	let supabase: SupabaseClient;
	$: ({ supabase } = $page.data); 

	let newPassword = '';
	let confirmPassword = '';
	let errorMessage = '';
	let successMessage = '';
	let isUpdating = false;
	let showPasswordForm = false; // Show form if recovery query param is present

	onMount(() => {
        console.log('Update Password page mounted.');
        const searchParams = new URLSearchParams(window.location.search);
        
        // --- Check for the recovery query parameter --- 
        if (searchParams.has('recovery') && searchParams.get('recovery') === 'true') {
            console.log('"recovery=true" query parameter found! Showing form.');
            showPasswordForm = true;
            
            // Remove the query parameter from the URL using replaceState
            const newUrl = window.location.pathname; // Keep path, remove query and hash
            window.history.replaceState({}, document.title, newUrl);
            console.log('Query parameter removed from URL.');
        } else {
            console.log('"recovery=true" query parameter NOT found.');
            // Optional: Show message or redirect if user lands here directly?
        }
        
        // --- Optional: Keep listener just for cleanup or other events? ---
        // We don't need it for the main logic anymore.
		const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('(Listener) Auth event received:', event); 
            // No action needed here based on event for showing the form
		});

        console.log('onAuthStateChange listener attached (optional).');

		// Cleanup subscription on component destroy
		return () => {
            console.log('Unsubscribing from auth state changes.');
            subscription.unsubscribe();
        };
	});

	async function handlePasswordUpdate() {
		if (newPassword !== confirmPassword) {
			errorMessage = 'Passwords do not match.';
			return;
		}
		if (!newPassword) {
			errorMessage = 'Password cannot be empty.';
			return;
		}

		isUpdating = true;
		errorMessage = '';
		successMessage = '';

		try {
			const { error } = await supabase.auth.updateUser({ password: newPassword });

			if (error) {
				toast.error(`Error updating password: ${error.message}`);
				errorMessage = `Error: ${error.message}`; 
			} else {
				toast.success('Password updated successfully! Redirecting to login...');
                successMessage = 'Password updated successfully! Redirecting to login...';
                // Clear form and potentially redirect after a delay
                newPassword = '';
                confirmPassword = '';
                showPasswordForm = false; // Hide form on success
                setTimeout(() => {
                    goto('/auth'); // Redirect to login page
                }, 2000); 
			}
		} catch (err: any) {
            toast.error('An unexpected error occurred during password update.');
			errorMessage = 'An unexpected error occurred.';
        } finally {
            isUpdating = false;
        }
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
		<h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Update Password</h1>

		{#if showPasswordForm}
            <form on:submit|preventDefault={handlePasswordUpdate} class="space-y-4">
                <div>
                    <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        bind:value={newPassword}
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your new password"
                    />
                </div>
                <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        bind:value={confirmPassword}
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirm your new password"
                    />
                </div>

                {#if errorMessage}
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                        {errorMessage}
                    </div>
                {/if}

                <button
                    type="submit"
                    class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        {:else if successMessage}
             <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">
                 {successMessage}
             </div>
        {:else}
            <p class="text-center text-gray-600">Waiting for password recovery confirmation...</p>
            <p class="text-center text-gray-500 text-sm mt-2">If you arrived here from a password reset email, the form should appear shortly.</p>
        {/if}
	</div>
</div>