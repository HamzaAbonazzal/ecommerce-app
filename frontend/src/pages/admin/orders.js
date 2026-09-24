import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/components/AdminLayout";
import AdminRoute from "@/components/AdminRoute";
import Loader from "@/components/Loader";
import api from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";
import SEO from "@/components/SEO";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const { t, lang } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter ? `/admin/orders?status=${filter}` : "/admin/orders";
      const res = await api.get(url);
      setOrders(res.data.data);
    } catch (err) {
      toast.error(t("common.error"));
    } finally {
      setLoading(false);
    }
  }, [filter, t]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const openDetails = async (order) => {
    setSelectedOrder(order);
    setDetailsLoading(true);
    try {
      const res = await api.get(`/admin/orders/${order.id}`);
      setSelectedOrder(res.data.data);
    } catch (err) {
      toast.error(t("common.error"));
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => setSelectedOrder(null);

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status });
      toast.success(t("admin.status_updated") || "Status updated");
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || t("common.error"));
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminRoute>
      <AdminLayout title={t("admin.orders")}>
        <SEO title="Admin Dashboard" noindex />
        {/* Filter bar */}
        <div className="glass-card p-3 p-md-4 mb-4">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <span className="fw-semibold me-2">
              {t("admin.filter_status") || "Filter:"}
            </span>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-3 ${
                !filter ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setFilter("")}
            >
              {t("admin.all") || "All"}
            </button>
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                className={`btn btn-sm rounded-pill px-3 ${
                  filter === s ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setFilter(s)}
              >
                {t(`status.${s}`)}
              </button>
            ))}
            <span className="ms-auto fw-semibold">
              {orders.length} {t("admin.orders_count") || "orders"}
            </span>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <div className="glass-card p-5 text-center">
            <i
              className="bi bi-receipt"
              style={{ fontSize: "3rem", color: "var(--text-muted)" }}
            ></i>
            <h5 className="mt-3 fw-bold">{t("admin.no_orders")}</h5>
          </div>
        ) : (
          <div className="glass-card p-0 overflow-hidden">
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{t("admin.customer")}</th>
                    <th>{t("admin.date")}</th>
                    <th>{t("admin.total") || "Total"}</th>
                    <th>{t("admin.status")}</th>
                    <th style={{ width: 140 }}>{t("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="fw-bold">#{o.id}</td>
                      <td>
                        <div className="fw-semibold">{o.customer_name}</div>
                        <small style={{ color: "var(--text-muted)" }}>
                          {o.customer_email}
                        </small>
                      </td>
                      <td style={{ color: "var(--text-secondary)" }}>
                        <small>{formatDate(o.created_at)}</small>
                      </td>
                      <td className="fw-bold">${Number(o.total).toFixed(2)}</td>
                      <td>
                        <span className={`status-badge status-${o.status}`}>
                          {t(`status.${o.status}`)}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openDetails(o)}
                        >
                          <i className="bi bi-eye me-1"></i>
                          {t("admin.view") || "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============ DETAILS MODAL ============ */}
        {selectedOrder && (
          <div className="custom-modal-overlay" onClick={closeDetails}>
            <div
              className="custom-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="glass-card p-4"
                style={{ borderRadius: "var(--radius-lg)" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">
                    <i className="bi bi-receipt me-2"></i>
                    {t("admin.order_details")} #{selectedOrder.id}
                  </h4>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={closeDetails}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                {/* Customer info */}
                <div className="glass-card p-3 mb-3">
                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-person me-1"></i>
                    {t("checkout.customer_info")}
                  </h6>
                  <div className="row g-3 small">
                    <div className="col-md-6">
                      <span style={{ color: "var(--text-muted)" }}>
                        {t("checkout.name")}:
                      </span>
                      <div className="fw-semibold">
                        {selectedOrder.customer_name}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <span style={{ color: "var(--text-muted)" }}>
                        {t("checkout.email")}:
                      </span>
                      <div className="fw-semibold">
                        {selectedOrder.customer_email}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <span style={{ color: "var(--text-muted)" }}>
                        {t("checkout.phone")}:
                      </span>
                      <div className="fw-semibold">
                        {selectedOrder.customer_phone}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <span style={{ color: "var(--text-muted)" }}>
                        {t("admin.date")}:
                      </span>
                      <div className="fw-semibold">
                        {formatDate(selectedOrder.created_at)}
                      </div>
                    </div>
                    <div className="col-12">
                      <span style={{ color: "var(--text-muted)" }}>
                        {t("checkout.address")}:
                      </span>
                      <div className="fw-semibold">
                        {selectedOrder.customer_address}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="glass-card p-3 mb-3">
                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-bag-check me-1"></i>
                    {t("admin.items") || "Items"}
                  </h6>
                  {detailsLoading ? (
                    <Loader />
                  ) : (
                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>{t("cart.product")}</th>
                            <th>{t("cart.price")}</th>
                            <th>{t("cart.quantity")}</th>
                            <th>{t("cart.subtotal")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items?.map((item) => (
                            <tr key={item.id}>
                              <td className="fw-semibold">
                                {item.product_name}
                              </td>
                              <td>${Number(item.price).toFixed(2)}</td>
                              <td>× {item.quantity}</td>
                              <td className="fw-bold">
                                ${(item.price * item.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div
                    className="d-flex justify-content-end mt-3 pt-3 border-top"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <div className="text-end">
                      <div
                        className="small"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {t("cart.total")}
                      </div>
                      <div className="fw-bold fs-4 gradient-text">
                        ${Number(selectedOrder.total).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status update */}
                <div className="glass-card p-3">
                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-arrow-repeat me-1"></i>
                    {t("admin.update_status")}
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 ${
                          selectedOrder.status === s
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => updateStatus(selectedOrder.id, s)}
                        disabled={selectedOrder.status === s}
                      >
                        {t(`status.${s}`)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </AdminRoute>
  );
}
