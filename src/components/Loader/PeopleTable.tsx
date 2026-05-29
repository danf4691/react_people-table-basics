import { Person } from '../../types';
import { getPeople } from '../../api';
import React from 'react';
import { Loader } from './Loader';
import { Link, useParams } from 'react-router-dom';

export const PeopleTable = () => {
  const [peopleLoading, setPeopleLoading] = React.useState(false);
  const [peopleError, setPeopleError] = React.useState(false);
  const [people, setPeople] = React.useState<Person[]>([]);
  const [empty, setEmpty] = React.useState(false);
  const { slug } = useParams();
  const selectedSlug = slug || '';

  React.useEffect(() => {
    const fetchPeople = async () => {
      try {
        setPeopleLoading(true);
        const loaded = await getPeople();

        setPeople(loaded);
        setEmpty(loaded.length === 0);
      } catch {
        setPeopleError(true);
      } finally {
        setPeopleLoading(false);
      }
    };

    fetchPeople();
  }, []);

  return (
    <>
      {peopleLoading && <Loader />}
      {peopleError && (
        <p data-cy="peopleLoadingError" className="has-text-danger">
          Something went wrong
        </p>
      )}

      {!peopleLoading && !peopleError && empty && (
        <p data-cy="noPeopleMessage">There are no people on the server</p>
      )}

      {!peopleLoading && !peopleError && !empty && (
        <table
          data-cy="peopleTable"
          className="table is-striped is-hoverable is-narrow is-fullwidth"
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Sex</th>
              <th>Born</th>
              <th>Died</th>
              <th>Mother</th>
              <th>Father</th>
            </tr>
          </thead>

          <tbody>
            {people.map(person => (
              <tr
                key={person.slug}
                data-cy="person"
                className={
                  person.slug === selectedSlug ? 'has-background-warning' : ''
                }
              >
                <td>
                  {person.slug === selectedSlug ? (
                    <Link to={`..`}>{person.name}</Link>
                  ) : (
                    <Link
                      to={`../${person.slug}`}
                      className={person.sex === 'f' ? 'has-text-danger' : ''}
                    >
                      {person.name}
                    </Link>
                  )}
                </td>
                <td>{person.sex}</td>
                <td>{person.born}</td>
                <td>{person.died}</td>
                <td>
                  {people.find(p => p.name === person.motherName) ? (
                    <Link
                      to={`../${people.find(p => p.name === person.motherName)?.slug}`}
                      className="has-text-danger"
                    >
                      {person.motherName}
                    </Link>
                  ) : (
                    person.mother?.name || person.motherName || '-'
                  )}
                </td>
                <td>
                  {people.find(p => p.name === person.fatherName) ? (
                    <Link
                      to={`../${people.find(p => p.name === person.fatherName)?.slug}`}
                    >
                      {person.fatherName}
                    </Link>
                  ) : (
                    person.father?.name || person.fatherName || '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};
