import { createFileRoute } from '@tanstack/react-router'
import Companies from './../../../features/company/index'

export const Route = createFileRoute('/_authenticated/companies/')({
  component: Companies,
})
