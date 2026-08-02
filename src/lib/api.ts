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

export async function getContracts() {
  const { data, error } = await supabase.from('contracts').select('*').order('id')
  if (error) {
    console.error('Error fetching contracts:', error)
    return []
  }
  return data || []
}

export async function getBilling() {
  const { data, error } = await supabase.from('billing').select('*').order('id')
  if (error) {
    console.error('Error fetching billing:', error)
    return []
  }
  return data || []
}

export async function getMaintenance() {
  const { data, error } = await supabase.from('maintenance').select('*').order('id')
  if (error) {
    console.error('Error fetching maintenance:', error)
    return []
  }
  return data || []
}
