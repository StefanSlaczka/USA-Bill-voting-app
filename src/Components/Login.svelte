<script>
  let username = '';
  let password = '';
  let state = '';
  let isLoggedIn = false;
  let isLogin = true; // Determines whether the user is in the login or signup mode
  
  const handleLogin = () => {
    // Perform login logic here
    console.log('Logging in with:', username, password);
    isLoggedIn = true;
  };
  
  const handleSignup = () => {
    // Perform signup logic here
    console.log('Signing up with:', username, password, state);
    isLoggedIn = true;
  };
  
  const toggleMode = () => {
    isLogin = !isLogin;
  };

  const handleLogout = () => {
    isLoggedIn = false;
    username = '';
    password = '';
    state = '';
  };
</script>
  
{#if isLoggedIn}
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
