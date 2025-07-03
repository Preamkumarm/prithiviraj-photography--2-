
import axios from 'axios';
import type { User, PortfolioCategory, Service, ContactSubmission, Feedback, Photo } from '../types';
import { INITIAL_PORTFOLIO_CATEGORIES, SERVICES } from '../constants';

// This service is fully mocked to ensure offline functionality and avoid network errors.

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api', // NOTE: This is not used as all functions are mocked.
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add the auth token to every request if it exists
apiClient.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

const MOCK_DELAY = 300;

const mockApi = <T>(data: T, shouldFail = false): Promise<T> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error("Mock API Error"));
            } else {
                // Deep clone data to simulate fresh API response and prevent mutation bugs
                resolve(JSON.parse(JSON.stringify(data)));
            }
        }, MOCK_DELAY);
    });
};

const initStorage = <T>(key: string, initialData: T): T => {
    try {
        const stored = sessionStorage.getItem(key);
        if (stored) return JSON.parse(stored);
        sessionStorage.setItem(key, JSON.stringify(initialData));
        return initialData;
    } catch {
        return initialData;
    }
};

const saveData = (key: string, data: any) => sessionStorage.setItem(key, JSON.stringify(data));


// --- MOCK DATA STORE ---

let mockUsers = initStorage<any[]>('mock_users', [
    { id: 1, email: 'prstudionkl@gmail.com', password: 'PRS@pr123', name: 'Admin', role: 'admin', phone: '9876543210', createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
    { id: 2, email: 'user@test.com', password: 'password', name: 'Test User', role: 'user', phone: '1234567890', createdAt: new Date().toISOString() },
]);
let mockPortfolio = initStorage<PortfolioCategory[]>('mock_portfolio', INITIAL_PORTFOLIO_CATEGORIES);
let mockServices = initStorage<Service[]>('mock_services', SERVICES);
let mockContacts = initStorage<ContactSubmission[]>('mock_contacts', []);
let mockFeedbackList = initStorage<Feedback[]>('mock_feedback', [
    {id: 1, name: 'Sathish Kumar', rating: 5, review: 'Absolutely stunning wedding photos!', timestamp: new Date().toISOString()},
]);
const INITIAL_SITE_CONTENT = {
    aboutIntro: 'A passionate photographer from Namakkal with over a decade of experience in capturing life\'s most precious moments. My journey began with a simple film camera, a gift from my father, which ignited a lifelong passion for storytelling through images. I specialize in weaving narratives, whether it’s the fairytale romance of a wedding, the raw energy of a fashion shoot, or the quiet intimacy of a newborn\'s first days. My style is a blend of cinematic and photojournalistic, focusing on authentic emotions and stunning visuals. I believe that a great photograph is not just seen, but felt.',
    homeHeroTitle: `Capturing Life's Moments`,
    homeHeroSubtitle: `From wedding vows to newborn smiles, we frame your memories with artistry and passion.`
};
let mockSiteContent = initStorage<typeof INITIAL_SITE_CONTENT>('mock_site_content', INITIAL_SITE_CONTENT);


// --- API FUNCTIONS ---

// Authentication
export const login = (email: string, password: string): Promise<{ user: User; token: string }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = mockUsers.find(u => u.email === email && u.password === password);
            if (user) {
                const { password, ...userWithoutPass } = user;
                resolve({ user: userWithoutPass, token: `mock_token_${Date.now()}` });
            } else {
                const err: any = new Error("Invalid credentials");
                err.isAxiosError = true;
                err.response = { status: 401 };
                reject(err);
            }
        }, MOCK_DELAY);
    });
};

export const register = (name: string, email: string, password: string): Promise<{ user: User, token: string }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (mockUsers.some(u => u.email === email)) {
                const err: any = new Error("Email already in use");
                err.isAxiosError = true;
                err.response = { status: 409 };
                return reject(err);
            }
            const newUser: any = { id: Date.now(), name, email, password, role: 'user', createdAt: new Date().toISOString() };
            mockUsers.push(newUser);
            saveData('mock_users', mockUsers);
            const { password: pw, ...userWithoutPass } = newUser;
            resolve({ user: userWithoutPass, token: `mock_token_${Date.now()}` });
        }, MOCK_DELAY);
    });
};

export const registerAdmin = (name: string, email: string, password: string): Promise<{ user: User, token: string }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (mockUsers.some(u => u.role === 'admin')) {
                const err: any = new Error("Admin already exists");
                err.isAxiosError = true;
                err.response = { status: 403 };
                return reject(err);
            }
            if (mockUsers.some(u => u.email === email)) {
                const err: any = new Error("Email already in use");
                err.isAxiosError = true;
                err.response = { status: 409 };
                return reject(err);
            }
            const newAdmin: any = { id: Date.now(), name, email, password, role: 'admin', createdAt: new Date().toISOString() };
            mockUsers.push(newAdmin);
            saveData('mock_users', mockUsers);
            const { password: pw, ...userWithoutPass } = newAdmin;
            resolve({ user: userWithoutPass, token: `mock_token_${Date.now()}` });
        }, MOCK_DELAY);
    });
};

