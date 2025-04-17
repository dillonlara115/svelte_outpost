<script lang="ts">
	import { goto } from '$app/navigation';
    import type { ActionData } from './$types';

    // Get potential success/error messages from the server action
    export let form: ActionData;
</script>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
		<h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Reset Password</h1>
		
		<!-- Standard SvelteKit form using POST -->
		<form method="POST" action="?/reset" class="space-y-4">
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
				<input
					type="email"
					name="email" 
					id="email"
                    value={form?.email ?? ''}
					required
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Enter your email"
                    aria-describedby={form?.message && !form?.success ? "error-message" : undefined}
				/>
			</div>

            <!-- Display Success Message -->
			{#if form?.success}
				<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">
					{form.message}
				</div>
			{/if}

            <!-- Display Error Message -->
			{#if form?.message && !form?.success}
				<div id="error-message" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
					{form.message}
				</div>
			{/if}

			<button
				type="submit"
				class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
			>
				Send Reset Instructions
			</button>

			<button
				type="button"
				class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded transition-colors mt-2"
				on:click={() => goto('/auth')} 
			>
				Back to Login
			</button>
		</form>
	</div>
</div> 