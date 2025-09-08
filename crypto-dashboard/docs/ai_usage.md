# AI Usage Documentation

This document outlines where and how AI tools were used during the development of the **AI-Powered Build Challenge** project for SL2 Capital.

## 🔹 Tools Used
- **Claude** – assisted in generating and refining CSS/Tailwind component structures.
- **Gemini** – provided API references and helped define endpoints for fetching cryptocurrency prices and market data.
- **ChatGPT** – supported documentation writing, inline code comments, and project structuring notes.

## 🔹 Areas Where AI Helped

1. **UI/Styling (Claude)**
   - Used prompts to generate Tailwind component templates for the homepage layout, coin detail page, and dark/light mode toggle.
   - Adjusted spacing, responsiveness, and colors manually to fit the design requirements.

2. **API Design (Gemini)**
   - Asked Gemini for suitable free crypto APIs and how to query them (e.g., CoinGecko endpoints for Vanry/USDT and other pairs).
   - Used Gemini to confirm parameters for price, % change, and historical chart data.

3. **Documentation & Comments (ChatGPT)**
   - Generated project-level documentation (README draft).
   - Suggested best practices for structuring services (`cryptoService.js`).
   - Helped write explanatory comments in the code to make it maintainable and clear.

## 🔹 Manual Adjustments
- Integrated all AI suggestions into a coherent codebase.
- Modified Tailwind classes for better responsiveness across desktop/mobile.
- Optimized API calls and added error handling beyond AI-generated snippets.
- Wrote custom logic for search/filter functionality and the price alert “wild card” feature.
