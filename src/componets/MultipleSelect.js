import React, { useLayoutEffect, useRef } from "react";
import { forwardRef } from 'react';
import styles from "./Multiselect.module.css"

const MultipleSelect = forwardRef(({ data , title, setSelect, select, children}, ref) => {
  const inputRef = useRef();

  useLayoutEffect(() => {
    inputRef.current.innerHTML = select.length <= 0 
        ? `<p>${title || 'MultiSelect'}</p>` 
        : select?.map(({ name }) => `<span>${name}</span>`).join(" ");
  }, [select]);

  return (
    <section className={styles["ml-container"]} ref={ref} onClick={e => e.stopPropagation()}>
      <input type="checkbox" id="toggle-ml-drop-menu" />

      <label htmlFor="toggle-ml-drop-menu" className={styles["ml-dropdown-label"]}>
        <div ref={inputRef} className={styles["preview-container"]}></div>
        <div>
        <span className={styles["ml-icon-arrow"]}></span>
        </div>
      </label>

      <ul name="multiselect" id={styles["ml-multiselect"]} multiple className={styles["ml-hide"]}>
        {data?.map((item) => {
          return (
            <li key={item.id}>
              <input
                type="checkbox"
                id={item.id + item.name}
                onChange={changeHandler}
              />
              <label htmlFor={item.id + item.name} data-id={item.id}>
                <span>{item.name}</span>
                {item.duration && item.duration !== '-1' && <span style={{opacity: 0}}>:</span>}
                <span className={`${styles["ml-light"]} ${styles["ml-2nd-describe"]}`}>{item.duration && `${Number(item.duration)+1} months`}</span>
              </label>
            </li>
          );
        })}
      </ul>

      {
        children
      }
    </section>
  );

  function changeHandler(e) {
    const ele   = e.target.nextElementSibling;
    const id = ele.getAttribute("data-id");
    const name  = ele.innerText;

    e.target.checked
      ? setSelect((select) => [...select, { id, name }])
      : setSelect((prev) => {
          let i = prev.findIndex((_) => _.id === id);
          if (i === -1) return [...prev];
          prev.splice(i, 1);
          return [...prev];
        });
  }
});

export default MultipleSelect;
