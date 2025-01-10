<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { Button } from '$lib/components/ui/button';
	import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
	import { Badge } from '$lib/components/ui/badge';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import SquareArrowOutUpRight from 'lucide-svelte/icons/square-arrow-out-up-right';
	import { supabase } from '$lib/supabaseClient';
	import { page } from '$app/stores';
	import StarRating from '$lib/components/StarRating.svelte';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import Svelecte from 'svelecte';

	let businesses: any[] = [];
	let loading = false;
	let error = false;
	let searchLimitReached = false;

	let formData = {
		city: '',
		state: '',
		zipCode: '',
		businessType: '',
		womenOwned: false,
		asianOwned: false,
		blackOwned: false,
		latinoOwned: false,
		lgbtqOwned: false,
		veteranOwned: false,
		indigenousOwned: false,
		disabledOwned: false,
		verified: 'any'
	};

	$: session = $page.data.session;

	$: {
		if (session?.user?.id) {
			// Fetch the user data directly from Supabase
			supabase
				.from('users')
				.select('current_searches_this_month, max_searches_per_month')
				.eq('id', session.user.id)
				.single()
				.then(({ data, error }) => {
					if (data) {
						searchLimitReached = data.current_searches_this_month >= data.max_searches_per_month;
						console.log('User data:', data);
					}
					if (error) console.error('Error fetching user data:', error);
				});
		}
	}

	const stateOptions = [
        { value: 'AL', label: 'Alabama' },
        { value: 'AK', label: 'Alaska' },
        { value: 'AZ', label: 'Arizona' },
        { value: 'AR', label: 'Arkansas' },
        { value: 'CA', label: 'California' },
        { value: 'CO', label: 'Colorado' },
        { value: 'CT', label: 'Connecticut' },
        { value: 'DE', label: 'Delaware' },
        { value: 'FL', label: 'Florida' },
        { value: 'GA', label: 'Georgia' },
        { value: 'HI', label: 'Hawaii' },
        { value: 'ID', label: 'Idaho' },
        { value: 'IL', label: 'Illinois' },
        { value: 'IN', label: 'Indiana' },
        { value: 'IA', label: 'Iowa' },
        { value: 'KS', label: 'Kansas' },
        { value: 'KY', label: 'Kentucky' },
        { value: 'LA', label: 'Louisiana' },
        { value: 'ME', label: 'Maine' },
        { value: 'MD', label: 'Maryland' },
        { value: 'MA', label: 'Massachusetts' },
        { value: 'MI', label: 'Michigan' },
        { value: 'MN', label: 'Minnesota' },
        { value: 'MS', label: 'Mississippi' },
        { value: 'MO', label: 'Missouri' },
        { value: 'MT', label: 'Montana' },
        { value: 'NE', label: 'Nebraska' },
        { value: 'NV', label: 'Nevada' },
        { value: 'NH', label: 'New Hampshire' },
        { value: 'NJ', label: 'New Jersey' },
        { value: 'NM', label: 'New Mexico' },
        { value: 'NY', label: 'New York' },
        { value: 'NC', label: 'North Carolina' },
        { value: 'ND', label: 'North Dakota' },
        { value: 'OH', label: 'Ohio' },
        { value: 'OK', label: 'Oklahoma' },
        { value: 'OR', label: 'Oregon' },
        { value: 'PA', label: 'Pennsylvania' },
        { value: 'RI', label: 'Rhode Island' },
        { value: 'SC', label: 'South Carolina' },
        { value: 'SD', label: 'South Dakota' },
        { value: 'TN', label: 'Tennessee' },
        { value: 'TX', label: 'Texas' },
        { value: 'UT', label: 'Utah' },
        { value: 'VT', label: 'Vermont' },
        { value: 'VA', label: 'Virginia' },
        { value: 'WA', label: 'Washington' },
        { value: 'WV', label: 'West Virginia' },
        { value: 'WI', label: 'Wisconsin' },
        { value: 'WY', label: 'Wyoming' }
    ];


	// Business type options array
    const businessTypeOptions = [
        { value: 'accountant', label: 'Accountant' },
        { value: 'advertising_agency', label: 'Advertising Agency' },
        { value: 'attorney', label: 'Attorney' },
        { value: 'auto_dealer', label: 'Auto Dealer' },
        { value: 'auto_repair', label: 'Auto Repair' },
        { value: 'bank', label: 'Bank' },
        { value: 'beauty_salon', label: 'Beauty Salon' },
        { value: 'chiropractor', label: 'Chiropractor' },
        { value: 'construction', label: 'Construction' },
        { value: 'dentist', label: 'Dentist' },
        { value: 'doctor', label: 'Doctor' },
        { value: 'electrician', label: 'Electrician' },
        { value: 'financial_advisor', label: 'Financial Advisor' },
        { value: 'florist', label: 'Florist' },
        { value: 'funeral_home', label: 'Funeral Home' },
        { value: 'furniture_store', label: 'Furniture Store' },
        { value: 'gym', label: 'Gym' },
        { value: 'hair_salon', label: 'Hair Salon' },
        { value: 'hardware_store', label: 'Hardware Store' },
        { value: 'insurance_agency', label: 'Insurance Agency' },
        { value: 'jewelry_store', label: 'Jewelry Store' },
        { value: 'landscaping', label: 'Landscaping' },
        { value: 'locksmith', label: 'Locksmith' },
        { value: 'mortgage_broker', label: 'Mortgage Broker' },
        { value: 'moving_company', label: 'Moving Company' },
        { value: 'optometrist', label: 'Optometrist' },
        { value: 'painter', label: 'Painter' },
        { value: 'pest_control', label: 'Pest Control' },
        { value: 'photographer', label: 'Photographer' },
        { value: 'plumber', label: 'Plumber' },
        { value: 'real_estate_agency', label: 'Real Estate Agency' },
        { value: 'restaurant', label: 'Restaurant' },
        { value: 'roofing', label: 'Roofing' },
        { value: 'security_system', label: 'Security System' },
        { value: 'spa', label: 'Spa' },
        { value: 'storage', label: 'Storage' },
        { value: 'tax_preparation', label: 'Tax Preparation' },
        { value: 'travel_agency', label: 'Travel Agency' },
        { value: 'veterinarian', label: 'Veterinarian' },
        { value: 'web_design', label: 'Web Design' }
    ];


	console.log('max searches', session?.user?.max_searches_per_month);
	console.log('current searches', session?.user?.current_searches_this_month);

	console.log(searchLimitReached);

	async function getBusinesses() {
		loading = true;
		error = false;
		try {
			if (!session) {
				throw new Error('Not authenticated');
			}

			// Continue with search if limit not reached
			const params = new URLSearchParams({
			city: formData.city,
			state: formData.state,
			zipCode: formData.zipCode,
			type: formData.businessType,
			womenOwned: formData.womenOwned.toString(),
			asianOwned: formData.asianOwned.toString(),
			blackOwned: formData.blackOwned.toString(),
			latinoOwned: formData.latinoOwned.toString(),
			lgbtqOwned: formData.lgbtqOwned.toString(),
			veteranOwned: formData.veteranOwned.toString(),
			indigenousOwned: formData.indigenousOwned.toString(),
			disabledOwned: formData.disabledOwned.toString(),
			verified: formData.verified === 'any' ? '' : formData.verified,
		}).toString();

			const response = await fetch(`/api/businesses?${params}`);
			const data = await response.json();
			console.log('Frontend received data:', data);
			businesses = data.businesses || [];
			console.log('Assigned businesses:', businesses);

			// Only increment search count if we got results
			if (businesses && businesses.length > 0) {
				const { error: updateError } = await supabase.rpc('increment_search_count', {
					user_id: session.user.id
				});

				if (updateError) {
					console.error('Error updating search count:', updateError);
				}
			}
		} catch (e) {
			error = true;
			console.error('Search error:', e);
		} finally {
			loading = false;
		}
	}

	async function saveSearch() {
		const searchData = {
			query: {
				city: formData.city,
				state: formData.state,
				zipCode: formData.zipCode,
				businessType: formData.businessType
			},
			results: businesses // Save current search results
		};

		try {
			const response = await fetch('/dashboard/search', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(searchData)
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to save search');
			}

			// Show success message
			alert('Search saved successfully!');
		} catch (error) {
			console.error('Error saving search:', error);
			alert(error.message);
		}
	}

	function handleSubmit() {
		getBusinesses();
	}

	const ownershipTypes = [
		'Identifies as Asian-owned',
		'Identifies as Black-owned',
		'Identifies as disabled-owned',
		'Identifies as Indigenous-owned',
		'Identifies as Latino-owned',
		'Identifies as LGBTQ+ owned',
		'Identifies as veteran-owned',
		'Identifies as women-owned'
	];

	function getOwnershipStatus(business: any): string[] {
		const statuses: string[] = [];
		const fromBusiness = business.about?.['From the business'] || {};

		for (const [key, value] of Object.entries(fromBusiness)) {
			if (key.startsWith('Identifies as') && value === true) {
				statuses.push(key);
			}
		}
		return statuses;
	}
