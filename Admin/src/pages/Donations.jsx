import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import AdminLayout from "../components/layouts/AdminLayout";
import PageHeader from "../components/common/PageHeader";
import Input from "../components/common/Input";
import Card from "../components/common/Card";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Pagination from "../components/common/Pagination";
import { donationService } from "../services";

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchField, setSearchField] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    fetchDonations();
  }, [pagination.current, fromDate, toDate, statusFilter]);

  const fetchDonations = async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.current,
        limit: pagination.limit,
      };

      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      if (statusFilter) params.status = statusFilter;
      if (searchQuery && searchField) {
        if (searchField === "name") params.name = searchQuery;
        else if (searchField === "phone_email")
          params.phone_email = searchQuery;
      }

      const response = await donationService.getAll(params);
      setDonations(response.data?.donations || []);
      if (response.data?.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error("Failed to fetch donations");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      success: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Successful",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
      },
      failed: { bg: "bg-red-100", text: "text-red-800", label: "Failed" },
    };

    const config = statusMap[status] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: "Unknown",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Donations"
        subtitle="View and manage donor contributions"
      />

      {/* Filters */}
      <Card className="mb-6">
        <h3 className="subsection-title mb-4">Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="From Date"
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPagination({ ...pagination, current: 1 });
            }}
          />

          <Input
            label="To Date"
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPagination({ ...pagination, current: 1 });
            }}
          />

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination({ ...pagination, current: 1 });
              }}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="success">Successful</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Search By</label>
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="input-field"
            >
              <option value="name">Name</option>
              <option value="phone_email">Phone/Email</option>
            </select>
          </div>
        </div>

        <Input
          label="Search Query"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPagination({ ...pagination, current: 1 });
          }}
          placeholder="Enter search term..."
          className="mt-4"
        />
      </Card>

      {/* Donations Table */}
      {loading && !donations.length ? (
        <LoadingSpinner />
      ) : donations.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500">No donations found.</p>
        </Card>
      ) : (
        <>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Phone/Email
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation._id} className="table-row">
                    <td className="px-4 py-3">
                      {new Date(donation.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{donation.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {donation.phone_email}
                    </td>
                    <td className="px-4 py-3">{donation.category || "-"}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {donation.amount.toLocaleString()} $
                    </td>
                    <td className="px-4 py-3 text-center">
                      {getStatusBadge(donation.payment_status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Pagination
            currentPage={pagination.current}
            totalPages={pagination.pages}
            onPageChange={(page) =>
              setPagination({ ...pagination, current: page })
            }
          />
        </>
      )}
    </AdminLayout>
  );
};

export default Donations;
