# Minimal URL Shortener App

A minimal React app to shorten URLs, view statistics, and test basic functionality. No fancy UI, just a working interface.

## Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/Joya-01/2218901.git
   cd 2218901
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the project root with your API token:
   ```env
   REACT_APP_ACCESS_TOKEN=your_token_here
   ```
4. Start the app:
   ```sh
   npm start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000).

## Usage
- Enter a URL, validity (in minutes), and an optional shortcode in the form.
- Click "Shorten" to generate a short link.
- Results will appear in a table below the form.
- Visit the Stats page (`/stats`) to see a list of all shortened URLs.

## Testing
Run the test suite with:
```sh
npm test -- --watchAll=false
```
This will check that the Home and Stats pages render correctly.

## Error Handling
- User-friendly error messages are shown for invalid input or API/network failures.

---
