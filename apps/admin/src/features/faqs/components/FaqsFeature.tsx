'use client';

import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, EditIcon, SearchIcon, LifeBuoyIcon } from '@ff/ui';
import { api } from '@/lib/api-client';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  href?: string;
  linkText?: string;
  sortOrder: number;
}

export function FaqsFeature() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('Shipping');
  const [href, setHref] = useState('');
  const [linkText, setLinkText] = useState('');
  const [sortOrder, setSortOrder] = useState('0');

  const categories = ['Shipping', 'Orders', 'Returns', 'Sizing', 'Partnerships'];
  const filterCategories = ['All', ...categories];

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<FAQItem[]>('/admin/faq');
      setFaqs(data || []);
    } catch (err) {
      console.error('Failed to load FAQs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    const filtered = faqs.filter((faq) => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredFaqs(filtered);
  }, [faqs, searchQuery, selectedCategory]);

  const openAddModal = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setCategory('Shipping');
    setHref('');
    setLinkText('');
    setSortOrder(String(faqs.length + 1));
    setIsFormOpen(true);
  };

  const openEditModal = (faq: FAQItem) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category);
    setHref(faq.href || '');
    setLinkText(faq.linkText || '');
    setSortOrder(String(faq.sortOrder));
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      question,
      answer,
      category,
      href: href || undefined,
      linkText: linkText || undefined,
      sortOrder: parseInt(sortOrder, 10) || 0,
    };

    try {
      if (editingFaq) {
        await api.put(`/admin/faq/${editingFaq.id}`, payload);
      } else {
        await api.post('/admin/faq', payload);
      }
      setIsFormOpen(false);
      fetchFaqs();
    } catch (err) {
      console.error('Failed to save FAQ:', err);
      alert('Failed to save FAQ. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/faq/${id}`);
      fetchFaqs();
    } catch (err) {
      console.error('Failed to delete FAQ:', err);
      alert('Failed to delete FAQ.');
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white">
            FAQs Curation ({faqs.length})
          </h1>
          <p className="text-xs font-semibold text-black/60 dark:text-white/60">
            List, curate, and publish store policies and help content.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 rounded-full bg-black px-5 py-2.5 text-xs font-black tracking-wider text-white uppercase transition-all hover:bg-black/90 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add FAQ Option</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center text-black/40 dark:text-white/40">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search FAQs by question or answer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-black/10 bg-white py-2 pl-10 pr-4 text-sm font-semibold outline-none focus:border-black/30 dark:border-white/10 dark:bg-[#111111] dark:focus:border-white/30"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-black/5 text-black/60 hover:bg-black/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-black/40 dark:text-white/40">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-current">
            <LifeBuoyIcon className="h-8 w-8" />
          </div>
          <p className="text-sm font-semibold">No FAQs found matching your criteria.</p>
        </div>
      ) : (
        /* Table of FAQs */
        <div className="flex-1 overflow-y-auto rounded-3xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#111111]">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
                <th className="p-4 text-xs font-black uppercase tracking-wider text-black/40 dark:text-white/40">Order</th>
                <th className="p-4 text-xs font-black uppercase tracking-wider text-black/40 dark:text-white/40">Category</th>
                <th className="p-4 text-xs font-black uppercase tracking-wider text-black/40 dark:text-white/40 w-1/3">Question</th>
                <th className="p-4 text-xs font-black uppercase tracking-wider text-black/40 dark:text-white/40 w-1/2">Answer</th>
                <th className="p-4 text-xs font-black uppercase tracking-wider text-black/40 dark:text-white/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {filteredFaqs.map((faq) => (
                <tr key={faq.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                  <td className="p-4 font-mono font-bold text-xs">{faq.sortOrder}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider dark:bg-white/5">
                      {faq.category}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-black dark:text-white">{faq.question}</td>
                  <td className="p-4 text-black/60 dark:text-white/60 line-clamp-2 mt-2">{faq.answer}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => openEditModal(faq)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
                      >
                        <EditIcon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(faq.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 dark:border-red-500/10 dark:hover:bg-red-950/20"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Drawer / Modal Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs">
          <div className="h-full w-full max-w-lg border-l border-black/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#111111] overflow-y-auto">
            <h2 className="mb-6 text-xl font-black uppercase tracking-tight text-black dark:text-white">
              {editingFaq ? 'Modify FAQ Option' : 'Curate New FAQ'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/60 dark:text-white/60">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-transparent p-3 text-sm font-semibold outline-none dark:border-white/10"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="dark:bg-[#111111]">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/60 dark:text-white/60">Question</label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter the curated question..."
                  className="w-full rounded-2xl border border-black/10 bg-transparent p-3 text-sm font-semibold outline-none dark:border-white/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/60 dark:text-white/60">Answer</label>
                <textarea
                  required
                  rows={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Explain the store policy or answer clearly..."
                  className="w-full rounded-2xl border border-black/10 bg-transparent p-3 text-sm font-semibold outline-none dark:border-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/60 dark:text-white/60">Link Path (Optional)</label>
                  <input
                    type="text"
                    value={href}
                    onChange={(e) => setHref(e.target.value)}
                    placeholder="e.g. /shipping"
                    className="w-full rounded-2xl border border-black/10 bg-transparent p-3 text-sm font-semibold outline-none dark:border-white/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/60 dark:text-white/60">Link Text (Optional)</label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="e.g. View policy"
                    className="w-full rounded-2xl border border-black/10 bg-transparent p-3 text-sm font-semibold outline-none dark:border-white/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-black/60 dark:text-white/60">Sort Order</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-transparent p-3 text-sm font-semibold outline-none dark:border-white/10"
                />
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-black/5 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-full bg-black/5 px-5 py-2.5 text-xs font-black tracking-wider text-black/60 uppercase hover:bg-black/10 dark:bg-white/5 dark:text-white/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-black px-6 py-2.5 text-xs font-black tracking-wider text-white uppercase hover:bg-black/90 dark:bg-white dark:text-black"
                >
                  {editingFaq ? 'Save Changes' : 'Curate FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={async () => {
          if (deleteConfirmId) {
            await handleDelete(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        title="Delete FAQ Option"
        message="Are you sure you want to delete this FAQ? This policy will instantly disappear from the storefront."
        confirmText="Delete"
      />
    </div>
  );
}
