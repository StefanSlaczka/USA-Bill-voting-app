# Bill Voting App

## Overview

This project aims to revolutionize citizen engagement by replacing Congress Interlay with a user-friendly platform for voting on proposed bills. It empowers individuals to directly influence the legislative process by casting their votes for bills they want to see implemented. Users can:

* Generate 20 random bills for review.
* Vote for each bill once to express their opinion.
* View aggregated vote counts by state to gain insights into public sentiment.
* Securely log in to ensure one vote per user.

## Technologies Used

**Front-end:**

* Svelte (reactive JavaScript framework)
* JavaScript
* HTML
* CSS

**Back-end:**

* Node.js (JavaScript runtime environment)
* Express.js (web framework for Node.js)
* Python (optional, for database setup)

**Database:**

* SQLite (lightweight relational database)

**Other Libraries:**

* Leaflet.css (mapping library for visualizing state-based vote counts)

## Getting Started

**Front-end Setup:**

1. Navigate to the front-end directory.
2. Install dependencies:

   ```bash
   npm install

3. Start the development server
   ```bash
    npm run dev


**back-end Setup:**

1. Navigate to the back-end directory.


2. Install dependencies:
   ```bash
    npm insall

3. Start the development server
   ```bash
    node index.js

**database-end Setup:**

1. Navigate to the Data directory in back-end directory.

2. Initialize the database
   ```bash
    python setup_database.py

# About This Project

This project fosters citizen participation by providing a platform for individuals to:

- **Generate Random Bills:** Explore a variety of proposed laws.
- **Cast Informed Votes:** Express their opinions on bills.
- **Securely Log In:** Ensure a fair and accountable voting process.
- **View Vote Counts:** Gain insights into public opinion across states.

This app promotes transparency and encourages citizens to actively engage in the legislative process.

## License

This project is licensed under the MIT License. Please refer to the LICENSE file for details.

## Acknowledgments

- **Svelte:** For a performant and intuitive front-end experience.
- **Node.js and Express.js:** For a robust and scalable back-end.
- **SQLite:** For its efficient database management capabilities.
- **Python:** For streamlining database setup (if applicable).
