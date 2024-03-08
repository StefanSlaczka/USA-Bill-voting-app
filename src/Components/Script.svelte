<script>
  import { onMount, afterUpdate } from "svelte";

  const apiKey = process.env.API_KEY
  let congress = 117;
  let billType = 'hr';
  let billNumber = 3076;
  let apiUrl = `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}?api_key=${apiKey}`;
  let textUrl = `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}/text?api_key=${apiKey}&format=json`;
  let billDetails = null;
  let publicLawUrl = null;
  let error = null;
  let buttonDisabled = false;

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
        
        if (publicLawVersion) {
          publicLawUrl = publicLawVersion.formats.find(format => format.type === "Formatted XML").url;
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
    // Fetch bill data
    congress = Math.floor(Math.random() * 120) + 100;
    const billTypes = ['hr', 's', 'hjres', 'sjres', 'hconres', 'sconres', 'hres', 'sres'];
    billType = billTypes[Math.floor(Math.random() * billTypes.length)];
    billNumber = Math.floor(Math.random() * 5000) + 1;

    apiUrl = `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}?api_key=${apiKey}`;
    textUrl = `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}/text?api_key=${apiKey}&format=json`;

    await fetchBillData();

    // Re-enable the button after fetching data
    buttonDisabled = false; 
  };

  onMount(fetchBillData);

  const checkLoading = async () => {
    const maxRetries = 10; // Maximum number of retries
    let retries = 0;

    // Check loading status until it's not "Loading..." or maxRetries is reached
    while (billDetails && billDetails.title === "Loading..." && retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before checking again
      await generateRandomBillId();
      retries++;
    }
  };

  afterUpdate(checkLoading);
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
  <button class="random_button" on:click={generateRandomBillId
} disabled={buttonDisabled}>Generate Random Bill</button>
</div>
