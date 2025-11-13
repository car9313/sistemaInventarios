import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

type OwnerTooltipProps = {
  value: string
}

export default function OwnerTooltip({ value }: OwnerTooltipProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success('Copied to clipboard')
    } catch {
      toast.error('Could not copy')
    }
  }

  return (
    <>
      <span className='block break-all'>{value}</span>
      <div className='mt-2 flex gap-2'>
        <Button
          variant='outline'
          onClick={handleCopy}
          className='h-7 px-2 text-sm'
        >
          <Copy className='mr-1' />
          Copy
        </Button>
      </div>
    </>
  )
}
