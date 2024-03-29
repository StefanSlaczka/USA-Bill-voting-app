<script>
  import { writable } from 'svelte/store';
  import statesData from '../statesData.js';
  import { onMount, afterUpdate } from "svelte";

  import {urls} from "./Data/API_links.js"

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
  let publicLawUrl = null;
  let billDetails = null;
  let error = null;
  let buttonDisabled = false;
  const maxAttempts = 100;
  let attemptCount = 0;

  export let state;
  
  /*
  const fetchBillData = async () => {
    try {
      console.log('Fetching data with URL:', apiUrl);
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
  */

  const fetchRandomBillData = async (urls) => {
  try {
    const randomIndex = Math.floor(Math.random() * urls.length);
    const apiUrl = urls[randomIndex];

    // Constructing the text URL
    const titleUrl = `${apiUrl}?api_key=${apiKey}`;
    const textUrl = `${apiUrl}/text?api_key=${apiKey}&format=json`;

    console.log("titleUrl ", titleUrl)
    console.log("textUrl ",textUrl)

    const detailsResponse = await fetch(titleUrl);

    if (detailsResponse.status === 404) {
      return { error: 'Bill not found' };
    }

    const detailsData = await detailsResponse.json();
    const billDetails = detailsData.bill;
    
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

    return { billDetails, publicLawUrl }; // Include textUrl in the returned object
  } catch (error) {
    console.error('Error:', error);
    return { error: 'An error occurred while fetching data.' };
  }
};

  const generateRandomBillId = async () => {
    try {
      const { billDetails: fetchedBillDetails, error: fetchError } = await fetchRandomBillData(urls);
      
      if (fetchError) {
        error = fetchError;
        return;
      }

      billDetails = fetchedBillDetails;
      error = null;
    } catch (error) {
      console.error('Error:', error);
      error = 'An error occurred while generating random bill ID.';
    }
  };

  const checkLoading = async () => {
    // Check loading status until it's not "Loading..."
    while (billDetails && billDetails.title === "Loading...") {
      await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before checking again
      await generateRandomBillId();
    }
  };
  onMount(generateRandomBillId);
  //onMount(fetchBillData);
  afterUpdate(checkLoading);


  const handlePush = () => {
    if (state.trim() !== '' && !hasVoted) {
      const stateName = state.trim().toLowerCase();
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
    if (state.trim() !== '' && !hasVoted) {
      const stateName = state.trim().toLowerCase();
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

<div class="container">
  <div class="left-section">
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
  </div>

  <div class="right-section">
    <div class="outer_layer">
      {#if $voteMessage}
      <p>{$voteMessage}</p>
      {/if}
      <div class="button-container">
        <button class="Pass" style="background-color: red;" on:click={handlePass} disabled={state.trim() === ''}>Pass</button>
        <p>Pass Count: {passCount}</p>
      </div>
      
      <div class="button-container">
        <button class="Push" style="background-color: green;"  on:click={handlePush} disabled={state.trim() === ''}>Push</button>
        <p>Push Count: {pushCount}</p>
      </div>
    </div>
  </div>
</div>

<style>
.container {
  display: flex;
  justify-content: space-between;
}

.left-section,
.right-section {
  flex: 1;
}

.outer_layer {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  height: auto;
}

.button-container {
  display: inline-block;
  margin-right: 20px; /* Adjust the margin between buttons and counts */
}

.inner_layer {
  margin-bottom: 10px;
}

.random_button {
  display: block;
  margin-top: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.random_button:hover {
  background-color: #0056b3;
}

.Pass,
.Push {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.Pass:hover,
.Push:hover {
  background-color: #0056b3;
}
</style>