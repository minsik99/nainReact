import { useCallback, useEffect } from 'react';

const useInfiniteScroll = (containerRef, loadMore, hasMore) => {
    const handleScroll = useCallback(() => {
        if (containerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            if (scrollTop + clientHeight >= scrollHeight && hasMore) {
                loadMore();
            }
        }
    }, [hasMore, loadMore]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll, containerRef]);
};

export default useInfiniteScroll;
