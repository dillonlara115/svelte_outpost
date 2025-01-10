<script lang="ts">
    import { Star, StarHalf } from 'lucide-svelte';
    
    export let rating: number;
    
    function getStars(rating: number) {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push({ type: 'full' });
        }
        
        // Add half star if needed
        if (hasHalfStar) {
            stars.push({ type: 'half' });
        }
        
        // Add empty stars
        while (stars.length < 5) {
            stars.push({ type: 'empty' });
        }
        
        return stars;
    }
    
    $: stars = getStars(rating);
</script>

<div class="relative inline-block">
    {#each stars as star}
        {#if star.type === 'full'}
            <Star class="inline" size={16} fill="#FFD700" stroke="#FFD700" />
        {:else if star.type === 'half'}
            <StarHalf class="inline" size={16} fill="#FFD700" stroke="#FFD700" />
        {:else}
            <Star class="inline" size={16} stroke="#FFD700" />
        {/if}
    {/each}
</div>