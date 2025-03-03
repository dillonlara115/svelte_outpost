<script lang="ts">
    import { page } from '$app/stores';
	import * as Table from '$lib/components/ui/table';
	import { invalidate } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';	
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
    import { supabase } from '$lib/supabaseClient.js';

    export let data;
    $: ({ savedSearches } = data);

    async function deleteSearch(searchId: string) {
        try {
            if (!$page.data.session?.user?.id) {
                console.error('No session found');
                return;
            }

            const { data: deleteData, error } = await data.supabase
                .from('saved_searches')
                .delete()
                .match({ 
                    id: searchId,
                    user_id: $page.data.session.user.id
                })
                .select();

            if (error) {
                console.error('Error deleting search:', error);
                return;
            }

            // Refresh the page data
            await invalidate('supabase:db');  // This will trigger a reload of the data
            
        } catch (e) {
            console.error('Exception in deleteSearch:', e);
        }
    }
</script>

<div class="flex flex-col items-center gap-1">
	<h1 class="text-lg font-semibold md:text-2xl">Saved Searches</h1>
	<p>View your saved searches here.</p>
</div>

<div>
	{#if savedSearches.length === 0}
		<p>No saved searches found</p>
	{:else}
		<Table.Root>
			<Table.Caption>A list of your saved searches.</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>Search Details</Table.Head>
					<Table.Head>Created</Table.Head>
					<Table.Head>Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each savedSearches as search}
					<Table.Row>
						<Table.Cell class="font-medium capitalize">
							{search.search_data.query.businessType} near {search.search_data.query.city}, {search
								.search_data.query.state}
							{#if search.search_data.query.zipCode}
								({search.search_data.query.zipCode})
							{/if}
						</Table.Cell>
						<Table.Cell>{new Date(search.created_at).toLocaleDateString()}</Table.Cell>
						<Table.Cell class="space-x-2">
							<Button size="sm" href="/dashboard/saved/{search.id}">View</Button>
							<AlertDialog.Root>
								<AlertDialog.Trigger>
									<Button size="sm" variant="destructive">Delete</Button>
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Delete this saved search?</AlertDialog.Title>
										<AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
										<AlertDialog.Action on:click={() => deleteSearch(search.id)}>
											Delete
										</AlertDialog.Action>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>
