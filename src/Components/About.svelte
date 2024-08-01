<script>
  import { navigate } from 'svelte-routing';
</script>

<div>
  <h1>About Voting Bill App</h1>
  <p>This is the About page of the Voting Bill App.</p>
  <p>You can add any additional information about your app here.</p>
  <button on:click={() => navigate('/more-info')}>More Info</button>
</div>

<style>
  h1 {
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 0.5rem;
  }

  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>
