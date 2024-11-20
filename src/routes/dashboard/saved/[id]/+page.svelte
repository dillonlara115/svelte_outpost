<script lang="ts">
  import * as Table from "$lib/components/ui/table";
  import { Button } from '$lib/components/ui/button';
  import { Star, ExternalLink, StarHalf } from 'lucide-svelte';
  import { Badge } from '$lib/components/ui/badge';
  import * as Card from "$lib/components/ui/card";
  import { ScrollArea } from "$lib/components/ui/scroll-area";
  import * as Dialog from "$lib/components/ui/dialog";

  export let data;
  $: ({ savedSearch } = data);
  $: businesses = savedSearch?.search_data?.results || [];
  $: query = savedSearch?.search_data?.query || {};
</script>

<div class="flex flex-col gap-6">
  <div class="flex flex-col items-center gap-1">
      <h1 class="text-lg font-semibold md:text-2xl">
          Saved Search Results for {query.businessType} near {query.city}, {query.state}
      </h1>
  </div>

  <Card.Content>
      <ScrollArea class="" type="always">
          <div class="">
              <Table.Root>
                  <Table.Header>
                      <Table.Row>
                          <Table.Head class="min-w-[150px]">Logo</Table.Head>
                          <Table.Head class="w-[175px]">Name</Table.Head>
                          <Table.Head class="w-[200px]">Address</Table.Head>
                          <Table.Head class="min-w-[100px]">Phone</Table.Head>
                          <Table.Head class="w-[100px]">Rating</Table.Head>
                          <Table.Head class="w-[100px]">Ownership</Table.Head>
                          <Table.Head class="w-[100px]">Verified</Table.Head>
                          <Table.Head class="w-[100px]">Actions</Table.Head>
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
                                  {business.name}
                              </Table.Cell>
                              <Table.Cell>
                                  {business.full_address}
                                  {#if business.location_link}
                                      <a 
                                          href={business.location_link} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          class="inline-flex items-center ml-1"
                                      >
                                          <ExternalLink size={16} />
                                      </a>
                                  {/if}
                              </Table.Cell>
                              <Table.Cell>{business.phone || 'N/A'}</Table.Cell>
                              <Table.Cell>
                                  <div class="flex flex-col items-center">
                                      {business.rating}
                                      <div class="flex">
                                        {#each Array(5) as _, i}
                                        {#if i < Math.floor(business.rating)}
                                            <Star size={14} fill="currentColor" />
                                        {:else if i === Math.floor(business.rating) && business.rating % 1 >= 0.5}
                                            <StarHalf size={14} fill="currentColor" />
                                        {:else}
                                            <Star size={14} />
                                            {/if}
                                        {/each}
                                      </div>
                                      <span class="text-xs text-muted-foreground">
                                          Based on {business.reviews} reviews
                                      </span>
                                  </div>
                              </Table.Cell>
                              <Table.Cell>
                                  {#if business.about?.['From the business']}
                                      {#each Object.entries(business.about['From the business']) as [type, value]}
                                          {#if value === true && type.includes('Identifies as')}
                                              <Badge class="mr-1">
                                                  {type.replace('Identifies as ', '')}
                                              </Badge>
                                          {/if}
                                      {/each}
                                  {/if}
                              </Table.Cell>
                              <Table.Cell>
                                  <Badge variant={business.verified ? "default" : "outline"}>
                                      {business.verified ? "Yes" : "No"}
                                  </Badge>
                              </Table.Cell>
                              <Table.Cell>
                                 
                                  <Dialog.Root>
                                      <Dialog.Trigger>View</Dialog.Trigger>
                                      <Dialog.Content>
                                          <Dialog.Header>
                                              <Dialog.Title>{business.name} <Badge variant={business.verified ? "default" : "outline"}>
                                                {business.verified ? "GBP Verified" : "Not GBP Verified"}
                                            </Badge></Dialog.Title>
                                              <Dialog.Description>
<div class="space-y-4">

  <img
      src={`/api/proxy/image?url=${encodeURIComponent(business.photo)}`}
      alt="Business" 
      class="w-96 h-44 rounded-md object-none"
  />

    <div class="grid grid-cols-2 gap-4">
        <div>           
            <h4 class="font-semibold">Contact</h4>
            
            {#if business.location_link}
                <p>
                    <a 
                        href={business.location_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="inline-flex items-center text-primary hover:underline"
                    >{business.full_address} <ExternalLink size={14} />
                    </a>
                </p>
            {/if}
            {#if business.phone}
                <p><a href="tel:{business.phone}" class="text-primary hover:underline">{business.phone}</a></p>
            {:else}
                <p>No phone listed</p>
            {/if}
            {#if business.email_1}
                <p><a href="mailto:{business.email_1}" class="text-primary hover:underline">{business.email_1}</a></p>
            {:else}
                <p>No email listed</p>
            {/if}
            {#if business.site}
                <a href={business.site} target="_blank" rel="noopener noreferrer" class="text-primary hover:underline inline-flex items-center gap-1">
                    Website <ExternalLink size={14} />
                </a>
            {/if}
        </div>
        <div>
            <h4 class="font-semibold">Rating</h4>
            <div class="flex items-center gap-1">
                <span>{business.rating}</span>
                <div class="flex">
                    {#each Array(5) as _, i}
                        {#if i < Math.floor(business.rating)}
                            <Star size={14} fill="currentColor" />
                        {:else if i === Math.floor(business.rating) && business.rating % 1 >= 0.5}
                            <StarHalf size={14} fill="currentColor" />
                        {:else}
                            <Star size={14} />
                        {/if}
                    {/each}
                </div>
                <span class="text-sm text-muted-foreground">({business.reviews} reviews)</span>
            </div>
        </div>
    </div>

    {#if business.about?.['From the business']}
        <h4 class="font-semibold">Ownership</h4>
        {#each Object.entries(business.about['From the business']) as [type, value]}
            {#if value === true && type.includes('Identifies as')}
                <Badge class="mr-1">
                    {type.replace('Identifies as ', '')}
                </Badge>
            {/if}
        {/each}
    {/if}

    {#if business.hours}
        <div>
            <h4 class="font-semibold">Hours</h4>
            <div class="grid grid-cols-2 gap-1 text-sm">
                {#each Object.entries(business.hours) as [day, hours]}
                    <div>{day}:</div>
                    <div>{hours}</div>
                {/each}
            </div>
        </div>
    {/if}
</div>
                                              </Dialog.Description>
                                          </Dialog.Header>
                                      </Dialog.Content>
                                  </Dialog.Root>
                              </Table.Cell>
                          </Table.Row>
                      {/each}
                  </Table.Body>
              </Table.Root>
          </div>
      </ScrollArea>
  </Card.Content>
</div>