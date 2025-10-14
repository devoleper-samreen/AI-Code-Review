import AxiosInstance from "@/app/AxiosManager";

export interface Repo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  description: string | null;
  private: boolean;
  html_url: string;
}

export interface ConnectedRepo {
  id: number;
  repoName: string;
  userId: number;
  webhookId: number;
  createdAt: string;
}

export interface PRReview {
  id: number;
  prNumber: number;
  prTitle: string;
  repoName: string;
  author: string;
  status: string;
  reviewData: any;
  createdAt: string;
}

// Auth APIs
export const authAPI = {
  // GitHub OAuth redirect is handled by direct navigation to backend
  getCurrentUser: async () => {
    const response = await AxiosInstance.get("/auth/me");
    return response.data;
  },
};

// Repository APIs
export const repoAPI = {
  getRepos: async (): Promise<{ repos: Repo[] }> => {
    const response = await AxiosInstance.get("/repos");
    return response.data;
  },

  connectRepo: async (full_name: string): Promise<{ success: boolean; data: ConnectedRepo; message: string }> => {
    const response = await AxiosInstance.post("/repos/connect-repo", {
      full_name,
    });
    return response.data;
  },

  getConnectedRepos: async (): Promise<{ repos: ConnectedRepo[] }> => {
    const response = await AxiosInstance.get("/repos/connected");
    return response.data;
  },

  getRepoById: async (id: string): Promise<{ success: boolean; repo: ConnectedRepo }> => {
    const response = await AxiosInstance.get(`/repos/${id}`);
    return response.data;
  },

  disconnectRepo: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await AxiosInstance.delete(`/repos/${id}`);
    return response.data;
  },
};

// PR Review APIs
export const prAPI = {
  getPRReviews: async (repoId?: number): Promise<{ reviews: PRReview[] }> => {
    const url = repoId ? `/reviews?repoId=${repoId}` : "/reviews";
    const response = await AxiosInstance.get(url);
    return response.data;
  },

  getPRReviewById: async (id: string): Promise<{ review: PRReview }> => {
    const response = await AxiosInstance.get(`/reviews/${id}`);
    return response.data;
  },
};
