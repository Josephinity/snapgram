import {Models} from "appwrite";
import Loader from "@/components/shared/Loader.tsx";
import GridPostList from "@/components/shared/GridPostList.tsx";

type SearchResultsProps = {
    isSearchFetching: boolean;
    searchedPosts?: Models.Document[];
}

function SearchResults({ isSearchFetching, searchedPosts }: SearchResultsProps) {
    if(isSearchFetching) return <div className="w-full flex-center"><Loader /></div>;

    if(searchedPosts && searchedPosts.length > 0) return <GridPostList posts={searchedPosts} />

    return <p className="text-light-4 mt-10 text-center w-full">No results found</p>
}

export default SearchResults;