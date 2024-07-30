<!-- Navbar.svelte -->
<script>
  import About from "./About.svelte";

  export let isLoggedIn = false;
  export let onLogout = () => {};
</script>

<nav class="navbar">
  <div class="container">
    <div class="navbar-brand">
      <h4 class="navbar-item">Voting Bill App</h4>
      <!-- Add any logo or branding here -->
    </div>
    <div class="navbar-menu">
      <div class="navbar-start">
        <a href="/about" class="navbar-item">About</a>
        {#if isLoggedIn}
          <a href="#/" class="navbar-item" on:click={onLogout}>Sign Out</a>
        {:else}
          <a href="/login" class="navbar-item">Log In</a>
        {/if}
      </div>
    </div>
  </div>
</nav>
<style>
  .navbar {
    background-color: #f0f0f0;
    padding: auto;
    border-radius: 5%;
  }

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 10% 0 10%;
}


  .navbar-brand {
    display: flex;
    align-items: center;
  }

  .navbar-brand a {
    font-weight: bold;
    color: #333;
    text-decoration: none;
  }

  .navbar-menu {
    display: flex;
    align-items: center;
  }

  .navbar-start,
  .navbar-end {
    display: flex;
    align-items: center;
  }

  .navbar-item {
    margin-right: 1rem;
    color: #333;
    text-decoration: none;
    font-weight: bold;
    cursor: pointer;
  }

  .navbar-item:hover {
    color: #555;
    text-decoration: none !important;
  }

</style>
