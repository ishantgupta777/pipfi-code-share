<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";
import PipfiLink from "./PipfiLink.svelte";
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
          }
      });
      tsvscode.postMessage({ type: "get-token", value: undefined });
  });
</script>

<h1>hello ishant13</h1>

<button on:click={()=>{
  tsvscode.postMessage({
    type: 'test',
    value: 'fafa come'
  })
}}>Login to Github</button>

<PipfiLink />