import { supabase } from '../../../lib/supabase'
import { type CompanyCreateForm } from '../data/schema'

export const companyRepo = () => {
  const listCompanies = async () => {
    return await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false })
  }
  const createCompany = async (
    validatedData: CompanyCreateForm,
    id: string
  ) => {
    return await supabase
      .from('companies')
      .insert([{ ...validatedData, owner_id: id }])
  }

  const updateCompany = async (
    id: string,
    validatedData: Pick<CompanyCreateForm, 'name'>
  ) => {
    return await supabase.from('companies').update(validatedData).eq('id', id)
  }
  const deleteCompany = async (id: string) => {
    return await supabase.from('companies').delete().eq('id', id)
  }
  const getCompany = async (id: string) => {
    return await supabase.from('companies').select('*').eq('id', id).single()
  }
  return {
    listCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompany,
  }
}
