import React, { useEffect, useState, useRef, useCallback } from "react";

const App = () => {
  const itemsPerPage = 20;
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const fetchItems = useCallback(
    async (page) => {
      if (!hasMore) return;

      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newItems = Array.from({ length: itemsPerPage }, (_, i) => ({
        id: startIndex + i + 1,
        name: `Item ${startIndex + i + 1}`,
      })).slice(0, Math.min(itemsPerPage, 100 - startIndex));

      setItems((prevItems) => [...prevItems, ...newItems]);
      setHasMore(endIndex < 100);
    },
    [hasMore]
  );

  useEffect(() => {
    fetchItems(page);
  }, [page, fetchItems]);

  const lastItemRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  return (
    <div className="App">
      <ul>
        {items.map((item, index) => (
          <li
            key={item.id}
            ref={index === items.length - 1 ? lastItemRef : null}
          >
            {item.name}
          </li>
        ))}
      </ul>
      {!hasMore && <p>No more items to load</p>}
    </div>
  );
};

export default App;