// Portfolio & Photo Management
export const getPortfolio = (): Promise<PortfolioCategory[]> => {
    const categoriesShell = mockPortfolio.map(cat => ({ ...cat, photos: [] }));
    return mockApi(categoriesShell);
};

export const getPhotosByCategory = (category: string): Promise<Photo[]> => {
    const categoryData = mockPortfolio.find(c => c.id === category);
    return mockApi(categoryData ? categoryData.photos : []);
};

export const uploadPhoto = (file: File, category: string): Promise<Photo> => {
    // With a real backend, this function would use FormData to upload the file
    // and the server would return a persistent URL like '/uploads/image-name.jpg'.
    // For this mocked version, we convert the image to a Base64 data URL.
    // This allows the image to be stored in sessionStorage and persist on page refresh,
    // which is not possible with temporary blob URLs created by URL.createObjectURL().
    return new Promise((resolve, reject) => {
        const categoryData = mockPortfolio.find(c => c.id === category);
        if (!categoryData) {
            return reject(new Error("Category not found"));
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const newPhoto: Photo = {
                id: Date.now(),
                url: reader.result as string, // This is the Base64 data URL
            };
            categoryData.photos.push(newPhoto);
            saveData('mock_portfolio', mockPortfolio);

            setTimeout(() => resolve(newPhoto), MOCK_DELAY);
        };
        reader.onerror = (error) => {
            console.error("FileReader error: ", error);
            reject(new Error("Failed to read file."));
        };
    });
};

export const deletePhoto = (photoId: number): Promise<void> => {
    mockPortfolio.forEach(category => {
        const photoToDelete = category.photos.find(p => p.id === photoId);
        // If the URL is a blob URL from a previous session (before the fix), 
        // revoking it is good practice to prevent potential memory leaks.
        // Data URLs or external URLs don't need this.
        if (photoToDelete && photoToDelete.url.startsWith('blob:')) {
            URL.revokeObjectURL(photoToDelete.url);
        }
        category.photos = category.photos.filter(p => p.id !== photoId);
    });
    saveData('mock_portfolio', mockPortfolio);
    return mockApi(undefined);
};

// Site Content Management
export const getSiteContent = (): Promise<typeof INITIAL_SITE_CONTENT> => mockApi(mockSiteContent);

export const updateSiteContent = (content: typeof INITIAL_SITE_CONTENT): Promise<typeof INITIAL_SITE_CONTENT> => {
    mockSiteContent = { ...mockSiteContent, ...content };
    saveData('mock_site_content', mockSiteContent);
    return mockApi(mockSiteContent);
};

// Form Submissions
export const submitEnquiry = (data: { name: string; email: string; phone: string; message: string }): Promise<void> => {
    const newSubmission: ContactSubmission = { id: Date.now(), ...data, timestamp: new Date().toISOString() };
    mockContacts.push(newSubmission);
    saveData('mock_contacts', mockContacts);
    return mockApi(undefined);
};

export const getContactSubmissions = (): Promise<ContactSubmission[]> => mockApi(mockContacts);

export const submitFeedback = (data: { name: string; rating: number; review: string }): Promise<void> => {
    const newFeedback: Feedback = { id: Date.now(), ...data, timestamp: new Date().toISOString() };
    mockFeedbackList.push(newFeedback);
    saveData('mock_feedback', mockFeedbackList);
    return mockApi(undefined);
};

export const getFeedback = (): Promise<Feedback[]> => mockApi(mockFeedbackList);

export const deleteFeedback = (feedbackId: number): Promise<void> => {
    mockFeedbackList = mockFeedbackList.filter(f => f.id !== feedbackId);
    saveData('mock_feedback', mockFeedbackList);
    return mockApi(undefined);
};

// Services
export const getServices = (): Promise<Service[]> => mockApi(mockServices);
export const addService = (service: Omit<Service, 'id' | 'finalPrice'>): Promise<Service> => {
    const newService: Service = { id: Date.now(), ...service, finalPrice: Math.round(service.basePrice * (1 - service.discount / 100)) };
    mockServices = [...mockServices, newService];
    saveData('mock_services', mockServices);
    return mockApi(newService);
};
export const updateService = (service: Service): Promise<Service> => {
    mockServices = mockServices.map(s => s.id === service.id ? service : s);
    saveData('mock_services', mockServices);
    return mockApi(service);
};
export const deleteService = (serviceId: number): Promise<void> => {
    mockServices = mockServices.filter(s => s.id !== serviceId);
    saveData('mock_services', mockServices);
    return mockApi(undefined);
};

// User Management (Admin)
export const apiUpdateProfile = (userId: number, data: { email?: string; phone?: string }): Promise<User> => {
    let updatedUser: any;
    mockUsers = mockUsers.map(u => {
        if (u.id === userId) {
            const updated = { ...u, ...data };
            updatedUser = updated;
            return updated;
        }
        return u;
    });

    if (updatedUser) {
        saveData('mock_users', mockUsers);
        const { password, ...userWithoutPass } = updatedUser;
        return mockApi(userWithoutPass);
    }
    return Promise.reject(new Error("User not found"));
};

export const apiGetAllUsers = (): Promise<User[]> => {
    const usersWithoutPasswords = mockUsers.map(u => {
        const { password, ...user } = u;
        return user;
    });
    return mockApi(usersWithoutPasswords);
};