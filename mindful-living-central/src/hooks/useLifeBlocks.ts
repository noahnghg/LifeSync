
import { useState, useEffect } from 'react';
import { CustomLifeBlock, ContentType, LifeBlockContent } from '@/types/lifeblocks';

const STORAGE_KEY = 'custom-lifeblocks';

export const useLifeBlocks = () => {
  const [lifeBlocks, setLifeBlocks] = useState<CustomLifeBlock[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLifeBlocks(parsed.map((block: any) => ({
          ...block,
          createdAt: new Date(block.createdAt),
          updatedAt: new Date(block.updatedAt),
          contents: block.contents.map((content: any) => ({
            ...content,
            createdAt: new Date(content.createdAt),
            updatedAt: new Date(content.updatedAt),
          }))
        })));
      } catch (error) {
        console.error('Error parsing stored LifeBlocks:', error);
      }
    }
  }, []);

  const saveToStorage = (blocks: CustomLifeBlock[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
  };

  const createLifeBlock = (lifeBlock: Omit<CustomLifeBlock, 'id' | 'createdAt' | 'updatedAt' | 'contents'>) => {
    const newLifeBlock: CustomLifeBlock = {
      ...lifeBlock,
      id: crypto.randomUUID(),
      contents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updated = [...lifeBlocks, newLifeBlock];
    setLifeBlocks(updated);
    saveToStorage(updated);
    return newLifeBlock;
  };

  const updateLifeBlock = (id: string, updates: Partial<CustomLifeBlock>) => {
    const updated = lifeBlocks.map(block =>
      block.id === id
        ? { ...block, ...updates, updatedAt: new Date() }
        : block
    );
    setLifeBlocks(updated);
    saveToStorage(updated);
  };

  const deleteLifeBlock = (id: string) => {
    const updated = lifeBlocks.filter(block => block.id !== id);
    setLifeBlocks(updated);
    saveToStorage(updated);
  };

  const addContent = (lifeBlockId: string, content: Omit<LifeBlockContent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newContent: LifeBlockContent = {
      ...content,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updated = lifeBlocks.map(block =>
      block.id === lifeBlockId
        ? {
            ...block,
            contents: [...block.contents, newContent],
            updatedAt: new Date(),
          }
        : block
    );
    setLifeBlocks(updated);
    saveToStorage(updated);
    return newContent;
  };

  const updateContent = (lifeBlockId: string, contentId: string, updates: Partial<LifeBlockContent>) => {
    const updated = lifeBlocks.map(block =>
      block.id === lifeBlockId
        ? {
            ...block,
            contents: block.contents.map(content =>
              content.id === contentId
                ? { ...content, ...updates, updatedAt: new Date() }
                : content
            ),
            updatedAt: new Date(),
          }
        : block
    );
    setLifeBlocks(updated);
    saveToStorage(updated);
  };

  const deleteContent = (lifeBlockId: string, contentId: string) => {
    const updated = lifeBlocks.map(block =>
      block.id === lifeBlockId
        ? {
            ...block,
            contents: block.contents.filter(content => content.id !== contentId),
            updatedAt: new Date(),
          }
        : block
    );
    setLifeBlocks(updated);
    saveToStorage(updated);
  };

  return {
    lifeBlocks,
    createLifeBlock,
    updateLifeBlock,
    deleteLifeBlock,
    addContent,
    updateContent,
    deleteContent,
  };
};
