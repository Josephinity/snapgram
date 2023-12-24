Fix: storage fetch image exception after deleted post and redirected to home

Implement: session expiration logout


Follow-up:
Promise timeout
Promise count out


Questions:
What's the common practice to limit the result count of searched posts? Pagination



Notes:
src/hooks/useDebounce.ts
Debouncing - search result after searchterm stop changing for a while, instead of calling search on any character change

Infinite scroll - react-intersection-observer - checks if element is in viewport, react-query.useInfiniteQuery()

CSS: inner div with long words overflows
Solution: provide width ratios of flex boxes in parallel