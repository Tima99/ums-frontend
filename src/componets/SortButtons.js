import React from "react";

const SortButtons = ({sortBy, setSortAsc, sortAsc}) => {

  return (
    <span>
      
      <span className="sort-btn" onClick={(e) => {sortBy(e); setSortAsc(prev => !prev)}}
        style={{
          transform: 'rotate(' + (sortAsc ? '180deg': '0deg') + ')',
          transition: 'all .4s',
          display: 'inline-block',
          fontSize: '.65rem'
        }}
      >
        🔼
      </span>
    </span>
  );
};

export default SortButtons;
