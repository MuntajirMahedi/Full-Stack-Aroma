import React, { useEffect, useState } from 'react'
import api from '../../api'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  
  // Form states
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [parentCategory, setParentCategory] = useState('')

  const loadCategories = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/categories')
      setCategories(res.data)
    } catch (err) {
      setError(err.response?.data?.msg || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/api/categories/${editingId}`, { name, slug, parentCategory: parentCategory || null })
      } else {
        await api.post('/api/categories', { name, slug, parentCategory: parentCategory || null })
      }
      // Reset form
      setName('')
      setSlug('')
      setParentCategory('')
      setEditingId(null)
      // Reload list
      await loadCategories()
    } catch (err) {
      setError(err.response?.data?.msg || err.message)
    }
  }

  const startEdit = (category) => {
    setEditingId(category._id)
    setName(category.name)
    setSlug(category.slug)
    setParentCategory(category.parentCategory || '')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try {
      await api.delete(`/api/categories/${id}`)
      await loadCategories()
    } catch (err) {
      setError(err.response?.data?.msg || err.message)
    }
  }

  if (loading) return <p>Loading categories...</p>

  return (
    <div className="admin-page">
      <h2>Manage Categories</h2>
      
      {error && <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>}

      <div className="card" style={{ marginBottom: 24 }}>
        <h3>{editingId ? 'Edit Category' : 'Create Category'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>Name:</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Slug:</label>
            <input 
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              required
              style={{ width: '100%' }}
              placeholder="unique-category-slug"
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Parent Category (optional):</label>
            <select 
              value={parentCategory} 
              onChange={e => setParentCategory(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">None</option>
              {categories.map(cat => (
                // Don't show current category as parent option when editing
                cat._id !== editingId && (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                )
              ))}
            </select>
          </div>

          <div style={{ marginTop: 16 }}>
            <button type="submit" className="btn-primary">
              {editingId ? 'Update Category' : 'Create Category'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingId(null)
                  setName('')
                  setSlug('')
                  setParentCategory('')
                }}
                style={{ marginLeft: 8 }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Categories</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Parent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.slug}</td>
                  <td>
                    {category.parentCategory ? 
                      categories.find(c => c._id === category.parentCategory)?.name 
                      : '—'}
                  </td>
                  <td>
                    <button 
                      onClick={() => startEdit(category)}
                      style={{ marginRight: 8 }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(category._id)}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: 16 }}>
                    No categories yet. Create one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