</script>

<div class="flex flex-col items-center gap-1">
	<h1 class="text-lg font-semibold md:text-2xl">Find Business Leads</h1>
	<p>Search for businesses in your area.</p>
</div>
{#if searchLimitReached}
	<Alert.Root variant="destructive" class="bg-red-400">
		<Alert.Title>Max Searches Reached</Alert.Title>
		<Alert.Description
			>You've reached your monthly search limit of {session.user.max_searches_per_month} searches. Please
			upgrade to Pro (coming soon) to continue.</Alert.Description
		>
	</Alert.Root>
{/if}
<div>
	<form on:submit|preventDefault={handleSubmit} class="dark">
		<Label>City*</Label>
		<Input type="text" class="mb-2" required bind:value={formData.city} placeholder="Enter city" />

		<Label>State*</Label>
		<Svelecte 
			options={stateOptions}
			bind:value={formData.state}
			placeholder="Select state"
			class="mb-2"
			required
			disabled={searchLimitReached}
		/>

		<Label>Zip Code(optional)</Label>
		<Input type="text" class="mb-2" bind:value={formData.zipCode} placeholder="Enter zip code" />

		<Label>Business Type*</Label>
		<Svelecte 
			options={businessTypeOptions}
			bind:value={formData.businessType}
			placeholder="Select business type"
			class="mb-2"
			required
			disabled={searchLimitReached}
		/>

		<div class="mb-4">
			<Label>Business Filters</Label>
			<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
				<div class="flex items-center space-x-2">
					<Checkbox id="womenOwned" bind:checked={formData.womenOwned} />
					<Label for="womenOwned" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Women Owned
					</Label>
				</div>
				<div class="flex items-center space-x-2">
					<Checkbox id="asianOwned" bind:checked={formData.asianOwned} />
					<Label for="asianOwned" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Asian Owned
					</Label>
				</div>
				<div class="flex items-center space-x-2">
					<Checkbox id="blackOwned" bind:checked={formData.blackOwned} />
					<Label for="blackOwned" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Black Owned
					</Label>
				</div>
				<div class="flex items-center space-x-2">
					<Checkbox id="latinoOwned" bind:checked={formData.latinoOwned} />
					<Label for="latinoOwned" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Latino Owned
					</Label>
				</div>
				<div class="flex items-center space-x-2">
					<Checkbox id="lgbtqOwned" bind:checked={formData.lgbtqOwned} />
					<Label for="lgbtqOwned" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						LGBTQ+ Owned
					</Label>
				</div>
				<div class="flex items-center space-x-2">
					<Checkbox id="veteranOwned" bind:checked={formData.veteranOwned} />
					<Label for="veteranOwned" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Veteran Owned
					</Label>
				</div>
				<div class="flex items-center space-x-2">
					<Checkbox id="indigenousOwned" bind:checked={formData.indigenousOwned} />
					<Label for="indigenousOwned" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Indigenous Owned
					</Label>
				</div>
				<div class="flex items-center space-x-2">
					<Checkbox id="disabledOwned" bind:checked={formData.disabledOwned} />
					<Label for="disabledOwned" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Disabled Owned
					</Label>
				</div>
			</div>
			<div class="mb-4">
				<Label>Google Verified Status</Label>
				<RadioGroup.Root 
					value={formData.verified} 
					onValueChange={(value) => formData.verified = value}
					class="grid gap-2"
				>
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="any" id="verified-any" />
						<Label for="verified-any">Show All</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="yes" id="verified-yes" />
						<Label for="verified-yes">Verified Only</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroup.Item value="no" id="verified-no" />
						<Label for="verified-no">Not Verified Only</Label>
					</div>
					<RadioGroup.Input name="verified" />
				</RadioGroup.Root>
			</div>
		</div>

		<Button type="submit" disabled={searchLimitReached}>
			{searchLimitReached ? 'Search Limit Reached' : 'Start Searching'}
		</Button>
	</form>

	{#if loading}
		<p class="mt-4">Searching...</p>
	{:else if error}
		<p>Error searching for businesses</p>
	{:else if businesses.length}
		<Card.Root class="mt-4">
			<Card.Header>
				<Card.Title>Search Results</Card.Title>
				<Card.Description>
					View and manage your search results. You must save your search in order to view additional
					information about a business.
				</Card.Description>
				<div class="flex justify-end">
					<Button variant="outline" size="sm" on:click={saveSearch}>Save Search</Button>
				</div>
			</Card.Header>
			<Card.Content>
				<ScrollArea class="" orientation="horizontal" type="always">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head class="w-[150px]">Logo</Table.Head>
								<Table.Head class="w-[175px]">Name</Table.Head>
								<Table.Head class="w-[200px]">Address</Table.Head>
								<Table.Head class="w-[100px]">Rating</Table.Head>
								<Table.Head class="w-[100px]">Ownership</Table.Head>
								<Table.Head class="w-[100px]">Verified</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each businesses as business}
								<Table.Row>
									<Table.Cell>
										<img
											src={`/api/proxy/image?url=${encodeURIComponent(business.photo)}`}
											alt="Business"
											class="h-auto w-44 rounded-md"
										/>
									</Table.Cell>
									<Table.Cell class="font-medium">
										{#if business.site}
											<a href={business.site} target="_blank" rel="noreferrer">
												{business.display_name}
												<SquareArrowOutUpRight size={14} />
											</a>
										{:else}
											{business.display_name}
										{/if}
									</Table.Cell>
									<Table.Cell>{business.address}</Table.Cell>
									<Table.Cell>
										<StarRating rating={business.rating} />
										<br /> based on {business.reviews} reviews
									</Table.Cell>
									<Table.Cell>
										{#each getOwnershipStatus(business) as status}
											<Badge class="mb-2">
												{status.replace('Identifies as ', '')}
											</Badge>
										{/each}
									</Table.Cell>
									<Table.Cell>
										<Badge variant={business.verified ? 'secondary' : 'destructive'}>
											{business.verified ? 'Verified' : 'Not Verified'}
										</Badge>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</ScrollArea>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
