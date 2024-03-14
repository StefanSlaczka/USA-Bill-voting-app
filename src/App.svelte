<script>
  import { Router, Route, navigate } from 'svelte-routing';
  import { onMount } from 'svelte';
  import Navbar from './Components/Navbar.svelte';
  import Voting from './Components/Voting.svelte';
  import UsaMap from './Components/USAMap.svelte';

  let username = '';
  let password = '';
  let state = '';
  let isLogin = true; // Determines whether the user is in the login or signup mode
  let showContent = false; // Determines whether to show the content or login form

  // Function to handle login button click
  const handleLoginButtonClick = () => {
    showContent = true;
    // Redirect to the login page
    navigate('/login');
  };

  // Function to handle successful login
  const handleSuccessfulLogin = () => {
    showContent = true;
  };

  // Automatically scroll to the top of the page when the component mounts
  onMount(() => {
    window.scrollTo(0, 0);
  });

  const handleLogin = () => {
    // Perform login logic here
    console.log('Logging in with:', username, password, state);
    handleSuccessfulLogin(); // Assuming login is successful
  };
  
  const handleSignup = () => {
    // Perform signup logic here
    console.log('Signing up with:', username, password, state);
    handleSuccessfulLogin(); // Assuming signup is successful
  };
  
  const toggleMode = () => {
    isLogin = !isLogin;
  };

  const handleLogout = () => {
    showContent = false;
    username = '';
    password = '';
    state = '';
  };
</script>

<div>
  <Router>
    <!-- Navbar always displayed -->
    <Navbar/>

    <!-- Conditional rendering of content -->
    {#if showContent}
      <Voting/>
      <UsaMap/>
    {/if}
  </Router>
</div>

{#if showContent}
  <h2>Welcome, {username}!</h2>
  <button type="button" on:click={handleLogout}>Sign Out</button>
{:else}
  {#if isLogin}
    <h2>Login</h2>
    <form on:submit|preventDefault>
      <label>
        Username:
        <input type="text" bind:value={username} />
      </label>
    
      <label>
        Password:
        <input type="password" bind:value={password} />
      </label>
      
      <label>
        State:
        <input type="text" bind:value={state} />
      </label>
    
      <button type="button" on:click={handleLogin}>Login</button>
      <p>Don't have an account? Sign up <a href="#/" on:click|preventDefault={toggleMode}>here</a>.</p>
    </form>
  {:else}
    <h2>Sign Up</h2>
    <form on:submit|preventDefault>
      <label>
        Username:
        <input type="text" bind:value={username} />
      </label>
    
      <label>
        Password:
        <input type="password" bind:value={password} />
      </label>
    
      <label>
        State:
        <input type="text" bind:value={state} />
      </label>
    
      <button type="button" on:click={handleSignup}>Sign Up</button>
      <p>Already have an account? Login <a href="#/" on:click|preventDefault={toggleMode}>here</a>.</p>
    </form>
  {/if}
{/if}
