import {Input} from "@/components/ui/input.tsx";
import {useEffect, useState} from "react";
import GridPostList from "@/components/shared/GridPostList.tsx";
import SearchResults from "@/components/shared/SearchResults.tsx";
import {useGetPosts, useSearchPosts} from "@/lib/react-query/queriesAndMutations.ts";
import Loader from "@/components/shared/Loader.tsx";
import useDebounce from "@/hooks/useDebounce.ts";
import {useInView} from "react-intersection-observer";


function Explore() {
    const [ searchValue, setSearchValue ] = useState<string>('')
    const {
        data: posts,
        fetchNextPage,
        hasNextPage,
    } = useGetPosts()  //connects to getInfinitePosts() api

    const debouncedValue = useDebounce<string>(searchValue, 500)
    const { data: searchResult, isFetching: isFetchingSearch } = useSearchPosts(debouncedValue)

    //for infinite scroll to load new posts in view
    const { ref, inView } = useInView();

    const shouldShowSearchResults = searchValue !== ''
    const endOfPosts = !shouldShowSearchResults && posts?.pages.every(page => page?.documents.length === 0)

    useEffect(()=> {
            if(!searchValue && inView) {
                fetchNextPage()
            }
        },
        [inView, searchValue]
    )

    if(!posts) return <div className="flex-center w-full"><Loader /></div>

    return (
        <div className="explore-container">
            <div className="explore-inner_container">
                <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
                <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
                    <img src="/assets/icons/search.svg"
                         width={24}
                         height={24}
                         alt="search"
                    />
                    <Input type="text"
                           placeholder='Search'
                           className="explore-search"
                           value={searchValue}
                           onChange={(e)=>setSearchValue(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-between w-full max-w-5xl mt-16 mb-7">
                <h3 className="body-bold md:h3-bold">Popular Today</h3>

                <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
                    <p className="small-medium md:base-medium text-light-2">All</p>
                    <img src="/assets/icons/filter.svg"
                         width={20}
                         height={20}
                         alt="filter"
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-9 w-full max-w-5xl">
                {
                    shouldShowSearchResults
                    ? searchResult && <SearchResults
                        isSearchFetching={isFetchingSearch}
                        searchedPosts={searchResult.documents}
                    />
                    : endOfPosts
                        ? <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
                        : posts.pages.map((page, index) =>
                            <GridPostList key={`page-${index}`} posts={page?.documents}/>
                        )
                }
            </div>

            {/*if this div becomes in view and hasNextPage and not searching, show loader*/}
            {/*the effect gets triggered to load more posts, pushing this div off view*/}
            {
                hasNextPage && !searchValue && !endOfPosts
                    ? <div ref={ref} className="mt-10">
                        <Loader />
                    </div>
                    : !searchValue && <p className="text-light-4 mt-10 small-regular text-center w-full">-- End --</p>
            }
        </div>
    );
}

export default Explore;