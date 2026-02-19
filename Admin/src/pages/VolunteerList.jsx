import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ChevronDown } from "lucide-react";
import AdminLayout from "../components/layouts/AdminLayout";
import PageHeader from "../components/common/PageHeader";
import Input from "../components/common/Input";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Pagination from "../components/common/Pagination";
import { volunteerService } from "../services";

const VolunteerList = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    fetchVolunteers();
  }, [pagination.current, searchQuery]);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const response = await volunteerService.getAll({
        page: pagination.current,
        limit: pagination.limit,
        is_member: true,
        search: searchQuery.trim() || undefined,
      });
      setVolunteers(response.data?.volunteers || []);
      if (response.data?.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error("Failed to fetch volunteers");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVolunteer = async () => {
    try {
      setLoading(true);
      await volunteerService.delete(confirmDialog.id);
      toast.success("Volunteer deleted successfully!");
      setConfirmDialog({ isOpen: false, id: null });
      await fetchVolunteers();
    } catch (error) {
      toast.error("Failed to delete volunteer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Volunteer List"
        subtitle={`Showing ${Math.min(100, volunteers.length)} volunteers`}
      />

      {/* Search Bar */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Search by Name</label>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter volunteer name..."
            />
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Found:{" "}
              <span className="font-bold text-gray-900">
                {pagination.total}
              </span>{" "}
              volunteers
            </div>
          </div>
        </div>
      </Card>

      {/* Volunteers List */}
      {loading && !volunteers.length ? (
        <LoadingSpinner />
      ) : volunteers.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500">
            {searchQuery.trim()
              ? "No matching volunteers found."
              : "No volunteers yet."}
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
                        variant="danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDialog({
                            isOpen: true,
                            id: volunteer._id,
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

          {volunteers.length > 0 && (
            <Pagination
              currentPage={pagination.current}
              totalPages={pagination.pages}
              onPageChange={(page) =>
                setPagination({ ...pagination, current: page })
              }
            />
          )}
        </>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Volunteer"
        message="Are you sure you want to delete this volunteer? This action cannot be undone."
        isDangerous
        loading={loading}
        onConfirm={handleDeleteVolunteer}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
    </AdminLayout>
  );
};

export default VolunteerList;
