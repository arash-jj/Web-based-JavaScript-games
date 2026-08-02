import { debounce, throttle } from "./utils";

// ---------- Debounced Search Input ----------
class SearchComponent {
  constructor(inputElement, resultsElement) {
    this.input = inputElement;
    this.results = resultsElement;
    this.abortController = null;

    // Debounced search: wait 300ms after user stops typing
    this.handleInput = debounce(this.performSearch.bind(this), 300, {
      leading: false,
      trailing: true,
    });

    this.input.addEventListener("input", this.handleInput);
  }

  async performSearch(event) {
    const query = this.input.value.trim();
    if (query.length < 2) {
      this.results.innerHTML = "";
      return;
    }

    // Cancel previous request (avoids race conditions)
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    try {
      this.results.innerHTML = '<div class="loading">Searching...</div>';

      // Simulate API call
      const data = await this.fetchResults(query, this.abortController.signal);
      this.displayResults(data);
    } catch (error) {
      if (error.name !== "AbortError") {
        this.results.innerHTML = '<div class="error">Search failed</div>';
      }
    }
  }

  async fetchResults(query, signal) {
    // Replace with real API endpoint
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?q=${query}`,
      { signal },
    );
    return response.json();
  }

  displayResults(items) {
    this.results.innerHTML = items
      .slice(0, 10)
      .map((item) => `<div class="result-item">${item.title}</div>`)
      .join("");
  }
}

// ---------- Throttled Scroll Handler ----------
class InfiniteScroll {
  constructor(container, loadMoreFn) {
    this.container = container;
    this.loadMore = loadMoreFn;
    this.isLoading = false;

    // Throttle to check scroll position at most every 200ms
    this.handleScroll = throttle(this.checkScroll.bind(this), 200, {
      leading: true,
      trailing: true,
    });

    this.container.addEventListener("scroll", this.handleScroll);
  }

  checkScroll() {
    const { scrollTop, scrollHeight, clientHeight } = this.container;

    // When within 100px of bottom, load more
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      if (!this.isLoading) {
        this.isLoading = true;
        this.loadMore().finally(() => {
          this.isLoading = false;
        });
      }
    }
  }
}

// Usage:
// const searchInput = document.getElementById("search");
// const searchResults = document.getElementById("results");
// new SearchComponent(searchInput, searchResults);

// const scrollContainer = document.getElementById("content");
// new InfiniteScroll(scrollContainer, async () => {
  // Load next page of data
//   const nextPage = await fetchNextPage();
//   appendContent(nextPage);
// });
