<script>
  let username = '';
  let password = '';
  let state = '';

  let isLogin = true; // Determines whether the user is in the login or signup mode

  const handleLogin = () => {
    // Perform login logic here
    console.log('Logging in with:', username, password);
    // You should only have login logic here, not other HTML or Svelte syntax
  };

  const handleSignup = () => {
    // Perform signup logic here
    console.log('Signing up with:', username, password, state);
    // Similar to login, only signup logic should be here
  };

  const toggleMode = () => {
    isLogin = !isLogin;
  };
</script>

{#if isLogin}
  <h2>Login</h2>
{:else}
  <h2>Sign Up</h2>
{/if}

<form on:submit|preventDefault>
  <label>
    Username:
    <input type="text" bind:value={username} />
  </label>

  <label>
    Password:
    <input type="password" bind:value={password} />
  </label>

  {#if !isLogin}
    <label>
      State:
      <input type="text" bind:value={state} />
    </label>
  {/if}

  {#if isLogin}
    <button type="button" on:click={handleLogin}>Login</button>
    <p>Don't have an account? <a href="#/" on:click|preventDefault={toggleMode}>Sign up here</a>.</p>
  {:else}
    <button type="button" on:click={handleSignup}>Sign Up</button>
    <p>Already have an account? <a href="#/" on:click|preventDefault={toggleMode}>Login here</a>.</p>
  {/if}
</form>
