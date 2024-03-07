<script>
  import { Router, Route, navigate } from 'svelte-routing';
  import { onMount } from 'svelte';
  import Navbar from './Components/Navbar.svelte';
  import Routing from './Components/Routing.svelte';
  import Login from './Components/Login.svelte';

  let showLogin = false;

  // Function to handle login button click
  const handleLoginButtonClick = () => {
    showLogin = true;
    // Redirect to the login page
    navigate('/login');
  };

  // Function to handle back button click (if needed)
  const handleBackButtonClick = () => {
    showLogin = false;
  };

  // Automatically scroll to the top of the page when the component mounts
  onMount(() => {
    window.scrollTo(0, 0);
  });
</script>

<div>
  <Router>
    <!-- Navbar always displayed -->
    <Navbar/>

    <!-- Conditional rendering of Login component -->
    {#if showLogin}
      <Route path="/login" component={Login} />
      <button on:click={handleBackButtonClick}>Back</button>
    {:else}
      <button on:click={handleLoginButtonClick}>Login</button>
    {/if}
  </Router>
  <!-- Routing content -->
  <Routing/>
</div>
