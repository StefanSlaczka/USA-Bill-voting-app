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
  
  <div>
    <h2>{billDetails ? billDetails.title : "Loading..."}</h2>
    {#if publicLawUrl}
      <div id="xmlContent"></div>
      <object data={publicLawUrl} title="object" type="application/pdf" width="100%" height="600px">
        <p>Error: Unable to display XML. You can view the XML <a target="_blank" href={publicLawUrl}>here</a>.</p>
      </object>
    {/if}
    {#if error}
      <p style="color: red;">{error}</p>
    {/if}
  
    <button on:click={generateRandomBillId}>Generate Random Bill</button>
  </div>
  
  <style>
    #xmlContent {
      border: 1px solid #ddd;
      padding: 10px;
      margin-top: 10px;
      max-height: 300px;
      overflow: auto;
    }
  </style>
  