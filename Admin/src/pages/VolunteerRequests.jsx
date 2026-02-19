import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ChevronDown } from "lucide-react";
import AdminLayout from "../components/layouts/AdminLayout";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Modal from "../components/common/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Pagination from "../components/common/Pagination";
import { volunteerService } from "../services";

const VolunteerRequests = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    volunteer: null,
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null,
    action: null,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    fetchVolunteerRequests();
  }, [pagination.current]);

  const fetchVolunteerRequests = async () => {
    try {
      setLoading(true);
      const response = await volunteerService.getAll({
        page: pagination.current,
        limit: pagination.limit,
        is_member: false,
      });
      setVolunteers(response.data?.volunteers || []);
      if (response.data?.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error("Failed to fetch volunteer requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      setLoading(true);
      const volunteerId = confirmDialog.id;
      await volunteerService.setMember(volunteerId);

      // Remove the volunteer from the list immediately
      setVolunteers(volunteers.filter((v) => v._id !== volunteerId));

      toast.success("Volunteer accepted!");
      setConfirmDialog({ isOpen: false, id: null, action: null });

      // Refetch to update pagination and ensure consistency
      if (volunteers.length === 1) {
        // If this was the last item on the page, go back to previous page
        if (pagination.current > 1) {
          setPagination({ ...pagination, current: pagination.current - 1 });
        } else {
          await fetchVolunteerRequests();
        }
      }
    } catch (error) {
      toast.error("Failed to accept volunteer");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVolunteer = async () => {
    try {
      setLoading(true);
      await volunteerService.delete(confirmDialog.id);
      toast.success("Volunteer request deleted!");
      setConfirmDialog({ isOpen: false, id: null, action: null });
      await fetchVolunteerRequests();
    } catch (error) {
      toast.error("Failed to delete volunteer request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Volunteer Requests"
        subtitle="Review and manage pending volunteer requests"
      />

      {loading && !volunteers.length ? (
        <LoadingSpinner />
      ) : volunteers.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500">
            No pending volunteer requests.
          </p>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {volunteers.map((volunteer) => {
              const isExpanded = expandedId === volunteer._id;

              return (
                <Card
                  key={volunteer._id}
                  className="relative"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : volunteer._id)
                  }
                >
                  <div className="flex gap-4 cursor-pointer">
                    {volunteer.image && (
                      <img
                        src={volunteer.image}
                        alt={volunteer.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {volunteer.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {volunteer.country}
                      </p>
                      <p className="text-xs text-gray-500">{volunteer.email}</p>
                    </div>

                    <div className="flex gap-2 self-start">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDialog({
                            isOpen: true,
                            id: volunteer._id,
                            action: "accept",
                          });
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDialog({
                            isOpen: true,
                            id: volunteer._id,
                            action: "delete",
                          });
                        }}
                      >
                        Delete
                      </Button>
                    </div>

                    <ChevronDown
                      size={20}
                      className={`transition-transform self-center ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 font-medium">
                          Describe Yourself
                        </p>
                        <p className="text-gray-900">
                          {volunteer.description || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">
                          Why Volunteer?
                        </p>
                        <p className="text-gray-900">{volunteer.why || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">
                          What Motivates You?
                        </p>
                        <p className="text-gray-900">
                          {volunteer.motivation || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">
                          Expectations from Organization
                        </p>
                        <p className="text-gray-900">
                          {volunteer.expectation || "-"}
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          <Pagination
            currentPage={pagination.current}
            totalPages={pagination.pages}
            onPageChange={(page) =>
              setPagination({ ...pagination, current: page })
            }
          />
        </>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={
          confirmDialog.action === "accept"
            ? "Accept Volunteer"
            : "Delete Request"
        }
        message={
          confirmDialog.action === "accept"
            ? "Are you sure you want to accept this volunteer? They will be added to the member list."
            : "Are you sure you want to delete this request?"
        }
        isDangerous={confirmDialog.action === "delete"}
        loading={loading}
        onConfirm={
          confirmDialog.action === "accept"
            ? handleAccept
            : handleDeleteVolunteer
        }
        onCancel={() =>
          setConfirmDialog({ isOpen: false, id: null, action: null })
        }
      />
    </AdminLayout>
  );
};

export default VolunteerRequests;
