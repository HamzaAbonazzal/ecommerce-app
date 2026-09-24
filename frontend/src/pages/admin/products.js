import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/components/AdminLayout";
import AdminRoute from "@/components/AdminRoute";
import Loader from "@/components/Loader";
import api from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";
import SEO from "@/components/SEO";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  stock: "",
  image_url: "",
  category_id: "",
};

export default function AdminProducts() {
  const { t } = useLanguage();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // null = إضافة، غير ذلك = تعديل
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // تحميل البيانات
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get("/admin/products"),
        api.get("/categories"),
      ]);
      setProducts(prodRes.data.data);
      setCategories(catRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error(t("common.error"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // فتح Modal إضافة
  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  // فتح Modal تعديل
  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      image_url: product.image_url || "",
      category_id: product.category_id ?? "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  // حفظ (إضافة أو تعديل)
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        image_url: form.image_url || null,
        category_id: form.category_id ? Number(form.category_id) : null,
      };

      if (editing) {
        await api.put(`/admin/products/${editing.id}`, payload);
        toast.success(t("admin.updated") || "Product updated");
      } else {
        await api.post("/admin/products", payload);
        toast.success(t("admin.created") || "Product created");
      }
      closeModal();
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || t("common.error"));
    } finally {
      setSaving(false);
    }
  };

  // حذف
  const handleDelete = async (product) => {
    if (!confirm(t("admin.confirm_delete"))) return;
    try {
      await api.delete(`/admin/products/${product.id}`);
      toast.success(t("admin.deleted") || "Product deleted");
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || t("common.error"));
    }
  };

  return (
    <AdminRoute>
      <AdminLayout title={t("admin.products")}>
        <SEO title="Admin Dashboard" noindex />
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h5 className="fw-bold mb-0">
              {products.length} {t("admin.products_count") || "products"}
            </h5>
          </div>
          <button type="button" className="btn btn-primary" onClick={openAdd}>
            <i className="bi bi-plus-lg me-1"></i>
            {t("admin.add_product")}
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <div className="glass-card p-5 text-center">
            <i
              className="bi bi-box"
              style={{ fontSize: "3rem", color: "var(--text-muted)" }}
            ></i>
            <h5 className="mt-3 fw-bold">{t("admin.no_products")}</h5>
            <button className="btn btn-primary mt-3" onClick={openAdd}>
              <i className="bi bi-plus-lg me-1"></i>
              {t("admin.add_product")}
            </button>
          </div>
        ) : (
          <div className="glass-card p-0 overflow-hidden">
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: 70 }}></th>
                    <th>{t("admin.name")}</th>
                    <th>{t("admin.category")}</th>
                    <th>{t("admin.price")}</th>
                    <th>{t("admin.stock")}</th>
                    <th style={{ width: 140 }}>{t("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            p.image_url ||
                            `https://placehold.co/60x60?text=${encodeURIComponent(
                              p.name,
                            )}`
                          }
                          alt={p.name}
                          style={{
                            width: 48,
                            height: 48,
                            objectFit: "cover",
                            borderRadius: 10,
                          }}
                        />
                      </td>
                      <td>
                        <div className="fw-semibold">{p.name}</div>
                        <small
                          style={{ color: "var(--text-muted)" }}
                          className="d-block text-truncate"
                        >
                          #{p.id}
                        </small>
                      </td>
                      <td>
                        {p.category_name ? (
                          <span className="badge-soft-primary">
                            {p.category_name}
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>
                      <td className="fw-bold">${Number(p.price).toFixed(2)}</td>
                      <td>
                        {p.stock > 10 ? (
                          <span className="badge bg-success-subtle text-success">
                            {p.stock}
                          </span>
                        ) : p.stock > 0 ? (
                          <span className="badge bg-warning-subtle text-warning">
                            {p.stock}
                          </span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger">
                            {t("products.out_of_stock")}
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEdit(p)}
                            title={t("admin.edit")}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(p)}
                            title={t("admin.delete")}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============ MODAL ============ */}
        {showModal && (
          <div className="custom-modal-overlay" onClick={closeModal}>
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
                    <i className="bi bi-box-seam me-2"></i>
                    {editing ? t("admin.edit_product") : t("admin.add_product")}
                  </h4>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={closeModal}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                <form onSubmit={handleSave}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">
                        {t("admin.name")} *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">
                        {t("admin.category")}
                      </label>
                      <select
                        className="form-select"
                        value={form.category_id}
                        onChange={(e) =>
                          setForm({ ...form, category_id: e.target.value })
                        }
                      >
                        <option value="">{t("products.all_categories")}</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">
                        {t("admin.price")} *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        value={form.price}
                        onChange={(e) =>
                          setForm({ ...form, price: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">
                        {t("admin.stock")} *
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={form.stock}
                        onChange={(e) =>
                          setForm({ ...form, stock: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small">
                        {t("admin.image_url")}
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        value={form.image_url}
                        onChange={(e) =>
                          setForm({ ...form, image_url: e.target.value })
                        }
                        placeholder="https://placehold.co/400x300"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small">
                        {t("admin.description")}
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                      ></textarea>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={closeModal}
                    >
                      {t("admin.cancel")}
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          ></span>
                          {t("common.loading")}
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-1"></i>
                          {t("admin.save")}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </AdminRoute>
  );
}
