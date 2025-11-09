import { createFileRoute } from '@tanstack/react-router'
import { SignIn2 } from '@/features/auth/pages/sign-in/sign-in-2'

export const Route = createFileRoute('/(auth)/sign-in-2')({
  component: SignIn2,
})
