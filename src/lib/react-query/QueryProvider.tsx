import {ReactNode} from 'react';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";


function QueryProvider({children} : {children: ReactNode}) {
    return (
        <QueryClientProvider client={new QueryClient}>
            {children}
        </QueryClientProvider>
    );
}

export default QueryProvider;