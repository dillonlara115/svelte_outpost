<script lang="ts">
	import * as Table from "$lib/components/ui/table";
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
   </script>

<div class="flex flex-col items-center gap-1">
	<h1 class="text-lg font-semibold md:text-2xl">Saved Searches</h1>
	<p>View your saved searches here.</p>
</div>

<div>

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
		 <Table.Row>
		  <Table.Cell class="font-medium">Liquor store near Colorado Springs, CO</Table.Cell>
		  <Table.Cell>11-01-2024</Table.Cell>
		  <Table.Cell>
			<Button size="sm" href="/dashboard/saved/1">View</Button>
			<Button size="sm">Delete</Button>
		  </Table.Cell>
		 </Table.Row>
		 <Table.Row>
			<Table.Cell class="font-medium">restaurants store near Colorado Springs, CO</Table.Cell>
			<Table.Cell>11-01-2024</Table.Cell>
			<Table.Cell>
			  <Button size="sm" href="/dashboard/saved/1">View</Button>
			  <AlertDialog.Root>
				<AlertDialog.Trigger><Button>Delete</Button></AlertDialog.Trigger>
				<AlertDialog.Content>
				  <AlertDialog.Header>
					<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
					<AlertDialog.Description>
					  This action cannot be undone. This will permanently delete your account
					  and remove your data from our servers.
					</AlertDialog.Description>
				  </AlertDialog.Header>
				  <AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action>Continue</AlertDialog.Action>
				  </AlertDialog.Footer>
				</AlertDialog.Content>
			  </AlertDialog.Root>
			</Table.Cell>
		   </Table.Row>
		</Table.Body>
	   </Table.Root>
	   
	
</div>