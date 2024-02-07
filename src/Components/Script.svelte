<script>
    import { onMount, afterUpdate } from "svelte";
    import Voting from "./Voting.svelte";
    import Map from "./Map.svelte";

    const apiKey = process.env.API_KEY
    let congress = 117;
    let billType = 'hr';
    let billNumber = 3076;
    let apiUrl = `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}?api_key=${apiKey}`;
    let textUrl = `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}/text?api_key=${apiKey}&format=json`;
    let billDetails = null;
    let publicLawUrl = null;
    let error = null;
  
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
  
        // Find the XML URL for the "Public Law" type
        const publicLawVersion = textData.textVersions.find(version => version.type === "Public Law");
        
        if (publicLawVersion) {
          publicLawUrl = publicLawVersion.formats.find(format => format.type === "Formatted XML").url;
        } else {
          // If "Public Law" version not found, get the newest version
          const newestVersion = textData.textVersions.reduce((prev, current) => (prev.date > current.date) ? prev : current);
          publicLawUrl = newestVersion ? newestVersion.formats.find(format => format.type === "Formatted XML").url : null;
        }
  
      } catch (error) {
        console.error('Error:', error);
        error = 'An error occurred while fetching data.';
      }
    };
  
    // Need's to be optiomized
    const generateRandomBillId = () => {
      const randomCongress = Math.floor(Math.random() * 120) + 100;
      const billTypes = ['hr', 's', 'hjres', 'sjres', 'hconres', 'sconres', 'hres', 'sres'];
      const randomBillType = billTypes[Math.floor(Math.random() * billTypes.length)];
      const randomBillNumber = Math.floor(Math.random() * 5000) + 1;
  
      congress = randomCongress;
      billType = randomBillType;
      billNumber = randomBillNumber;
  
      apiUrl = `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}?api_key=${apiKey}`;
      textUrl = `https://api.congress.gov/v3/bill/${congress}/${billType}/${billNumber}/text?api_key=${apiKey}&format=json`;
  
      fetchBillData();
    };
  
    const checkLoading = async () => {
      // If "Loading..." is displayed, keep generating random bill until it's not
      while (billDetails && billDetails.title === "Loading...") {
        await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before checking again
        generateRandomBillId();
      }
    };
  
    onMount(fetchBillData);
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
    <Voting/>
    <button class="random_button" on:click={generateRandomBillId}>Generate Random Bill</button>
    <Map/>
  </div>
  
  <style>
    .outer_layer{
      display: flex;
      justify-content: center;
      margin-top: 1%;
      margin-left: 1%;
      margin-right: 1%;
      gap: 10%;
    }
    .inner_layer{
      background-color: yellow;
      font-weight: 900;
      padding: 1%;
    }
    .random_button{
      background-color: aqua;
      width: fit-content;
    
    }

  </style>
  