
import { useState, useEffect } from 'react';
import { CustomLifeBlock, ContentType, LifeBlockContent } from '@/types/lifeblocks';
import * as api from '@/lib/api';

export const useLifeBlocks = () => {
  const [lifeBlocks, setLifeBlocks] = useState<CustomLifeBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load life blocks from API
  useEffect(() => {
    const loadLifeBlocks = async () => {
      try {
        setLoading(true);
        const blocks = await api.getLifeBlocks();
        setLifeBlocks(blocks.map((block: any) => ({
          ...block,
          createdAt: new Date(block.createdAt),
          updatedAt: new Date(block.updatedAt),
          contents: block.contents.map((content: any) => ({
            ...content,
            createdAt: new Date(content.createdAt),
            updatedAt: new Date(content.updatedAt),
          }))
        })));
        setError(null);
      } catch (err) {
        console.error('Error loading life blocks:', err);
        setError('Failed to load life blocks');
      } finally {
        setLoading(false);
      }
    };

    loadLifeBlocks();
  }, []);

  const createLifeBlock = async (lifeBlock: Omit<CustomLifeBlock, 'id' | 'createdAt' | 'updatedAt' | 'contents'>) => {
    try {
      const newBlock = await api.createLifeBlock(lifeBlock);
      const processedBlock = {
        ...newBlock,
        createdAt: new Date(newBlock.createdAt),
        updatedAt: new Date(newBlock.updatedAt),
        contents: newBlock.contents.map((content: any) => ({
          ...content,
          createdAt: new Date(content.createdAt),
          updatedAt: new Date(content.updatedAt),
        }))
      };
      setLifeBlocks(prev => [...prev, processedBlock]);
      return processedBlock;
    } catch (err) {
      console.error('Error creating life block:', err);
      setError('Failed to create life block');
      throw err;
    }
  };

  const updateLifeBlock = async (id: string, updates: Partial<CustomLifeBlock>) => {
    try {
      const updatedBlock = await api.updateLifeBlock(id, updates);
      const processedBlock = {
        ...updatedBlock,
        createdAt: new Date(updatedBlock.createdAt),
        updatedAt: new Date(updatedBlock.updatedAt),
        contents: updatedBlock.contents.map((content: any) => ({
          ...content,
          createdAt: new Date(content.createdAt),
          updatedAt: new Date(content.updatedAt),
        }))
      };
      setLifeBlocks(prev => prev.map(block => 
        block.id === id ? processedBlock : block
      ));
    } catch (err) {
      console.error('Error updating life block:', err);
      setError('Failed to update life block');
      throw err;
    }
  };

  const deleteLifeBlock = async (id: string) => {
    try {
      await api.deleteLifeBlock(id);
      setLifeBlocks(prev => prev.filter(block => block.id !== id));
    } catch (err) {
      console.error('Error deleting life block:', err);
      setError('Failed to delete life block');
      throw err;
    }
  };

  const addContent = async (lifeBlockId: string, content: Omit<LifeBlockContent, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const updatedBlock = await api.addContentToLifeBlock(lifeBlockId, content);
      const processedBlock = {
        ...updatedBlock,
        createdAt: new Date(updatedBlock.createdAt),
        updatedAt: new Date(updatedBlock.updatedAt),
        contents: updatedBlock.contents.map((content: any) => ({
          ...content,
          createdAt: new Date(content.createdAt),
          updatedAt: new Date(content.updatedAt),
        }))
      };
      setLifeBlocks(prev => prev.map(block => 
        block.id === lifeBlockId ? processedBlock : block
      ));
      return processedBlock.contents[processedBlock.contents.length - 1];
    } catch (err) {
      console.error('Error adding content:', err);
      setError('Failed to add content');
      throw err;
    }
  };

  const updateContent = async (lifeBlockId: string, contentId: string, updates: Partial<LifeBlockContent>) => {
    try {
      const updatedBlock = await api.updateContentInLifeBlock(lifeBlockId, contentId, { data: updates.data });
      const processedBlock = {
        ...updatedBlock,
        createdAt: new Date(updatedBlock.createdAt),
        updatedAt: new Date(updatedBlock.updatedAt),
        contents: updatedBlock.contents.map((content: any) => ({
          ...content,
          createdAt: new Date(content.createdAt),
          updatedAt: new Date(content.updatedAt),
        }))
      };
      setLifeBlocks(prev => prev.map(block => 
        block.id === lifeBlockId ? processedBlock : block
      ));
    } catch (err) {
      console.error('Error updating content:', err);
      setError('Failed to update content');
      throw err;
    }
  };

  const deleteContent = async (lifeBlockId: string, contentId: string) => {
    try {
      const updatedBlock = await api.deleteContentFromLifeBlock(lifeBlockId, contentId);
      const processedBlock = {
        ...updatedBlock,
        createdAt: new Date(updatedBlock.createdAt),
        updatedAt: new Date(updatedBlock.updatedAt),
        contents: updatedBlock.contents.map((content: any) => ({
          ...content,
          createdAt: new Date(content.createdAt),
          updatedAt: new Date(content.updatedAt),
        }))
      };
      setLifeBlocks(prev => prev.map(block => 
        block.id === lifeBlockId ? processedBlock : block
      ));
    } catch (err) {
      console.error('Error deleting content:', err);
      setError('Failed to delete content');
      throw err;
    }
  };

  return {
    lifeBlocks,
    loading,
    error,
    createLifeBlock,
    updateLifeBlock,
    deleteLifeBlock,
    addContent,
    updateContent,
    deleteContent,
  };
};
