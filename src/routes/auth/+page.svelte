<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";

	let isLogin = true;
</script>
  
<div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
	<div class="flex items-center justify-center py-12">
		<div class="mx-auto grid w-[350px] gap-6">
			<div class="grid gap-2 text-center">
				<h1 class="text-3xl font-bold">{isLogin ? 'Login' : 'Sign Up'}</h1>
				<p class="text-muted-foreground text-balance">
					{isLogin 
						? 'Enter your email below to login to your account'
						: 'Create an account to get started'
					}
				</p>
			</div>
			<form method="POST" action={isLogin ? "?/login" : "?/signup"}>
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
					<Button type="submit" class="w-full">
						{isLogin ? 'Login' : 'Sign Up'}
					</Button>
				</div>
				
				<div class="mt-4 text-center text-sm">
					{#if isLogin}
						Don't have an account?
						<button type="button" class="underline" on:click={() => isLogin = false}>
							Sign up
						</button>
					{:else}
						Already have an account?
						<button type="button" class="underline" on:click={() => isLogin = true}>
							Login
						</button>
					{/if}
				</div>
			</form>
		</div>
	</div>
	<div class="bg-muted hidden lg:block">
		<img
			src="/images/auth.jpg"
			alt="Outpost Leads Login"
			width="1920"
			height="1080"
			class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
		/>
	</div>
</div>