import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faTimes,
  faChalkboard,
  faUserTie,
  faKey,
} from '@fortawesome/free-solid-svg-icons';
import { dtStrToLocalShortStr } from '../utils/timeUtils';

export const BIG_O_COMPLEXITY_DISPLAY = {
  O1: 'O(1)',
  NSQRT: 'O(N<sup>1/2</sup>)',
  LOGN: 'O(log N)',
  N: 'O(N)',
  NLOGN: 'O(N log N)',
  N2: 'O(N<sup>2</sup>)',
  N3: 'O(N<sup>3</sup>)',
  '2N': 'O(2<sup>N</sup>)',
  NFACTORIAL: 'O(N!)',
} as { [key: string]: string };

export const PROFICIENCY_LEVEL_DISPLAY = {
  NO_UNDERSTANDING: 'No Understanding',
  CONCEPTUAL_UNDERSTANDING: 'Conceptual Understanding',
  NO_PASS: 'No Pass',
  GUIDED_PASS: 'Guided Pass',
  UNSTEADY_PASS: 'Unsteady Pass',
  SMOOTH_PASS: 'Smooth Pass',
  SMOOTH_OPTIMAL_PASS: 'Smooth Optimal Pass',
} as { [key: string]: string };

type ProficiencyLevel =
  | 'NO_UNDERSTANDING'
  | 'CONCEPTUAL_UNDERSTANDING'
  | 'NO_PASS'
  | 'GUIDED_PASS'
  | 'UNSTEADY_PASS'
  | 'SMOOTH_PASS'
  | 'SMOOTH_OPTIMAL_PASS';

type Complexity =
  | 'O1'
  | 'NSQRT'
  | 'LOGN'
  | 'N'
  | 'NLOGN'
  | 'N2'
  | 'N3'
  | '2N'
  | 'NFACTORIAL'
  | 'A_2N';

export interface Submission {
  id: string;
  problem: { id: string; leetcodeNumber: number; title: string };
  code: string;
  submittedAt: string;
  duration: string;
  isSolution: boolean;
  isWhiteboardMode: boolean;
  isInterviewMode: boolean;
  timeComplexity: Complexity;
  spaceComplexity: Complexity;
  methods: { name: string }[];
  proficiencyLevel: ProficiencyLevel;
  passed: boolean;
}

export const FlagRenderer = (props: any) => {
  const { flag } = props.data;
  const flagArr = flag
    .split(',')
    .map((el: any) => el.trim())
    .sort((a: any, _: any) =>
      a === 'Solution' ? -1 : a === 'Interview' ? 1 : 0
    );
  return (
    <div className="d-flex align-items-center h-100">
      {flagArr.map((el: any) => (
        <Tooltip title={el} placement="top" key={el}>
          <div className="me-2">
            {el === 'Solution' ? (
              <FontAwesomeIcon icon={faKey} style={{ color: 'darkorange' }} />
            ) : el === 'Interview' ? (
              <FontAwesomeIcon icon={faUserTie} />
            ) : (
              <FontAwesomeIcon icon={faChalkboard} />
            )}
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

export const StatusRenderer = (props: any) => {
  const { passed } = props.data;
  return (
    <div className="d-flex align-items-center h-100">
      {passed ? (
        <div className="text-success">
          <FontAwesomeIcon icon={faCheck} />
        </div>
      ) : (
        <div className="text-danger">
          <FontAwesomeIcon icon={faTimes} />
        </div>
      )}
    </div>
  );
};

export const TimeComplexityCellRenderer = (props: any) => {
  const { timeComplexity } = props.data;

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: BIG_O_COMPLEXITY_DISPLAY[timeComplexity],
      }}
    ></div>
  );
};

export const SpaceComplexityCellRenderer = (props: any) => {
  const { spaceComplexity } = props.data;

  return (
    <div
      dangerouslySetInnerHTML={{
        __html:
          BIG_O_COMPLEXITY_DISPLAY[
            spaceComplexity == 'A_2N' ? '2N' : spaceComplexity
          ],
      }}
    ></div>
  );
};

export const NotesCellRenderer = (props: any) => {
  const id = props.data.id;
  const navigate = useNavigate();
  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <button
        className="btn btn-outline-primary btn-sm d-flex align-items-center fs-7 h-75 w-100"
        style={{
          opacity: props.data.hasNotes ? 1 : 0.5,
        }}
        onClick={() => {
          navigate(`/submissions/${id}/notes`);
        }}
        disabled={!props.data.hasNotes}
      >
        notes
      </button>
      <button
        className="btn btn-outline-primary btn-sm d-flex align-items-center fs-7 h-75 ms-2"
        onClick={() => {
          navigate(`/submissions/${id}/notes/new`);
        }}
      >
        +
      </button>
    </div>
  );
};

export const ResourcesCellRenderer = (props: any) => {
  const id = props.data.id;
  const navigate = useNavigate();
  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <button
        className="btn btn-outline-info btn-sm d-flex align-items-center fs-7 h-75"
        disabled={!props.data.hasResources}
        style={{
          opacity: props.data.hasResources ? 1 : 0.5,
        }}
        onClick={() => {
          navigate(`/submissions/${id}/resources`);
        }}
      >
        resources
      </button>
      <button
        className="btn btn-outline-info btn-sm d-flex align-items-center fs-7 h-75 ms-2"
        onClick={() => {
          console.log(id);
          navigate(`/submissions/${id}/resources/new`);
        }}
      >
        +
      </button>
    </div>
  );
};

