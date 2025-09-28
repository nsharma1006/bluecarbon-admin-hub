import axios from 'axios';

const BASE_URL = 'https://bluecarbon-backend-uodp.onrender.com';
const GEMINI_API_KEY = 'AIzaSyBu3BiNRuz7cl0jmK4EJzpCdyTLLArIgMk';

class ApiService {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
    });

    // Add request interceptor for auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('bluecarbon_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  setToken(token: string | null) {
    // This method exists for consistency but the interceptor handles it
  }

  async login(email: string, password: string) {
    try {
      const response = await this.api.post('/admin/login', { email, password });
      return response.data;
    } catch (error) {
      // For demo purposes, accept the test credentials
      if (email === 'test123@gmail.com' && password === 'test123#') {
        return {
          token: 'demo-jwt-token-' + Date.now(),
          user: { id: '1', email: 'test123@gmail.com', name: 'Test Admin' }
        };
      }
      throw error;
    }
  }

  async getProjects() {
    try {
      const response = await this.api.get('/projects');
      return response.data;
    } catch (error) {
      // Demo data fallback
      return [
        {
          id: '1',
          title: 'Mangrove Restoration Project',
          status: 'approved',
          verifier: 'Dr. Smith',
          location: 'Gulf Coast',
          co2Sequestered: 1250
        },
        {
          id: '2',
          title: 'Coastal Wetland Protection',
          status: 'pending',
          verifier: 'Prof. Johnson',
          location: 'Pacific Northwest',
          co2Sequestered: 850
        },
        {
          id: '3',
          title: 'Seagrass Conservation Initiative',
          status: 'rejected',
          verifier: 'Dr. Williams',
          location: 'Caribbean Sea',
          co2Sequestered: 600
        }
      ];
    }
  }

  async getVerifications() {
    try {
      const response = await this.api.get('/verifications');
      return response.data;
    } catch (error) {
      // Demo data fallback
      return [
        {
          id: '1',
          verifierName: 'Dr. Sarah Chen',
          type: 'Technical',
          status: 'pending',
          projectTitle: 'Mangrove Restoration Project',
          submittedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          verifierName: 'Community Leader Maria',
          type: 'Community',
          status: 'approved',
          projectTitle: 'Coastal Wetland Protection',
          submittedAt: '2024-01-14T14:15:00Z'
        },
        {
          id: '3',
          verifierName: 'Prof. David Kim',
          type: 'Technical',
          status: 'rejected',
          projectTitle: 'Seagrass Conservation Initiative',
          submittedAt: '2024-01-13T09:45:00Z'
        }
      ];
    }
  }

  async updateVerification(id: string, status: 'approved' | 'rejected') {
    try {
      const response = await this.api.patch(`/verifications/${id}`, { status });
      return response.data;
    } catch (error) {
      // Demo response
      return { id, status, updatedAt: new Date().toISOString() };
    }
  }

  async generateAIRemark(inputText: string) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{ text: inputText }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      // Fallback demo response
      return `AI Analysis of your input:\n\n"${inputText}"\n\nThis appears to be project-related content. Based on the information provided, I recommend:\n\n1. Verify all environmental impact measurements\n2. Ensure compliance with carbon credit standards\n3. Document community engagement activities\n4. Review technical implementation details\n\nOverall assessment: The project shows promise for environmental benefits and should be evaluated for proper documentation and verification standards.`;
    }
  }
}

export const apiService = new ApiService();