import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import SensorIcon from "../../Assets/Svg/Object/SensorIcon";
import ConsumerIcon from "../../Assets/Svg/Object/ConsumerIcon";
import CreateObjectModal from "./CreateObjectModal";
import EditObjectModal from "./EditObjectModal";
import DeleteObjectModal from "./DeleteObjectModal";
import PreviewObjectModal from "./PreviewObjectModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import CreateIcon from "../../Assets/Svg/Object/CreateIcon";
import DeleteIcon from "../../Assets/Svg/Object/DeleteIcon";
import PreviewIcon from "../../Assets/Svg/Object/PreviewIcon";
import EditIcon from "../../Assets/Svg/Object/EditIcon";
import { createObject, updateObject, deleteObject, deleteMultipleObjects, fetchObjects, clearMessages } from "../../Provider/objectSlice";
import SuccessAlertObject from "../../Components/Alerts/ObjectAlert/SuccessAlertObject";
import ErrorAlertObject from "../../Components/Alerts/ObjectAlert/ErrorAlertObject";

// Object Management Table Component
const ObjectManagementTable = () => {
  const dispatch = useDispatch();
  const objects = useSelector((state) => state.objects.objects);
  const successMessage = useSelector((state) => state.objects.successMessage);
  const errorMessage = useSelector((state) => state.objects.errorMessage);
  const shouldfetchObjects = useSelector((state) => state.objects.shouldfetchObjects);

  useEffect(() => {
    dispatch(fetchObjects());
  }, [dispatch]);

  useEffect(() => {
    if (shouldfetchObjects) {
      dispatch(fetchObjects());
    }
  }, [shouldfetchObjects, dispatch]);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage, dispatch]);

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);

  const handleCreateObject = (newObject) => {
    dispatch(createObject(newObject));
  };

  const handleEditObject = (updatedObject) => {
    dispatch(updateObject({ id: updatedObject.id, updatedObject }));
  };

  const handleDeleteObject = (objectId) => {
    dispatch(deleteObject(objectId));
  };

  const handleDeleteMultipleObjects = () => {
    dispatch(deleteMultipleObjects(selectedObjects));
    setDeleteConfirmationOpen(false);
    setSelectedObjects([]);
  };

  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedObjects, setSelectedObjects] = useState([]);

  const handleCheckboxChange = (objectId) => {
    setSelectedObjects((prevSelected) => {
      if (prevSelected.includes(objectId)) {
        return prevSelected.filter((id) => id !== objectId);
      } else {
        return [...prevSelected, objectId];
      }
    });
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedObjects([]);
    } else {
      setSelectedObjects(objects.map((object) => object.id));
    }
    setIsAllSelected(!isAllSelected);
  };

  const [toggleStates, setToggleStates] = useState({});

  const handleToggleChange = (objectId) => {
    setToggleStates((prevStates) => ({
      ...prevStates,
      [objectId]: !prevStates[objectId],
    }));
  };

  useEffect(() => {
    const initialToggleStates = objects.reduce((acc, object) => {
      acc[object.id] = false;
      return acc;
    }, {});
    setToggleStates(initialToggleStates);
  }, [objects]);

  useEffect(() => {
    if (selectedObjects.length === objects.length) {
      setIsAllSelected(true);
    } else {
      setIsAllSelected(false);
    }
  }, [selectedObjects, objects.length]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto">
        <div className="bg-white dark:bg-gray-800 relative shadow-md rounded-lg overflow-hidden">
          <SuccessAlertObject
            message={successMessage}
            onClose={() => dispatch(clearMessages())}
            isVisible={!!successMessage}
          />
          <ErrorAlertObject
            message={errorMessage}
            onClose={() => dispatch(clearMessages())}
            isVisible={!!errorMessage}
          />
          <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
            <div className="w-full md:w-1/2 flex flex-row gap-2">
              <button
                type="button"
                id="createProductButton"
                data-modal-toggle="createProductModal"
                className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                onClick={() => setCreateModalOpen(true)}
              >
                <CreateIcon />
                Add Object
              </button>
              {selectedObjects.length > 0 && (
                <button
                  type="button"
                  data-modal-target="delete-modal"
                  data-modal-toggle="delete-modal"
                  className="flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                  onClick={() => setDeleteConfirmationOpen(true)}
                >
                  <DeleteIcon />
                  Delete Selected
                </button>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all"
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                      <label htmlFor="checkbox-all" className="sr-only">
                        checkbox
                      </label>
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Object name
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Object
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Setting
                  </th>
                </tr>
              </thead>
              <tbody>
                {objects.map((object) => (
                  <tr key={object.id} className="border-b dark:border-gray-700">
                    <td className="p-4 w-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-table-search-1"
                          type="checkbox"
                          onclick="event.stopPropagation()"
                          className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          checked={selectedObjects.includes(object.id)}
                          onChange={() => handleCheckboxChange(object.id)}
                        />
                        <label
                          htmlFor="checkbox-table-search-1"
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {object.name}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex flex-row gap-2">
                        <div>
                          {(() => {
                            if (object.objectType === "sensor") return <SensorIcon />;
                            if (object.objectType === "consumer") return <ConsumerIcon />;
                            return object.objectType;
                          })()}
                        </div>
                        {objectObjectType(object.objectType)}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex items-center space-x-4">
                        <button
                          type="button"
                          data-drawer-target="drawer-update-product"
                          data-drawer-show="drawer-update-product"
                          aria-controls="drawer-update-product"
                          className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                          onClick={() => {
                            setSelectedObject(object);
                            setEditModalOpen(true);
                          }}
                        >
                          <EditIcon />
                          Edit
                        </button>
                        <button
                          type="button"
                          data-drawer-target="drawer-read-product-advanced"
                          data-drawer-show="drawer-read-product-advanced"
                          aria-controls="drawer-read-product-advanced"
                          className="py-2 px-3 flex items-center text-sm font-medium text-center text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                          onClick={() => {
                            setSelectedObject(object);
                            setPreviewModalOpen(true);
                          }}
                        >
                          <PreviewIcon />
                          Preview
                        </button>
                        <button
                          type="button"
                          data-modal-target="delete-modal"
                          data-modal-toggle="delete-modal"
                          className="flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                          onClick={() => {
                            setSelectedObject(object);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <DeleteIcon />
                          Delete
                        </button>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={toggleStates[object.id] || false}
                            onChange={() => handleToggleChange(object.id)}
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            {toggleStates[object.id] ? "Enabled" : "Disabled"}
                          </span>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <CreateObjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreateObject}
        />
        <EditObjectModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          onUpdate={handleEditObject}
          object={selectedObject}
        />
        <DeleteObjectModal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onDelete={handleDeleteObject}
          object={selectedObject}
        />
        <PreviewObjectModal
          isOpen={isPreviewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          object={selectedObject}
        />
        <DeleteConfirmationModal
          isOpen={isDeleteConfirmationOpen}
          onClose={() => setDeleteConfirmationOpen(false)}
          onConfirm={handleDeleteMultipleObjects}
          selectedCount={selectedObjects.length}
        />
      </div>
    </section>
  );
};

const objectObjectType = (objectType) => {
  if (objectType === "sensor") return "source";
  if (objectType === "consumer") return "consumer";
  return objectType;
};

ObjectManagementTable.propTypes = {
  objects: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      consumers: PropTypes.arrayOf(PropTypes.string).isRequired,
      parameters: PropTypes.arrayOf(PropTypes.string).isRequired,
      objectType: PropTypes.string.isRequired,
      port: PropTypes.number.isRequired,
      communication: PropTypes.number.isRequired,
      baudRate: PropTypes.number.isRequired,
      signalType: PropTypes.string.isRequired,
    })
  ).isRequired,
};

ObjectManagementTable.defaultProps = {
  objects: [],
};

export default ObjectManagementTable;
