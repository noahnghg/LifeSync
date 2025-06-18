const API_URL = 'http://127.0.0.1:5000';

export const getLifeBlocks = async () => {
  const response = await fetch(`${API_URL}/life_blocks`);
  if (!response.ok) {
    throw new Error('Failed to fetch life blocks');
  }
  return response.json();
};

export const createLifeBlock = async (lifeBlock: any) => {
  const response = await fetch(`${API_URL}/life_blocks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lifeBlock),
  });
  if (!response.ok) {
    throw new Error('Failed to create life block');
  }
  return response.json();
};

export const updateLifeBlock = async (id: string, lifeBlock: any) => {
  const response = await fetch(`${API_URL}/life_blocks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lifeBlock),
  });
  if (!response.ok) {
    throw new Error('Failed to update life block');
  }
  return response.json();
};

export const deleteLifeBlock = async (id: string) => {
  const response = await fetch(`${API_URL}/life_blocks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete life block');
  }
  return response.json();
};

export const addContentToLifeBlock = async (lifeBlockId: string, contentData: any) => {
  const response = await fetch(`${API_URL}/life_blocks/${lifeBlockId}/contents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contentData),
  });
  if (!response.ok) {
    throw new Error('Failed to add content to life block');
  }
  return response.json();
};

export const updateContentInLifeBlock = async (lifeBlockId: string, contentId: string, contentData: any) => {
  const response = await fetch(`${API_URL}/life_blocks/${lifeBlockId}/contents/${contentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contentData),
  });
  if (!response.ok) {
    throw new Error('Failed to update content in life block');
  }
  return response.json();
};

export const deleteContentFromLifeBlock = async (lifeBlockId: string, contentId: string) => {
  const response = await fetch(`${API_URL}/life_blocks/${lifeBlockId}/contents/${contentId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete content from life block');
  }
  return response.json();
};
