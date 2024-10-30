<script lang="ts">
    import { Label } from "$lib/components/ui/label";
      import { Input } from "$lib/components/ui/input";
	import { Button } from '$lib/components/ui/button';
</script>

<div class="flex flex-col items-center gap-1">
	<h1 class="text-lg font-semibold md:text-2xl">Find Business Leads</h1>
	<p>Search for businesses in your area.</p>
</div>

<div>
	<form>
			

				<Label>City</Label>
					<Input type="text" placeholder="Enter city" />

		
				<Label>State</Label>
					<Input type="text" placeholder="Enter state" maxlength="2" />

				<Label>Zip Code</Label>
					<Input type="text" placeholder="Enter zip code" maxlength="5" />
	</form>

	<Button>Start Searching</Button>
</div>