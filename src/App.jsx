import Select from "./components/Select.jsx";
import "./App.css";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

function App() {
  const renderCustomItem = (option) => (
    <div style={{ padding: "8px", display: "flex", flexDirection: "column" }}>
      <p>{option.id}</p>
      <strong>{option.title}</strong>
      <p>{option.body}</p>
    </div>
  );

  const renderDisplayValue = (option) => {
    return option.title + " - " + option.id;
  };

  const filterFunction = (option, filterText) => {
    const lowerCaseFilterText = filterText.toLowerCase();

    return (
      option.title.toLowerCase().includes(lowerCaseFilterText) ||
      option.body.toLowerCase().includes(lowerCaseFilterText)
    );
  };

  const sortFunction = (a, b) => a.title.localeCompare(b.title);

  return (
    <div className="app">
      <Select />
      <Select selectedIcon={faCheck} />
      <Select sortFunction={sortFunction} selectedIcon={faCheck} />
      <Select
        multiSelect={true}
        sortFunction={sortFunction}
        selectedIcon={faCheck}
      />
      <Select
        sortFunction={sortFunction}
        renderCustomItem={renderCustomItem}
        selectedIcon={faCheck}
      />
      <Select
        renderDisplayValue={renderDisplayValue}
        renderCustomItem={renderCustomItem}
        selectedIcon={faCheck}
      />
      <Select
        renderCustomItem={renderCustomItem}
        filterFunction={filterFunction}
        sortFunction={sortFunction}
        selectedIcon={faCheck}
        disabled={false}
        renderDisplayValue={renderDisplayValue}
        multiSelect={true}
      />
      <Select disabled />
    </div>
  );
}

export default App;
