import { useEffect, useRef, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import Toast from '../components/Toast';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faSearch } from '@fortawesome/free-solid-svg-icons';

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ThreeTabView = ({ selectedTags }: { selectedTags: any }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  useEffect(() => {
    console.log('selected tags', selectedTags);
  }, [selectedTags]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          textColor="inherit"
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          TabIndicatorProps={{ style: { background: '#fff' } }}
        >
          <Tab label="Problems" {...a11yProps(0)} />
          <Tab label="Submissions" {...a11yProps(1)} />
          <Tab label="Notes" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        Problems with this tag{' '}
        {selectedTags.map((tag: any) => (
          <li>{tag.name}</li>
        ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Submissions with this tag
        {selectedTags.map((tag: any) => (
          <li>{tag.name}</li>
        ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Notes with this tag
        {selectedTags.map((tag: any) => (
          <li>{tag.name}</li>
        ))}
      </CustomTabPanel>
    </Box>
  );
};

export const FETCH_ALL_TAGS = gql`
  query FetchAllTags {
    allTags {
      id
      name
    }
  }
`;

export const CREATE_OR_UPDATE_TAG = gql`
  mutation TagMuTation($input: TagMutationInput!) {
    updateTag(input: $input) {
      tag {
        id
        name
      }
    }
  }
`;

export const DELETE_TAG = gql`
  mutation DeleteTag($id: ID!) {
    deleteTag(id: $id) {
      ok
    }
  }
`;
const TagAgGrid = ({
  rowData,
  createOrUpdateTag,
  handleDelete,
  setToastMessage,
  setShowToast,
  setSelectedTags,
}: {
  rowData: any;
  createOrUpdateTag: any;
  handleDelete: any;
  setToastMessage: any;
  setShowToast: any;
  setSelectedTags: any;
}) => {
  const containerStyle = { height: '100%', flex: 1 };
  const gridStyle = { height: '100%', width: '100%' };

  type ColumnDef = {
    field?: string;
    filter?: string;
    headerName?: string;
    editable?: boolean;
    maxWidth?: number;
  };

  const columnDefs = [
    {
      field: 'name',
      headerName: 'Name',
      editable: true,
    },
  ] as ColumnDef[];

  const defaultColDef = {
    flex: 1,
    minWidth: 150,
    filter: true,
    sortable: true,
    resizable: true,
    checkboxSelection: true,
    headerCheckboxSelection: true,
  };

  const onGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };

  const onCellEditingStarted = (params: any) => {};

  const onCellEditingEnded = (params: any) => {
    createOrUpdateTag({
      variables: { input: { id: params.data.id, name: params.newValue } },
    }).then((res: any) => {
      if (res.data?.updateTag?.tag) {
        setToastMessage('Tag updated successfully!');
        setShowToast(true);
      }
    });
  };
  const onSelectionChanged = (params: any) => {
    const selectedNodes = params.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node: any) => node.data);
    setSelectedTags(selectedData);
  };

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine-dark">
        <AgGridReact
          getContextMenuItems={(params: any) => {
            const result = [
              {
                name: 'Delete',
                action: () => {
                  handleDelete(params.node.data.id);
                },
              },
            ];
            return result;
          }}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationAutoPageSize={true}
          onGridReady={onGridReady}
          overlayLoadingTemplate="Loading problems list..."
          rowSelection="multiple"
          onCellEditingStarted={onCellEditingStarted}
          onCellEditingStopped={onCellEditingEnded}
          rowMultiSelectWithClick={true}
          onSelectionChanged={onSelectionChanged}
        />
      </div>
    </div>
  );
};

const TagCRUDListPage = () => {
  const { loading, error, data, refetch } = useQuery(FETCH_ALL_TAGS);
  const [createOrUpdateTag] = useMutation(CREATE_OR_UPDATE_TAG);
  const [deleteTag] = useMutation(DELETE_TAG);

  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingSearchTerm, setIsEditingSearchTerm] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingTagId, setEditingTagId] = useState('');
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [rowData, setRowData] = useState<any[]>([]);

  useEffect(() => {
    setRowData(
      data?.allTags
        ?.filter((tag: any) =>
          tag.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((tag: any) => ({ id: tag.id, name: tag.name }))
    );
  }, [searchTerm]);

  useEffect(() => {
    if (data?.allTags) {
      setRowData(
        data.allTags.map((tag: any) => ({ id: tag.id, name: tag.name }))
      );
    }
  }, [data]);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleDelete = (id: any) => {
    deleteTag({
      variables: {
        id: id,
      },
    }).then((res) => {
      if (res.data?.deleteTag?.ok) {
        refetch();
        setToastMessage('Tag deleted successfully!');
        setShowToast(true);
      }
    });
  };

  const handleSaveTag = async () => {
    if (isAdding) {
      await createOrUpdateTag({ variables: { input: { name: newTagName } } });
    } else if (isEditing) {
      await createOrUpdateTag({
        variables: { input: { id: editingTagId, name: newTagName } },
      });
    }
    setNewTagName('');
    setIsAdding(false);
    setIsEditing(false);
    setEditingTagId('');
    refetch();
  };

  const [inputFocused, setInputFocused] = useState(false);
  const [editingInputFocused, setEditingInputFocused] = useState(false);
  const searchTermRef = useRef<HTMLInputElement>(null);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div
      onClick={() => {
        if (inputFocused || editingInputFocused) {
          return;
        }
        if (isAdding) {
          setIsAdding(false);
          setNewTagName('');
        }
        if (isEditingSearchTerm) {
          setIsEditingSearchTerm(false);
          setSearchTerm('');
        }
      }}
      className="d-flex ps-5 pe-5 flex-column"
      style={{ overflow: 'hidden', height: 'calc(100vh - 100px)' }}
    >
      <div className="d-flex align-items-center justify-content-start mt-5 gap-2">
        <h1>Tags</h1>
        <FontAwesomeIcon
          className="ms-4 me-2 text-primary"
          icon={faPlusCircle}
          onClick={() => {
            setIsAdding(true);
            setNewTagName('');
          }}
        />
        <input
          className="no-border"
          onFocus={() => {
            setInputFocused(true);
          }}
          onBlur={() => {
            setInputFocused(false);
          }}
          ref={inputRef}
          style={{
            width: isAdding ? 100 : 0,
            padding: 0,
            border: 0,
            transition: 'width 0.5s ease',
          }}
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSaveTag();
            }
          }}
          placeholder=" New Tag"
        />
        <FontAwesomeIcon
          onClick={() => {
            setIsEditingSearchTerm(!isEditingSearchTerm);
            if (searchTermRef.current) {
              searchTermRef.current.focus();
            }
          }}
          className="me-2 text-primary"
          icon={faSearch}
        />
        <input
          ref={searchTermRef}
          className="no-border"
          id="tag-search"
          placeholder=" Filter Tags "
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            setEditingInputFocused(true);
          }}
          onBlur={() => {
            setEditingInputFocused(false);
          }}
          style={{
            width: isEditingSearchTerm ? 200 : 0,
            padding: 0,
            border: 0,
            transition: 'width 0.5s ease',
          }}
        />
      </div>
      <div
        className="d-flex"
        style={{
          height: 'calc(100vh - 220px)',
          gap: 10,
        }}
      >
        <TagAgGrid
          rowData={rowData}
          createOrUpdateTag={createOrUpdateTag}
          handleDelete={handleDelete}
          setToastMessage={setToastMessage}
          setShowToast={setShowToast}
          setSelectedTags={setSelectedTags}
        />
        <div
          className="bg-dark overflow-y-auto p-2"
          style={{
            height: 'calc(100vh - 220px)',
            flex: 3,
            backgroundColor: '#f5f5f5',
            border: '0.3px solid #999',
            borderRadius: 10,
          }}
        >
          <ThreeTabView selectedTags={selectedTags} />
        </div>
      </div>
      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default TagCRUDListPage;