const SubmissionList = ({
  submissions,
  simplified,
  rowClickCallback,
}: {
  submissions: Submission[];
  simplified?: boolean;
  rowClickCallback?: (_: any) => void;
}) => {
  const [rowData, setRowData] = useState([]);
  const { problemId } = useParams();

  useEffect(() => {
    if (submissions?.length === 0) return;
    setRowData((_: any) => {
      return submissions?.map((el: any) => {
        const flag = [];
        if (el.isInterviewMode) flag.push('Interview');
        if (el.isSolution) flag.push('Solution');
        if (el.isWhiteboardMode) flag.push('Whiteboard');
        return {
          ...el,
          submittedAt: dtStrToLocalShortStr(el.submittedAt),
          duration: el.duration + 'm',
          problem: el.problem?.title,
          timeComplexity:
            el.timeComplexity == 'A_2N' ? '2N' : el.timeComplexity,
          spaceComplexity:
            el.spaceComplexity == 'A_2N' ? '2N' : el.spaceComplexity,
          flag: flag.join(', '),
        };
      });
    });
  }, [submissions]);

  const containerStyle = { width: '95vw', height: '70vh' };

  const gridStyle = { height: '100%', width: '100%' };

  const columnDefs = [
    {
      field: 'flag',
      headerName: 'Mode',
      cellRenderer: FlagRenderer,
      filter: 'agSetColumnFilter',
    },
    {
      field: 'problem',
      filter: 'agSetColumnFilter',
      minWidth: 160,
      hide: problemId ? true : false,
    },
    {
      field: 'passed',
      filter: 'agSetColumnFilter',
      headerName: 'Status',
      cellRenderer: StatusRenderer,
      minWidth: 30,
    },
    {
      field: 'submittedAt',
      headerName: 'Submission Time',
      filter: 'agSetColumnFilter',
      minWidth: 163,
    },
    {
      field: 'duration',
      headerName: 'Mins',
      filter: 'agSetColumnFilter',
      minWidth: 85,
    },
    {
      field: 'proficiencyLevel',
      headerName: 'Proficientcy Level',
      filter: 'agSetColumnFilter',
      cellRenderer: (props: any) => PROFICIENCY_LEVEL_DISPLAY[props.value],
      minWidth: 210,
    },
    {
      field: 'timeComplexity',
      cellRenderer: TimeComplexityCellRenderer,
      headerName: 'Time',
      filter: 'agSetColumnFilter',
      minWidth: 85,
    },
    {
      field: 'spaceComplexity',
      cellRenderer: SpaceComplexityCellRenderer,
      headerName: 'Space',
      filter: 'agSetColumnFilter',
      minWidth: 92,
    },
  ] as {
    field?: string;
    headerName?: string;
    filter?: string | boolean;
    sortable?: boolean;
    cellRenderer?: any;
    minWidth?: number;
    hide?: boolean;
  }[];

  if (!simplified) {
    columnDefs.push({
      field: 'notes',
      headerName: '',
      cellRenderer: NotesCellRenderer,
      filter: false,
      sortable: false,
      minWidth: 120,
    });
    columnDefs.push({
      field: 'resources',
      headerName: '',
      cellRenderer: ResourcesCellRenderer,
      filter: false,
      sortable: false,
      minWidth: 150,
    });
  }

  const onGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };
  const defaultColDef = {
    flex: 1,
    sortable: true,
    resizable: true,
    // menuTabs: ['export'],
    // filter: true,
  };
  const navigate = useNavigate();

  return (
    <div
      className={`d-flex justify-content-center align-items-center opacity-75 ${
        simplified ? '' : 'mt-4'
      }`}
      style={{ borderRadius: '12px !important' }}
    >
      <div style={{ ...containerStyle, minHeight: '70vh' }}>
        <div style={gridStyle} className="ag-theme-alpine-dark">
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationAutoPageSize={true}
            onGridReady={onGridReady}
            onRowDoubleClicked={(e: any) => {
              console.log('row', submissions[e.rowIndex]);
              rowClickCallback
                ? rowClickCallback(submissions[e.rowIndex])
                : navigate(`/submissions/${e.data.id}`);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SubmissionList;
