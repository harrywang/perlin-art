# Perlin Noise Art Generator

This project generates beautiful Perlin-noise-based art using [p5.js](https://p5js.org/). I use [Windsurf](https://codeium.com/windsurf) to generate most of the code based on the the original [Processing](https://processing.org/) code from [here](https://github.com/sighack/perlin-noise-fields), which was described in this blog post: [Perlin Noise Fields](https://github.com/sighack/perlin-noise-fields).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fharrywang%2Fperlin-art&demo-title=Perlin%20Noise%20Art%20Generator&demo-description=A%20beautiful%20generative%20art%20application%20using%20Perlin%20noise%20and%20Next.js&demo-url=https%3A%2F%2Fperlin-p5.vercel.app)


## Local Setup

Run the development server:

```bash
npm install
npm run dev
```

Then, open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Testing

The project uses Playwright for end-to-end testing. To run the tests:

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run tests in headless mode
npm test

# Run tests with UI mode
npm run test:ui
```

The tests verify:
- The canvas element is properly rendered
- The canvas responds to viewport size changes

## Stack
- Next.js 14
- React 18
- p5.js
- TypeScript
- Tailwind CSS
