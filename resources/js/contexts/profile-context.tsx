import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Organization {
  id: string
  name: string
  type: string
  position: string
  description: string
  startDate: string
  endDate: string
  current: boolean
  achievements: string[]
  skills: string[]
}

interface Profile {
  organizations: Organization[]
}

interface ProfileContextType {
  profile: Profile
  addOrganization: (org: Organization) => void
  updateOrganization: (id: string, org: Partial<Organization>) => void
  deleteOrganization: (id: string) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

interface ProfileProviderProps {
  children: ReactNode
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>({
    organizations: []
  })

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('student-profile')
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile))
      } catch (error) {
        console.error('Error loading profile from localStorage:', error)
      }
    }
  }, [])

  // Save to localStorage whenever profile changes
  useEffect(() => {
    localStorage.setItem('student-profile', JSON.stringify(profile))
  }, [profile])

  const addOrganization = (org: Organization) => {
    setProfile(prev => ({
      ...prev,
      organizations: [...prev.organizations, org]
    }))
  }

  const updateOrganization = (id: string, updates: Partial<Organization>) => {
    setProfile(prev => ({
      ...prev,
      organizations: prev.organizations.map(org =>
        org.id === id ? { ...org, ...updates } : org
      )
    }))
  }

  const deleteOrganization = (id: string) => {
    setProfile(prev => ({
      ...prev,
      organizations: prev.organizations.filter(org => org.id !== id)
    }))
  }

  const value: ProfileContextType = {
    profile,
    addOrganization,
    updateOrganization,
    deleteOrganization
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}
