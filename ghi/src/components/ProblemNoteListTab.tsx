import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import NoteDetailAccordion from './NoteDetailAccordion';
import { ALL_NOTES_BY_PROBLEM_ID } from '../graphql/noteQueries';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { AppBar, Toolbar } from '@mui/material';

const ProblemNoteListTab = () => {
  const { problemId } = useParams();
  const { loading, error, data, refetch } = useQuery(ALL_NOTES_BY_PROBLEM_ID, {
    variables: { id: problemId ? +problemId : 0 },
  });
  const [problemNotes, setProblemNotes] = useState([] as any[]);
  const [submissionNotes, setSubmissionNotes] = useState([] as any[]);
  const [allOpen, setAllOpen] = useState(true);

  useEffect(() => {
    if (data) {
      setProblemNotes(data.problemById.notes);
      setSubmissionNotes(() =>
        data.problemById.submissions.reduce((acc: any, cur: any) => {
          return [...acc, ...cur.notes];
        }, [])
      );
    }
  }, [data]);

  const [value, setValue] = useState('1');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div style={{ maxHeight: '75vh', overflowY: 'hidden' }}>
      <TabContext value={value}>
        <AppBar
          position="relative"
          sx={{
            bgcolor: 'transparent',
            boxShadow: 'none',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <TabList
              onChange={(_: React.SyntheticEvent, newValue: string) =>
                setValue(newValue)
              }
              textColor="inherit"
              variant="fullWidth"
              TabIndicatorProps={{ style: { background: 'orange' } }}
            >
              <Tab
                label="problem notes"
                value="1"
                sx={{
                  textTransform: 'capitalize',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: 'orange',
                }}
              />
              <Tab
                label="submission notes"
                value="2"
                sx={{
                  minWidth: '200px',
                  textTransform: 'capitalize',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: 'orange',
                }}
              />
            </TabList>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setAllOpen((prevState) => !prevState)}
            >
              {allOpen ? 'collapse all' : 'open all'}
            </button>
          </Toolbar>
        </AppBar>
        <TabPanel value="1">
          <div
            className="overflow-auto scrollbar-hidden"
            style={{ height: '70vh' }}
          >
            {problemNotes.map((note) => (
              <NoteDetailAccordion
                key={note?.id as string}
                note={note}
                allOpen={allOpen}
                parentId={problemId as string}
                noteLevel="problem"
              />
            ))}
          </div>
        </TabPanel>
        <TabPanel value="2">
          <div className="overflow-hidden">
            {submissionNotes.map((note) => (
              <NoteDetailAccordion
                key={note?.id as string}
                note={note}
                allOpen={allOpen}
                parentId={note?.submission?.id as string}
                noteLevel="submission"
              />
            ))}
          </div>
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default ProblemNoteListTab;
