<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import * as Card from "$lib/components/ui/card";


	export let data: PageData;
	$: ({ user } = data);

	
</script>

<div class="flex flex-col items-center gap-1">
	<h1 class="text-lg font-semibold md:text-2xl">Dashboard</h1>
	<p>Logged in as: {user?.email}</p>
</div>


<div class="grid gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-3">
<Card.Root>
	<Card.Header
		class="flex flex-row items-center justify-between space-y-0 pb-2"
	>
		<Card.Title class="text-sm font-medium">Saved Searches</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="text-2xl font-bold">5</div>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header
			class="flex flex-row items-center justify-between space-y-0 pb-2"
		>
			<Card.Title class="text-sm font-medium">Number of Searches Remaining</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold">3</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<Card.Title class="text-sm font-medium">Upgrade to Pro</Card.Title>
			</Card.Header>
			<Card.Content>
				<p class="text-muted-foreground text-xs">Unlock more saved searches and monthly searches.</p>
				</Card.Content>
			</Card.Root>
</div>


<div class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
	<div class="flex flex-col items-center gap-1 text-center">
		<h3 class="text-2xl font-bold tracking-tight">You have no saved searches</h3>
		<p class="text-muted-foreground text-sm">
			Start finding leads for your business.
		</p>
		<Button class="mt-4">Start Searching</Button>
	</div>
</div>
