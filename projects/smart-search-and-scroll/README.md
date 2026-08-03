# Smart Search and Scroll (Debounce & Throttle Utilities)

> A practical implementation of debounce and throttle functions with real‑world usage examples: search input and infinite scroll.

## 🎯 About

This project demonstrates two essential performance optimization techniques in JavaScript: **debounce** and **throttle**. It provides clean, configurable implementations of both utilities, along with interactive demonstrations that show how they improve user experience.

- **Debounce** delays function execution until after a pause in rapid calls – perfect for search inputs, form validation, and resize events.
- **Throttle** limits function execution to at most once per specified interval – ideal for scroll handlers, mouse movements, and game loops.

The code includes a search component that debounces API requests (avoiding unnecessary network calls) and an infinite scroll component that throttles scroll position checks (preventing excessive computations). Both utilities support advanced options like leading/trailing edge execution and integrate with AbortController for cancelling pending requests.

## ✨ Features

- **Debounce** – delays execution until a quiet period, with `leading` and `trailing` edge controls
- **Throttle** – enforces a maximum execution rate, with `leading` and `trailing` edge controls
- **Search Component** – debounced input handling with request cancellation (avoids race conditions)
- **Infinite Scroll** – throttled scroll detection that loads more content at the bottom
- **Configurable options** – choose leading, trailing, or both for precise behavior
- **Clean separation** – utilities are in dedicated modules, reusable across projects
- **AbortController integration** – cancels in‑flight requests when a new search starts

## 🎯 What You'll Learn

- **Debounce vs Throttle** – when to use each and how they differ
- **Implementation details** – building debounce and throttle from scratch with `setTimeout`
- **Leading/trailing edges** – understanding invocation timing options
- **Real‑world patterns** – applying debounce to search inputs and throttle to scroll events
- **Request cancellation** – using AbortController to avoid race conditions in async workflows
- **Composition** – combining utilities with UI components in a modular way

## 🎮 How to Use

1. Open `index.html` (if provided) or integrate the utilities into your own project.
2. The `SearchComponent` listens for input events and debounces the search function.
3. The `InfiniteScroll` class attaches a throttled scroll handler to a container.
4. Customize delay times and options to suit your needs.

### Example: Debouncing a Search

```js
import { debounce } from "./utils/debounce.js";

const searchInput = document.getElementById("search");
const results = document.getElementById("results");

const search = debounce(
  async (query) => {
    const data = await fetch(`/api/search?q=${query}`);
    // display results
  },
  300,
  { leading: false, trailing: true },
);

searchInput.addEventListener("input", (e) => {
  search(e.target.value);
});
```

### Example: Throttling a Scroll

```js
import { throttle } from "./utils/throttle.js";

const container = document.getElementById("scrollable");

const onScroll = throttle(
  () => {
    console.log("Scroll position:", container.scrollTop);
  },
  200,
  { leading: true, trailing: true },
);

container.addEventListener("scroll", onScroll);
```

## 🎨 Customization

### Debounce Options

- `leading` (default: `false`) – execute immediately on the first call
- `trailing` (default: `true`) – execute after the delay on the last call

```js
// Execute on both leading and trailing edges:
const fn = debounce(doWork, 500, { leading: true, trailing: true });
```

### Throttle Options

Same as debounce – control leading/trailing execution.

### Adjusting Delays

Change the delay (in milliseconds) in the constructor calls:

```js
new SearchComponent(input, results, 500); // 500ms debounce
new InfiniteScroll(container, loadMore, 100); // 100ms throttle
```

### Integrating with Real APIs

Replace the `fetchResults` method in `SearchComponent` with your own endpoint. The component automatically cancels previous requests using `AbortController`.

## 📁 Project Structure

```text
smart-search-and-scroll/
├── main.js              # SearchComponent & InfiniteScroll classes
├── utils/
│   ├── index.js         # Re‑exports debounce and throttle
│   ├── debounce.js      # Debounce implementation + demo
│   └── throttle.js      # Throttle implementation + demo
└── README.md            # This file
```

## 🚀 Run Locally

Open `index.html` in a browser (if included) or import the utilities into your own project. No build tools required – the code uses native ES modules.

## 📝 License

MIT License – free to use, modify, and distribute.
