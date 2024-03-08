<script>
  import { writable } from 'svelte/store';
  import statesData from '../statesData.js';

  let stateInput = '';
  let pushCount = 0;
  let passCount = 0;
  let hasVoted = false;
  const showButtons = writable(false);
  const showResetButton = writable(false); // Store to control visibility of Reset Vote button

  const handleSearch = () => {
      const stateName = stateInput.trim();
      if (stateName !== '') {
          const validState = statesData.features.find(feature => feature.properties.name.toLowerCase() === stateName.toLowerCase());
          if (validState) {
              console.log(stateName);
              if (!hasVoted) {
                  showButtons.set(true);
              }
          } else {
              alert('Invalid state. Please enter a valid state name.');
              showButtons.set(false);
          }
      } else {
          alert('Please enter a state name.');
          showButtons.set(false);
      }
  };

  const handlePush = () => {
      if (stateInput.trim() !== '' && !hasVoted) {
          const stateName = stateInput.trim().toLowerCase();
          const stateIndex = statesData.features.findIndex(feature => feature.properties.name.toLowerCase() === stateName);
          if (stateIndex !== -1) {
              statesData.features[stateIndex].properties.density = 'push';
              pushCount++;
              hasVoted = true;
              showButtons.set(false);
              showResetButton.set(true); // Show Reset Vote button after voting
          }
      }
  };

  const handlePass = () => {
      if (stateInput.trim() !== '' && !hasVoted) {
          const stateName = stateInput.trim().toLowerCase();
          const stateIndex = statesData.features.findIndex(feature => feature.properties.name.toLowerCase() === stateName);
          if (stateIndex !== -1) {
              statesData.features[stateIndex].properties.density = 'pass';
              passCount++;
              hasVoted = true;
              showButtons.set(false);
              showResetButton.set(true); // Show Reset Vote button after voting
          }
      }
  };

  const handleResetVote = () => {
      hasVoted = false; // Reset hasVoted to allow voting again
      showResetButton.set(false); // Hide Reset Vote button
      pushCount = 0; // Reset pushCount
      passCount = 0; // Reset passCount
      // Reset density values to default
      statesData.features.forEach(feature => {
          feature.properties.density = feature.properties.name; // Replace with default density value
      });
      showButtons.set(true); // Show buttons to vote again
  };
</script>
  
  <div class="outer_layer">
    <input bind:value={stateInput} placeholder="Enter your state for the vote" />
    <button on:click={handleSearch}>Search</button>
    
    <!-- Show the buttons only when showButtons is true -->
    {#if $showButtons}
      <button class="Pass" on:click={handlePass} disabled={stateInput.trim() === ''}>Pass</button>
      <button class="Push" on:click={handlePush} disabled={stateInput.trim() === ''}>Push</button>
    {/if}
  
    <!-- Show Reset Vote button only when showResetButton is true -->
    {#if $showResetButton}
      <button on:click={handleResetVote}>Reset Vote</button>
    {/if}
  
    <p>Push Count: {pushCount}</p>
    <p>Pass Count: {passCount}</p>
  </div>
  
  <style>
    .outer_layer {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10%;
    }
  
    button {
      height: 100%;
      font-size: 180%;
      border-radius: 30%;
    }
  
    .Pass {
      background-color: rgb(255, 45, 45);
    }
  
    .Push {
      background-color: rgb(4, 255, 4);
    }
  </style>
  