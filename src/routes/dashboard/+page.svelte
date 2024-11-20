<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	export let data: PageData;

	// Destructure data to get the user object
	let user = data.user;

	// Default values for user fields, to handle the case when `user` is null
	let max_saved_searches = 0;
	let current_searches_this_month = 0;
	let max_searches_per_month = 0;
	let email = '';
	let role_name = '';

	// If `user` is not null, update the values accordingly
	if (user) {
		({ max_saved_searches, current_searches_this_month, max_searches_per_month, email } = user);
		role_name = user.roles?.role_name ?? '';
	}
</script>

<div class="flex flex-col items-center gap-1">
	<h1 class="text-lg font-semibold md:text-2xl">Dashboard</h1>
	<p>Logged in as: {email}</p>
	<p>Role: {role_name}</p>
</div>

<div class="grid gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-3">
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium">Saved Searches</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold">{max_saved_searches}</div>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium">Number of Searches Remaining</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold">{max_searches_per_month - current_searches_this_month}</div>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
			<Card.Title class="text-sm font-medium">Upgrade to Pro (Coming Soon!)</Card.Title>
		</Card.Header>
		<Card.Content>
			<p class="text-xs text-muted-foreground">Unlock more saved searches and monthly searches.</p>
			
		</Card.Content>
	</Card.Root>
</div>

<div class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
	<div class="flex flex-col items-center gap-1 text-center">
		<h3 class="text-2xl font-bold tracking-tight">Start finding leads for your business.</h3>
		<Button class="mt-4" href="/dashboard/search">Start Searching</Button>
	</div>
</div>
