<script lang="ts">
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import Ellipsis from "lucide-svelte/icons/ellipsis";
	import SquareArrowOutUpRight from "lucide-svelte/icons/square-arrow-out-up-right";
	import { supabase } from "$lib/supabaseClient";
	import { page } from "$app/stores";
	import * as Alert from "$lib/components/ui/alert/index.js";

	let businesses: any[] = [];
    let loading = false;
    let error = false;
	let searchLimitReached = false;

	let formData = {
        city: '',
        state: '',
        zipCode: '',
        businessType: ''
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
            type: formData.businessType
        }).toString();

        const response = await fetch(`/api/businesses?${params}`);
        const data = await response.json();
        businesses = data.businesses[0];

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
        'Identifies as women-owned',
    ];

    function getOwnershipStatus(business: any): string[] {
        const statuses: string[] = [];
        const fromBusiness = business.about?.['From the business'] || {};
        
        for (const type of ownershipTypes) {
            if (fromBusiness[type] === true) {
                statuses.push(type);
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
	  >You've reached your monthly search limit of {session.user.max_searches_per_month} searches. Please upgrade to Pro (coming soon) to continue.</Alert.Description
	>
  </Alert.Root>
{/if}
<div>
	<form on:submit|preventDefault={handleSubmit}>
		<Label>City</Label>
		<Input type="text" bind:value={formData.city} placeholder="Enter city" />

		<Label>State</Label>
		<Input type="text" bind:value={formData.state} placeholder="Enter state" />

		<Label>Zip Code</Label>
		<Input type="text" bind:value={formData.zipCode} placeholder="Enter zip code" />

		<Label>Business Type</Label>
		<select  bind:value={formData.businessType} class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mb-6">
			<option value="" disabled selected>Select business type</option>
					<option value="accountant">Accountant</option>
					<option value="advertising_agency">Advertising Agency</option>
					<option value="amusement_park">Amusement Park</option>
					<option value="aquarium">Aquarium</option>
					<option value="art_gallery">Art Gallery</option>
					<option value="attorney">Attorney</option>
					<option value="bakery">Bakery</option>
					<option value="bank">Bank</option>
					<option value="bar">Bar</option>
					<option value="beauty_salon">Beauty Salon</option>
					<option value="bicycle_store">Bicycle Store</option>
					<option value="book_store">Book Store</option>
					<option value="bowling_alley">Bowling Alley</option>
					<option value="cafe">Cafe</option>
					<option value="campground">Campground</option>
					<option value="car_dealer">Car Dealer</option>
					<option value="car_rental">Car Rental</option>
					<option value="car_repair">Car Repair</option>
					<option value="car_wash">Car Wash</option>
					<option value="church">Church</option>
					<option value="city_hall">City Hall</option>
					<option value="clothing_store">Clothing Store</option>
					<option value="convenience_store">Convenience Store</option>
					<option value="courthouse">Courthouse</option>
					<option value="dentist">Dentist</option>
					<option value="department_store">Department Store</option>
					<option value="doctor">Doctor</option>
					<option value="electrician">Electrician</option>
					<option value="electronics_store">Electronics Store</option>
					<option value="fire_station">Fire Station</option>
					<option value="florist">Florist</option>
					<option value="funeral_home">Funeral Home</option>
					<option value="furniture_store">Furniture Store</option>
					<option value="gas_station">Gas Station</option>
					<option value="gym">Gym</option>
					<option value="hair_care">Hair Care</option>
					<option value="hardware_store">Hardware Store</option>
					<option value="home_goods_store">Home Goods Store</option>
					<option value="hospital">Hospital</option>
					<option value="insurance_agency">Insurance Agency</option>
					<option value="jewelry_store">Jewelry Store</option>
					<option value="laundry">Laundry</option>
					<option value="lawyer">Lawyer</option>
					<option value="library">Library</option>
					<option value="liquor_store">Liquor Store</option>
					<option value="local_government_office">Local Government Office</option>
					<option value="locksmith">Locksmith</option>
					<option value="lodging">Lodging</option>
					<option value="meal_delivery">Meal Delivery</option>
					<option value="meal_takeaway">Meal Takeaway</option>
					<option value="movie_rental">Movie Rental</option>
					<option value="movie_theater">Movie Theater</option>
					<option value="moving_company">Moving Company</option>
					<option value="museum">Museum</option>
					<option value="night_club">Night Club</option>
					<option value="painter">Painter</option>
					<option value="parking">Parking</option>
					<option value="pet_store">Pet Store</option>
					<option value="pharmacy">Pharmacy</option>
					<option value="physiotherapist">Physiotherapist</option>
					<option value="plumber">Plumber</option>
					<option value="police">Police</option>
					<option value="post_office">Post Office</option>
					<option value="real_estate_agency">Real Estate Agency</option>
					<option value="restaurant">Restaurant</option>
					<option value="roofing_contractor">Roofing Contractor</option>
					<option value="rv_park">RV Park</option>
					<option value="school">School</option>
					<option value="shoe_store">Shoe Store</option>
					<option value="shopping_mall">Shopping Mall</option>
					<option value="spa">Spa</option>
					<option value="storage">Storage</option>
					<option value="store">Store</option>
					<option value="supermarket">Supermarket</option>
					<option value="taxi_stand">Taxi Stand</option>
					<option value="train_station">Train Station</option>
					<option value="travel_agency">Travel Agency</option>
					<option value="veterinary_care">Veterinary Care</option>
			</select>

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
					View and manage your search results. You must save your search in order to view additional information about a business.
				</Card.Description>
				<div class="flex justify-end">
					<Button variant="outline" size="sm" on:click={saveSearch}>
						Save Search
					</Button>
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
										class="w-44 h-auto rounded-md"
										/>
								</Table.Cell>
								<Table.Cell class="font-medium">
									{#if business.site}
										<a href={business.site} target="_blank" rel="noreferrer">
											{business.name} <SquareArrowOutUpRight size={14} />
										</a>
									{:else}
										{business.name}
									{/if}
								</Table.Cell>
								<Table.Cell>{business.full_address}</Table.Cell>
								<Table.Cell>{business.rating}<br/> based on {business.reviews} reviews</Table.Cell>
								<Table.Cell>
									{#each getOwnershipStatus(business) as status}
										<Badge class="mb-2">
											{status.replace('Identifies as ', '')}
										</Badge>
									{/each}
								</Table.Cell>
								<Table.Cell>
									<Badge variant="{business.verified ? 'secondary' : 'destructive'}">
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
