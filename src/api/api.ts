import axios from 'axios'

export type UserRole = 'officer' | 'analyst' | 'judge'

export interface LoginResponse {
  token: string
  role: UserRole
  name?: string
}

export interface EvidenceRegistrationPayload {
  evidenceId: string
  description?: string
  file: File
}

export interface CustodyTransferPayload {
  evidenceId: string
  to: string
  note?: string
}

export interface EvidenceVerificationPayload {
  evidenceId: string
  file: File
}

const apiClient = axios.create({
  baseURL: '/api',
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function login(email: string, password: string): Promise<LoginResponse> {
  const normalizedEmail = email.trim().toLowerCase()

  const demoUsers: Record<string, LoginResponse> = {
    'officer@demo.local': {
      token: 'demo-officer-token',
      role: 'officer',
      name: 'Demo Officer',
    },
    'analyst@demo.local': {
      token: 'demo-analyst-token',
      role: 'analyst',
      name: 'Demo Analyst',
    },
    'judge@demo.local': {
      token: 'demo-judge-token',
      role: 'judge',
      name: 'Demo Judge',
    },
  }

  if (password === 'password123' && demoUsers[normalizedEmail]) {
    return demoUsers[normalizedEmail]
  }

  const { data } = await apiClient.post<LoginResponse>('/auth/login', { email, password })
  return data
}

export async function registerEvidence(payload: EvidenceRegistrationPayload) {
  const form = new FormData()
  form.append('evidenceId', payload.evidenceId)
  if (payload.description) form.append('description', payload.description)
  form.append('file', payload.file)
  const { data } = await apiClient.post('/evidence/register', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function transferCustody(payload: CustodyTransferPayload) {
  const { data } = await apiClient.post('/evidence/transfer', payload)
  return data
}

export async function verifyEvidence(payload: EvidenceVerificationPayload) {
  const form = new FormData()
  form.append('evidenceId', payload.evidenceId)
  form.append('file', payload.file)
  const { data } = await apiClient.post('/evidence/verify', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function fetchAssignedEvidence() {
  // Placeholder: Replace with GET /api/evidence/assigned when backend available.
  return [
    { evidenceId: 'EV-2025-001', status: 'In Analysis', custody: 'Forensic Lab A' },
    { evidenceId: 'EV-2025-014', status: 'Pending Report', custody: 'Forensic Lab B' },
  ]
}
