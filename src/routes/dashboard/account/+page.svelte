<script lang="ts">
   import type { PageData } from './$types';

   export let data: PageData;
   
   $: ({ user } = data);

   async function openCustomerPortal() {
    const response = await fetch('/dashboard/account', { method: 'POST' });
    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Failed to open customer portal');
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
   <h1 class="text-3xl font-bold mb-8">My Account</h1>

   {#if user}
       <div>
           <div class="mb-6">
               <h2 class="text-xl font-semibold mb-2">Profile Information</h2>
               <p class="text-gray-600">Email: {user.email}</p>
               <p class="text-gray-600">Last Sign In: {new Date(user.last_sign_in_at).toLocaleString()}</p>
               <p class="text-gray-600">Role: {user.role_name || 'No role assigned'}</p>
           </div>

           <div class="mb-6">
               <h2 class="text-xl font-semibold mb-2">Account Settings</h2>
               <button class="bg-blue-500 text-white px-4 py-2 rounded" on:click={openCustomerPortal}>Open Customer Portal</button>
           </div>
       </div>
   {:else}
       <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
           Please sign in to view your account details.
       </div>
   {/if}
</div>