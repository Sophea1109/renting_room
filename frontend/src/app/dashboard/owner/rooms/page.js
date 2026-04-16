"use client";

import React, {useCallback, useEffect, useState} from "react";
import OwnerSidebar from "@/components/OwnerSidebar";
import OwnerHeader from "@/components/OwnerHeader";
import { rooms as initialRooms } from "@/data/roomData";
import Link from "next/link";
import {
  FiTrash2,
  FiEdit,
  FiAlertTriangle,
  FiMapPin,
  FiMail,
  FiHome,
  FiDollarSign,
  FiUser,
  FiCamera,
} from "react-icons/fi";
import ownerDashboardApi from "@/lib/ownerDashboardApi";

const {
  fetchOwnerDashboard,
  updateOwnerRoom,
  updateOwnerRoomStatus,
  deleteOwnerRoom,
} = ownerDashboardApi;

function toPriceLabel(monthlyRent) {
  return `$${Number(monthlyRent || 0)}/mo`;
}

function normalizeApiRoom(room) {
  return {
    id: room.id,
    title: room.name,
    description: room.description || "",
    location: room.location || "",
    price: toPriceLabel(room.monthlyRent),
    image: room.imageUrl || "",
    owner: {
      name: room.ownerName || "Owner",
      avatar: "",
      contact: room.contactEmail || "",
    },
    occupancyStatus: room.occupancyStatus || "available",
    paymentStatus: room.paymentStatus || "unpaid",
  };
}

function normalizeFallbackRoom(room) {
  return {
    ...room,
    occupancyStatus: room.occupancyStatus || "available",
    paymentStatus: room.paymentStatus || "unpaid",
  };
}

