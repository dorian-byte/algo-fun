import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { gql, useQuery, useMutation } from '@apollo/client';
import Toast from '../components/Toast';

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

const TagCRUDListPage = () => {
  const { loading, error, data, refetch } = useQuery(FETCH_ALL_TAGS);
  const [createOrUpdateTag] = useMutation(CREATE_OR_UPDATE_TAG);
  const [deleteTag] = useMutation(DELETE_TAG);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingTagId, setEditingTagId] = useState('');
  const itemsPerPage = 8;

  const filteredTags = data?.allTags?.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTags?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTags?.length / itemsPerPage);

  const handleDelete = (id: any) => {
    deleteTag({
      variables: {
        id: id,
      },
    }).then((res) => {
      console.log('res', res);
      if (res.data?.deleteTag?.ok) {
        refetch();
        setToastMessage('Tag deleted successfully!');
        setShowToast(true);
      }
    });
  };

  const handleSaveNewTag = async () => {
    if (newTagName) {
      await createOrUpdateTag({ variables: { input: { name: newTagName } } });

      // createOrUpdateTag({
      //   variables: {
      //     input: {
      //       id: id,
      //       name: newTagName,
      //     },
      //   },
      // });

      setNewTagName('');
      setIsAdding(false);
      refetch();
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h1 className="page-header text-center mt-5">Tags</h1>
      <div className="container">
        <div className="row mb-3">
          <div className="col-md-6 d-flex align-items-center">
            <button
              className="btn btn-primary"
              onClick={() => setIsAdding(true)}
            >
              <FontAwesomeIcon
                icon={faPlus}
                color="darkorange"
                className="me-1"
              />
              Add Tag
            </button>
          </div>
          <div className="col-md-6 d-flex justify-content-end align-items-baseline">
            <input
              id="tag-search"
              placeholder=" Search by tag name..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="table table-dark table-hover table-striped">
          <thead>
            <tr>
              <th>Tag Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isAdding && (
              <tr>
                <td>
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder=" Enter new tag name "
                  />
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={handleSaveNewTag}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setIsAdding(false);
                      setNewTagName('');
                    }}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            )}
            {currentItems?.map((tag: any) => (
              <tr key={tag.id}>
                {isEditing && tag.id === editingTagId ? (
                  <td>
                    <input
                      type="text"
                      value={newTagName || tag.name}
                      onChange={(e) => setNewTagName(e.target.value)}
                    />
                  </td>
                ) : (
                  <td>{tag.name}</td>
                )}

                {isEditing && tag.id === editingTagId ? (
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => {
                        handleSaveNewTag();
                        setIsEditing(false);
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setIsEditing(false);
                        setNewTagName('');
                      }}
                    >
                      Cancel
                    </button>
                  </td>
                ) : (
                  <td>
                    <button
                      className="btn btn-outline-success btn-sm me-2"
                      onClick={() => {
                        setEditingTagId(tag.id);
                        setIsEditing(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        handleDelete(tag.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center custom-pagination">
            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}
              >
                <a
                  className="page-link"
                  href="#!"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </a>
              </li>
            ))}
          </ul>
        </nav>
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
