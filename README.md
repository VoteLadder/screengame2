
# VSCode Hand-Tracking Game

A high-intensity, VSCode-themed arcade game using Google Gemini and MediaPipe Hand Tracking.

## Local Setup Instructions

1. **Clone/Copy** all files into a local directory.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set your API Key** (Optional for AI Commentary):
   Create a `.env` file in the root directory:
   ```env
   VITE_API_KEY=your_google_gemini_api_key_here
   ```
4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
5. **Play**:
   Open `http://localhost:3000` in your browser.

## How to play
- Use your **index finger** to point at the screen.
- Hover over the flashing balls and bugs to "debug" them and gain points.
- You have 30 seconds to get the highest score possible.
- A Senior Dev (Gemini AI) will review your "code performance" at the end of the session.