export default function RoomsPage() {
  const [activeTab, setActiveTab] = useState("rooms");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [roomsList, setRoomsList] = useState(initialRooms.map(normalizeFallbackRoom));

  // Delete states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [deletedRoomName, setDeletedRoomName] = useState("");

  // Edit states
  const [showEditModal, setShowEditModal] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
  const [actionError, setActionError] = useState('');

  // Mark available state
  const [markingAvailable, setMarkingAvailable] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    image: "",
    occupancyStatus: "available",
    paymentStatus: "unpaid",
    owner: {
      name: "",
      avatar: "",
      contact: "",
    },
  });

  // Available locations for dropdown
  const locations = [
    "Chamkarmon",
    "Toul Kork",
    "7 Makara",
    "Boeung Keng Kang",
    "Sen Sok",
    "Chroy Changvar",
    "Dangkao",
    "Meanchey",
  ];

  // Handle edit click
  const loadRoomsFromApi = useCallback(async () => {
    try {
      const data = await fetchOwnerDashboard();
      if (Array.isArray(data.rooms)) {
        setRoomsList(data.rooms.map(normalizeApiRoom));
      }
    } catch {
      // fallback to local data silently
    }
  }, []);

  useEffect(() => {
    loadRoomsFromApi();
  }, [loadRoomsFromApi]);

  const handleEditClick = (room) => {
    setRoomToEdit(room);
    setFormData({
      title: room.title,
      description: room.description,
      location: room.location,
      price: room.price.replace("$", "").replace("/mo", ""),
      image: room.image,
      occupancyStatus: room.occupancyStatus || "available",
      paymentStatus: room.paymentStatus || "unpaid",
      owner: {
        name: room.owner.name,
        avatar: room.owner.avatar,
        contact: room.owner.contact || "",
      },
    });
    setShowEditModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("owner.")) {
      const ownerField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        owner: {
          ...prev.owner,
          [ownerField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle edit submission
  const handleEditSubmit = async (e) => {
  e.preventDefault();
  if (!roomToEdit) return;

  setIsEditing(true);
  setActionError('');

  try {
    await updateOwnerRoom(roomToEdit.id, {
      name:              formData.title,
      owner_name:        formData.owner.name,
      description:       formData.description,
      location:          formData.location,
      contact_email:     formData.owner.contact,
      monthly_rent:      Number(formData.price || 0),
      occupancy_status:  formData.occupancyStatus,
      payment_status:    formData.paymentStatus,
    });

    setRoomsList((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id !== roomToEdit.id) return room;
        return {
          ...room,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          price: `$${formData.price}/mo`,
          image: formData.image,
          occupancyStatus: formData.occupancyStatus,
          paymentStatus: formData.paymentStatus,
          owner: {
            ...room.owner,
            name: formData.owner.name,
            contact: formData.owner.contact,
          },
        };
      })
    );

    setShowEditModal(false);
    setRoomToEdit(null);
    setShowEditSuccessAlert(true);
    setTimeout(() => setShowEditSuccessAlert(false), 5000);

    await loadRoomsFromApi();
  } catch (error) {
    setActionError(error?.message || 'Failed to update room status');
  } finally {
    setIsEditing(false);
  }
};

const handleDeleteClick = (roomId, roomName) => {
  setRoomToDelete({ id: roomId, name: roomName });
  setShowDeleteModal(true);
};

const confirmDelete = async () => {
  if (!roomToDelete) return;

  setIsDeleting(true);
  setActionError('');
  try {
    await deleteOwnerRoom(roomToDelete.id);
    setRoomsList((prevRooms) => prevRooms.filter((room) => room.id !== roomToDelete.id));
    setDeletedRoomName(roomToDelete.name);
    setShowSuccessAlert(true);
    setShowDeleteModal(false);
    setRoomToDelete(null);
    setTimeout(() => setShowSuccessAlert(false), 5000);
  } catch (error) {
    setActionError(error?.message || 'Failed to delete room');
  } finally {
    setIsDeleting(false);
  }
}  
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRoomToDelete(null);
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setRoomToEdit(null);
  };

  const handleMarkAvailable = async (roomId) => {
    setMarkingAvailable(roomId);
    setActionError('');
    try {
      await updateOwnerRoomStatus(roomId, {
        occupancy_status: 'available',
        payment_status:   'unpaid',
      });
      setRoomsList((prev) =>
        prev.map((r) =>
          r.id === roomId
            ? { ...r, occupancyStatus: 'available', paymentStatus: 'unpaid' }
            : r
        )
      );
    } catch (error) {
      setActionError(error?.message || 'Failed to update room status');
    } finally {
      setMarkingAvailable(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <OwnerSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <OwnerHeader />

        {/* Page content */}
        <main className="p-6 flex-1 overflow-y-auto bg-gray-50 relative">
          {/* Delete Success Alert */}
          {showSuccessAlert && (
            <div className="absolute top-6 right-6 z-50 animate-slide-in">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg shadow-lg max-w-md">
                <p className="text-sm font-medium text-green-800">
                  Room &quot;{deletedRoomName}&quot; has been deleted successfully.
                </p>
              </div>
            </div>
          )}
          {actionError && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-lg max-w-md">
                <p className="text-sm font-medium text-red-800">{actionError}</p>
              </div>
            </div>
          )}

          {/* Edit Success Alert */}
          {showEditSuccessAlert && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg shadow-lg max-w-md">
                <p className="text-sm font-medium text-green-800">
                  Room &quot;{formData.title}&quot; has been updated successfully.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">My Rooms</h1>
            <Link
              href="/dashboard/owner/rooms/create"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg shadow-md hover:from-blue-700 hover:to-cyan-600 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Room
            </Link>
          </div>

          {/* Rooms Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roomsList.map((room, idx) => (
                  <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-16 mr-4 relative overflow-hidden rounded-md bg-gray-200 flex items-center justify-center">
                          {room.image ? <div className="text-gray-400 text-xs">Image</div> : <FiHome className="w-6 h-6 text-gray-400" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{room.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">{room.description}</div>
                        </div>
                      </div>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center"><FiMapPin className="w-4 h-4 mr-1 text-gray-400" />{room.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {room.price}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="space-y-1.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          room.occupancyStatus === 'occupied'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {room.occupancyStatus === 'occupied' ? 'Occupied' : 'Unoccupied'}
                        </span>
                        <br />
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          room.paymentStatus === 'paid'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {room.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 mr-3 relative rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">{room.owner.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{room.owner.name}</div>
                          {room.owner.contact && (
                            <div className="text-xs text-gray-500 flex items-center"><FiMail className="w-3 h-3 mr-1" />{room.owner.contact}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col gap-2">
                        <div className="flex space-x-3">
                          <button className="text-blue-600 hover:text-blue-900 transition-all hover:underline flex items-center gap-1" onClick={() => handleEditClick(room)}>
                            <FiEdit className="w-4 h-4" />Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900 transition-all hover:underline flex items-center gap-1" onClick={() => handleDeleteClick(room.id, room.title)}>
                            <FiTrash2 className="w-4 h-4" />Delete
                          </button>
                        </div>
                        {room.occupancyStatus === 'occupied' && (
                          <button
                            onClick={() => handleMarkAvailable(room.id)}
                            disabled={markingAvailable === room.id}
                            className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg transition-all flex items-center gap-1 disabled:opacity-50"
                          >
                            {markingAvailable === room.id ? 'Updating...' : '✓ Mark as Available'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Edit Room Modal */}
      {showEditModal && (
        <div className="text-gray-700 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FiEdit className="h-6 w-6 text-blue-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Edit Room</h3>
                    <p className="text-sm text-gray-500 mt-1">Update room details and status</p>
                  </div>
                </div>
                <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="space-y-6">
                {/* Room Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Title</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiHome className="h-5 w-5 text-gray-400" /></div>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>

                {/* Location and Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiMapPin className="h-5 w-5 text-gray-400" /></div>
                      <select name="location" value={formData.location} onChange={handleInputChange} className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select Location</option>
                        {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (per month)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiDollarSign className="h-5 w-5 text-gray-400" /></div>
                      <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="50" className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* Owner Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupancy</label>
                    <select name="occupancyStatus" value={formData.occupancyStatus} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="available">Unoccupied</option>
                      <option value="occupied">Occupied</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment</label>
                    <select name="paymentStatus" value={formData.paymentStatus} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Owner Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiUser className="h-5 w-5 text-gray-400" /></div>
                      <input type="text" name="owner.name" value={formData.owner.name} onChange={handleInputChange} className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiMail className="h-5 w-5 text-gray-400" /></div>
                      <input type="email" name="owner.contact" value={formData.owner.contact} onChange={handleInputChange} className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiCamera className="h-5 w-5 text-gray-400" /></div>
                    <input type="text" name="image" value={formData.image} onChange={handleInputChange} className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                  <button type="button" onClick={cancelEdit} disabled={isEditing} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg">Cancel</button>
                <button type="submit" disabled={isEditing} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                  {isEditing ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="p-6">
              <div className="flex items-center space-x-3">
                {/* <div className="flex-shrink-0">
                  <FiAlertTriangle className="h-6 w-6 text-red-500" />
                </div> */}
                <FiAlertTriangle className="h-6 w-6 text-red-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Room</h3>
                  <p className="text-sm text-gray-500 mt-1">Are you sure you want to delete this room?</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-md">
                {/* <p className="text-sm text-red-800">
                  Room "{roomToDelete?.name}" will be permanently deleted. This action cannot be undone.
                </p> */}
                <p className="text-sm text-red-800">Room &quot;{roomToDelete?.name}&quot; will be permanently deleted.</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button onClick={cancelDelete} disabled={isDeleting} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg">Cancel</button>
              <button onClick={confirmDelete} disabled={isDeleting} className="px-4 py-2 bg-red-600 text-white rounded-lg">
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animation */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}