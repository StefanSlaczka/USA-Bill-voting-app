<!-- Navbar.svelte -->
<script>
  import { Link } from "svelte-routing";
  import About from "./About.svelte";
</script>

<div>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <h4 class="navbar-item">Voting Bill App</h4>
        <!-- Add any logo or branding here -->
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <button>
            <Link to="/about" class="navbar-item">About</Link>
          </div>
      </div>
    </div>
  </nav>
</div>

<style>
  .navbar {
    background-color: #f0f0f0;
    padding: 1rem 0;
  }

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  }

  .navbar-item:hover {
    color: #555;
  }

  /* Style for the login button */
  .button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    text-decoration: none;
  }

  .button:hover {
    background-color: #0056b3;
  }
</style>
