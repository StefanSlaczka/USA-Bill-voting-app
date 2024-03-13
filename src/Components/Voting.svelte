<script>
  import { writable } from 'svelte/store';
  import statesData from '../statesData.js';
  import { onMount, afterUpdate } from "svelte";

  let stateInput = '';
  let pushCount = 0;
  let passCount = 0;
  let hasVoted = false;
  const showButtons = writable(false);
  const showResetButton = writable(false); // Store to control visibility of Reset Vote button
  const voteMessage = writable('');

  const apiKey = process.env.API_KEY;
  let congress = 117;
  let billType = 'hr';
  let billNumber = 3076;
  let apiUrl = `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}?api_key=${apiKey}`;
  let textUrl = `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}/text?api_key=${apiKey}&format=json`;
  let billDetails = null;
  let publicLawUrl = null;
  let error = null;
  let buttonDisabled = false;
  const maxAttempts = 100;
  let attemptCount = 0;

  const fetchBillData = async () => {
    try {
      console.log('Fetching data with URL:', apiUrl); // Log the details URL
      const detailsResponse = await fetch(apiUrl);

      if (detailsResponse.status === 404) {
        // Handle 404 - Bill not found
        error = 'Bill not found';
        return;
      }

      const detailsData = await detailsResponse.json();
      billDetails = detailsData.bill;

      console.log('Fetching text with URL:', textUrl); // Log the text URL
      const textResponse = await fetch(textUrl);
      const textData = await textResponse.json();

      if (textData && textData.textVersions && textData.textVersions.length > 0) {
        // Find the XML URL for the "Public Law" type
        const publicLawVersion = textData.textVersions.find(version => version.type === "Public Law");
        
        if (publicLawVersion && publicLawVersion.formats) {
          const formattedXML = publicLawVersion.formats.find(format => format.type === "Formatted XML");
          publicLawUrl = formattedXML ? formattedXML.url : null;
        } else {
          // If "Public Law" version not found, get the newest version
          const newestVersion = textData.textVersions.reduce((prev, current) => (prev.date > current.date) ? prev : current);
          publicLawUrl = newestVersion ? newestVersion.formats.find(format => format.type === "Formatted XML").url : null;
        }
      } else {
        error = 'Text versions not found or empty';
      }
    } catch (error) {
      console.error('Error:', error);
      error = 'An error occurred while fetching data.';
      buttonDisabled = false; // Re-enable the button in case of an error
    }
  };

  const generateRandomBillId = async () => {
    buttonDisabled = true; // Disable the button
    attemptCount = 0;

    while (attemptCount < maxAttempts) {
      // Generate random bill data
      congress = Math.floor(Math.random() * 120) + 100;
      const billTypes = ['hr', 's', 'hjres', 'sjres', 'hconres', 'sconres', 'hres', 'sres'];
      billType = billTypes[Math.floor(Math.random() * billTypes.length)];
      billNumber = Math.floor(Math.random() * 5000) + 1;

      apiUrl = `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}?api_key=${apiKey}`;
      textUrl = `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}/text?api_key=${apiKey}&format=json`;

      await fetchBillData();

      // Check if billDetails is not null and contains valid data
      if (billDetails) {
        // If bill found and billDetails is not null, exit the loop
        // @ts-ignore
        resetVoting();
        break;
      }

      attemptCount++;
    }

    // Re-enable the button after fetching data
    buttonDisabled = false;
  };

  const checkLoading = async () => {
    // Check loading status until it's not "Loading..."
    while (billDetails && billDetails.title === "Loading...") {
      await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before checking again
      await generateRandomBillId();
    }
  };

  onMount(fetchBillData);
  afterUpdate(checkLoading);

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
        statesData.features[stateIndex].properties.push++; // Increment push count
        pushCount++;
        hasVoted = true;
        showButtons.set(false);
        showResetButton.set(true); // Show Reset Vote button after voting
        voteMessage.set('You have voted.');
      }
    }
  };

  const handlePass = () => {
    if (stateInput.trim() !== '' && !hasVoted) {
      const stateName = stateInput.trim().toLowerCase();
      const stateIndex = statesData.features.findIndex(feature => feature.properties.name.toLowerCase() === stateName);
      if (stateIndex !== -1) {
        statesData.features[stateIndex].properties.pass++; // Increment pass count
        passCount++;
        hasVoted = true;
        showButtons.set(false);
        showResetButton.set(true); // Show Reset Vote button after voting
        voteMessage.set('You have voted.');
      }
    }
  };

  export const resetVoting = () => {
    hasVoted = false; // Reset hasVoted to allow voting again
    showResetButton.set(false); // Hide Reset Vote button
    pushCount = 0; // Reset pushCount
    passCount = 0; // Reset passCount
    // Reset density values to default
    statesData.features.forEach(feature => {
      feature.properties.density = feature.properties.name; // Replace with default density value
    });
    showButtons.set(true); // Show buttons to vote again
    voteMessage.set(''); // Reset vote message
  };

</script>

<div class="outer_layer">
  <div class="inner_layer">
    <h2>{billDetails ? billDetails.title : "Loading..."}</h2>
    {#if publicLawUrl}
    <div id="xmlContent"></div>
    <p>Error: Unable to display XML. You can view the XML <a target="_blank" href={publicLawUrl}>here</a>.</p>
    {/if}
    {#if error}
    <p style="color: red;">{error}</p>
    {/if}
  </div>
  <button class="random_button" on:click={generateRandomBillId} disabled={buttonDisabled}>Generate Random Bill</button>
</div>

<div class="outer_layer">
  <input bind:value={stateInput} placeholder="Enter your state for the vote" />
  <button on:click={handleSearch}>Search</button>

  <!-- Show the buttons only when showButtons is true -->
  {#if $showButtons}
    <button class="Pass" on:click={handlePass} disabled={stateInput.trim() === ''}>Pass</button>
    <button class="Push" on:click={handlePush} disabled={stateInput.trim() === ''}>Push</button>
  {/if}

  {#if $voteMessage}
    <p>{$voteMessage}</p>
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
