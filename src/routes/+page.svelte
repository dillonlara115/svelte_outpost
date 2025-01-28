<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from "$lib/components/ui/radio-group";

	let isLogin = true;
	let selectedPlan = 'prod_RclJpzqmjs07Uu'; // Default to Standard Plan

	function handlePlanChange(event: Event) {
		const target = event.target as HTMLInputElement;
		selectedPlan = target.value;
	}
</script>

<div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
	<div class="flex items-center justify-center py-12">
		<div class="mx-auto grid w-[350px] gap-6">
			<div class="grid gap-2 text-center">
				<h1 class="text-3xl font-bold">{isLogin ? 'Login' : 'Sign Up'}</h1>
				<p class="text-balance text-muted-foreground">
					{isLogin
						? 'Enter your email below to login to your account'
						: 'Create an account to get started'}
				</p>
			</div>
			<form method="POST" action={isLogin ? '?/login' : '?/signup'} on:submit={() => console.log('Form submitted')}>
				<div class="grid gap-4">
					<div class="grid gap-2">
						<Label for="email">Email</Label>
						<Input id="email" type="email" name="email" placeholder="m@example.com" required />
					</div>
					<div class="grid gap-2">
						<div class="flex items-center">
							<Label for="password">Password</Label>
							{#if isLogin}
								<a href="/auth/reset-password" class="ml-auto inline-block text-sm underline">
									Forgot your password?
								</a>
							{/if}
						</div>
						<Input id="password" type="password" name="password" required />
					</div>
					{#if !isLogin}
						<div class="grid gap-2">
							<Label>Select Plan</Label>
							<div class="flex gap-4">
								<label class="flex-1 cursor-pointer rounded border p-4 hover:bg-muted">
									<input type="radio" name="priceId" value={import.meta.env.DEV ? 'price_1QjVoaB8sVzGezu0kfetCOuV' : 'price_1QjVmwB8sVzGezu02fSPx4ud'} bind:group={selectedPlan} on:change={handlePlanChange} required />
									<div class="text-lg font-semibold">Standard Plan</div>
									<div class="text-sm text-muted-foreground">$20/month</div>
								</label>
								<label class="flex-1 cursor-pointer rounded border p-4 hover:bg-muted">
									<input type="radio" name="priceId" value={import.meta.env.DEV ? 'price_1QjVoxB8sVzGezu0olflndDZ' : 'price_1QjVnQB8sVzGezu0lZyVFAYQ'} bind:group={selectedPlan} on:change={handlePlanChange} required />
									<div class="text-lg font-semibold">Business Pro Plan</div>
									<div class="text-sm text-muted-foreground">$50/month</div>
								</label>
							</div>
						</div>
					{/if}
					<Button type="submit" class="w-full">
						{isLogin ? 'Login' : 'Sign Up'}
					</Button>
				</div>

				<div class="mt-4 text-center text-sm">
					{#if isLogin}
						Don't have an account?
						<button type="button" class="underline" on:click={() => (isLogin = false)}>
							Sign up
						</button>
					{:else}
						Already have an account?
						<button type="button" class="underline" on:click={() => (isLogin = true)}>
							Login
						</button>
					{/if}
				</div>
			</form>
		</div>
	</div>
	<div class="hidden bg-muted lg:block">
		<img
			src="/images/auth.jpg"
			alt="Outpost Leads Login"
			width="1920"
			height="1080"
			class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
		/>
	</div>
</div>
