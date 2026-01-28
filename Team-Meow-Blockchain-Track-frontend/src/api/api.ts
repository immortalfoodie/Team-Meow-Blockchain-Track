import axios from 'axios'

export type UserRole = 'officer' | 'analyst' | 'judge' | 'POLICE' | 'LAB' | 'JUDGE' | 'ADMIN'

export interface LoginResponse {
  token: string
  role: UserRole
  user?: {
    id: string
    username: string
    name: string
    role: UserRole
  }
  name?: string
}

export interface EvidenceRegistrationPayload {
  evidenceId: string
  caseId: string
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
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000, // 10 second timeout
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    // Always use direct backend URL to avoid proxy issues
    const { data } = await axios.post('http://localhost:5000/api/auth/login', { username: email, password }, {
      timeout: 10000,
    })
    // Backend returns { success: true, token, user: {...} }
    return {
      token: data.token,
      role: data.user?.role || 'POLICE',
      name: data.user?.name,
      user: data.user,
    }
  } catch (error: any) {
    console.error('Login failed:', error.response?.data || error.message)
    throw new Error(error.response?.data?.error || 'Login failed. Please check your credentials.')
  }
}

export async function registerEvidence(payload: EvidenceRegistrationPayload) {
  const form = new FormData()
  form.append('evidenceId', payload.evidenceId)
  form.append('caseId', payload.caseId)
  if (payload.description) form.append('description', payload.description)
  form.append('file', payload.file)
  
  // Use longer timeout for file uploads and call backend directly to avoid proxy issues
  const token = localStorage.getItem('jwt')
  const { data } = await axios.post('http://localhost:5000/api/evidence/upload', form, {
    headers: { 
      'Content-Type': 'multipart/form-data',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    timeout: 30000, // 30 second timeout for uploads
  })
  return data
}

export async function transferCustody(payload: CustodyTransferPayload) {
  // Call backend directly to avoid proxy timeout issues with blockchain operations
  const token = localStorage.getItem('jwt')
  const { data } = await axios.post('http://localhost:5000/api/evidence/transfer', {
    evidenceId: payload.evidenceId,
    newOwnerId: payload.to,
    reason: payload.note,
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    timeout: 60000, // 60 second timeout for blockchain operations
  })
  return data
}

export async function verifyEvidence(payload: EvidenceVerificationPayload) {
  const form = new FormData()
  form.append('evidenceId', payload.evidenceId)
  form.append('file', payload.file)
  
  // Call backend directly to avoid proxy timeout issues with blockchain operations
  const token = localStorage.getItem('jwt')
  
  // Check if using demo token (won't work with real backend)
  if (token && token.startsWith('demo-token-')) {
    throw new Error('Demo tokens cannot verify evidence. Please log in again to get a valid token.')
  }
  
  try {
    const { data } = await axios.post('http://localhost:5000/api/evidence/verify', form, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      timeout: 60000, // 60 second timeout for blockchain operations
    })
    
    // Map backend response to frontend expected format
    return {
      matched: data.verified,
      transactionRef: data.originalHash ? `Hash: ${data.originalHash.substring(0, 16)}...` : undefined,
      chainTimestamp: data.verifiedBy ? `Verified by ${data.verifiedBy}` : undefined,
      message: data.message,
      originalHash: data.originalHash,
      currentHash: data.currentHash,
    }
  } catch (error: any) {
    // Extract error message from response
    const errorMsg = error.response?.data?.error || error.message || 'Verification failed'
    console.error('Verify error:', errorMsg, error.response?.status)
    throw new Error(errorMsg)
  }
}

export async function fetchAssignedEvidence() {
  try {
    const { data } = await apiClient.get('/evidence/assigned')
    return data.evidence || []
  } catch (error) {
    console.error('Failed to fetch assigned evidence:', error)
    // Fallback demo data
    return [
      { evidenceId: 'EV-2026-001', status: 'In Analysis', custody: 'Forensic Lab A' },
      { evidenceId: 'EV-2026-002', status: 'Pending Report', custody: 'Forensic Lab B' },
    ]
  }
}

export async function getEvidenceDetails(evidenceId: string) {
  const { data } = await apiClient.get(`/evidence/${evidenceId}`)
  return data.evidence
}

export async function getEvidenceCustodyHistory(evidenceId: string) {
  const { data } = await apiClient.get(`/evidence/${evidenceId}/history`)
  return data
}

export async function getAuditTrail(evidenceId: string) {
  const { data } = await apiClient.get(`/evidence/${evidenceId}/audit`)
  return data.auditTrail
}

export async function getAllEvidenceForCase(caseId: string) {
  const { data } = await apiClient.get(`/evidence/case/${caseId}`)
  return data.evidence
}

export async function getAllEvidence() {
  const { data } = await apiClient.get('/evidence/all')
  return data.evidence || []
}

export async function getUserProfile() {
  const { data } = await apiClient.get('/auth/profile')
  return data.user
}

export async function getAllUsers() {
  const { data } = await apiClient.get('/auth/users')
  return data.users
}
