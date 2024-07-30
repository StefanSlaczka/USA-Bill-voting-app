<!-- App.svelte -->
<script>
  import { Router, Route, navigate } from 'svelte-routing';
  import { onMount } from 'svelte';
  import Navbar from './Components/Navbar.svelte';
  import Voting from './Components/Voting.svelte';
  import UsaMap from './Components/USAMap.svelte';
  import About from './Components/About.svelte';
  import statesData from './statesData.js';

  let username = '';
  let password = '';
  let state = '';
  let isLogin = true;
  let showContent = false;
  let isLoggedIn = false;

  const handleLoginButtonClick = () => {
    showContent = true;
    navigate('/login');
  };

  const handleSuccessfulLogin = () => {
    showContent = true;
    isLoggedIn = true;
  };

  onMount(() => {
    window.scrollTo(0, 0);
  });

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();
      console.log('User logged in:', result);
      state = result.state;
      handleSuccessfulLogin();
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleSignup = async () => {
    if (state !== '') {
      const validState = statesData.features.find(
        feature => feature.properties.name.toLowerCase() === state.toLowerCase()
      );
      if (validState) {
        console.log(state);
      } else {
        alert('Invalid state. Please enter a valid state name.');
        return;
      }
    } else {
      alert('Please enter a state name.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, state }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();
      console.log('User signed up with ID:', result.id);
      handleSuccessfulLogin();
    } catch (error) {
      alert(`Sign up failed: ${error.message}`);
    }
  };

  const toggleMode = () => {
    isLogin = !isLogin;
  };

  const handleLogout = () => {
    showContent = false;
    username = '';
    password = '';
    state = '';
    isLoggedIn = false;
  };
</script>

<div>
  <Router>
    <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
    <Route path="/about" component={About} />

    {#if showContent}
      <h2>Welcome, {username}</h2>
      <Voting state={state} />
      <UsaMap />
    {/if}
  </Router>
</div>

{#if !showContent}
  {#if isLogin}
    <h2 class="form-title">Login</h2>
    <form class="login-form" on:submit|preventDefault>
      <label class="form-label">
        Username:
        <input class="form-input" type="text" bind:value={username} />
      </label>
      <label class="form-label">
        Password:
        <input class="form-input" type="password" bind:value={password} />
      </label>
      <button class="form-button" type="button" on:click={handleLogin}>Login</button>
      <p>Don't have an account? Sign up <a href="#/" on:click|preventDefault={toggleMode}>here</a>.</p>
    </form>
  {:else}
    <h2 class="form-title">Sign Up</h2>
    <form class="signup-form" on:submit|preventDefault>
      <label class="form-label">
        Username:
        <input class="form-input" type="text" bind:value={username} />
      </label>
      <label class="form-label">
        Password:
        <input class="form-input" type="password" bind:value={password} />
      </label>
      <label class="form-label">
        State:
        <input class="form-input" type="text" bind:value={state} />
      </label>
      <button class="form-button" type="button" on:click={handleSignup}>Sign Up</button>
      <p>Already have an account? Login <a href="#/" on:click|preventDefault={toggleMode}>here</a>.</p>
    </form>
  {/if}
{/if}

<style>
  /* Styles for login/sign-up forms */
  .login-form,
  .signup-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    text-align: center;
  }

  .form-title {
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
  }

  .form-label {
    display: block;
    margin-bottom: 10px;
  }

  .form-input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
  }

  .form-button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 3px;
    background-color: #E74C3C;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
  }

  .form-button:hover {
    background-color: #eeb2ab;
  }

  .form-p {
    margin-top: 10px;
  }

  .form-a {
    color: #007bff;
    text-decoration: none;
  }

  .form-a:hover {
    text-decoration: underline;
  }
</style>
