import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasPassed, allFailed } from '../utils/submissionStatusHelper';
import { difficultyColor } from '../utils/difficultyColorHelper';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faTimes,
  faPaperPlane,
  faBook,
} from '@fortawesome/free-solid-svg-icons';

export const StatusCellRenderer = (props: any) => {
  return (
    <div className="d-flex align-items-center h-100">
      {hasPassed(props.data.submissions) ? (
        <FontAwesomeIcon icon={faCheck} style={{ color: 'lightgreen' }} />
      ) : allFailed(props.data.submissions) ? (
        <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />
      ) : null}
    </div>
  );
};

export const DifficultyCellRenderer = (props: any) => {
  return (
    <div
      className="d-flex align-items-center h-100"
      style={{ color: difficultyColor(props.data.difficulty) }}
    >
      {props.data.difficulty[0] + props.data.difficulty.slice(1).toLowerCase()}
    </div>
  );
};

export const SubmissionsCellRenderer = (props: any) => {
  const id = props.data.id;
  const navigate = useNavigate();
  return (
    <div className="d-flex justify-content-start align-items-center h-100">
      <button
        className="btn btn-outline-success btn-sm d-flex align-items-center fs-7 h-75"
        disabled={props.data.hasSubmissions ? false : true}
        style={{
          opacity: props.data.hasSubmissions ? 1 : 0.5,
        }}
        onClick={() => {
          navigate(`/problems/${id}/submissions`);
        }}
      >
        {props.data.submissionsCount ? `${props.data.submissionsCount}` : null}
        <FontAwesomeIcon icon={faPaperPlane} className="ms-2" />
      </button>
      <button
        className="btn btn-outline-success btn-sm d-flex align-items-center fs-7 h-75 ms-1"
        onClick={() => {
          navigate(`/problems/${id}/submissions/new`);
        }}
      >
        +
      </button>
    </div>
  );
};
export const yellowToOrangeContainerStyle = {
  width: '95vw',
  height: 'calc(100vh - 200px)',
  border: '2px solid',
  borderRadius: '10px',
  color: 'transparent',
  backgroundImage:
    'linear-gradient( -90deg, rgb(255, 89, 0) 0%, #f38960 30%, rgb(240, 240, 118) 60%, darkorange 100%)',
};

export const NotesCellRenderer = (props: any) => {
  const id = props.data.id;
  const navigate = useNavigate();
  return (
    <div className="d-flex justify-content-start align-items-center h-100">
      <button
        className="btn btn-outline-primary btn-sm d-flex align-items-center fs-7 h-75"
        style={{
          opacity: props.data.hasNotes ? 1 : 0.5,
        }}
        disabled={!props.data.hasNotes}
        onClick={() => {
          navigate(`/problems/${id}/notes`);
        }}
      >
        {props.data.notesCount ? `${props.data.notesCount}` : null}
        <FontAwesomeIcon icon={faBook} className="ms-2" />
      </button>
    </div>
  );
};

// export const ResourcesCellRenderer = (props: any) => {
//   const id = props.data.id;
//   const navigate = useNavigate();
//   return (
//     <div className="d-flex justify-content-center align-items-center h-100">
//       <button
//         className="btn btn-outline-info btn-sm d-flex align-items-center fs-7 h-75"
//         disabled={!props.data.hasResources}
//         style={{
//           opacity: props.data.hasResources ? 1 : 0.5,
//         }}
//         onClick={() => {
//           navigate(`/problems/${id}/resources`);
//         }}
//       >
//         {props.data.resourcesCount ? `${props.data.resourcesCount}` : null}
//         <FontAwesomeIcon icon={faLink} className="ms-2" />
//       </button>
//       <button
//         className="btn btn-outline-info btn-sm d-flex align-items-center fs-7 h-75 ms-2"
//         onClick={() => {
//           console.log(id);
//           navigate(`/problems/${id}/resources/new`);
//         }}
//       >
//         +
//       </button>
//     </div>
//   );
// };

const ProblemList = ({
  problems,
  loading,
}: {
  problems: any[];
  loading: boolean;
}) => {
  const [rowData, setRowData] = useState<any[]>([]);

  useEffect(() => {
    if (problems.length !== 0) {
      setRowData(problems);
    }
  }, [problems]);

  // console.log('problems', problems);

  const gridStyle = { height: '100%', width: '100%' };

  const columnDefs = [
    {
      field: 'passed',
      filter: 'agSetColumnFilter',
      headerName: '',
      cellRenderer: StatusCellRenderer,
      maxWidth: 50,
    },
    {
      field: 'leetcodeNumber',
      filter: 'agSetColumnFilter',
      headerName: '#',
      minWidth: 69,
      maxWidth: 69,
    },
    {
      field: 'title',
      filter: 'agSetColumnFilter',
      minWidth: 350,
    },
    {
      field: 'difficulty',
      cellRenderer: DifficultyCellRenderer,
      filter: 'agSetColumnFilter',
      minWidth: 100,
    },
    {
      field: 'acceptanceRate',
      headerName: 'Pass %',
      cellRenderer: (props: any) => Math.round(props.value),
      filter: 'agSetColumnFilter',
      maxWidth: 100,
      minWidth: 100,
    },
    {
      field: 'frequency',
      headerName: 'Freq %',
      cellRenderer: (props: any) => Math.round(props.value),
      filter: 'agSetColumnFilter',
      maxWidth: 100,
      minWidth: 100,
    },
    {
      field: 'submissions',
      headerName: 'Submissions',
      cellRenderer: SubmissionsCellRenderer,
      filter: false,
      sortable: false,
      minWidth: 110,
    },
    {
      field: 'notes',
      headerName: 'Notes',
      cellRenderer: NotesCellRenderer,
      filter: false,
      sortable: false,
      minWidth: 100,
    },
    // {
    //   field: 'resources',
    //   headerName: 'Resources',
    //   cellRenderer: ResourcesCellRenderer,
    //   filter: false,
    //   sortable: false,
    //   minWidth: 120,
    // },
  ];

  const defaultColDef = {
    flex: 1,
    sortable: true,
    resizable: true,
    menutabs: ['filterMenuTab'],
    // : ['export'],
    // filter: true,
  };

  const navigate = useNavigate();
  const [gridApi, setGridApi] = useState<any>();
  const onGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
    setGridApi(params.api);
    if (loading) {
      params.api.showLoadingOverlay();
    }
  };
  useEffect(() => {
    if (gridApi && !loading) gridApi?.hideOverlay();
  }, [loading, gridApi]);
  console.log('rowData', rowData);
  return (
    <div className="d-flex justify-content-center align-items-center mt-4">
      <div style={yellowToOrangeContainerStyle}>
        <div style={gridStyle} className="ag-theme-alpine-dark">
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationAutoPageSize={true}
            onGridReady={onGridReady}
            onRowDoubleClicked={(e: any) => {
              navigate(`/problems/${e.data.id}`);
            }}
            overlayLoadingTemplate="Loading problems list..."
          />
        </div>
      </div>
    </div>
  );
};

export default ProblemList;
