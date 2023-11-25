import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            height: 'calc(100vh - 172px)',
            p: 3,
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const rowData = [
    {
      title: 'Toyota',
      content: 'Celica',
      submittedAt: '2021-10-10',
      isStarred: true,
      noteType: 'Submission',
      startLineNumber: 1,
      endLineNumber: 2,
    },
    {
      title: 'Ford',
      content: 'Mondeo',
      submittedAt: '2021-10-10',
      isStarred: false,
      noteType: 'Submission',
      startLineNumber: 1,
      endLineNumber: 2,
    },
    {
      title: 'Porsche',
      content: 'Boxter',
      submittedAt: '2021-10-10',
      isStarred: true,
      noteType: 'Submission',
      startLineNumber: 1,
      endLineNumber: 2,
    },
  ];
  const colDef = [
    {
      headerName: 'Title',
      field: 'title',
      sortable: true,
      filter: true,
      checkboxSelection: true,
    },
    {
      headerName: 'Content',
      field: 'content',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Submitted At',
      field: 'submittedAt',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Starred',
      field: 'isStarred',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Note Type',
      field: 'noteType',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Start Line Number',
      field: 'startLineNumber',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'End Line Number',
      field: 'endLineNumber',
      sortable: true,
      filter: true,
    },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  return (
    <div
      className="border border-orange w-100 p-4"
      style={{ marginTop: '10px' }}
    >
      <div>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Problem Notes" {...a11yProps(0)} />
          <Tab label="Submission Notes" {...a11yProps(1)} />
        </Tabs>
      </div>
      <CustomTabPanel value={value} index={0}>
        <div className="ag-theme-alpine-dark" style={{ height: '100%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={colDef}
            defaultColDef={defaultColDef}
          />
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Submission Notes
      </CustomTabPanel>
    </div>
  );
}
