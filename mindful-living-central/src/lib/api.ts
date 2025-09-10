import { CustomLifeBlock as LifeBlock, LifeBlockContent } from '../types/lifeblocks';

const API_URL = 'http://localhost:5001';

// Auth API functions
export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }
  
  return response.json();
};

export const signupUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Signup failed');
  }
  
  return response.json();
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No auth token found');
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to get current user');
  }
  
  return response.json();
};

export const logoutUser = async () => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Logout failed');
  }
  
  return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const getLifeBlocks = async (): Promise<LifeBlock[]> => {
  const response = await fetch(`${API_URL}/life_blocks`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch life blocks');
  }
  return response.json();
};

export const getTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
};

export const createTask = async (taskData: {
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate: string;
    category?: string;
}) => {
    const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
    });
    if (!response.ok) {
        throw new Error('Failed to create task');
    }
    return response.json();
};

export const createScheduleEvent = async (eventData: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    location?: string;
    category?: string;
}) => {
    const response = await fetch(`${API_URL}/schedules`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(eventData),
    });
    if (!response.ok) {
        throw new Error('Failed to create schedule event');
    }
    return response.json();
};

export const getFinances = async () => {
    const response = await fetch(`${API_URL}/finances`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch finances');
    }
    return response.json();
};

export const getTransactions = async () => {
    const response = await fetch(`${API_URL}/transactions`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch transactions');
    }
    return response.json();
};

export const createExpense = async (expenseData: {
    description: string;
    amount: number;
    category: string;
    date: string;
}) => {
    const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(expenseData),
    });
    if (!response.ok) {
        throw new Error('Failed to create expense');
    }
    return response.json();
};

export const getSchedules = async () => {
    const response = await fetch(`${API_URL}/schedules`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch schedules');
    }
    return response.json();
};

export const getAnalytics = async () => {
    const response = await fetch(`${API_URL}/analytics`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch analytics');
    }
    return response.json();
};

export const createLifeBlock = async (lifeBlockData: any): Promise<LifeBlock> => {
  const response = await fetch(`${API_URL}/life_blocks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(lifeBlockData),
  });
  if (!response.ok) {
    throw new Error('Failed to create life block');
  }
  return response.json();
};

export const updateLifeBlock = async (id: string, lifeBlock: any) => {
  const response = await fetch(`${API_URL}/life_blocks/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to delete life block');
  }
  return response.json();
};

export const addContentToLifeBlock = async (lifeBlockId: string, contentData: any) => {
  const response = await fetch(`${API_URL}/life_blocks/${lifeBlockId}/contents`, {
    method: 'POST',
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to delete content from life block');
  }
  return response.json();
};

export const getGoals = async () => {
    const response = await fetch(`${API_URL}/goals`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch goals');
    }
    return response.json();
};

export const createGoal = async (goalData: {
    title: string;
    description?: string;
    targetValue: number;
    currentValue?: number;
    category: string;
    deadline?: string;
}) => {
    const response = await fetch(`${API_URL}/goals`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(goalData),
    });
    if (!response.ok) {
        throw new Error('Failed to create goal');
    }
    return response.json();
};

export const updateGoal = async (goalId: string, goalData: any) => {
    const response = await fetch(`${API_URL}/goals/${goalId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(goalData),
    });
    if (!response.ok) {
        throw new Error('Failed to update goal');
    }
    return response.json();
};

export const deleteGoal = async (goalId: string) => {
    const response = await fetch(`${API_URL}/goals/${goalId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('Failed to delete goal');
    }
    return response.json();
};

export const updateProfile = async (profileData: {
    firstName: string;
    lastName: string;
    email: string;
}) => {
    const response = await fetch(`${API_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
    });
    if (!response.ok) {
        throw new Error('Failed to update profile');
    }
    return response.json();
};

export const changePassword = async (passwordData: {
    currentPassword: string;
    newPassword: string;
}) => {
    const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(passwordData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
    }
    return response.json();
};
