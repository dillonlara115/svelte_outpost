<script lang="ts">
	import CircleUser from "lucide-svelte/icons/circle-user";
	import House from "lucide-svelte/icons/house";
	import Building2 from "lucide-svelte/icons/building-2";
	import Menu from "lucide-svelte/icons/menu";
	import Package2 from "lucide-svelte/icons/package-2";
	import Search from "lucide-svelte/icons/search";
  
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import * as Sheet from "$lib/components/ui/sheet/index.js";

	export let data;
	$: ({ supabase } = data);
	$: logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
		window.location.href = '/';
	};

  </script>
  
  <div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
	<div class="bg-muted/40 hidden border-r md:block">
	  <div class="flex h-full max-h-screen flex-col gap-2">
		<div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
		  <a href="/dashboard" class="flex items-center gap-2 font-semibold">
			<span class="">Outpost Leads</span>
		  </a>
		</div>
		<div class="flex-1">
		  <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
			<a
			  href="/dashboard"
			  class="bg-muted text-primary hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
			  
			>
			  <House class="h-4 w-4" />
			  Dashboard
			</a>
			<a
			  href="/dashboard/search"
			  class="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
			>
			  <Search class="h-4 w-4" />
			  Find Leads
			</a>
			<a
			  href="/dashboard/saved"
			  class="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
			>
			  <Building2 class="h-4 w-4" />
			  Saved Searches
			</a>
		  </nav>
		</div>
		<div class="mt-auto p-4">
		  <Card.Root>
			<Card.Header class="p-2 pt-0 md:p-4">
			  <Card.Title>Upgrade to Pro</Card.Title>
			  <Card.Description>
				Unlock all features and get unlimited access to our support team.
			  </Card.Description>
			</Card.Header>
			<Card.Content class="p-2 pt-0 md:p-4 md:pt-0">
			  <Button size="sm" class="w-full">Upgrade</Button>
			</Card.Content>
		  </Card.Root>
		</div>
	  </div>
	</div>
	<div class="flex flex-col">
	  <header class="bg-muted/40 flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
		<Sheet.Root>
		  <Sheet.Trigger asChild let:builder>
			<Button
			  variant="outline"
			  size="icon"
			  class="shrink-0 md:hidden"
			  builders={[builder]}
			>
			  <Menu class="h-5 w-5" />
			  <span class="sr-only">Toggle navigation menu</span>
			</Button>
		  </Sheet.Trigger>
		  <Sheet.Content side="left" class="flex flex-col">
			<nav class="grid gap-2 text-lg font-medium">
			  <a href="##" class="flex items-center gap-2 text-lg font-semibold">
				<Package2 class="h-6 w-6" />
				<span class="sr-only">Outpost Leads</span>
			  </a>
			  <a
				href="##"
				class="text-muted-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
			  >
				<House class="h-5 w-5" />
				Dashboard
			  </a>
			  <a
				href="/dashboard/search"
				class="text-muted-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
			  >
				<Search class="h-5 w-5" />
				Find Leads
			  </a>
			  <a
				href="/dashboard/saved"
				class="bg-muted text-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
			  >
				<Building2 class="h-5 w-5" />
				Saved Searches
			  </a>
			</nav>
			<div class="mt-auto">
			  <Card.Root>
				<Card.Header>
				  <Card.Title>Upgrade to Pro</Card.Title>
				  <Card.Description>
					Unlock all features and get unlimited access to our support
					team.
				  </Card.Description>
				</Card.Header>
				<Card.Content>
				  <Button size="sm" class="w-full">Upgrade</Button>
				</Card.Content>
			  </Card.Root>
			</div>
		  </Sheet.Content>
		</Sheet.Root>
		<div class="w-full flex-1">
		
		</div>
		<DropdownMenu.Root>
		  <DropdownMenu.Trigger asChild let:builder>
			<Button
			  builders={[builder]}
			  variant="secondary"
			  size="icon"
			  class="rounded-full"
			>
			  <CircleUser class="h-5 w-5" />
			  <span class="sr-only">Toggle user menu</span>
			</Button>
		  </DropdownMenu.Trigger>
		  <DropdownMenu.Content align="end">
			<DropdownMenu.Label>My Account</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>Settings</DropdownMenu.Item>
			<DropdownMenu.Item>Support</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item on:click={logout}>Logout</DropdownMenu.Item>
		  </DropdownMenu.Content>
		</DropdownMenu.Root>
	  </header>
	  <main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
		<slot />
		
		
	  </main>
	</div>
  </div>