<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";
  export let user: User;
  export let accessToken: string;
  let links: Array<{ title: string; url: string; id: number }> = [];

  onMount(async () => {
      const response = await fetch(`${apiBaseUrl}/links`, {
          headers: {
              authorization: `Bearer ${accessToken}`,
          },
      });
      const payload = await response.json();
      links = payload.links;
  });
</script>

<ul>
  {#each links as link (link.id)}
      <li>
          <a href={link.url}>{link.url}</a>
          <span>{link.title}</span>
      </li>
  {/each}
</ul>