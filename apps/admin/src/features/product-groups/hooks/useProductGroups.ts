'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { fetchModelGroupsDetails, renameModelGroup as renameModelGroupApi } from '../services/api';
import { type ModelGroupDetail } from '../types';

export function useProductGroups() {
  const [groups, setGroups] = useState<ModelGroupDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [totalGroups, setTotalGroups] = useState(0);

  // Rename modal state
  const [groupToRename, setGroupToRename] = useState<ModelGroupDetail | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadGroups = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetchModelGroupsDetails(debouncedSearch);
      setGroups(res.data || []);
      setTotalGroups(res.meta?.total || 0);
    } catch (err: any) {
      console.error('Failed to load model groups:', err);
      toast.error(err?.message || 'Failed to load product groups');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    void loadGroups();
  }, [loadGroups]);

  const openRenameModal = (group: ModelGroupDetail) => {
    setGroupToRename(group);
    setNewGroupName(group.modelGroup);
  };

  const closeRenameModal = () => {
    setGroupToRename(null);
    setNewGroupName('');
  };

  const handleRenameGroup = async () => {
    if (!groupToRename || !newGroupName.trim()) return;
    const cleanNew = newGroupName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-');

    if (cleanNew === groupToRename.modelGroup) {
      closeRenameModal();
      return;
    }

    try {
      setIsRenaming(true);
      const res = await renameModelGroupApi(groupToRename.modelGroup, cleanNew);
      toast.success(
        `Group renamed! Updated ${res.updatedCount} product${res.updatedCount === 1 ? '' : 's'}.`,
      );
      closeRenameModal();
      await loadGroups();
    } catch (err: any) {
      console.error('Failed to rename model group:', err);
      toast.error(err?.message || 'Failed to rename group');
    } finally {
      setIsRenaming(false);
    }
  };

  // Stats calculation
  const totalProductsInGroups = groups.reduce((acc, g) => acc + g.count, 0);
  const totalStockInGroups = groups.reduce((acc, g) => acc + g.totalStock, 0);
  const averageColorsPerGroup =
    groups.length > 0 ? (totalProductsInGroups / groups.length).toFixed(1) : '0';

  return {
    groups,
    isLoading,
    searchQuery,
    setSearchQuery,
    totalGroups,
    loadGroups,
    groupToRename,
    newGroupName,
    setNewGroupName,
    isRenaming,
    openRenameModal,
    closeRenameModal,
    handleRenameGroup,
    stats: {
      totalGroups: totalGroups || groups.length,
      totalProducts: totalProductsInGroups,
      totalStock: totalStockInGroups,
      averageColors: averageColorsPerGroup,
    },
  };
}
