<script lang="ts">
	import * as Table from "$lib/components/ui/table";
	import { Button } from '$lib/components/ui/button';
    import { Star, ExternalLink } from 'lucide-svelte';   
    import { Badge } from '$lib/components/ui/badge';
   </script>

<div class="flex flex-col items-center gap-1">
	<h1 class="text-lg font-semibold md:text-2xl">Saved Search Results for Liquor store near Colorado Springs, CO</h1>
</div>

<div>

	<Table.Root>
		<Table.Caption>A list of your saved searches.</Table.Caption>
		<Table.Header>
		 <Table.Row>
		  <Table.Head>Name</Table.Head>
		  <Table.Head>Address</Table.Head>
		  <Table.Head>Phone</Table.Head>
		  <Table.Head>Rating/Reviews</Table.Head>
          <Table.Head>Email</Table.Head>
          <Table.Head>GBP Verified</Table.Head>
          <Table.Head>Minority-Owned</Table.Head>
		 </Table.Row>
		</Table.Header>
		<Table.Body>
		 <Table.Row>
		  <Table.Cell class="font-medium">Liquor Plus</Table.Cell>
		  <Table.Cell>3725 Van Teylingen Dr, Colorado Springs, CO 80917<ExternalLink size={16} /></Table.Cell>
          <Table.Cell>(330) 456-7890</Table.Cell>
		  <Table.Cell>
            4.5
		  </Table.Cell>
          <Table.Cell>test@email.com</Table.Cell>
          <Table.Cell>Yes</Table.Cell>
          <Table.Cell>Veteran Owned</Table.Cell>
		 </Table.Row>
         <Table.Row>
            <Table.Cell class="font-medium">Liquor Plus</Table.Cell>
            <Table.Cell>3725 Van Teylingen Dr, Colorado Springs, CO 80917<ExternalLink size={16} /></Table.Cell>
            <Table.Cell>(330) 456-7890</Table.Cell>
            <Table.Cell>
              <div class="flex flex-col items-center">
                4.5
                <div class="flex"><Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} /></div>
              </div>
            </Table.Cell>
            <Table.Cell>test@email.com</Table.Cell>
            <Table.Cell><Badge variant="outline">Yes</Badge></Table.Cell>
            <Table.Cell>	
                <Badge>Veteran Owned</Badge>
                
                </Table.Cell>
           </Table.Row>
           <Table.Row>
            <Table.Cell class="font-medium">Liquor Plus</Table.Cell>
            <Table.Cell>3725 Van Teylingen Dr, Colorado Springs, CO 80917<ExternalLink size={16} /></Table.Cell>
            <Table.Cell>(330) 456-7890</Table.Cell>
            <Table.Cell>
              4.5
            </Table.Cell>
            <Table.Cell>test@email.com</Table.Cell>
            <Table.Cell>Yes</Table.Cell>
            <Table.Cell>Veteran Owned</Table.Cell>
           </Table.Row>
		 
		</Table.Body>
	   </Table.Root>
	
</div>