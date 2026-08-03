import { createClient } from './supabase'
import type { Unit } from '@/types/unit'

const supabase = createClient()

export async function getUnits(): Promise<Unit[]> {
  const { data, error } = await supabase.from('units').select('*').order('id')
  if (error) {
    console.error('Error fetching units:', error)
    return []
  }
  return data || []
}

export async function getUnitById(id: string): Promise<Unit | null> {
  const { data, error } = await supabase.from('units').select('*').eq('id', id).single()
  if (error) {
    console.error('Error fetching unit:', error)
    return null
  }
  return data
}

export async function getFeaturedUnits(): Promise<Unit[]> {
  const { data, error } = await supabase.from('units').select('*').limit(3).order('id')
  if (error) {
    console.error('Error fetching featured units:', error)
    return []
  }
  return data || []
}

export async function getTenants() {
  const { data, error } = await supabase.from('tenants').select('*').order('id')
  if (error) {
    console.error('Error fetching tenants:', error)
    return []
  }
  return data || []
}

export async function getContracts(tenantName?: string) {
  let query = supabase.from('contracts').select('*').order('id')
  if (tenantName) {
    query = query.eq('tenant_name', tenantName)
  }
  const { data, error } = await query
  if (error) {
    console.error('Error fetching contracts:', error)
    return []
  }
  return data || []
}

export async function getBilling(tenantName?: string) {
  let query = supabase.from('billing').select('*').order('id')
  if (tenantName) {
    query = query.eq('tenant_name', tenantName)
  }
  const { data, error } = await query
  if (error) {
    console.error('Error fetching billing:', error)
    return []
  }
  return data || []
}

export async function getMaintenance(tenantName?: string) {
  let query = supabase.from('maintenance').select('*').order('id')
  if (tenantName) {
    query = query.eq('reported_by', tenantName)
  }
  const { data, error } = await query
  if (error) {
    console.error('Error fetching maintenance:', error)
    return []
  }
  return data || []
}

// Mutations

export async function addUnit(unitData: Omit<Unit, 'id'>) {
  const { data, error } = await supabase.from('units').insert([unitData]).select()
  if (error) {
    console.error('Error adding unit:', JSON.stringify(error, null, 2), error)
    throw error
  }
  return data
}

export async function updateUnit(id: number, updates: Partial<Unit>) {
  const { data, error } = await supabase.from('units').update(updates).eq('id', id).select()
  if (error) {
    console.error('Error updating unit:', error)
    throw error
  }
  return data
}

export async function deleteUnit(id: number) {
  const { error } = await supabase.from('units').delete().eq('id', id)
  if (error) {
    console.error('Error deleting unit:', error)
    throw error
  }
  return true
}

export async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('property-images')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Error uploading image:', uploadError)
    throw uploadError
  }

  const { data } = supabase.storage
    .from('property-images')
    .getPublicUrl(filePath)

  return data.publicUrl
}

export async function addTenant(tenantData: any) {
  const { data, error } = await supabase.from('tenants').insert([tenantData]).select()
  if (error) {
    console.error('Error adding tenant:', error)
    throw error
  }
  return data
}
export async function updateTenant(id: string, updates: any) {
  const { data, error } = await supabase.from('tenants').update(updates).eq('id', id).select()
  if (error) {
    console.error('Error updating tenant:', error)
    throw error
  }
  return data
}

export async function deleteTenant(id: string) {
  const { error } = await supabase.from('tenants').delete().eq('id', id)
  if (error) {
    console.error('Error deleting tenant:', error)
    throw error
  }
  return true
}

export async function addContract(contractData: any) {
  const { data, error } = await supabase.from('contracts').insert([contractData]).select()
  if (error) {
    console.error('Error adding contract:', error)
    throw error
  }
  return data
}


export async function markMaintenanceResolved(id: string) {
  const { data, error } = await supabase
    .from('maintenance')
    .update({ status: 'Resolved' })
    .eq('id', id)
    .select()
  if (error) {
    console.error('Error updating maintenance ticket:', error)
    throw error
  }
  return data
}

export async function markInvoicePaid(id: string) {
  const { data, error } = await supabase
    .from('billing')
    .update({ status: 'Paid' })
    .eq('id', id)
    .select()
  if (error) {
    console.error('Error updating invoice status:', error)
    throw error
  }
  return data
}

export async function authenticateUser(email: string, password: string) {
  // Hardcoded Admin
  if (email === 'admin@teridox.com' && password === 'admin123') {
    return { role: 'admin', name: 'Super Admin' }
  }

  // Check tenants table
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single()

  if (error || !data) {
    throw new Error('Invalid credentials')
  }

  return { role: 'tenant', name: data.name, tenantId: data.id, requiresChange: data.requires_password_change }
}
