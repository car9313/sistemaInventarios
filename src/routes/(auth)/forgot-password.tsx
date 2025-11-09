import { createFileRoute } from '@tanstack/react-router'
import { ForgotPassword } from '@/features/auth/pages/forgot-password'

export const Route = createFileRoute('/(auth)/forgot-password')({
  component: ForgotPassword,
})
