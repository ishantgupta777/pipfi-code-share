<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";
  import PipfiLinks from "./PipfiLinks.svelte";
  let accessToken = "";
  let loading = true;
  let user: User | null = null;

  onMount(async () => {
      window.addEventListener("message", async (event) => {
          const message = event.data;
          switch (message.type) {
              case "token":
                  accessToken = message.value;
                  const response = await fetch(`${apiBaseUrl}/me`, {
                      headers: {
                          authorization: `Bearer ${accessToken}`,
                      },
                  });
                  const data = await response.json();
                  user = data.user;
                  loading = false;
                  console.log(user,'user ka data')
                  return
          }
      });
      tsvscode.postMessage({ type: "get-token", value: undefined });
  });
</script>

<h1>Hello {user?.name || 'User'}</h1>

{#if loading}
  <p>Loading data... Please wait...</p>
{:else}
  {#if user}
  <button
        on:click={() => {
            accessToken = '';
            user = null;
            tsvscode.postMessage({ type: 'logout', value: undefined });
        }}>logout</button>
    <PipfiLinks {user} {accessToken} />
  {:else}
  <p>Please login with GitHub to sync your pipfi history.</p>
    <button
    on:click={() => {
        tsvscode.postMessage({ type: 'authenticate', value: undefined });
    }}>login with GitHub</button>
  {/if}
{/if}