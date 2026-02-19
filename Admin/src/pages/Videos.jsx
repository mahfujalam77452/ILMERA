import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, Play } from "lucide-react";
import AdminLayout from "../components/layouts/AdminLayout";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Card from "../components/common/Card";
import Modal from "../components/common/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Pagination from "../components/common/Pagination";
import { videoService } from "../services";
import { getEmbedUrl, isValidYouTubeUrl } from "../utils/youtubeUtils";
import { validations } from "../utils/validations";

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [errors, setErrors] = useState({});
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
    fetchVideos();
  }, [pagination.current]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await videoService.getAll(
        pagination.current,
        pagination.limit,
      );
      setVideos(response.data?.videos || []);
      if (response.data?.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validations.isNotEmpty(title)) {
      newErrors.title = "Title is required";
    }

    if (!validations.isNotEmpty(videoLink)) {
      newErrors.videoLink = "Video link is required";
    } else if (!isValidYouTubeUrl(videoLink)) {
      newErrors.videoLink = "Please enter a valid YouTube URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors above");
      return;
    }

    try {
      setLoading(true);
      
      await videoService.add(title, videoLink);
      toast.success("Video added successfully!");
      setTitle("");
      setVideoLink("");
      setIsModalOpen(false);
      setPagination({ ...pagination, current: 1 });
      await fetchVideos();
    } catch (error) {
      const message = error.response?.data?.error || "Failed to add video";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async () => {
    try {
      setLoading(true);
      await videoService.delete(confirmDialog.id);
      toast.success("Video deleted successfully!");
      setConfirmDialog({ isOpen: false, id: null });
      await fetchVideos();
    } catch (error) {
      toast.error("Failed to delete video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Videos"
        actions={
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Add Video
          </Button>
        }
      />

      {loading && !videos.length ? (
        <LoadingSpinner />
      ) : videos.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500">
            No videos yet. Add one to get started!
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => {
              const embedUrl = getEmbedUrl(video.video_link);
              return (
                <Card key={video._id} className="relative">
                  <button
                    onClick={() =>
                      setConfirmDialog({ isOpen: true, id: video._id })
                    }
                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition-colors z-10"
                    aria-label="Delete video"
                  >
                    <X size={20} />
                  </button>

                  {embedUrl && (
                    <iframe
                      src={embedUrl}
                      title={video.title}
                      width="100%"
                      height="200"
                      className="rounded-lg mb-4"
                      allowFullScreen
                    ></iframe>
                  )}

                  <p className="font-semibold text-gray-900">{video.title}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Added: {new Date(video.createdAt).toLocaleDateString()}
                  </p>
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

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        title="Add New Video"
        onClose={() => {
          setIsModalOpen(false);
          setTitle("");
          setVideoLink("");
          setErrors({});
        }}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddVideo}
              loading={loading}
            >
              {loading ? "Adding..." : "Add Video"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddVideo}>
          <Input
            label="Video Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            placeholder="e.g., Charity Event 2024"
            required
          />

          <Input
            label="YouTube Link"
            type="url"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            error={errors.videoLink}
            placeholder="https://youtube.com/watch?v=..."
            required
          />

          {videoLink && isValidYouTubeUrl(videoLink) && (
            <div className="mt-4">
              <p className="text-sm text-green-600 mb-2">✓ Valid YouTube URL</p>
              <iframe
                src={getEmbedUrl(videoLink)}
                width="100%"
                height="250"
                className="rounded-lg"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Video"
        message="Are you sure you want to delete this video?"
        isDangerous
        loading={loading}
        onConfirm={handleDeleteVideo}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
    </AdminLayout>
  );
};

export default Videos;
