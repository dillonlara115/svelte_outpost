<script lang="ts">
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	let user: any = null;
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
			
			if (authError) throw authError;
			
			user = currentUser;
		} catch (e) {
			error = (e as Error).message;
		} finally {
			loading = false;
		}
	});

	async function handleSignOut() {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			window.location.href = '/';
		} catch (e) {
			error = (e as Error).message;
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-8">My Account</h1>

	{#if loading}
		<div class="flex justify-center">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
		</div>
	{:else if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
			{error}
		</div>
	{:else if user}
		<div class="bg-white shadow rounded-lg p-6">
			<div class="mb-6">
				<h2 class="text-xl font-semibold mb-2">Profile Information</h2>
				<p class="text-gray-600">Email: {user.email}</p>
				<p class="text-gray-600">Last Sign In: {new Date(user.last_sign_in_at).toLocaleString()}</p>
			</div>

			<div class="mb-6">
				<h2 class="text-xl font-semibold mb-2">Account Settings</h2>
				<button
					on:click={handleSignOut}
					class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
				>
					Sign Out
				</button>
			</div>
		</div>
	{:else}
		<div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
			Please sign in to view your account details.
		</div>
	{/if}
</div>
