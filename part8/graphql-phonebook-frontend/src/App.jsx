import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const ALL_PERSONS = gql`
  query {
    allPersons {
      name
      phone
      id
    }
  }
`;

const App = () => {
  const result = useQuery(ALL_PERSONS);

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <Persons persons={result.data.allPersons} />

      <PersonForm />
    </div>
  );
};

export default App;
