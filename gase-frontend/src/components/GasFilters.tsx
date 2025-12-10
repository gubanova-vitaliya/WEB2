import { FC, useState } from "react";
import { useAppDispatch } from "../hooks/useTypedRedux";
import { setSearchFilter } from "../slices/gasSlice";
import "./GasFilters.css";

export const GasFilters: FC = () => {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    dispatch(setSearchFilter(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Поиск по названию или формуле..."
        value={search}
        onChange={handleSearchChange}
      />
      <button type="submit">Найти</button>
    </form>
  );
};

